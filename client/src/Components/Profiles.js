import { useContext, useEffect, createContext } from "react";
import "./styles/Profiles.css";
import { Profile, ProfilesData } from "../App";
import { useNavigate } from "react-router-dom";

export const profileApi = createContext();

function Profiles() {
  const navigate = useNavigate();
  const {activeProfile, setActiveProfile} = useContext(Profile);
  const {Allprofiles} = useContext(ProfilesData);

  const nxtPage = (user) => {
    setActiveProfile(user);
    navigate("/browse");
  };

  useEffect(() => {
    if (activeProfile) navigate("/browse");
  }, []);

  return (
    <>
      <header className="logo px-10 flex items-center">
        <div className="">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png?20190206123158"></img>
        </div>
      </header>
      <main className="Profiles--wrapper">
        {Allprofiles ? (
          Allprofiles.length > 0 ? (
            <>
              <div className="header">
                <h1 className="text-5xl">Who's watching?</h1>
              </div>
              <div className="profiles">
                <div className="profiles--wrapper">
                  {Allprofiles.map((p) => {
                    return (
                      <div className="img-wrapper">
                        <figure>
                          <img
                            loading="lazy"
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
                  {Allprofiles.length < 5 && (
                    <div
                      className="new-profile--wrapper img-wrapper"
                      onClick={() => {
                        navigate("/create");
                      }}
                    >
                      <div className="new-profile">
                        <p className=""> + </p>
                      </div>
                      <span>
                        <p className="user text-center">New Profile</p>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="manage"
                onClick={() => {
                  navigate("/Manage");
                }}
              >
                Manage Profiles
              </button>
            </>
          ) : (
            <>
              <div className="header">
                <h1>Create Profile</h1>
              </div>
              <div
                className="new-profile--wrapper img-wrapper"
                onClick={() => {
                  navigate("/create");
                }}
              >
                <div className="new-profile">
                  <p> + </p>
                </div>
                <span>
                  <p className="user text-center">New Profile</p>
                </span>
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
