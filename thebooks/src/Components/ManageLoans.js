import React, { useEffect, useState } from "react";

function ManageLoans() {
  const [loans, setLoans] = useState([]);

  const loadLoans = () => {
    fetch("http://localhost:5000/loans")
      .then((res) => res.json())
      .then((data) => setLoans(data));
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const deleteLoan = async (loanId) => {
    const confirmed = window.confirm("Are you sure you want to delete this loan?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/loans/${loanId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Loan deleted!");
      loadLoans(); 
    } else {
      alert("Failed to delete loan");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Loans</h2>

      {loans.length === 0 && <p>No loans found</p>}

      {loans.map((loan) => (
        <div
          key={loan.id}
          style={{
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <strong>{loan.bookTitle}</strong> — borrowed by {loan.studentName}
          </div>

          <button
            onClick={() => deleteLoan(loan.id)}
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

export default ManageLoans;
