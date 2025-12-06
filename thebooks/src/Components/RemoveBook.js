import React, { useState } from "react";

function RemoveBook() {
  const [bookName, setBookName] = useState("");

  const handleRemove = async () => {
    const res = await fetch(`http://localhost:5000/books/remove/${bookName}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      alert("Book Removed Successfully!");
    } else {
      alert(data.message || "Book Not Found!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Remove Book</h2>

      <input
        placeholder="Enter Book Name"
        onChange={(e) => setBookName(e.target.value)}
      />

      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}

export default RemoveBook;
