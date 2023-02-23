import React from "react";
import { styled } from "utils/styled-component";

interface ProgressBarProps {
  progressBar: any;
}

function ProgressBars({ progressBar }: ProgressBarProps) {
  return (
    <ProgressBarStyled>
      <div className="container-progress">
        <div className="progress">
          <span
            className="title timer"
            data-from="0"
            // data-to={`100`}
            data-to={`${progressBar?.percent}`}
            data-speed="1800"
          >
            {/* {progressBar?.percent} */}
            {/* 100 */}
          </span>
          <div className="overlay"></div>
          <div className="left"></div>
          <div className="right"></div>
        </div>
      </div>
    </ProgressBarStyled>
  );
}

const ProgressBarStyled = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .container-progress {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    background-color: #111116;
    height: 100vh;
    align-items: center;
  }

  .container-progress {
    width: 60px;
    height: 60px;
    font-size: 30px;
    color: #fff;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background: transparent;
    text-align: center;
    line-height: 60px;
    margin: 0;
  }

  .progress::after {
    content: "";
  }

  .progress .title {
    position: relative;
    z-index: 100;
  }

  .progress .overlay {
    width: 0%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: #07070c;
  }

  .progress .left,
  .progress .right {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border: 3px solid #fff;
    border-radius: 100px 0px 0px 100px;
    border-right: 0;
    transform-origin: right;
  }

  .progress .left {
    animation: load1 1s linear forwards;
  }

  .progress:nth-of-type(2) .right,
  .progress:nth-of-type(3) .right {
    animation: load2 0.5s linear forwards 1s;
  }

  .progress:last-of-type .right,
  .progress:first-of-type .right {
    animation: load3 0.8s linear forwards 1s;
  }

  @keyframes load1 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes load2 {
    0% {
      z-index: 100;
      transform: rotate(180deg);
    }

    100% {
      z-index: 100;
      transform: rotate(270deg);
    }
  }

  @keyframes load3 {
    0% {
      z-index: 100;
      transform: rotate(180deg);
    }

    100% {
      z-index: 100;
      transform: rotate(360deg);
    }
  }
`;

export default ProgressBars;
