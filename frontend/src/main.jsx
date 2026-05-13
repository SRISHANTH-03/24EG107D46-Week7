// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from "react";
import ReactDOM from "react-dom/client";

try {
  function Test() {
    return (
      <div style={{ padding: "40px", fontSize: "30px" }}>
        APP IS WORKING
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Test />
    </React.StrictMode>
  );
} catch (err) {
  console.error("FULL ERROR:", err);

  document.body.innerHTML = `
    <div style="padding:40px;color:red;font-size:20px">
      <h1>ERROR OCCURRED</h1>
      <pre>${err}</pre>
    </div>
  `;
}