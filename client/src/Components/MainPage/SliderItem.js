import { useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Scroll } from "../../App";
import { w500imgPATH } from "../../url";
import MovieHover from "./CardHover";
import AllInfo from "./ContextApi";
import { useScreenWidth } from "../../Hooks.";

const SliderItem = (s) => {
  const location = useLocation();
  const currPath = location.pathname;
  const searchVal = location.search;
  const navigate = useNavigate();
  const screen = useScreenWidth()
  const CurrCard = useRef();
  const {setScroll} = useContext(Scroll);
  const {
    showId,
    setShowId,
    setShowDeets,
    setDisplayContents,
    hoverCard,
    setHoverCard,
  } = useContext(AllInfo);

  return (
    <div
      className="card"
      id={s.title || s.name}
      ref={CurrCard}
      data-id={`${s.category}-${s.id}`}
      onClick={() => {
        setDisplayContents(s);
        sessionStorage.setItem("displayContents", JSON.stringify(s));
        setScroll(true);
        navigate(`${currPath}/content=${s.id}${searchVal && `/${searchVal}`}`);
      }}
      onMouseLeave={(e) => {
        clearTimeout(hoverCard);
        setShowId();
        setShowDeets();
      }}
      onMouseEnter={() => {
        if (hoverCard) clearTimeout(hoverCard);
        setHoverCard(
          setTimeout(() => {
            setShowId(`${s.category}-${s.id}`);
            setShowDeets(s);
          }, 1000)
        );
      }}
    >
      <img loading="lazy" src={`${w500imgPATH}${s.poster_path}`}></img>
      {screen > 900 && showId === `${s.category}-${s.id}` && (
        <MovieHover cardType="small" />
      )}
    </div>
  );
};

export default SliderItem;
