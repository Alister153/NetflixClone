import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { baseUrl } from "../../url";
import LoadingSkeleton from "../LoadingSkeleton";
import AllInfo from "../MainPage/ContextApi";
import DisplayContents from "../MainPage/DisplayContent";
import SliderItem from "../MainPage/SliderItem";

const Search = () => {
  const display = sessionStorage.getItem("displayContents");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchC = searchParams.get("s");
  const [data, setData] = useState();
  const [actors, setActors] = useState([]);
  const [showDeets, setShowDeets] = useState();
  const [showId, setShowId] = useState();
  const [hoverCard, setHoverCard] = useState(0);
  const [forDisplayContents, setDisplayContents] = useState(
    display && JSON.parse(display)
  );
  const fetchsearch = async () => {
    await axios
      .post(`/api/movies/search`, null, {
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
        <h1>Results for {searchC} and more</h1>
        {data ? (
          <div>
            <div
              style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
            >
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
            <div className="shows-list movies">
              {data.map((d, index) => {
                return (
                  <SliderItem
                    {...d}
                    index={index}
                    category="search"
                  ></SliderItem>
                );
              })}
            </div>
          </div>
        ) : (
          <LoadingSkeleton number={5} width={200} height={350} />
        )}
        <Routes>
          <Route path={`/content=:id`} element={<DisplayContents />}></Route>
        </Routes>
      </AllInfo.Provider>
    </div>
  );
};

export default Search;
