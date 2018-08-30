import React, { Component, createRef } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { arrayOf, number, shape, string } from "prop-types";

import Candle from "./components/candle";
import { candleMarginFactor, candleMarginMax, chartMargins } from "./constants";
import "./chart.css";

const minAndMaxPrices = pricesData =>
  pricesData.reduce(
    (minAndMax, price) => {
      const high = parseFloat(price[2]);
      const low = parseFloat(price[3]);
      const { min, max } = minAndMax;
      if (high > max) {
        return {
          ...minAndMax,
          max: high
        };
      }

      if (low < min) {
        return {
          ...minAndMax,
          min: low
        };
      }

      return minAndMax;
    },
    { min: Infinity, max: -Infinity }
  );

const getDatesInAscendingOrder = pricesData => {
  const dataLen = pricesData.length;
  let dates = [];

  if (dataLen) {
    const date1 = new Date(pricesData[0][0]);
    const dateN = new Date(pricesData[dataLen - 1][0]);
    dates = pricesData.map(data => new Date(data[0]));
    date1 > dateN && dates.reverse();
  }

  return dates;
};

// TODO: formatDate and tickValues have similar code structure,
// try to combine them and remove the redundancy
const formatDate = (date, totalDuration) => {
  // On an average there are 20 trading days per month
  // thus we consider 120 dates equal to 6 months
  const months = [
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
    return `${months[date.getMonth()]}-${date.getFullYear()}`;
  }

  if (totalDuration > 120) {
    return months[date.getMonth()];
  }

  if (totalDuration < 120) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

const tickValues = dates => {
  const totalDuration = dates.length;

  if (totalDuration > 480) {
    return dates.reduce((filteredDates, date) => {
      const filteredDatesLength = filteredDates.length;
      if (!filteredDatesLength) {
        filteredDates.push(date);
      } else {
        const lastMonth = filteredDates[filteredDatesLength - 1].getMonth();
        const next2NextMonth = lastMonth > 7 ? lastMonth - 8 : lastMonth + 4;
        if (next2NextMonth === date.getMonth()) {
          filteredDates.push(date);
        }
      }

      return filteredDates;
    }, []);
  }

  if (totalDuration > 240) {
    return dates.reduce((filteredDates, date) => {
      const filteredDatesLength = filteredDates.length;
      if (!filteredDatesLength) {
        filteredDates.push(date);
      } else {
        const lastMonth = filteredDates[filteredDatesLength - 1].getMonth();
        const next2NextMonth = lastMonth > 9 ? lastMonth - 10 : lastMonth + 2;
        if (next2NextMonth === date.getMonth()) {
          filteredDates.push(date);
        }
      }

      return filteredDates;
    }, []);
  }

  if (totalDuration > 120) {
    return dates.reduce((filteredDates, date) => {
      const filteredDatesLength = filteredDates.length;
      if (!filteredDatesLength) {
        filteredDates.push(date);
      } else {
        const lastDate = filteredDates[filteredDatesLength - 1];
        if (lastDate.getMonth() !== date.getMonth()) {
          filteredDates.push(date);
        }
      }

      return filteredDates;
    }, []);
  }

  if (totalDuration < 120) {
    return dates.filter((d, i) => i % 4 === 0);
  }
};

const getColor = openCloseDifference => {
  if (openCloseDifference < 0) {
    return "red";
  }

  if (openCloseDifference > 0) {
    return "green";
  }

  return "black";
};

class Chart extends Component {
  xAxisRef = createRef();
  xGridLinesRef = createRef();
  yAxisRef = createRef();
  yGridLinesRef = createRef();
  xScale = scaleBand().range([0, this.props.width]);
  yScale = scaleLinear().range([this.props.height, 0]);

  componentDidMount() {
    // Calling renderAxes in CDM as these methods
    // use d3-axis which manipulates dom and thus we
    // pass a reference of the dom element to d3
    this.props.pricesData && this.renderAxes();
  }

  componentDidUpdate() {
    this.props.pricesData && this.renderAxes();
  }

  setDomainForAxes = () => {
    const dates = getDatesInAscendingOrder(this.props.pricesData);
    const pricesRange = minAndMaxPrices(this.props.pricesData);
    this.xScale.domain(dates);
    this.yScale.domain([pricesRange.min, pricesRange.max]);
  };

  renderXAxis = () => {
    const { height, pricesData } = this.props;
    const dates = getDatesInAscendingOrder(pricesData);

    this.xAxis = axisBottom()
      .scale(this.xScale)
      .tickValues(tickValues(dates))
      .tickFormat(date => {
        return formatDate(date, dates.length);
      });
    select(this.xAxisRef.current).call(this.xAxis);

    this.xAxis.tickSize(-height).tickFormat("");

    select(this.xGridLinesRef.current).call(this.xAxis);
  };

  renderYAxis = () => {
    const { width } = this.props;
    this.yAxis = axisLeft().scale(this.yScale);
    select(this.yAxisRef.current).call(this.yAxis);

    this.yAxis.tickSize(-width).tickFormat("");

    select(this.yGridLinesRef.current).call(this.yAxis);
  };

  renderAxes = () => {
    this.renderXAxis();
    this.renderYAxis();
  };

  renderCandles = () => {
    const { pricesData, width } = this.props;
    const candleBandWidth = width / pricesData.length;
    const candleMargin =
      candleMarginMax / parseInt(pricesData.length / candleMarginFactor);
    const candleWidth = candleBandWidth - candleMargin;

    return pricesData.map(data => {
      const open = parseFloat(data[1]);
      const high = parseFloat(data[2]);
      const low = parseFloat(data[3]);
      const close = parseFloat(data[4]);
      const x = this.xScale(new Date(data[0]));
      const y = this.yScale(high);
      const yOpen = this.yScale(open);
      const yClose = this.yScale(close);
      const yLow = this.yScale(low);

      // TODO: work on the part where open and close are equal
      const candleHeight = yOpen - yClose || 1;
      const candleHigh = (candleHeight > 0 ? yClose : yOpen) - y;
      const candleLow = yLow - (candleHeight > 0 ? yOpen : yClose);
      return (
        <g
          className="candle"
          key={data[0]}
          transform={`translate(${x + candleMargin / 2}, ${y})`}
        >
          <Candle
            height={Math.abs(candleHeight)}
            width={candleWidth}
            highHeight={candleHigh}
            lowHeight={candleLow}
            color={getColor(candleHeight)}
          />
        </g>
      );
    });
  };

  render() {
    const { margins, width, height, pricesData } = this.props;
    const { top, left, right, bottom } = margins;

    if (pricesData.length) {
      // We need to change the domain when the pricesData changes
      this.setDomainForAxes();
      return (
        <svg
          width={width + left + right || 0}
          height={height + top + bottom || 0}
        >
          <g transform={`translate(${left}, ${top})`}>
            <g ref={this.xAxisRef} transform={`translate(0, ${height})`} />
            <g
              className="grid-lines"
              ref={this.xGridLinesRef}
              transform={`translate(0, ${height})`}
            />
            <g ref={this.yAxisRef} />
            <g className="grid-lines" ref={this.yGridLinesRef} />
            {this.renderCandles()}
          </g>
        </svg>
      );
    }

    return null;
  }
}

Chart.propTypes = {
  // A single priceData has following structure:
  // [date, open, high, low, close, volume]
  // TODO: Volume is not currently used but in future
  // it will come into the picture.
  pricesData: arrayOf(arrayOf(string)).isRequired,
  width: number.isRequired,
  height: number.isRequired,
  margins: shape({
    top: number,
    left: number,
    right: number,
    bottom: number
  })
};

Chart.defaultProps = {
  margins: chartMargins
};

export default Chart;
