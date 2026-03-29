import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();
 useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
    navigate("/dashboard"); // if already logged in, go home
    }
  }, [navigate]);

  const handleLogin = async () => {
  const res = await fetch("https://healthcare-platform-ltr5.onrender.com/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Login successful");
     window.location.reload();
navigate("/"); 
 
  } else {
    alert(data.message);
  }
};


  return (
   
 <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", flexDirection: "column" }}>
      <Box sx={{ width: 350, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h5">Log in</Typography>

        <TextField fullWidth label="Email" onChange={(e) => setEmail(e.target.value)} />
        <TextField
          fullWidth
          label="Password"
          type="password"
          sx={{ mt: 2 }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
          Log in
        </Button>

        <Typography fontSize={12} mt={2}>
          New to Webshop? <Link to="/register">Create your account</Link>
        </Typography>
      </Box>
    </Box>
  );
};