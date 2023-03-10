import React from "react";
import { styled } from "utils/styled-component";

interface Page404Props {
  content: string;
}
function Page404({ content }: Page404Props) {
  return (
    <Page404Styled>
      <div className="page404">
        <h1>{content}</h1>
      </div>
    </Page404Styled>
  );
}

const Page404Styled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .page404 {
  }
`;

export default Page404;
