import React, { Component } from "react";
import { render } from "react-dom";

import Chart from "../../src";
import data from "./data";
import "./index.css";

const margins = {
  top: 50,
  left: 50,
  bottom: 100,
  right: 50
};

class App extends Component {
  state = { priceData: [], zoomFactor: 1 };
  width = document.documentElement.clientWidth - margins.left - margins.right;
  height = document.documentElement.clientHeight - margins.top - margins.bottom;

  componentDidMount() {
    const priceData = Object.entries(data["Time Series (Daily)"]).map(
      priceData => {
        return [priceData[0], ...Object.values(priceData[1])];
      }
    );
    this.setState({ priceData });
  }

  onZoomIn = () => {
    this.setState({ zoomFactor: this.state.zoomFactor + 1 });
  };

  onZoomOut = () => {
    this.setState({ zoomFactor: this.state.zoomFactor - 1 || 1 });
  };

  render() {
    const { zoomFactor, priceData } = this.state;
    const priceDataSubset = priceData.slice(0, 50 * zoomFactor);

    return (
      <div>
        <div className="zoom">
          <button onClick={this.onZoomIn}>-</button>
          <button onClick={this.onZoomOut}>+</button>
        </div>
        <Chart
          width={this.width}
          height={this.height}
          pricesData={priceDataSubset}
          margins={margins}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
