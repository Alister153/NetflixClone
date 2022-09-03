import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { search } from "../MainPage";
import MovieHover from "../MainPage/CardHover";
import DisplayContents from "../MainPage/DisplayContent";
import SliderItem from "../MainPage/SliderItem";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchC = searchParams.get("s");
  const [data, setData] = useState();
  const [actors, setActors] = useState([]);
  const [showDeets, setShowDeets] = useState();
  const [showId, setShowId] = useState();
  const [showInfo, setShowInfo] = useState();
  const [hoverCardType, setHoveredCardType] = useState("");
  const [hoverCard, setHoverCard] = useState(0);

  const fetchsearch = async () => {
    await axios
      .get(`${process.env.REACT_APP_baseServerurl}/movies/search`, {
        params: {
          s: searchC,
        },
      })
      .then((res) => {
        var actorsData = [],
          dataData = [];

        res.data.map((r) => {
          if (r.hasOwnProperty("gender")) {
            actorsData.push(r);
          } else dataData.push(r);
        });
        setData(dataData);
        setActors(actorsData);
      });
  };

  useEffect(() => {
    fetchsearch();
  }, [searchC]);

  return (
    <div className="search-results">
      <h1>Results for {searchC} and more</h1>
      {data && (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
            <p style={{ color: "grey", display: "flex", flexWrap: "wrap" }}>
              Explore Titles related to:{" "}
            </p>
            {actors.map((a) => {
              return (
                <p
                  className="related-list"
                  style={{ margin: "0px 5px" }}
                  onClick={() => {
                    setData(a.known_for);
                  }}
                >
                  {" "}
                  {a.name}|
                </p>
              );
            })}
          </div>
          <div className="shows-list">
            {data.map((d, index) => {
              return (
                <div
                  className="card"
                  data-id={d.id}
                  onMouseEnter={() => {
                    if (hoverCard) clearTimeout(hoverCard);
                    setHoverCard(
                      setTimeout(() => {
                        setShowId(d.id);
                        setShowDeets(d);
                        setHoveredCardType("small");
                      }, 600)
                    );
                  }}
                  onMouseLeave={(e) => {
                    if (hoverCard) clearTimeout(hoverCard);
                    else
                      setTimeout(() => {
                        showId();
                        setHoveredCardType("");
                      }, 100);
                  }}
                >
                  <figure>
                    <img
                      src={`${process.env.REACT_APP_w500imgPATH}${d.poster_path}`}
                    ></img>
                  </figure>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {showInfo && (
        <DisplayContents
          showInfo={[showInfo, setShowInfo]}
          // genre={genres}
        />
      )}
      {showId && (
        <MovieHover
          showDeets={showDeets}
          showInfo={setShowInfo}
          showId={[showId, setShowId]}
          cardType={[hoverCardType, setHoveredCardType]}
        />
      )}
    </div>
  );
};

export default Search;
