import "./App.css";
import { createContext, useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  useNavigate,
  useRoutes,
} from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Profiles from "./Components/Profiles";
import MainPage from "./Components/MainPage";
import Search from "./Components/Search/Search";
import Navbar from "./Components/MainPage/Navbar";
import Signup from "./Components/Signup";
import axios from "axios";
import { auth } from "./firebase";
import GetStarted from "./Components/SignComponents/GetStarted";
import CreateProfile from "./Components/ProfileComponents/createProfile";
import Genre from "./Components/MainPage/Genre";
import Latest from "./Components/MainPage/Latest";
import MyList from "./Components/MainPage/MyList";

const PagesRoutes = (props) =>
  useRoutes([
    {
      path: "/",
      element:
        props.value[0] && props.value[1] ? (
          <MainPage></MainPage>
        ) : props.value[1] && props.value[2] ? (
          <Profiles></Profiles>
        ) : (
          <Signup></Signup>
        ),
    },
    {
      path: "/get-started",
      element: <GetStarted></GetStarted>,
    },
    {
      path: "/create",
      element: props.value[1] && <CreateProfile></CreateProfile>,
    },
    {
      path: `/search`,
      element: props.value[0] && props.value[1] && <Search></Search>,
    },
    {
      path: "/genre/:genre",
      element: <Genre></Genre>,
    },
    {
      path: "/latest",
      element: <Latest></Latest>,
    },
    {
      path: "/my-list",
      element: <MyList></MyList>,
    },
  ]);

export const Profile = createContext();
export const ProfilesData = createContext();
export const ScreenWidth = createContext();
export const search = createContext();
export const Scroll = createContext();
export const validate = createContext();

function App() {
  const [screen, setScreen] = useState(window.innerWidth);
  const [signIn, setSignIn] = useState(localStorage.getItem("SignIn"));
  const [profile, setProfile] = useState(localStorage.getItem("activeProfile"));
  const [Allprofiles, setAllProfiles] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchContent, setSearchContent] = useState();
  const [scroll, setScroll] = useState(false);
  window.addEventListener("resize", () => {
    setScreen(window.innerWidth);
  });

  useEffect(() => {
    document.getElementById("root").classList.toggle("overflow");
  }, [scroll]);

  const getProfiles = async () => {
    const data = {
      userId: auth.currentUser.uid,
    };
    axios
      .post(`${process.env.REACT_APP_baseServerurl}/profile/get-profiles`, data)
      .then((res) => {
        setAllProfiles(res.data);
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        getProfiles().then(() => setIsLoading(false));
        setSignIn(true);
      } else {
        setSignIn(false);
        setAllProfiles();
        setProfile(
          localStorage.getItem("activeProfile") !== "null"
            ? localStorage.getItem("activeProfile")
            : null
        );
        localStorage.removeItem("activeProfile");
        localStorage.removeItem("SignIn");
      }
    });
  }, []);

  return (
    <>
      <ScreenWidth.Provider value={screen}>
        <validate.Provider value={[signIn, setSignIn]}>
          <Profile.Provider value={[profile, setProfile]}>
            <ProfilesData.Provider value={[Allprofiles, setAllProfiles]}>
              <search.Provider value={[searchContent, setSearchContent]}>
                <Scroll.Provider value={[scroll, setScroll]}>
                  <NotificationContainer />
                  <Router>
                    {profile && signIn && <Navbar></Navbar>}
                    <PagesRoutes
                      value={[profile, signIn, Allprofiles]}
                    ></PagesRoutes>
                  </Router>
                </Scroll.Provider>
              </search.Provider>
            </ProfilesData.Provider>
          </Profile.Provider>
        </validate.Provider>
      </ScreenWidth.Provider>
    </>
  );
}

export default App;
