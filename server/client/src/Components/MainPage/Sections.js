import { useState, useContext, useRef, useEffect } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import { FaAngleRight } from "react-icons/fa";
import SliderItem from "./SliderItem";
import AllInfo from "./ContextApi";
import MovieHover from "./CardHover";
import { ScreenWidth } from "../../App";

function Categories(props) {
  const [slider, setSlider] = useState();
  const scroll = useContext(ScreenWidth)
  const [showId] = useContext(AllInfo);
  var x = 90;

  const handleScroll = (e) => {
    const amt = scroll > 900 ? 6 : 3
    const parent = e.currentTarget.previousSibling;
    const curr = slider.slice(3);

    var nArr = [];
    for (let y = props.data.indexOf(slider[11]) + 1; nArr.length < amt; y++) {
      if (y > props.data.length - 1) y = 0;
      nArr.push(props.data[y]);
    }
    setSlider((prevArry) => prevArry.concat([...nArr]));

    parent.classList.add("animate");
    parent.style.transform = `translateX(-${x}%)`;
    setTimeout(() => {
      parent.classList.remove("animate");
      setSlider(curr.concat([...nArr]));
      parent.style.transform = "translateX(0%)";
    }, 450);
  };

  useEffect(() => {
    setSlider(props.data.slice(0, 12));
  }, [props.data]);

  return (
    <section id={props.name} className="categories">
      {slider && (
        <>
          <div className="title px-2 lg:px-10">
            <h1 className="lg:text-3xl md:text-lg mb-1">{props.name}</h1>
          </div>
          <div className="movies section2">
            <div className="row3" id={`slider-${props.name}`} data-row>
              {slider.map((s, index) => {
                return (
                  <SliderItem {...s} index={index} category={props.name}>
                  </SliderItem>
                );
              })}
            </div>
            <div className="nxt-btn" onClick={handleScroll}>
              <FaAngleRight size="40px"></FaAngleRight>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Categories;
