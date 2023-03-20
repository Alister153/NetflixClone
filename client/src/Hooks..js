import { useEffect, useState } from "react";

export const useScreenWidth = () => {
  const [state, setState] = useState();

  const Resize = () => {
    setState(window.innerWidth);
  };
  useEffect(() => {
    document.addEventListener("resize", Resize);
    Resize();
    return () => {
      document.removeEventListener("resize", Resize);
    };
  });

  return state;
};
