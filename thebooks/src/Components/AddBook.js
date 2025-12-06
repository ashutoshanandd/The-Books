import React, { useState } from "react";

function AddBook() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");

  const handleAdd = async () => {
    const res = await fetch("http://localhost:5000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, author }),
    });

    const data = await res.json();
    alert(data.message || "Book Added!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Book</h2>

      <input
        placeholder="Book Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Author"
        onChange={(e) => setAuthor(e.target.value)}
      />

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddBook;
