import { useState, useContext, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import SliderItem from "./SliderItem";
import { ScreenWidth } from "../../App";
import { useNavigate } from "react-router-dom";
import { useScreenWidth } from "../../Hooks.";

function Categories(props) {
  const navigate = useNavigate();
  const [slider, setSlider] = useState();
  const scroll = useScreenWidth()
  var x = scroll < 500 || scroll > 900 ? 90 : 100;

  const handleScroll = (e) => {
    const amt = scroll < 500 ? 2 : scroll < 900 ? 5 : 6;
    const parent = e.currentTarget.previousSibling;
    const curr = slider.slice(amt);

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
          <div
            className="title cursor-pointer"
            onClick={() => {
              const { id } = props.genres.find((g) => g.name === props.name);
              navigate(`/genre/${id}`);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector(".explore").classList.add("active");
            }}
            onMouseLeave={(e) => {
              e.currentTarget
                .querySelector(".explore")
                .classList.remove("active");
            }}
          >
            <h1 className="lg:text-3xl md:text-lg mb-1">{props.name}</h1>
            <p className="explore">Explore All</p>
            <span>&gt;</span>
          </div>
          <div className="movies section2">
            <div className="row3" id={`slider-${props.name}`} data-row>
              {slider.map((s, index) => {
                return (
                  <SliderItem
                    {...s}
                    index={index}
                    category={props.name}
                  ></SliderItem>
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
