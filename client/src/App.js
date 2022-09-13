import "./App.css";
import { createContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Profiles from "./Components/Profiles";
import MainPage from "./Components/MainPage";
import Search from "./Components/Search/Search";
import Navbar from "./Components/MainPage/Navbar";
import Signup from "./Components/Signup";
import axios from "axios";
import { auth, db } from "./firebase";
import GetStarted from "./Components/SignComponents/GetStarted";
import CreateProfile from "./Components/ProfileComponents/createProfile";
import Genre from "./Components/MainPage/Genre";
import Latest from "./Components/MainPage/Latest";
import MyList from "./Components/MainPage/MyList";
import { baseUrl } from "./url";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import EditProfile from "./Components/ProfileComponents/editProfile";

const PagesRoutes = (props) =>
  useRoutes([
    {
      path: "/",
      element: props.value[0] ? <Profiles></Profiles> : <Signup></Signup>,
    },
    {
      path: "/Manage",
      element: props.value[0] && <EditProfile></EditProfile>,
    },
    {
      path: "/browse/*",
      element: <MainPage></MainPage>,
    },
    {
      path: "/get-started",
      element: <GetStarted></GetStarted>,
    },
    {
      path: "/create",
      element: <CreateProfile></CreateProfile>,
    },
    {
      path: "/search/*",
      element: props.value[0] && <Search></Search>,
    },
    {
      path: "/genre/:genre/*",
      element: <Genre></Genre>,
    },
    {
      path: "/latest/*",
      element: <Latest></Latest>,
    },
    {
      path: "/my-list/*",
      element: <MyList></MyList>,
    },
  ]);

export const Profile = createContext();
export const ProfilesData = createContext();
export const ScreenWidth = createContext();
export const search = createContext();
export const Scroll = createContext();
export const validate = createContext();
export const List = createContext();

function App() {
  const [screen, setScreen] = useState(window.innerWidth);
  const [signIn, setSignIn] = useState(localStorage.getItem("SignIn"));
  const [activeProfile, setActiveProfile] = useState(
    localStorage.getItem("activeProfile")
  );
  const [Allprofiles, setAllProfiles] = useState();
  const [searchContent, setSearchContent] = useState();
  const [scroll, setScroll] = useState(false);
  const [list, setList] = useState();
  const isMounted = useRef(false);
  window.addEventListener("resize", () => {
    setScreen(window.innerWidth);
  });

  const getProfiles = async () => {
    const data = {
      userId: auth.currentUser.uid,
    };
    axios.post(`/api/profile/get-profiles`, data).then((res) => {
      setAllProfiles(res.data);
    });
    const ref = collection(db, auth.currentUser.uid);
    onSnapshot(ref, (res) => {
      var data = [];
      res.forEach((profile) => {
        data.push({ name: profile.id, data: profile.data() });
      });
      setAllProfiles(data);
    });
  };

  useEffect(() => {
    if (isMounted.current)
      document.getElementById("root").classList.toggle("overflow");
    else isMounted.current = false;
  }, [scroll]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setSignIn(true);
        getProfiles();
      } else {
        setSignIn(false);
        setAllProfiles();
        setActiveProfile(
          localStorage.getItem("activeProfile") !== "null"
            ? localStorage.getItem("activeProfile")
            : null
        );
        localStorage.removeItem("activeProfile");
        localStorage.removeItem("SignIn");
        localStorage.removeItem("uid");
        setList();
      }
    });
  }, []);

  useEffect(() => {
    if (activeProfile && localStorage.getItem("uid")) {
      const ref = doc(db, localStorage.getItem("uid"), activeProfile);
      getDoc(ref).then((data) => {
        setList(data.data().list);
      });
      onSnapshot(ref, (snap) => {
        setList(snap.data().list);
      });
    }
  }, [activeProfile]);

  return (
    <>
      <ScreenWidth.Provider value={screen}>
        <validate.Provider value={[signIn, setSignIn]}>
          <Profile.Provider value={[activeProfile, setActiveProfile]}>
            <ProfilesData.Provider value={[Allprofiles, setAllProfiles]}>
              <Scroll.Provider value={[scroll, setScroll]}>
                <search.Provider value={[searchContent, setSearchContent]}>
                  <NotificationContainer />
                  <List.Provider value={list}>
                    <Router>
                      {activeProfile && signIn && <Navbar></Navbar>}
                      <PagesRoutes value={[signIn]}></PagesRoutes>
                    </Router>
                  </List.Provider>
                </search.Provider>
              </Scroll.Provider>
            </ProfilesData.Provider>
          </Profile.Provider>
        </validate.Provider>
      </ScreenWidth.Provider>
    </>
  );
}

export default App;
