import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.tsx';

try {
  console.log("Rendering App...");
  renderToString(React.createElement(App));
  console.log("Success");
} catch (e) {
  console.error("Render failed:");
  console.error(e);
}
