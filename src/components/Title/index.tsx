import React from "react";
import styled from "styled-components";

interface TitleProps {
  name: string;
}

function Title({ name }: TitleProps) {
  return (
    <TitleStyled>
      <p>{name}</p>
    </TitleStyled>
  );
}

const TitleStyled = styled.div`
  padding: 0 20px;
  border-bottom: 1px solid #e6ecf3;
  max-height: 91px;
  min-height: 91px;
  line-height: 91px;
  
  p {
    font-size: 24px;
    margin: 0;
  }
`;

export default Title;
