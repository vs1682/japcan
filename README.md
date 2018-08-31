# Japcan

This is a [react](https://github.com/facebook/react/) and [d3](https://github.com/d3/d3) based japanese candlestick chart component.

This is a basic component with just candlestick chart. More features will be added over the time.

It has following `peerDependencies`

```js
"peerDependencies": {
  "react": "^16.4.0",
  "react-dom": "^16.4.0",
  "prop-types": "^15.6.0",
  "d3-axis": "^1.0.12",
  "d3-scale": "^2.1.2",
  "d3-selection": "^1.3.2"
}
```

Demo: https://vs1682.github.io/japcan/

# Installation

`npm install japcan`

`yarn add japcan`

# Usage

```js
import React from 'react';
import Japcan from 'japcan';

const pricesData = [
  ['2018-06-03', '110.4', '112.7', '109.0', '109.1', '29081'],
  ['2018-06-04', '112.1', '112.7', '111.0', '111.5', '34081'],
  ['2018-06-05', '108.4', '110.7', '107.0', '110.1', '69781'],
  ['2018-06-06', '110.9', '112.7', '109.0', '111.8', '39081'],
  ['2018-06-07', '113.4', '114.7', '108.0', '109.1', '59181'],
  .
  .
  .
  .
];

const App = () => (
  <Chart
    width={800}
    height={600}
    pricesData={pricesData}
  />
);
```

# Props

### width

> `number` | required

### height

> `number` | required

### margins

> `object` | optional

Margins to apply around the chart

```js
margins = {
  top: number.isRequired,
  left: number.isRequired,
  right: number.isRequired,
  bottom: number.isRequired
};
```

### pricesData

> `arrayOf(arrayOf(string))` | required

Each element of `pricesData` is an array of strings of `6 elements` in the following order `[date, open, high, low, close, volume]`. Though `volume` is not currently used anywhere in the code but in coming updates it will be there.

# Roadmap

[x] Create a basic candlestick chart

[ ] Add theme

[ ] Add animations

[ ] Add indicators

[ ] Add test cases

# License

[MIT](https://opensource.org/licenses/MIT)
