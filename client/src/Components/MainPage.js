import { useState, useContext, useEffect } from "react";
import "./styles/MainPage.css";
import axios from "axios";
import DisplayContents from "./MainPage/DisplayContent";
import LoadingSkeleton from "./LoadingSkeleton";
import MovieHover from "./MainPage/CardHover";
import AllInfo from "./MainPage/ContextApi";
import { ScreenWidth, Scroll } from "../App";
import { baseUrl, OriginalimgPATH } from "../url";
import Categories from "./MainPage/Sections";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

function MainPage() {
  const display = sessionStorage.getItem("displayContents");
  const currPath = useLocation().pathname;
  const navigate = useNavigate();
  const screen = useContext(ScreenWidth);
  const [, setScroll] = useContext(Scroll);
  const [shows, setShows] = useState();
  const [showId, setShowId] = useState();
  const [showDeets, setShowDeets] = useState();
  const [hoverCard, setHoverCard] = useState(0);
  const [forDisplayContents, setDisplayContents] = useState(
    display && JSON.parse(display)
  );
  const [genres, setGenres] = useState();

  const fetchMovies = () => {
    axios.post(`/api/movies/get-shows`).then((res) => {
      setShows(res.data);
    });

    axios.post(`/api/movies/get-showByGenre`).then((res) => {
      setGenres(res.data);
    });
  };


  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="page--wrapper p-10">
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
        <main className="moviesCategories">
          {screen > 1100 && (
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
                          onClick={() => {
                            setScroll(true);
                            setDisplayContents(m);
                            sessionStorage.setItem(
                              "displayContents",
                              JSON.stringify(m)
                            );
                            navigate(`${currPath}/content=${m.id}`);
                          }}
                          onMouseLeave={() => {
                            clearTimeout(hoverCard);
                            setShowId();
                            setShowDeets();
                          }}
                          onMouseEnter={(e) => {
                            if (hoverCard) clearTimeout(hoverCard);
                            setHoverCard(
                              setTimeout(() => {
                                setShowId(`header-${m.id}`);
                                setShowDeets(m);
                              }, 1000)
                            );
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${OriginalimgPATH}${m.backdrop_path}`}
                          ></img>
                          {showId === `header-${m.id}` && <MovieHover />}
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
                          onClick={() => {
                            setScroll(true);
                            setDisplayContents(m);
                            sessionStorage.setItem(
                              "displayContents",
                              JSON.stringify(m)
                            );
                            navigate(`${currPath}/content=${m.id}`);
                          }}
                          onMouseLeave={() => {
                            clearTimeout(hoverCard);
                            setShowId();
                            setShowDeets();
                          }}
                          onMouseEnter={() => {
                            if (hoverCard) clearTimeout(hoverCard);
                            setHoverCard(
                              setTimeout(() => {
                                setShowId(`header-${m.id}`);
                                setShowDeets(m);
                              }, 1000)
                            );
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${OriginalimgPATH}${m.backdrop_path}`}
                          ></img>
                          {showId === `header-${m.id}` && <MovieHover />}
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
            Object.keys(genres.data).map((g) => {
              return (
                <Categories
                  data={[...genres.data[g]]}
                  name={g}
                  genres={genres.genres}
                />
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
        </main>
        <Routes>
          <Route path={`/content=:id`} element={<DisplayContents />}></Route>
        </Routes>
      </AllInfo.Provider>
    </div>
  );
}
export default MainPage;
