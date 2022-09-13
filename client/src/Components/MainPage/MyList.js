import { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebase";
import { Profile } from "../../App";
import axios from "axios";
import SliderItem from "./SliderItem";
import AllInfo from "./ContextApi";
import "./styles/MyList.css";
import DisplayContents from "./DisplayContent";
import { Route, Routes } from "react-router-dom";
import { baseUrl } from "../../url";
import { NotificationManager } from "react-notifications";
import { collection, onSnapshot } from "firebase/firestore";
import LoadingSkeleton from "../LoadingSkeleton";

const MyList = () => {
  const display = sessionStorage.getItem("displayContents");
  const [activeProfile] = useContext(Profile);
  const [list, setlist] = useState();
  const [showDeets, setShowDeets] = useState();
  const [showId, setShowId] = useState();
  const [hoverCard, setHoverCard] = useState(0);
  const [forDisplayContents, setDisplayContents] = useState(
    display && JSON.parse(display)
  );
  const getList = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: activeProfile,
    };
    axios.post(`/api/profile/my-list`, data).then((res) => {
      setlist(res.data);
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        getList();
        onSnapshot(collection(db, auth.currentUser.uid), (snap) => {
          getList();
        });
      }
    });
  }, [activeProfile]);

  return (
    <div className="page--wrapper my-list--wrapper p-10">
      <div className="title text-lg lg:text-3xl w-full">
        <h1 className="ml-1">My List</h1>
      </div>
      <AllInfo.Provider
        value={[
          showId,
          setShowId,
          showDeets,
          setShowDeets,
          forDisplayContents,
          setDisplayContents,
          hoverCard,
          setHoverCard,
        ]}
      >
        <div className="moviesCategories">
          {list ? (
            list.map((l, index) => {
              return (
                <SliderItem {...l} index={index} category="list"></SliderItem>
              );
            })
          ) : (
            <LoadingSkeleton
              number={5}
              width={200}
              height={350}
            ></LoadingSkeleton>
          )}
        </div>
        <Routes>
          <Route path={`/content=:id`} element={<DisplayContents />}></Route>
        </Routes>
      </AllInfo.Provider>
    </div>
  );
};

export default MyList;
