import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import { List, Profile, ScreenWidth, Scroll } from "../../App";
import { fetchTrailer } from "./CardHover";
import { baseUrl, OriginalimgPATH } from "../../url";
import { useNavigate } from "react-router-dom";
import AllInfo from "./ContextApi";
import { AiFillPlayCircle } from "react-icons/ai";
import {
  IoIosCheckmarkCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { BsFillHandThumbsUpFill, BsHandThumbsDownFill } from "react-icons/bs";
import { NotificationManager } from "react-notifications";
import { auth } from "../../firebase";

var trailerTimeout = 0;
function DisplayContents(props) {
  const navigate = useNavigate();
  const [
    showId,
    setShowId,
    showDeets,
    setShowDeets,
    forDisplayContents,
    setDisplayContents,
    hoverCard,
    setHoverCard,
  ] = useContext(AllInfo);
  const [, setScroll] = useContext(Scroll);
  const screen = useContext(ScreenWidth);
  const list = useContext(List);
  const [activeProfile] = useContext(Profile);
  const [recommendations, setRecommendations] = useState();
  const [credits, setCredits] = useState();
  const [, setGenres] = useState();

  const close = (e) => {
    clearTimeout(trailerTimeout);
    navigate(-1);
    sessionStorage.removeItem("displayContents");
    setScroll(false);
  };

  const addToList = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: activeProfile,
      showId: forDisplayContents.id,
      type: forDisplayContents.media_type,
    };

    axios.post(`/api/profile/add-item`, data).then((res) => {
      NotificationManager.success(res.data);
    });
  };

  const removeFromList = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: activeProfile,
      showId: forDisplayContents.id,
      type: forDisplayContents.media_type,
    };

    axios.post(`/api/profile/remove-item`, data).then((res) => {
      NotificationManager.success(res.data);
    });
  };

  const checkList = () => {
    return list?.some(
      (d) =>
        d.showId === forDisplayContents.id &&
        d.type === forDisplayContents.media_type
    );
  };

  const more_Recommendations = async () => {
    const data = {
      type: forDisplayContents.media_type,
      id: forDisplayContents.id,
    };
    await axios
      .post(`/api/movies/get-recommendations`, data)
      .then((res) => setRecommendations(res.data));
  };

  const getCredits = async () => {
    const data = {
      type: forDisplayContents.media_type,
      id: forDisplayContents.id,
    };
    await axios.post(`/api/movies/get-credits`, data).then((res) => {
      setCredits(res.data);
    });
  };

  const getGenres = async () => {
    await axios.post(`/api/movies/get-genres`).then((res) => {
      setGenres(res.data);
    });
  };

  const scrollParallex = (e) => {
    var value = screen > 1100 ? 370 : 170;
    const element = document.getElementsByClassName("details-recommends")[0];
    const img = document
      .getElementsByClassName("show-trailer")[0]
      .querySelector("img");
    var scroll = e.target.scrollTop;
    element.style.top = `${value - scroll / 2}px`;
    img.style.transform = `scale(${1 + scroll / 1000})`;
  };

  useEffect(() => {
    getCredits();
    getGenres();
    more_Recommendations();

    trailerTimeout = setTimeout(() => {
      fetchTrailer(forDisplayContents);
    }, 1500);
  }, []);

  return (
    <div className="overlay" onClick={close}>
      <div
        className="more--info"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onScroll={scrollParallex}
      >
        <figure className="show-trailer">
          <img
            loading="lazy"
            src={`${OriginalimgPATH}${forDisplayContents.backdrop_path}`}
          ></img>
        </figure>
        <div className="details-recommends">
          <div className="details">
            <div className="w-full">
              <div className="ratings-date-type mb-5">
                <p
                  style={{
                    color:
                      forDisplayContents.vote_average > 6 ? "green" : "red",
                  }}
                >
                  {forDisplayContents.vote_average}
                </p>
                <p>
                  {forDisplayContents.release_date ||
                    forDisplayContents.first_air_date}
                </p>
                <p style={{ textTransform: "uppercase" }}>
                  {forDisplayContents.media_type}
                </p>
              </div>
              <div className="btns--wrapper">
                <div className="btns">
                  <AiFillPlayCircle
                    size="30px"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  ></AiFillPlayCircle>
                  {checkList() ? (
                    <IoIosRemoveCircleOutline
                      size="30px"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromList();
                      }}
                    />
                  ) : (
                    <IoIosCheckmarkCircleOutline
                      size="30px"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToList();
                      }}
                    ></IoIosCheckmarkCircleOutline>
                  )}
                  <span className="like-dislike">
                    <BsFillHandThumbsUpFill
                      size="20px"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    ></BsFillHandThumbsUpFill>
                    <BsHandThumbsDownFill
                      size="20px"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    ></BsHandThumbsDownFill>
                  </span>
                </div>
              </div>
            </div>
            <div className="overview">
              <h1>{forDisplayContents.title || forDisplayContents.name}</h1>
              <p>{forDisplayContents.overview}</p>
            </div>
          </div>
          <div className="recommendations">
            <h1>More like this</h1>
            <div className="movies">
              {recommendations &&
                recommendations.map((r) => {
                  return (
                    <div className="recomend-movie-wrapper">
                      <div>
                        <img
                          loading="lazy"
                          src={`${OriginalimgPATH}${r.backdrop_path}`}
                        ></img>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <div style={{ marginBottom: "10px" }}>
                          <h2>{r.title || r.name}</h2>
                          <h5>
                            {new Date(
                              r.release_date || r.first_air_date
                            ).getFullYear()}
                          </h5>
                        </div>
                        <p>{r.overview}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="credits">
            <h1>About {forDisplayContents.title || forDisplayContents.name}</h1>
            <div className="cast">
              <span style={{ color: "grey" }}>Cast:</span>
              {credits &&
                credits.map((c) => {
                  return <a>{c.name}, </a>;
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayContents;
