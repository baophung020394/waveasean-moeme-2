// src/Index.tsx

import App from "./App";
import React from "react";
import { createRoot } from "react-dom/client";
import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';
import './index.scss';

const rootNode = document.getElementById("app");
if (rootNode) {
  createRoot(rootNode).render(<App />);
}
