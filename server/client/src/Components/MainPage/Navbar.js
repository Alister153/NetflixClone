import { useState, useContext, useRef } from "react";
import { Profile, ProfilesData, ScreenWidth } from "../../App";
import { userData } from "../userData";
import { BiSearch, BiUser, BiHelpCircle } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosNotifications } from "react-icons/io";
import { GoTriangleDown, GoPencil } from "react-icons/go";
import { search } from "../../App";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

var searchTimeout = 0;
function Navbar(props) {
  const screen = useContext(ScreenWidth);
  const [profile, setProfile] = useContext(Profile);
  const [searchContent, setSearchContent] = useContext(search);
  const [Allprofiles, setAllProfiles] = useContext(ProfilesData);
  const navigate = useNavigate();
  const searchRef = useRef();
  const notifications = useRef();
  const profileSettings = useRef();
  const Browse = useRef();
  const navMenu = useRef();
  const overlay = useRef();
  var section = sessionStorage.getItem("section");
  var notiTimeout;
  var profileTimeout;

  const searchIcon = () => {
    searchRef.current.classList.toggle("active");
  };

  const navToggle = () => {
    navMenu.current.classList.toggle("active");
    overlay.current.classList.toggle("overlay");
  };

  const popNoti = () => {
    clearTimeout(notiTimeout);
    Browse.current && Browse.current.classList.remove("active");
    profileSettings.current.classList.remove("active");
    notifications.current.classList.add("active");
  };

  const removePopNoti = () => {
    notiTimeout = setTimeout(() => {
      notifications.current.classList.remove("active");
    }, 200);
  };

  const popProfile = () => {
    clearTimeout(profileTimeout);
    Browse.current && Browse.current.classList.remove("active");
    notifications.current.classList.remove("active");
    profileSettings.current.classList.add("active");
  };

  const removeProfile = () => {
    profileTimeout = setTimeout(() => {
      profileSettings.current.classList.remove("active");
    }, 200);
  };

  const activeSection = (e) => {
    const children = [
      ...document.getElementsByClassName("categories")[0].children,
    ];
    children.map((c) => {
      delete c.dataset.active;
    });
    e.target.dataset.active = "true";
  };

  const browse = () => {
    var browseTimeout;

    const popBrowse = () => {
      clearTimeout(browseTimeout);
      notifications.current.classList.remove("active");
      profileSettings.current.classList.remove("active");
      Browse.current.classList.add("active");
    };
    const removeBrowse = () => {
      browseTimeout = setTimeout(() => {
        Browse.current.classList.remove("active");
      }, 200);
    };
    const cate = (
      <ul className="categories">
        <li
          onClick={(e) => {
            activeSection(e);
            sessionStorage.setItem("section", "home");
            searchRef.current.classList.remove("active");
            navigate("/");
          }}
          data-active={section === "home"}
        >
          Home
        </li>
        <li
          onClick={(e) => {
            activeSection(e);
            sessionStorage.setItem("section", "tv");
            navigate(`/genre/tv`);
          }}
          data-active={section === "tv"}
        >
          TV Shows
        </li>
        <li
          onClick={(e) => {
            activeSection(e);
            sessionStorage.setItem("section", "movies");
            navigate(`/genre/movies`);
          }}
          data-active={section === "movies"}
        >
          Movies
        </li>
        <li
          onClick={(e) => {
            activeSection(e);
            sessionStorage.setItem("section", "latest");
            navigate("/latest");
          }}
          data-active={section === "latest"}
        >
          Latest
        </li>
        <li
          onClick={(e) => {
            activeSection(e);
            sessionStorage.setItem("section", "my-list");
            navigate("/my-list");
          }}
          data-active={section === "my-list"}
        >
          MyList
        </li>
        <li
          onClick={(e) => {
            activeSection(e);
            navigate("/");
          }}
        >
          Browse by Languages
        </li>
      </ul>
    );

    if (screen > 900) return cate;

    return (
      <div
        className="browse pl-3"
        ref={Browse}
        onMouseEnter={popBrowse}
        onMouseLeave={removeBrowse}
      >
        <p>Browse</p>
        {cate}
      </div>
    );
  };

  const logOut = () => {
    localStorage.removeItem("activeProfile");
    auth.signOut();
  };

  return screen > 900 ? (
    <nav className="navbar">
      <div className="logo-category">
        <figure>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png?20190206123158"></img>
        </figure>
        {browse()}
      </div>
      <div className="search-profile">
        <ul>
          <li className="search-container" ref={searchRef}>
            <div className="search--wrapper">
              <BiSearch
                className="icons"
                onClick={searchIcon}
                id="search"
              ></BiSearch>
              <input
                type="search"
                placeholder="Titles,people,genres"
                onChange={(e) => {
                  const { value } = e.target;
                  if (searchTimeout) clearTimeout(searchTimeout);
                  if (value.length === 0) navigate("/");
                  else if (/^\S/.test(value)) {
                    searchTimeout = setTimeout(() => {
                      navigate(`/search?s=${value}`);
                    }, 500);
                  }
                }}
              ></input>
            </div>
          </li>
          <li className="childrens">Kids</li>
          <li className="notification-container--wrapper" ref={notifications}>
            <IoIosNotifications
              className="icons"
              onMouseOver={popNoti}
              onMouseLeave={removePopNoti}
            ></IoIosNotifications>
            <div
              className="notifications--lists"
              onMouseLeave={removePopNoti}
              onMouseOver={popNoti}
            >
              <div className="notification-item">
                <figure>
                  <img
                    className="noti-img"
                    src="https://occ-0-1360-769.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABWyssWH42yPoRSGMPdesYpn0r2ybzOLJ68HxzTZ5R5P67YPA6M1ozPGBP8KYA0NkegmZEleQbgFTfCA5SS4DHRsdR9cnaDQ6tUb8.jpg?r=7bb"
                  ></img>
                </figure>
                <div className="details">
                  <h1>New Arrival</h1>
                  <p>Day Shift</p>
                  <p>3 weeks ago</p>
                </div>
              </div>
              <div className="notification-item">
                <figure>
                  <img
                    className="noti-img"
                    src="https://occ-0-1360-769.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABWyssWH42yPoRSGMPdesYpn0r2ybzOLJ68HxzTZ5R5P67YPA6M1ozPGBP8KYA0NkegmZEleQbgFTfCA5SS4DHRsdR9cnaDQ6tUb8.jpg?r=7bb"
                  ></img>
                </figure>
                <div className="details">
                  <h1>New Arrival</h1>
                  <p>Day Shift</p>
                  <p>3 weeks ago</p>
                </div>
              </div>
              <div className="notification-item">
                <figure>
                  <img
                    className="noti-img"
                    src="https://occ-0-1360-769.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABWyssWH42yPoRSGMPdesYpn0r2ybzOLJ68HxzTZ5R5P67YPA6M1ozPGBP8KYA0NkegmZEleQbgFTfCA5SS4DHRsdR9cnaDQ6tUb8.jpg?r=7bb"
                  ></img>
                </figure>
                <div className="details">
                  <h1>New Arrival</h1>
                  <p>Day Shift</p>
                  <p>3 weeks ago</p>
                </div>
              </div>
            </div>
          </li>
          <li
            className="profile"
            onMouseOut={removeProfile}
            onMouseOver={popProfile}
          >
            {Allprofiles &&
              Allprofiles.map((p) => {
                return (
                  p.name === profile && (
                    <figure>
                      <img src={p.data.picture}></img>
                    </figure>
                  )
                );
              })}
            <GoTriangleDown className="icons"></GoTriangleDown>
            <div className="more-profile-details" ref={profileSettings}>
              <ul>
                {Allprofiles &&
                  Allprofiles.map((p) => {
                    if (p.name !== profile)
                      return (
                        <li
                          onClick={() => {
                            localStorage.setItem("activeProfile", p.name);
                            setProfile(p.name);
                          }}
                        >
                          <figure>
                            <img src={p.data.picture}></img>
                          </figure>
                          <p>{p.name}</p>
                        </li>
                      );
                  })}
                <li className="manage">
                  <figure>
                    <GoPencil></GoPencil>
                  </figure>
                  <p>Manage Profile</p>
                </li>
                <li className="account">
                  <figure>
                    <BiUser></BiUser>
                  </figure>
                  <p>Account</p>
                </li>
                <li className="help">
                  <figure>
                    <BiHelpCircle></BiHelpCircle>
                  </figure>
                  <p>Help Centre</p>
                </li>
                <li className="sign-out" onClick={logOut}>
                  <p>Sign out of Netflix</p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  ) : (
    <nav className="navbar">
      <div className="nav--wrapper fixed left-0 right-0 flex h-24">
        <div className="" ref={overlay}></div>
        <div className="nav-menu overflow-hidden " ref={navMenu}>
          <ul className="flex flex-col justify-evenly w-60 font-semibold categories">
            <li className="w-full mb-5 border-b-2 border-gray-600">
              {Allprofiles &&
                Allprofiles.map((p) => {
                  return (
                    p.name === profile && (
                      <li className="Profile-settings cursor-pointer px-5 py-1 w-full flex justify-start items-end">
                        <figure className="w-9">
                          <img src={p.data.picture}></img>
                        </figure>
                        <div className="w-3/5 px-2">
                          <p className="w-full">{p.name}</p>
                          <p
                            className="text-xs w-full font-thin"
                            onClick={() => {
                              localStorage.removeItem("activeProfile");
                              setProfile();
                            }}
                          >
                            Switch Profiles
                          </p>
                        </div>
                      </li>
                    )
                  );
                })}
              <li className="w-full py-1 px-5 flex justify-start cursor-pointer">
                <p>Account</p>
              </li>
              <li className="w-full py-1 px-5 flex justify-start cursor-pointer">
                <p>Help Centre</p>
              </li>
              <li
                className="w-full py-1 px-5 flex justify-start cursor-pointer"
                onClick={logOut}
              >
                <p>Sign out of Netflix</p>
              </li>
            </li>
            <li
              className="w-full py-1 px-5 flex justify-start cursor-pointer"
              onClick={(e) => {
                activeSection(e);
                navigate("/");
                navToggle();
              }}
              data-active={section === "home"}
            >
              <p>Home</p>
            </li>
            <li
              className="w-full py-1 px-5 flex justify-start cursor-pointer"
              onClick={(e) => {
                activeSection(e);
                sessionStorage.setItem("section", "my-list");
                navigate("/my-list");
                navToggle();
              }}
              data-active={section === "my-list"}
            >
              <p>My List</p>
            </li>
            <li
              className="w-full py-1 px-5 flex justify-start cursor-pointer"
              onClick={(e) => {
                activeSection(e);
                sessionStorage.setItem("section", "tv");
                navigate(`/genre/tv`);
                navToggle();
              }}
              data-active={section === "tv"}
            >
              <p>Tv Shows</p>
            </li>
            <li
              className="w-full py-1 px-5 flex justify-start cursor-pointer"
              onClick={(e) => {
                activeSection(e);
                sessionStorage.setItem("section", "movies");
                navigate(`/genre/movies`);
                navToggle();
              }}
              data-active={section === "movies"}
            >
              <p>Movies</p>
            </li>
            <li className="w-full py-1 px-5 flex justify-start cursor-pointer">
              <p>Action</p>
            </li>
            <li className="w-full py-1 px-5 flex justify-start cursor-pointer">
              <p>Adventure</p>
            </li>
            <li className="w-full py-1 px-5 flex justify-start cursor-pointer">
              <p>Comedies</p>
            </li>
          </ul>
        </div>
        <div className="flex w-full justify-between align-center px-5">
          <div className="logo-category flex w-1/4">
            <figure
              className="h-5 w-5"
              onClick={navToggle}
            >
              <GiHamburgerMenu className="w-full h-full"></GiHamburgerMenu>
            </figure>
            <figure className="ml-1">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1198px-Netflix_2015_logo.svg.png?20190206123158"></img>
            </figure>
          </div>
          <div
            className="search"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div>
              <input
                placeholder="Search"
                style={{
                  background: "#141414",
                  padding: "5px",
                  border: "1px solid grey",
                }}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
