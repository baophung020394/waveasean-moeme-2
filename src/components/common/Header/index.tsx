import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import LogoTop from "assets/images/logo/logo2.png";

interface HeaderProps {}

function Header({}: HeaderProps) {
  return (
    <HeaderStyled className="header--top">
      <Link to="/home">
        <img src={LogoTop} alt="" />
        <span>MoeME</span>
      </Link>
    </HeaderStyled>
  );
}

const HeaderStyled = styled.div`
  min-height: 56px;
  max-height: 56px;
  width: 100%;
  background-color: #fbf7f7;
  display: flex;
  align-items: center;
  padding: 5px 20px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  a {
    height: 100%;
    display: flex;
    align-items: center;
    color: #000;
    text-decoration: none;
    font-size: 24px;
    font-weight: 400;

    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      margin-right: 6px;
    }
  }
`;
export default Header;
