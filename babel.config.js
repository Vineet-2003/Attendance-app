/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: ["nativewind/babel"],
// };

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   env: {
//     production: {
//       plugins: ['react-native-paper/babel'],
//     },
//   },
// };

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  overrides: [{
    "plugins": [
      ["@babel/plugin-transform-private-methods", {
      "loose": true,
    }],
    ],
  }],
};
