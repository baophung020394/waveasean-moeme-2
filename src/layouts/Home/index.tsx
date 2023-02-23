import Navbar from "components/Navbar";
import React from "react";
import { styled } from "utils/styled-component";
import { withBaseLayout } from "layouts/Base";

interface HomeProps {}

function Home() {
  return (
    <HomeStyled className="home-container">
      <h1>Home page</h1>
      <h4>Comming soon</h4>
    </HomeStyled>
  );
}

const HomeStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
`;

export default withBaseLayout(Home);
