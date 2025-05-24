// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// To Fix Test Errors for React Router v7. 
// Explanation: React Router v7 uses TextEncoder/TextDecoder APIs that are available in browsers but not globally available in Node.js test environments. 
// This codeblock imports them from Node's util module and makes them globally accessible. 
// Without this, tests fail with "TextEncoder is not defined" errors when importing React Router components. 
// This was not needed in v6 because the library didn't depend on these Web APIs.
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
