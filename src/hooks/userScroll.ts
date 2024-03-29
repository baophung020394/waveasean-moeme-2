import { useState, useEffect } from "react";

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    console.log('scrollDirection', lastScrollY)
    // function to run on scroll
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection); // clean up
    };
  }, [scrollDirection]); // run when scroll direction changes

  return scrollDirection;
}

export { useScrollDirection };
