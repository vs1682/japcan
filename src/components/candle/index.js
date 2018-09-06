import React, { Fragment } from "react";
import { candleDimensions } from "../../constants";

const Candle = ({
  height,
  width,
  highHeight,
  lowHeight,
  color,
  stickColor
}) => {
  return (
    <Fragment>
      <rect
        x={width / 2}
        width={candleDimensions.stickWidth}
        height={highHeight}
        style={{ fill: stickColor }}
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
        width={candleDimensions.stickWidth}
        height={lowHeight}
        style={{ fill: stickColor }}
      />
    </Fragment>
  );
};

export default Candle;
