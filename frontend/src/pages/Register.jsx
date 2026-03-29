import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();
useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/Login"); 
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault(); 
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful ");
        
         navigate("/Login"); 
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        <form onSubmit={handleRegister} style={styles.form}>
          <label style={styles.label}>Your Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    background: "linear-gradient(to right, #dbeafe, #c7d2fe)"
  },
  card: {
    width: "400px",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },
  title: {
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    marginTop: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px"
  },
  button: {
    marginTop: "25px",
    padding: "14px",
    backgroundColor: "#FFD814",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default Register;


 