import React from "react";
import { useSelector } from "react-redux";

function Test() {
  const user = useSelector(({ auth }) => auth.user);
  return <h1 style={{paddingTop: 80}}>Test Component ne</h1>;
}

Test.propTypes = {};

export default Test;
