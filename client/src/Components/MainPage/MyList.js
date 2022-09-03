import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { auth } from "../../firebase";
import { Profile } from "../../App";
import axios from "axios";
import SliderItem from "./SliderItem";
import AllInfo from "./ContextApi";
import "./styles/MyList.css";
import DisplayContents from "./DisplayContent";
import MovieHover from "./CardHover";

const MyList = () => {
  const [profile] = useContext(Profile);
  const [list, setlist] = useState();
  const [showDeets, setShowDeets] = useState();
  const [showId, setShowId] = useState();
  const [showInfo, setShowInfo] = useState();
  const [hoverCardType, setHoveredCardType] = useState("");
  const [hoverCard, setHoverCard] = useState(0);

  const getList = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: profile,
    };
    axios
      .post(`${process.env.REACT_APP_baseServerurl}/profile/my-list`, data)
      .then((res) => {
        setlist(res.data);
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) getList();
    });
  }, []);
  return (
    <div className="page--wrapper my-list--wrapper py-10 lg:px-0">
        <div className="title text-lg lg:text-3xl px-10">
          <h1>My List</h1>
        </div>
      <div className="moviesCategories">
        <AllInfo.Provider
          value={[
            showId,
            setShowId,
            showDeets,
            setShowDeets,
            showInfo,
            setShowInfo,
            hoverCardType,
            setHoveredCardType,
            hoverCard,
            setHoverCard,
          ]}
        >
          {list &&
            list.map((l, index) => {
              return (
                <SliderItem {...l} index={index} category="list"></SliderItem>
              );
            })}
        </AllInfo.Provider>
      </div>
      {showInfo && <DisplayContents showInfo={[showInfo, setShowInfo]} />}
    </div>
  );
};

export default MyList;
