import axios from "axios";
import { useEffect, useState } from "react";
import AllInfo from "./ContextApi";
import Categories from "./Sections";
import DisplayContents from "../MainPage/DisplayContent";
import LoadingSkeleton from "../LoadingSkeleton";
import { Route, Routes } from "react-router-dom";
import { baseUrl } from "../../url";

const Latest = () => {
  const display = sessionStorage.getItem("displayContents");
  const [showDeets, setShowDeets] = useState();
  const [showId, setShowId] = useState();
  const [hoverCard, setHoverCard] = useState(0);
  const [Movies, setMovies] = useState();
  const [Tv, setTv] = useState();
  const [forDisplayContents, setDisplayContents] = useState(
    display && JSON.parse(display)
  );

  const get_data = () => {
    axios.post(`${baseUrl}/api/movies/latest`).then((res) => {
      setMovies(res.data.movie);
      setTv(res.data.tv);
    });
  };

  useEffect(() => {
    get_data();
  }, []);
  return (
    <div className="page--wrapper p-10">
      <AllInfo.Provider
        value={{
          showId,
          setShowId,
          showDeets,
          setShowDeets,
          forDisplayContents,
          setDisplayContents,
          hoverCard,
          setHoverCard,
        }}
      >
        <div className="moviesCategories">
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
              width={200}
              height={350}
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
                width={200}
                height={350}
              ></LoadingSkeleton>
            </div>
          )}
        </div>
        <Routes>
          <Route path={`/content=:id`} element={<DisplayContents />}></Route>
        </Routes>
      </AllInfo.Provider>
    </div>
  );
};

export default Latest;
