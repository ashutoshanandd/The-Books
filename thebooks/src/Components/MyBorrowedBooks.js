import { useEffect, useState } from "react";

function MyBorrowedBooks() {
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/my-borrows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch borrowed books");

      const data = await res.json();
      setBorrowed(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  
  const returnBook = async (borrowId) => {
    try {
      const res = await fetch(`http://localhost:5000/return-book/${borrowId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      alert(data.message);

      
      setBorrowed((prev) => prev.filter((b) => b._id !== borrowId));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p>Loading borrowed books...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>📖 My Borrowed Books</h2>

      {borrowed.length === 0 ? (
        <p>No borrowed books yet.</p>
      ) : (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author</th>
              <th>Return</th>
            </tr>
          </thead>
          <tbody>
            {borrowed.map((item) => (
              <tr key={item._id}>
                <td>{item.bookId?.name}</td>
                <td>{item.bookId?.author}</td>

                
                <td>
                  <button
                    onClick={() => returnBook(item._id)}
                    style={{
                      padding: "5px 10px",
                      background: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyBorrowedBooks;
