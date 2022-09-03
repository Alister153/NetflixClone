import { useState, useContext, useEffect, createContext } from "react";
import "./styles/MainPage.css";
import axios from "axios";
import DisplayContents from "./MainPage/DisplayContent";
import LoadingSkeleton from "./LoadingSkeleton";
import Categories from "./MainPage/Sections";
import MovieHover from "./MainPage/CardHover";
import AllInfo from "./MainPage/ContextApi";
import { ScreenWidth } from "../App";

function MainPage() {
  const [shows, setShows] = useState();
  const screen = useContext(ScreenWidth);
  const [showId, setShowId] = useState();
  const [showDeets, setShowDeets] = useState();
  const [showInfo, setShowInfo] = useState();
  const [hoverCardType, setHoveredCardType] = useState("");
  const [hoverCard, setHoverCard] = useState(0);
  const [genres, setGenres] = useState();

  const fetchMovies = () => {
    axios
      .get(`${process.env.REACT_APP_baseServerurl}/movies/get-shows`)
      .then((res) => {
        setShows(res.data);
      });

    axios
      .get(`${process.env.REACT_APP_baseServerurl}/movies/get-showByGenre`)
      .then((res) => {
        setGenres(res.data);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="page--wrapper py-10 md:py-0">
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
        <main className="moviesCategories">
          {screen > 900 && (
            <section className="categories">
              <div className="title">
                <h1 className="text-3xl mb-1">
                  TV Shows &amp; Movies in English
                </h1>
              </div>
              <div className="movies">
                <div className="row1">
                  {shows ? (
                    shows.slice(0, 3).map((m, index) => {
                      return (
                        <div
                          className="card"
                          id={m.title || m.name}
                          data-id={`header-${m.id}`}
                          onMouseLeave={(e) => {
                            setShowId();
                            setShowDeets();
                            setHoveredCardType("");
                          }}
                          onMouseEnter={(e) => {
                            if (hoverCard) clearTimeout(hoverCard);
                            setHoverCard(
                              setTimeout(() => {
                                setShowId(`header-${m.id}`);
                                setShowDeets(m);
                                setHoveredCardType("");
                              }, 300)
                            );
                          }}
                        >
                          <img
                            src={`${process.env.REACT_APP_OriginalimgPATH}${m.backdrop_path}`}
                          ></img>
                          {showId === `header-${m.id}` && (
                            <MovieHover
                              showDeets={showDeets}
                              showInfo={setShowInfo}
                              showId={[showId, setShowId]}
                              cardType={[hoverCardType, setHoveredCardType]}
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <LoadingSkeleton
                      number={3}
                      height={200}
                      width={470}
                    ></LoadingSkeleton>
                  )}
                </div>
                <div className="row2">
                  {shows ? (
                    shows.slice(3).map((m, index) => {
                      return (
                        <div
                          className="card"
                          id={m.title || m.name}
                          data-id={`header-${m.id}`}
                          onMouseLeave={(e) => {
                            setShowId();
                            setShowDeets();
                            setHoveredCardType("");
                          }}
                          onMouseEnter={() => {
                            if (hoverCard) clearTimeout(hoverCard);
                            setHoverCard(
                              setTimeout(() => {
                                setShowId(`header-${m.id}`);
                                setShowDeets(m);
                                setHoveredCardType("medium");
                              }, 300)
                            );
                          }}
                        >
                          <img
                            src={`${process.env.REACT_APP_OriginalimgPATH}${m.backdrop_path}`}
                          ></img>
                          {showId === `header-${m.id}` && (
                            <MovieHover
                              showDeets={showDeets}
                              showInfo={setShowInfo}
                              showId={[showId, setShowId]}
                              cardType={[hoverCardType, setHoveredCardType]}
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <LoadingSkeleton
                      number={4}
                      height={200}
                      width={347}
                    ></LoadingSkeleton>
                  )}
                </div>
                <div></div>
              </div>
            </section>
          )}
          {genres ? (
            Object.keys(genres).map((g) => {
              return <Categories data={[...genres[g]]} name={g}></Categories>;
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
          {showInfo && <DisplayContents showInfo={[showInfo, setShowInfo]} />}
        </main>
      </AllInfo.Provider>
    </div>
  );
}
export default MainPage;
