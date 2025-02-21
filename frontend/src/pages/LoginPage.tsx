import React, { useState } from "react";
import "../css/LoginPage.css";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false); 
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [full_name, setfull_name] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [latest_edu_name, setlatest_edu_name] = useState<string>("");
  const [latest_edu_from_date, setlatest_edu_from_date] = useState<string>("");
  const [latest_edu_desc, setlatest_edu_desc] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);

  const handleSignIn = () => {
    // Check if username and password are valid
    if (username === "123" && password === "123") {
      onLogin(username); // Proceed with login if valid
    } else {
      setErrorMessage("Invalid username or password!"); // Show error if invalid
    }
  };

  const handleRegister = () => {
    if (registerPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    console.log("Registered:", { registerUsername, email, registerPassword, full_name, phone, website, latest_edu_name, latest_edu_from_date, latest_edu_desc });
    setRegistrationSuccess(true);
    setIsRegistering(false);
    onLogin(registerUsername);
  };

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
          <div className="form-container">
            <div className="form-column">
              <div className="section">
                <h3 className="section-title">Identifying Information</h3>
                <div className="textBox1">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="visible-input"
                    placeholder="Full Name"
                    value={full_name}
                    onChange={(e) => setfull_name(e.target.value)}
                  />
                </div>
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

              </div>
            </div>

            <div className="form-column">
              <div className="section">
                <h3 className="section-title">Education Information</h3>
                <div className="textBox1">
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    className="visible-input"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="textBox1">
                  <label className="label">Website</label>
                  <input
                    type="url"
                    className="visible-input"
                    placeholder="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="textBox1">
                  <label className="label">Latest Education Name</label>
                  <input
                    type="text"
                    className="visible-input"
                    placeholder="Latest Education Name"
                    value={latest_edu_name}
                    onChange={(e) => setlatest_edu_name(e.target.value)}
                  />
                </div>

                <div className="textBox1">
                  <label className="label">From (Date)</label>
                  <input
                    type="date"
                    className="visible-input"
                    value={latest_edu_from_date}
                    onChange={(e) => setlatest_edu_from_date(e.target.value)}
                  />
                </div>

                <div className="textBox1">
                  <label className="label">Latest Education Description</label>
                  <textarea
                    className="visible-input"
                    placeholder="Education Description"
                    value={latest_edu_desc}
                    onChange={(e) => setlatest_edu_desc(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {registrationSuccess && (
            <p className="success-message">Registration successful! You are now signed in.</p>
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
