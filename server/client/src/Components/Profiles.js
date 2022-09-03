import { useState, useContext, useEffect, createContext } from "react";
import "./styles/Profiles.css";
import { userData } from "./userData";
import { Profile } from "../App";
import axios from "axios";
import { auth } from "../firebase";
import CreateProfile from "./ProfileComponents/createProfile";
import { useNavigate } from "react-router-dom";

export const profileApi = createContext();

function Profiles() {
  const navigate = useNavigate();
  const [profile, setProfile] = useContext(Profile);
  const [profiles, setProfiles] = useState();
  const [create, setCreate] = useState(false);
  const nxtPage = (user) => {
    setProfile(user);
  };

  const getData = async () => {
    const data = {
      userId: auth.currentUser.uid,
    };

    axios
      .post(`${process.env.REACT_APP_baseServerurl}/profile/get-profiles`, data)
      .then((res) => {
        setProfiles(res.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <header className="logo px-10 flex items-center">
        <div className="w-20 h-10">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png?20190206123158"></img>
        </div>
      </header>
      <main className="Profiles--wrapper">
        {profiles ? (
          profiles.length > 0 ? (
            <>
              <div className="header">
                <h1>Who's watching?</h1>
              </div>
              <div className="profiles">
                <div className="profiles--wrapper">
                  {profiles.map((p) => {
                    return (
                      <div className="img-wrapper">
                        <figure>
                          <img
                            src={p.data.picture}
                            onClick={() => {
                              localStorage.setItem("activeProfile", p.name);
                              nxtPage(p.name);
                            }}
                          ></img>
                        </figure>
                        <span>
                          <p className="user">{p.name}</p>
                        </span>
                      </div>
                    );
                  })}
                  {profiles.length < 5 && (
                    <div className="n profiles">
                      <div
                        onClick={() => {
                          navigate("/create");
                        }}
                      >
                        <div className="new-profile">
                          <p> + </p>
                        </div>
                        <span>
                          <p className="user">New Profile</p>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button>Manage Profiles</button>
            </>
          ) : (
            <>
              <div className="header">
                <h1>Create Profile</h1>
              </div>
              <div className="n profiles">
                <div
                  onClick={() => {
                    navigate("/create");
                  }}
                >
                  <div className="new-profile">
                    <p> + </p>
                  </div>
                  <span>
                    <p className="user">New Profile</p>
                  </span>
                </div>
              </div>
            </>
          )
        ) : (
          <div></div>
        )}
      </main>
    </>
  );
}
export default Profiles;
