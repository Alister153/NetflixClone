import axios from "axios";
import { AiFillPlayCircle } from "react-icons/ai";
import {
  IoIosCheckmarkCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { BsFillHandThumbsUpFill, BsHandThumbsDownFill } from "react-icons/bs";
import { FaAngleUp } from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import { List, Profile } from "../../App";
import { auth } from "../../firebase";
import { NotificationManager } from "react-notifications";
import { baseUrl, OriginalimgPATH, YOUTUBE } from "../../url";
import AllInfo from "./ContextApi";

var trailerTimeout = 0;

function MovieHover(props) {
  const [activeProfile] = useContext(Profile);
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
  const list = useContext(List);

  const placement = document.querySelector(`[data-id="${showId}"]`);
  const location = placement.getBoundingClientRect();
  const left = location.left;
  const isMounted = useRef(false);

  var name;
  name = left < 50 ? "from--left" : left > 1000 && "from--right";

  const addToList = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: activeProfile,
      showId: showDeets.id,
      type: showDeets.media_type,
    };

    axios.post(`/api/profile/add-item`, data).then((res) => {
      NotificationManager.success(res.data);
    });
  };

  const removeFromList = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: activeProfile,
      showId: showDeets.id,
      type: showDeets.media_type,
    };

    axios.post(`/api/profile/remove-item`, data).then((res) => {
      NotificationManager.success(res.data);
    });
  };

  const checkList = () => {
    return list.some(
      (d) => d.showId === showDeets.id && d.type === showDeets.media_type
    );
  };

  if (props.cardType !== "small") {
    if (trailerTimeout) {
      clearTimeout(trailerTimeout);
    }

    if (!isMounted.current) {
      trailerTimeout = setTimeout(() => {
        fetchTrailer(showDeets);
      }, 1000);
      isMounted.current = true;
    }
  }
  return (
    <div className={`movieHover ${props.cardType} ${name}`} onClick={() => {
      clearTimeout(trailerTimeout)
    }}>
      <figure className="show-trailer">
        <img
          loading="lazy"
          src={`${OriginalimgPATH}${
            props.cardType === "small"
              ? showDeets.poster_path
              : showDeets.backdrop_path
          }`}
        ></img>
      </figure>
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
        <div className="more-info">
          <FaAngleUp size="30px"></FaAngleUp>
        </div>
      </div>
    </div>
  );
}

export const fetchTrailer = async (show) => {
  const trailer = await axios.post(`/api/movies/get-trailer`, {
    id: show.id,
    type: show.media_type,
  });
  const data = await trailer.data[0];
  document.querySelector(".show-trailer").innerHTML = `<iframe
    class="trailer"
    title="Youtube"
    frameborder="0"
    allow="autoplay"
    allowfullscreen
    src=${YOUTUBE}${data.key}?autoplay=1
  ></iframe>`;
};
export default MovieHover;
