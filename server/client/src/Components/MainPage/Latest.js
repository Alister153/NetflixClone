import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import AllInfo from "./ContextApi";
import Categories from "./Sections";
import DisplayContents from "../MainPage/DisplayContent";
import MovieHover from "../MainPage/CardHover";
import LoadingSkeleton from "../LoadingSkeleton";

const Latest = () => {
  const [showDeets, setShowDeets] = useState();
  const [showId, setShowId] = useState();
  const [showInfo, setShowInfo] = useState();
  const [hoverCardType, setHoveredCardType] = useState("");
  const [hoverCard, setHoverCard] = useState(0);
  const [Movies, setMovies] = useState();
  const [Tv, setTv] = useState();

  const get_data = () => {
    axios
      .post(`${process.env.REACT_APP_baseServerurl}/movies/latest`)
      .then((res) => {
        setMovies(res.data.movie);
        setTv(res.data.tv);
      });
  };

  useEffect(() => {
    get_data();
  }, []);
  return (
    <div className="page--wrapper">
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
          {Tv ? (
            Object.keys(Tv).map((t) => {
              return (
                <Categories
                  name={`${t.charAt(0).toUpperCase().concat(t.slice(1))} Tv`}
                  data={Tv[t]}
                ></Categories>
              );
            })
          ) : (
            <LoadingSkeleton
              number={8}
              height={330}
              width={200}
            ></LoadingSkeleton>
          )}
          {Movies ? (
            Object.keys(Movies).map((m) => {
              return (
                <Categories
                  name={`${m
                    .charAt(0)
                    .toUpperCase()
                    .concat(m.slice(1))} Movies`}
                  data={Movies[m]}
                ></Categories>
              );
            })
          ) : (
            <div className="mt-20">
              <LoadingSkeleton
                number={8}
                height={330}
                width={200}
              ></LoadingSkeleton>
            </div>
          )}
        </AllInfo.Provider>
      </div>
      {showInfo && <DisplayContents showInfo={[showInfo, setShowInfo]} />}
    </div>
  );
};

export default Latest;
