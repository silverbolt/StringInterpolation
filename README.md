StringInterpolation JS
===

A high performance string interpolation library for JavaScript/NodeJS.  
It used Finite State Machine (FSM) to process strings instead of Regular Expression, resulting in better performance.

## How to use

two methods are provided:
```js
const SI = require('StringInterpolation');
const context = {
  v1: 'Life',
  v2: {
    v3: 'chocolate.'
  }
};

const strTemp = '${v1} is like ${v2.v3}'

// method1 parseTemplate
const sentences = SI.parseTemplate(strTemp, context)
console.log(sentences) // output: Life is like chocolate.

// method2 extraTokens
const strSegments = SI.extraTokens(strTemp);
console.log(strSegments) // output: [{ type: "var", value: "v1" }, { type: "text", value: " is like " }, { type: "var", value: "v2.v3" }]
```
