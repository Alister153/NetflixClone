import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import MovieHover from "./CardHover";
import AllInfo from "./ContextApi";
import DisplayContents from "./DisplayContent";
import Categories from "./Sections";
import { FaPlay } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useParams, useSearchParams } from "react-router-dom";
import { ScreenWidth } from "../../App";

const Genre = () => {
  const { genre } = useParams();
  const [data, setData] = useState();
  const [showDeets, setShowDeets] = useState();
  const [showInfo, setShowInfo] = useState();
  const [showId, setShowId] = useState();
  const [hoverCardType, setHoveredCardType] = useState("");
  const [hoverCard, setHoverCard] = useState(0);
  const [random, setRandom] = useState();
  const screen = useContext(ScreenWidth);

  const fetchData = () => {
    axios
      .post(`${process.env.REACT_APP_baseServerurl}/movies/get-${genre}`)
      .then((res) => {
        setData(res.data);
        const response = res.data;
        const keys = Object.keys(response);
        const random_key = keys[Math.floor(Math.random() * keys.length)];
        setRandom(
          response[random_key][
            Math.floor(Math.random() * response[random_key].length)
          ]
        );
      });
  };

  useEffect(() => {
    fetchData();
  }, [genre]);
  return (
    <div className="page--wrapper py-10 lg:py-0 display-show--wrapper">
      {screen > 900 && random && (
        <>
          <div className="main w-full overflow-hidden">
            <figure className="h-full">
              <img
                className="w-full h-full"
                src={`${process.env.REACT_APP_OriginalimgPATH}${random.backdrop_path}`}
              ></img>
              <div className="img-layer"></div>
            </figure>
          </div>
          <div className="display-show flex justify-center">
            <div className="display-show-details">
              <div className="mb-10">
                <div>
                  <h1 className="mb-4 text-sm lg:text-5xl">
                    {random.name || random.original_title}
                  </h1>
                </div>
                <div className="display-show-info">
                  <p className="text-xs lg:text-base">{random.overview}</p>
                </div>
              </div>
              <div className="display-show-btns flex">
                <button className="slider-btn flex items-center justify-evenly">
                  <FaPlay className="fill-black"></FaPlay>
                  <p className="text-black">Play</p>
                </button>
                <button className="slider-btn flex items-center justify-evenly">
                  <AiOutlineExclamationCircle className="fill-white"></AiOutlineExclamationCircle>
                  <p className="text-white">More Info</p>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
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
          {data ? (
            Object.keys(data).map((t) => {
              return (
                <Categories
                  name={`${t
                    .charAt(0)
                    .toUpperCase()
                    .concat(t.slice(1))} ${genre}`}
                  data={data[t]}
                ></Categories>
              );
            })
          ) : (
            <LoadingSkeleton
              number={8}
              height={300}
              width={190}
            ></LoadingSkeleton>
          )}
        </AllInfo.Provider>
      </div>
      {showInfo && <DisplayContents showInfo={[showInfo, setShowInfo]} />}
    </div>
  );
};

export default Genre;
