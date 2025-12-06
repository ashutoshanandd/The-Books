import "../index.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);

    const email = formData.get("email");
    const password = formData.get("password");

    const data = { email, password };

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      
      let responseData;
      try {
        responseData = await res.json();
      } catch {
        responseData = { message: await res.text() };
      }

      console.log("Response:", responseData);

      if (res.ok) {
        localStorage.setItem("token", responseData.token);
        alert(responseData.message || "Login successful!");
        navigate("/");
      } else {
        
        if (responseData.message === "Invalid password") {
          alert("Password doesn't match");
        } else if (responseData.message === "User not found") {
          alert("User not found");
        } else {
          alert(responseData.message || "Invalid credentials. Please try again!");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Server error. Please try again later.");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} method="post">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="abc@gmail.com"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter password"
          required
        />

        <button type="submit">Submit</button>

        <p>Don't have an account?</p>
        <button type="button" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </form>
    </>
  );
}
