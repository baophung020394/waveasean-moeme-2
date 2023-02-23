import { withBaseLayout } from "layouts/Base";
import React from "react";
import { styled } from "utils/styled-component";

function Profile() {
  return (
    <ProfileStyled className="profile-container">
      <h1>Profile page</h1>
      <h4>Comming soon</h4>
    </ProfileStyled>
  );
}
const ProfileStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
`;

export default withBaseLayout(Profile);
