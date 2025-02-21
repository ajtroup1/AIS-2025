import React, { useState } from "react";
import "../css/LoginPage.css";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);

  const handleSignIn = () => {
    // Check if username and password are valid
    onLogin(username, password);
  };

  const handleRegister = async () => {
    if (registerPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Call the API to register the user
    const ok = await APIRegister(registerUsername, email, registerPassword);

    if (!ok) {
      return;
    }

    console.log("Registered:", { registerUsername, email, registerPassword });
    setRegistrationSuccess(true);
    setIsRegistering(false);
  };

  const APIRegister = async (username: string, email: string, password: string) => {
    const data = {
      username,
      email,
      password
    }
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status !== 201) {
      const data = await response.json();
      const usernameErr = data.username;
      const emailErr = data.email;
      const passwordErr = data.password;
      const err = usernameErr || emailErr || passwordErr;
      alert("Error registering: " + err);

      return false;
    }

    return true;
  }

  return (
    <div className="container">
      <header className="head">
        <h1 className="headerText">Login</h1>
      </header>

      {!isRegistering ? (
        <>
          <div className="textBox1">
            <label className="label">Username</label>
            <input
              type="text"
              className="visible-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="textBox2">
            <label className="label">Password</label>
            <input
              type="password"
              className="visible-input"
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

          {errorMessage && (
            <p className="error-message">{errorMessage}</p> // Display error message if invalid credentials
          )}
        </>
      ) : (
        <>
          <div className="textBox1">
            <label className="label">Username</label>
            <input
              type="text"
              className="visible-input"
              placeholder="Username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </div>

          <div className="textBox2">
            <label className="label">Email</label>
            <input
              type="email"
              className="visible-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="textBox2">
            <label className="label">Password</label>
            <input
              type="password"
              className="visible-input"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>

          <div className="textBox2">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              className="visible-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}

          {registrationSuccess && (
            <p className="success-message">
              Registration successful! You are now signed in.
            </p>
          )}

          <div>
            <button onClick={handleRegister} className="Signinbutton">
              Register
            </button>
            <button
              onClick={() => setIsRegistering(false)}
              className="Signinbutton"
              style={{ backgroundColor: "#ccc", marginTop: "10px" }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;
