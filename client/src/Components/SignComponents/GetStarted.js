import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../url";

const GetStarted = () => {
  const navigate = useNavigate();
  const setup = useRef();
  const [password, setPassword] = useState("");
  const [passVisibility, setPassVisibility] = useState(false);
  const [passActive, setPassActive] = useState(false);

  const nextSlide = (e) => {
    const parent = setup.current;
    const currentActive = e.target.closest(".parts");
    const nextActive = [...parent.children].indexOf(currentActive) + 1;

    if (nextActive < [...parent.children].length && nextActive) {
      currentActive.classList.add("off");
      [...parent.children][nextActive].classList.add("on");
      setTimeout(() => {
        delete currentActive.dataset.active;
        [...parent.children][nextActive].dataset.active = true;
      }, 300);
    }
  };
  const handleClick = (e) => {
    if (password.length > 0) {
      handleComplete(e);
    } else {
      const placeholder = document.getElementsByClassName("placeholder")[0];
      const input = document.querySelector("input");
      input.focus();
      placeholder.style.color = "red";
      setTimeout(() => {
        placeholder.style.color = "";
      }, 1000);
      setPassActive(true);
    }
  };

  const handleComplete = (e) => {
    const email = sessionStorage.getItem("email");
    const data = {
      email: email,
      password: password,
    };
    axios
      .post(`${baseUrl}/api/login/signup`, data)
      .then((res) => {
        NotificationManager.success(res.data);
        nextSlide(e);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          NotificationManager.error(err.response.data);
        }
      });
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, sessionStorage.getItem("email"), password)
      .then((userCred) => {
        navigate("/");
        NotificationManager.success("Logged In");
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        NotificationManager.error(`${errorCode}: ${errorMessage}`);
      });
  };

  return (
    <div className="get-started--wrapper">
      <nav className="navbar">
        <div>
          <figure>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png?20190206123158"></img>
          </figure>
        </div>
        <div>
          <p style={{ color: "black" }}>Sign In</p>
        </div>
      </nav>
      <div className="setup" ref={setup}>
        <div className="parts" data-active>
          <div className="deets">
            <p>STEP 1 OF 2</p>
            <h1>Create your password</h1>
            <p>Just another step and you're done!</p>
            <p>Netflix clone is personalized for you.</p>
          </div>
          <div className={`password ${passActive && "active"}`}>
            <label
              onClick={() => {
                if (password.length === 0) {
                  setPassActive(!passActive);
                }
              }}
            >
              <p className="placeholder">Password</p>
              <input
                type={passVisibility ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  if (passActive) setPassword(e.target.value);
                }}
              ></input>
              <p
                className="pass-vis"
                onClick={() => {
                  setPassVisibility(!passVisibility);
                }}
              >
                {passVisibility ? "HIDE" : "SHOW"}
              </p>
            </label>
          </div>
          <div className="nxt-btn">
            <button onClick={handleClick}>Next</button>
          </div>
        </div>

        <div className="parts">
          <figure>
            <img src="https://assets.nflxext.com/ffe/siteui/acquisition/simplicity/Devices.png"></img>
          </figure>
          <div className="deets">
            <p>STEP 2 OF 2</p>
            <h1>That's it!</h1>
            <p>How fast was that Uhhh.</p>
          </div>
          <div className="nxt-btn">
            <button onClick={signIn}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
