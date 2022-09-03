import axios from "axios";
import { AiFillPlayCircle } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BsFillHandThumbsUpFill, BsHandThumbsDownFill } from "react-icons/bs";
import { FaAngleUp } from "react-icons/fa";
import { useContext, useRef } from "react";
import { AllShowInfo } from "../MainPage";
import { Profile, Scroll } from "../../App";
import { auth } from "../../firebase";
import { NotificationManager } from "react-notifications";

var trailerTimeout = 0;
var hoverTimeout = 0;
function MovieHover(props) {
  const [scroll, setScroll] = useContext(Scroll);
  const [profile] = useContext(Profile);
  const placement = document.querySelector(`[data-id="${props.showId[0]}"]`);
  const location = placement.getBoundingClientRect();
  const left = location.left;

  var name;
  name =
    left < 50
      ? "from--left"
      : left > 1000 && "from--right";
      
  const addToList = () => {
    const data = {
      userId: auth.currentUser.uid,
      name: profile,
      showId: props.showDeets.id,
      type: props.showDeets.media_type,
    };

    axios
      .post(`${process.env.REACT_APP_baseServerurl}/profile/add-item`, data)
      .then((res) => {
        NotificationManager.success(res.data);
      });
  };

  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
  }
  if (trailerTimeout) {
    clearTimeout(trailerTimeout);
  }
  // trailerTimeout = setTimeout(() => {
  //   fetchTrailer(props.showDeets);
  // }, 1000);

  return (
    <div
      className={`movieHover ${props.cardType[0]} ${name}`}
    >
      <figure className="show-trailer">
        <img
          src={`${process.env.REACT_APP_OriginalimgPATH}${
            props.cardType[0] === "small"
              ? props.showDeets.poster_path
              : props.showDeets.backdrop_path
          }`}
        ></img>
      </figure>
      <div className="btns">
        <div>
          <AiFillPlayCircle size="30px"></AiFillPlayCircle>
          <IoIosCheckmarkCircleOutline
            size="30px"
            onClick={addToList}
          ></IoIosCheckmarkCircleOutline>
          <span className="like-dislike">
            <BsFillHandThumbsUpFill size="20px"></BsFillHandThumbsUpFill>
            <BsHandThumbsDownFill size="20px"></BsHandThumbsDownFill>
          </span>
        </div>
        <div className="more-info">
          <FaAngleUp
            size="30px"
            onClick={() => {
              props.showInfo(props.showDeets);
              props.showId[1]();
              setScroll(true);
            }}
          ></FaAngleUp>
        </div>
      </div>
    </div>
  );
}

export const fetchTrailer = async (show) => {
  const trailer = await axios.post(
    `${process.env.REACT_APP_baseServerurl}/movies/get-trailer`,
    {
      id: show.id,
      type: show.media_type,
    }
  );
  const data = await trailer.data[0];
  document.querySelector(".show-trailer").innerHTML = `<iframe
    className="trailer"
    width="100%"
    height="100%"
    title="Youtube"
    frameborder="0"
    allow="autoplay"
    allowfullscreen
    src=${process.env.REACT_APP_YOUTUBE}${data.key}?autoplay=1
  ></iframe>`;
};
export default MovieHover;
