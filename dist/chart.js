"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Selection = require("d3-selection");

var _d3Scale = require("d3-scale");

var _d3Axis = require("d3-axis");

var _propTypes = require("prop-types");

var _candle = require("./components/candle");

var _candle2 = _interopRequireDefault(_candle);

var _constants = require("./constants");

require("./chart.css");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var minAndMaxPrices = function minAndMaxPrices(pricesData) {
  return pricesData.reduce(
    function(minAndMax, price) {
      var high = parseFloat(price[2]);
      var low = parseFloat(price[3]);
      var min = minAndMax.min,
        max = minAndMax.max;

      if (high > max) {
        return _extends({}, minAndMax, {
          max: high
        });
      }

      if (low < min) {
        return _extends({}, minAndMax, {
          min: low
        });
      }

      return minAndMax;
    },
    { min: Infinity, max: -Infinity }
  );
};

var getDatesInAscendingOrder = function getDatesInAscendingOrder(pricesData) {
  var dataLen = pricesData.length;
  var dates = [];

  if (dataLen) {
    var date1 = new Date(pricesData[0][0]);
    var dateN = new Date(pricesData[dataLen - 1][0]);
    dates = pricesData.map(function(data) {
      return new Date(data[0]);
    });
    date1 > dateN && dates.reverse();
  }

  return dates;
};

// TODO: formatDate and tickValues have similar code structure,
// try to combine them and remove the redundancy
var formatDate = function formatDate(date, totalDuration) {
  // On an average there are 20 trading days per month
  // thus we consider 120 dates equal to 6 months
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  if (totalDuration > 240) {
    return months[date.getMonth()] + "-" + date.getFullYear();
  }

  if (totalDuration > 120) {
    return months[date.getMonth()];
  }

  if (totalDuration < 120) {
    return date.getMonth() + 1 + "/" + date.getDate();
  }
};

var tickValues = function tickValues(dates) {
  var totalDuration = dates.length;

  if (totalDuration > 480) {
    return dates.reduce(function(filteredDates, date) {
      var filteredDatesLength = filteredDates.length;
      if (!filteredDatesLength) {
        filteredDates.push(date);
      } else {
        var lastMonth = filteredDates[filteredDatesLength - 1].getMonth();
        var next2NextMonth = lastMonth > 7 ? lastMonth - 8 : lastMonth + 4;
        if (next2NextMonth === date.getMonth()) {
          filteredDates.push(date);
        }
      }

      return filteredDates;
    }, []);
  }

  if (totalDuration > 240) {
    return dates.reduce(function(filteredDates, date) {
      var filteredDatesLength = filteredDates.length;
      if (!filteredDatesLength) {
        filteredDates.push(date);
      } else {
        var lastMonth = filteredDates[filteredDatesLength - 1].getMonth();
        var next2NextMonth = lastMonth > 9 ? lastMonth - 10 : lastMonth + 2;
        if (next2NextMonth === date.getMonth()) {
          filteredDates.push(date);
        }
      }

      return filteredDates;
    }, []);
  }

  if (totalDuration > 120) {
    return dates.reduce(function(filteredDates, date) {
      var filteredDatesLength = filteredDates.length;
      if (!filteredDatesLength) {
        filteredDates.push(date);
      } else {
        var lastDate = filteredDates[filteredDatesLength - 1];
        if (lastDate.getMonth() !== date.getMonth()) {
          filteredDates.push(date);
        }
      }

      return filteredDates;
    }, []);
  }

  if (totalDuration < 120) {
    return dates.filter(function(d, i) {
      return i % 4 === 0;
    });
  }
};

var getColor = function getColor(openCloseDifference) {
  if (openCloseDifference < 0) {
    return "red";
  }

  if (openCloseDifference > 0) {
    return "green";
  }

  return "black";
};

