import { useEffect, useRef, useState, useContext } from "react";
import { ScreenWidth } from "../../App";
import MovieHover from "./CardHover";
import AllInfo from "./ContextApi";

const SliderItem = (s) => {
  const screen = useContext(ScreenWidth)
  const CurrCard = useRef();
  const [
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
  ] = useContext(AllInfo);

  return (
    <div
      className="card"
      id={s.title || s.name}
      ref={CurrCard}
      data-id={`${s.category}-${s.id}`}
      onMouseLeave={(e) => {
        setShowId();
        setShowDeets();
        setHoveredCardType("");
      }}
      onMouseOver={() => {
        if (hoverCard) clearTimeout(hoverCard);
        setHoverCard(
          setTimeout(() => {
            setShowId(`${s.category}-${s.id}`);
            setShowDeets(s);
            setHoveredCardType("small");
          }, 300)
        );
      }}
    >
      <img src={`${process.env.REACT_APP_w500imgPATH}${s.poster_path}`}></img>
      {screen > 900 && showId === `${s.category}-${s.id}` && (
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

export default SliderItem;
