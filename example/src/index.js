import React, { Component } from "react";
import { render } from "react-dom";
import { ChromePicker } from "react-color";

import Chart from "../../src";
import data from "./data";
import { defaultTheme } from "../../src/constants";
import "./index.css";

const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const margins = {
  top: 50,
  left: 50,
  bottom: 50,
  right: 50
};

class App extends Component {
  state = {
    priceData: [],
    zoomFactor: 1,
    theme: defaultTheme,
    colorPicker: {
      type: "",
      position: null
    }
  };
  width = 1000;
  height = 500;

  componentDidMount() {
    const priceData = Object.entries(data["Time Series (Daily)"]).map(
      priceData => {
        return [priceData[0], ...Object.values(priceData[1])];
      }
    );
    this.setState({ priceData });
  }

  onZoomIn = () => {
    const { priceData, zoomFactor } = this.state;
    const onePlusZoomFactor = zoomFactor + 1;

    if (zoomFactor * 50 < priceData.length) {
      this.setState({ zoomFactor: onePlusZoomFactor });
    }
  };

  onZoomOut = () => {
    this.setState({ zoomFactor: this.state.zoomFactor - 1 || 1 });
  };

  onChangeColor = color => {
    this.setState({
      theme: {
        ...this.state.theme,
        [this.state.colorPicker.type]: color.hex
      }
    });
  };

  onClickColorSelector = (type, event) => {
    this.setState({
      colorPicker: {
        position: {
          x: event.pageX,
          y: event.pageY
        },
        type
      }
    });
  };

  onClickColorPickerOverlay = () => {
    this.setState({
      colorPicker: {
        type: "",
        position: null
      }
    });
  };

  renderPicker = () => {
    const { colorPicker, theme } = this.state;

    if (colorPicker.position) {
      const { x, y } = colorPicker.position;
      return (
        <div className="color-picker" style={{ top: y + 10, left: x - 100 }}>
          <div
            className="color-picker__overlay"
            onClick={this.onClickColorPickerOverlay}
          />
          <ChromePicker
            color={theme[colorPicker.type]}
            onChange={this.onChangeColor}
          />
        </div>
      );
    }
  };

  renderThemeSelector = () => {
    const { theme } = this.state;
    const themeParts = [
      "background",
      "profit",
      "loss",
      "stick",
      "gridLines",
      "domain"
    ];

    return (
      <div className="theme">
        {themeParts.map(part => (
          <div key={part} className="theme__selector">
            <p>{capitalize(part)}</p>
            <button
              className="theme__color-selector"
              style={{ backgroundColor: theme[part] }}
              onClick={event => this.onClickColorSelector(part, event)}
            />
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { zoomFactor, priceData, theme } = this.state;
    const priceDataSubset = priceData.slice(0, 50 * zoomFactor);

    return (
      <div className="container">
        <div className="zoom">
          <button onClick={this.onZoomIn}>-</button>
          <button onClick={this.onZoomOut}>+</button>
        </div>
        {this.renderThemeSelector()}
        {this.renderPicker()}
        <div className="chart">
          <Chart
            width={this.width}
            height={this.height}
            pricesData={priceDataSubset}
            margins={margins}
            theme={theme}
          />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
