import { useContext, useState } from "react";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";

const LoginModal = (props) => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState(false);
  const [passwordInput, setPasswordIntput] = useState(false);
  const [passToggle, setPassToggle] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const Login = async () => {
    const data = {
      email: email,
      password: password,
    };

    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        localStorage.setItem("SignIn", "true");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            NotificationManager.error("Email address is not valid");
            break;
          case "auth/too-many-requests":
            NotificationManager.warning("Too many signIn attempts try again later.");
            break;
          case "auth/wrong-password":
            NotificationManager.error("Wrong Password.");
            break;
          default:
            console.log(error);
            break;
        }
      });
  };
  return (
    <div
      className="login--modal"
      onClick={() => {
        if (passwordInput && password.length === 0)
          setPasswordIntput(!passwordInput);
        if (emailInput && email.length === 0) setEmailInput(!emailInput);
      }}
    >
      <div className="modal--wrapper">
        <div className="modal">
          <h1 style={{ color: "white" }}>Sign In</h1>
          <div className="email-password">
            <label
              className={emailInput && "active"}
              onClick={() => {
                if (email.length === 0) setEmailInput(!emailInput);
                if (passwordInput && password.length === 0)
                  setPasswordIntput(!passwordInput);
              }}
            >
              <p>Email or phone number</p>
              <input
                value={email}
                onChange={(e) => {
                  if (emailInput) setEmail(e.target.value);
                }}
                type="email"
                className="email"
              ></input>
            </label>
            <label
              className={passwordInput && "active"}
              id="password-container"
              onClick={(e) => {
                if (password.length === 0) setPasswordIntput(!passwordInput);
                if (emailInput && email.length === 0)
                  setEmailInput(!emailInput);
              }}
            >
              <p>Password</p>
              <input
                value={password}
                onChange={(e) => {
                  if (passwordInput) setPassword(e.target.value);
                }}
                type={passToggle ? "text" : "password"}
                className="password"
              ></input>
              <p
                className="password-toggle"
                onClick={() => {
                  setPassToggle(!passToggle);
                }}
              >
                {passToggle ? "HIDE" : "SHOW"}
              </p>
            </label>
          </div>
          <div className="content--wrapper">
            <button className="sign-btn" onClick={Login}>
              Sign In
            </button>
            <div className="extra-content">
              <div className="check-container">
                <label>
                  <input type="checkbox" />
                  <span className="check"></span>
                </label>
                Remember me
              </div>
              <p className="help">Need help?</p>
            </div>
          </div>
          <div className="modal--footer">
            <p>
              New to Netflix?
              <span
                onClick={() => {
                  props.page("create");
                }}
              >
                Sign up now
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
