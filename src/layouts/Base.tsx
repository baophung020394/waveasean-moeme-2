import Navbar from "components/Navbar";
import React from "react";
import { styled } from "utils/styled-component";

export const withBaseLayout = (Component: any) => (props: any) => {
  return (
    <BaseLayoutStyled>
      <Navbar />
      <Component {...props} />
    </BaseLayoutStyled>
  );
};

const BaseLayoutStyled = styled.div`
  display: flex;
  height: 100%;
`;
