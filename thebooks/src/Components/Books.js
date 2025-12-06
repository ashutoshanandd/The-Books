import { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); 
  const isLoggedIn = !!token; 


  useEffect(() => {
    fetchBooks();
  }, [page]);

  
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/books?page=${page}&limit=5`
      );
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data.books);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!name.trim() || !author.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, author }),
      });
      if (!res.ok) throw new Error("Failed to add book");
      setName("");
      setAuthor("");
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return fetchBooks();
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/books/search?q=${search}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setBooks(data);
      setTotalPages(1); 
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


 const handleBorrow = async (bookId) => {
  if (!isLoggedIn) return alert("Please log in to borrow books");

  try {
    const res = await fetch(`http://localhost:5000/borrow/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json(); 

    if (!res.ok) throw new Error(data.message || "Failed to borrow book");

    alert(data.message);
  } catch (err) {
    alert(err.message); 
  }
};


  if (loading) return <p>Loading books...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>📚 Book List</h2>

     
      <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by name or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            fetchBooks();
          }}
        >
          Reset
        </button>
      </form>

    

   
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            {isLoggedIn && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {books.length ? (
            books.map((book) => (
              <tr key={book._id}>
                <td>{book.name}</td>
                <td>{book.author}</td>
                {isLoggedIn && (
                  <td>
                    <button onClick={() => handleBorrow(book._id)}>Borrow</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isLoggedIn ? 3 : 2} style={{ textAlign: "center" }}>
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>

     
      <div style={{ marginTop: "10px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          ⬅ Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default Books;
