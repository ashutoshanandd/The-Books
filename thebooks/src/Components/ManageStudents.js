import React, { useEffect, useState } from "react";

function ManageStudents() {
  const [students, setStudents] = useState([]);

  
  const loadStudents = () => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched students:", data); 
        setStudents(data);
      });
  };

  useEffect(() => {
    loadStudents();
  }, []);

 
  const deleteStudent = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/students/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Student deleted!");
      loadStudents(); 
    } else {
      alert("Failed to delete");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Students</h2>

      {students.length === 0 && <p>No students found</p>}

      {students.map((s) => (
        <div
          key={s.id}
          style={{
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <strong>{s.name}</strong> — {s.email}
          </div>

          <button
            onClick={() => deleteStudent(s.id)}
            style={{
              padding: "5px 10px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManageStudents;
