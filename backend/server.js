const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🧩 Connect MongoDB
mongoose
  .connect("mongodb://localhost:27017/loginCredentials")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));

// 🧩 User Schema + Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  borrowedBooks: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      borrowedAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("user", userSchema);

// 🧩 Book Schema + Model
const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
});
const Book = mongoose.model("Book", bookSchema);

// 🛡️ AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("No token provided!");

    const decoded = jwt.verify(token, "mySecretKey");
    req.userId = decoded.userId;

    next();
  } catch (err) {
    res.status(401).send("Invalid token!");
  }
}

// 📝 SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ name, email, password: hashedPassword }).save();

    res.send("User registered successfully!");
  } catch (error) {
    res.status(500).send("Signup failed!");
  }
});

// 🔑 LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, "mySecretKey", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed!" });
  }
});


// ------------------------------------------------------
// 🔥🔥🔥 BORROW SYSTEM ROUTES ADDED HERE 🔥🔥🔥
// ------------------------------------------------------

// 📚 BORROW BOOK
// 📚 BORROW BOOK (UPDATED)
app.post("/borrow/:bookId", authMiddleware, async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);

    // Check if already borrowed
    const alreadyBorrowed = user.borrowedBooks.some(
      (b) => b.bookId.toString() === bookId
    );

    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({ message: "You already borrowed this book" });
    }

    user.borrowedBooks.push({
      bookId,
      borrowedAt: new Date(),
    });

    await user.save();

    res.json({ message: "Book borrowed successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error borrowing book" });
  }
});


// 📖 MY BORROWED BOOKS
app.get("/my-borrows", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "borrowedBooks.bookId",
      "name author"
    );

    res.json(user.borrowedBooks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching borrowed books" });
  }
});

// 🔁 RETURN BOOK
app.delete("/return-book/:borrowId", authMiddleware, async (req, res) => {
  try {
    const { borrowId } = req.params;
    const user = await User.findById(req.userId);

    user.borrowedBooks = user.borrowedBooks.filter(
      (b) => b._id.toString() !== borrowId
    );

    await user.save();

    res.json({ message: "Book returned successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error returning book" });
  }
});

// ------------------------------------------------------
// 🔥🔥🔥 END BORROW ROUTES 🔥🔥🔥
// ------------------------------------------------------

// GET ALL STUDENTS (Admin Feature)
app.get("/students", async (req, res) => {
  try {
    const students = await User.find({}, "name email");

    const formatted = students.map((s) => ({
      id: s._id,
      name: s.name,
      email: s.email,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).send("Error fetching students");
  }
});

// DELETE STUDENT
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await User.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

// GET ALL LOANS (Admin Feature)
app.get("/loans", async (req, res) => {
  try {
    const users = await User.find().populate(
      "borrowedBooks.bookId",
      "name author"
    );

    let loans = [];

    users.forEach((user) => {
      user.borrowedBooks.forEach((loan) => {
        loans.push({
          id: loan._id,
          bookTitle: loan.bookId?.name || "Unknown",
          studentName: user.name,
          borrowedAt: loan.borrowedAt,
        });
      });
    });

    res.json(loans);
  } catch (err) {
    res.status(500).send("Error fetching loans");
  }
});

// DELETE LOAN (Admin Feature)
app.delete("/loans/:loanId", async (req, res) => {
  try {
    const { loanId } = req.params;

    const user = await User.findOne({ "borrowedBooks._id": loanId });

    if (!user) {
      return res.status(404).json({ message: "Loan not found" });
    }

    user.borrowedBooks = user.borrowedBooks.filter(
      (loan) => loan._id.toString() !== loanId
    );

    await user.save();

    res.json({ message: "Loan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting loan" });
  }
});

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// 📚 GET ALL BOOKS
app.get("/books", async (req, res) => {
  try {
    let { page = 1, limit = 5 } = req.query;
    page = Number(page);
    limit = Number(limit);

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      books,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).send("Error fetching books");
  }
});

// ➕ ADD BOOK
app.post("/books", async (req, res) => {
  try {
    const { name, author } = req.body;

    const newBook = new Book({ name, author });
    await newBook.save();

    res.json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    res.status(500).send("Failed to add book");
  }
});

// 🔍 SEARCH BOOKS
app.get("/books/search", async (req, res) => {
  try {
    const { q } = req.query;

    const results = await Book.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
      ],
    });

    res.json(results);
  } catch (error) {
    res.status(500).send("Search failed");
  }
});

// ❌ REMOVE BOOK BY NAME
app.delete("/books/remove/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const deletedBook = await Book.findOneAndDelete({ name });

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing book" });
  }
});

// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
