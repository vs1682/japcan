import React from "react";
import { render } from "react-dom";

import Candle from "../../src";

const App = () => (
  <svg width="100" height="500">
    <Candle
      height="100"
      width="10"
      highHeight="50"
      lowHeight="100"
      color="green"
    />
  </svg>
);

render(<App />, document.getElementById("root"));
