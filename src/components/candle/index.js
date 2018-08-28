import React, { Fragment } from "react";
import { candleDimensions } from "../../constants";

const Candle = ({ height, width, highHeight, lowHeight, color }) => {
  return (
    <Fragment>
      <rect
        x={width / 2}
        width={candleDimensions.highWidth}
        height={highHeight}
      />
      <rect
        y={highHeight}
        height={height}
        width={width}
        style={{ fill: color }}
      />
      <rect
        x={width / 2}
        y={parseInt(height) + parseInt(highHeight)}
        width={candleDimensions.highWidth}
        height={lowHeight}
      />
    </Fragment>
  );
};

export default Candle;
