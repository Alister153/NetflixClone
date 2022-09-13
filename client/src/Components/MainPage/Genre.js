import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import AllInfo from "./ContextApi";
import DisplayContents from "./DisplayContent";
import Categories from "./Sections";
import { FaPlay } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ScreenWidth, Scroll } from "../../App";
import { baseUrl, OriginalimgPATH } from "../../url";

const Genre = () => {
  const currPath = useLocation().pathname;
  const display = sessionStorage.getItem("displayContents");
  const [scroll, setScroll] = useContext(Scroll);
  const screen = useContext(ScreenWidth);
  const navigate = useNavigate();

  const { genre } = useParams();
  const [data, setData] = useState();
  const [showDeets, setShowDeets] = useState();
  const [showId, setShowId] = useState();
  const [forDisplayContents, setDisplayContents] = useState(
    display && JSON.parse(display)
  );
  const [hoverCard, setHoverCard] = useState(0);
  const [random, setRandom] = useState();

  const fetchData = () => {
    axios.post(`/api/movies/genre/${genre}`).then((res) => {
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
    <div className="page--wrapper display-show--wrapper">
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
        {screen > 900 && random && (
          <>
            <div className="main w-full overflow-hidden">
              <figure className="h-full">
                <img
                  loading="lazy"
                  Provider
                  className="w-full h-full"
                  src={`${OriginalimgPATH}${random.backdrop_path}`}
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
                  <button
                    className="slider-btn flex items-center justify-evenly"
                    onClick={() => {
                      setScroll(true);
                      setDisplayContents(random);
                      sessionStorage.setItem(
                        "displayContents",
                        JSON.stringify(random)
                      );
                      navigate(`${currPath}/content=${random.id}`);
                    }}
                  >
                    <AiOutlineExclamationCircle className="fill-white"></AiOutlineExclamationCircle>
                    <p className="text-white">More Info</p>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="moviesCategories p-10">
          {data ? (
            Object.keys(data).map((t) => {
              return (
                <Categories
                  name={`${t.charAt(0).toUpperCase().concat(t.slice(1))} ${
                    genre === ("movies" || "tv") ? genre : ""
                  }`}
                  data={data[t]}
                ></Categories>
              );
            })
          ) : (
            <LoadingSkeleton
              number={8}
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

export default Genre;