var Chart = (function(_Component) {
  _inherits(Chart, _Component);

  function Chart() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Chart);

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return (
      (_ret = ((_temp = ((_this = _possibleConstructorReturn(
        this,
        (_ref = Chart.__proto__ || Object.getPrototypeOf(Chart)).call.apply(
          _ref,
          [this].concat(args)
        )
      )),
      _this)),
      (_this.xAxisRef = (0, _react.createRef)()),
      (_this.xGridLinesRef = (0, _react.createRef)()),
      (_this.yAxisRef = (0, _react.createRef)()),
      (_this.yGridLinesRef = (0, _react.createRef)()),
      (_this.xScale = (0, _d3Scale.scaleBand)().range([0, _this.props.width])),
      (_this.yScale = (0, _d3Scale.scaleLinear)().range([
        _this.props.height,
        0
      ])),
      (_this.setDomainForAxes = function() {
        var dates = getDatesInAscendingOrder(_this.props.pricesData);
        var pricesRange = minAndMaxPrices(_this.props.pricesData);
        _this.xScale.domain(dates);
        _this.yScale.domain([pricesRange.min, pricesRange.max]);
      }),
      (_this.renderXAxis = function() {
        var _this$props = _this.props,
          height = _this$props.height,
          pricesData = _this$props.pricesData;

        var dates = getDatesInAscendingOrder(pricesData);

        _this.xAxis = (0, _d3Axis.axisBottom)()
          .scale(_this.xScale)
          .tickValues(tickValues(dates))
          .tickFormat(function(date) {
            return formatDate(date, dates.length);
          });
        (0, _d3Selection.select)(_this.xAxisRef.current).call(_this.xAxis);

        _this.xAxis.tickSize(-height).tickFormat("");

        (0, _d3Selection.select)(_this.xGridLinesRef.current).call(_this.xAxis);
      }),
      (_this.renderYAxis = function() {
        var width = _this.props.width;

        _this.yAxis = (0, _d3Axis.axisLeft)().scale(_this.yScale);
        (0, _d3Selection.select)(_this.yAxisRef.current).call(_this.yAxis);

        _this.yAxis.tickSize(-width).tickFormat("");

        (0, _d3Selection.select)(_this.yGridLinesRef.current).call(_this.yAxis);
      }),
      (_this.renderAxes = function() {
        _this.renderXAxis();
        _this.renderYAxis();
      }),
      (_this.renderCandles = function() {
        var _this$props2 = _this.props,
          pricesData = _this$props2.pricesData,
          width = _this$props2.width;

        var candleBandWidth = width / pricesData.length;
        var candleMargin =
          _constants.candleMarginMax /
          parseInt(pricesData.length / _constants.candleMarginFactor);
        var candleWidth = candleBandWidth - candleMargin;

        return pricesData.map(function(data) {
          var open = parseFloat(data[1]);
          var high = parseFloat(data[2]);
          var low = parseFloat(data[3]);
          var close = parseFloat(data[4]);
          var x = _this.xScale(new Date(data[0]));
          var y = _this.yScale(high);
          var yOpen = _this.yScale(open);
          var yClose = _this.yScale(close);
          var yLow = _this.yScale(low);

          // TODO: work on the part where open and close are equal
          var candleHeight = yOpen - yClose || 1;
          var candleHigh = (candleHeight > 0 ? yClose : yOpen) - y;
          var candleLow = yLow - (candleHeight > 0 ? yOpen : yClose);
          return _react2.default.createElement(
            "g",
            {
              className: "candle",
              key: data[0],
              transform: "translate(" + (x + candleMargin / 2) + ", " + y + ")"
            },
            _react2.default.createElement(_candle2.default, {
              height: Math.abs(candleHeight),
              width: candleWidth,
              highHeight: candleHigh,
              lowHeight: candleLow,
              color: getColor(candleHeight)
            })
          );
        });
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }

  _createClass(Chart, [
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        // Calling renderAxes in CDM as these methods
        // use d3-axis which manipulates dom and thus we
        // pass a reference of the dom element to d3
        this.props.pricesData && this.renderAxes();
      }
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this.props.pricesData && this.renderAxes();
      }
    },
    {
      key: "render",
      value: function render() {
        var _props = this.props,
          margins = _props.margins,
          width = _props.width,
          height = _props.height,
          pricesData = _props.pricesData;
        var top = margins.top,
          left = margins.left,
          right = margins.right,
          bottom = margins.bottom;

        if (pricesData.length) {
          // We need to change the domain when the pricesData changes
          this.setDomainForAxes();
          return _react2.default.createElement(
            "svg",
            {
              width: width + left + right || 0,
              height: height + top + bottom || 0
            },
            _react2.default.createElement(
              "g",
              { transform: "translate(" + left + ", " + top + ")" },
              _react2.default.createElement("g", {
                ref: this.xAxisRef,
                transform: "translate(0, " + height + ")"
              }),
              _react2.default.createElement("g", {
                className: "grid-lines",
                ref: this.xGridLinesRef,
                transform: "translate(0, " + height + ")"
              }),
              _react2.default.createElement("g", { ref: this.yAxisRef }),
              _react2.default.createElement("g", {
                className: "grid-lines",
                ref: this.yGridLinesRef
              }),
              this.renderCandles()
            )
          );
        }

        return null;
      }
    }
  ]);

  return Chart;
})(_react.Component);

Chart.propTypes = {
  // A single priceData has following structure:
  // [date, open, high, low, close, volume]
  // TODO: Volume is not currently used but in future
  // it will come into the picture.
  pricesData: (0, _propTypes.arrayOf)(
    (0, _propTypes.arrayOf)(_propTypes.string)
  ).isRequired,
  width: _propTypes.number.isRequired,
  height: _propTypes.number.isRequired,
  margins: (0, _propTypes.shape)({
    top: _propTypes.number,
    left: _propTypes.number,
    right: _propTypes.number,
    bottom: _propTypes.number
  })
};

Chart.defaultProps = {
  margins: _constants.chartMargins
};

exports.default = Chart;
