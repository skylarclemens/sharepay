import * as React from 'react';
const SvgClose = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      stroke="#fff"
      strokeMiterlimit={10}
      strokeWidth={32}
      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M320 320 192 192m0 128 128-128"
    />
  </svg>
);
export default SvgClose;
