import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const data = { name, email, password };

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.text();
      console.log("Response:", responseData);

      if (res.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(responseData); 
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Server error. Please try again later.");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" name="name" placeholder="Ashutosh" />

        <label htmlFor="email">Email:</label>
        <input id="email" type="email" name="email" placeholder="abc@gmail.com" />

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" name="password" />

        <button type="submit">Submit</button>

        <p>Already have an account?</p>
        <button type="button" onClick={() => navigate("/login")}>
          Sign in
        </button>
      </form>
    </>
  );
}
