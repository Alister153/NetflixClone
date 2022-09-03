import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import { AllShowInfo, Scroll } from "../../App";
import { fetchTrailer } from "./CardHover";
import SliderItem from "./SliderItem";

function DisplayContents(props) {
  const [recommendations, setRecommendations] = useState();
  const [credits, setCredits] = useState();
  const [genres, setGenres] = useState()
  const [scroll, setScroll] = useContext(Scroll);

  const close = (e) => {
    props.showInfo[1]();
    setScroll(false);
  };

  const more_Recommendations = async () => {
    const data = {
      type: props.showInfo[0].media_type,
      id: props.showInfo[0].id,
    };
    await axios
      .post(`${process.env.REACT_APP_baseServerurl}/movies/get-recommendations`, data)
      .then((res) => setRecommendations(res.data));
  };
  const getCredits = async () => {
    const data = {
      type: props.showInfo[0].media_type,
      id: props.showInfo[0].id,
    };
    await axios
      .post(`${process.env.REACT_APP_baseServerurl}/movies/get-credits`, data)
      .then((res) => {
        setCredits(res.data);
      });
  };
  const getGenres = async () => {
    await axios
    .get(`${process.env.REACT_APP_baseServerurl}/movies/get-genres`)
    .then((res) => {
      setGenres(res.data);
    });
  }
  const scrollParallex = (e) => {
    var value = 400;
    var scale = 1
    const element = document.getElementsByClassName("details-recommends")[0];
    const img = document.getElementsByClassName("show-trailer")[0].querySelector("img")
    var scroll = e.target.scrollTop;
    element.style.top = `${value - scroll / 2}px`;
    img.style.transform= `scale(${1 + scroll/1000})`
  };

  useEffect(() => {
    getCredits();
    getGenres();
    more_Recommendations();
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
            src={`${process.env.REACT_APP_OriginalimgPATH}${props.showInfo[0].backdrop_path}`}
          ></img>
        </figure>
        <div className="details-recommends">
          <div className="details">
            <div>
              <p
                style={{
                  color: props.showInfo[0].vote_average > 6 ? "green" : "red",
                }}
              >
                {props.showInfo[0].vote_average}
              </p>
              <p>
                {props.showInfo[0].release_date ||
                  props.showInfo[0].first_air_date}
              </p>
              <p style={{ textTransform: "uppercase" }}>
                {props.showInfo[0].media_type}
              </p>
            </div>
            <div>
              <h1>{props.showInfo[0].title || props.showInfo[0].name}</h1>
              <p>{props.showInfo[0].overview}</p>
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
                          src={`${process.env.REACT_APP_OriginalimgPATH}${r.backdrop_path}`}
                        ></img>
                      </div>
                      <div style={{padding: "20px"}}>
                        <div style={{marginBottom: '10px'}}>
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
            <h1>About {props.showInfo[0].title || props.showInfo[0].name}</h1>
            <div className="cast">
              <span style={{ color: "grey" }}>Cast:</span>
              {credits &&
                credits.map((c) => {
                  return <a>{c.name}, </a>;
                })}
            </div>
            {/* <div className="genre">
              <span style={{ color: "grey" }}>Genres:</span>
              {genres && genres
                .filter((g) => props.showInfo[0].genre_ids.includes(g.id))
                .map((g) => {
                  return <span>{g.name},</span>;
                })}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayContents;
