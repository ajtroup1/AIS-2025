import React, { useState } from "react";
import "../css/LoginPage.css";

interface LoginPageProps {
  onLogin: (username: string) => void; 
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignIn = () => {
    
    onLogin(username);
  };

  return (
    <div className="container">
      <header className="head">
        <h1 className="headerText">Login</h1>
      </header>

      <div className="textBox1">
        <label className="label">Username</label>
        <input
          type="text"
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="textBox2">
        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <button onClick={handleSignIn} className="Signinbutton">
          Sign In
        </button>
         <p>
              Don't have an account?{" "}
              <button
                onClick={() => setIsRegistering(true)}
                style={{ background: "none", border: "none", color: "#0071ce", cursor: "pointer" }}
              >
                Register
              </button>
            </p>
      </div>
    </div>
  );
};

export default LoginPage;