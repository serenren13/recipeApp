import { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 400, p: 4, border: "1px solid", borderColor: "primary.main", borderRadius: "12px" }}>
        <Typography variant="h4" sx={{ color: "text.primary", fontWeight: 700, mb: 1 }}>
          Sign In
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Welcome back!
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ input: { color: "text.primary" }, label: { color: "text.secondary" } }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ input: { color: "text.primary" }, label: { color: "text.secondary" } }}
          />
          <Button onClick={handleSignIn} color="primary" fullWidth>
            Sign In
          </Button>
          <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#7AE2CF" }}>
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default SignIn;