import { useState } from "react";
import CreateModal from "./SignComponents/CreateModal";
import LoginModal from "./SignComponents/LoginModal";
import "./styles/Signup.css";
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const page = sessionStorage.getItem("page")
  const [signPage, setSignPage] = useState(page ? page: "login");
  return (
    <div className="signup">
      <div className="overlay"></div>
      <nav className="navbar">
        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png?20190206123158"></img>
        </figure>
        {signPage === "create" && (
          <div className="language-sign">
            <select>
              <option value="English">English</option>
              <option value="German">deutsch</option>
              <option value="Russian">русский</option>
              <option value="Japanese">日本</option>
            </select>
            <button 
            style={{cursor: "pointer"}}
            onClick={() => {
              setSignPage('login')
            }}>Sign In</button>
          </div>
        )}
      </nav>
      {signPage === "login" ? (
        <LoginModal page={setSignPage}></LoginModal>
      ) : signPage === 'create' && (
        <CreateModal></CreateModal>
      )}
    </div>
  );
};

export default Signup;
