// src/Index.tsx

import App from "./App";
import React from "react";
import { createRoot } from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.scss";

const rootNode = document.getElementById("app");
if (rootNode) {
  createRoot(rootNode).render(<App />);
}
