"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _constants = require("../../constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Candle = function Candle(_ref) {
  var height = _ref.height,
    width = _ref.width,
    highHeight = _ref.highHeight,
    lowHeight = _ref.lowHeight,
    color = _ref.color,
    stickColor = _ref.stickColor;

  return _react2.default.createElement(
    _react.Fragment,
    null,
    _react2.default.createElement("rect", {
      x: width / 2,
      width: _constants.candleDimensions.stickWidth,
      height: highHeight,
      style: { fill: stickColor }
    }),
    _react2.default.createElement("rect", {
      y: highHeight,
      height: height,
      width: width,
      style: { fill: color }
    }),
    _react2.default.createElement("rect", {
      x: width / 2,
      y: parseInt(height) + parseInt(highHeight),
      width: _constants.candleDimensions.stickWidth,
      height: lowHeight,
      style: { fill: stickColor }
    })
  );
};

exports.default = Candle;
