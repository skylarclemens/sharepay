import * as React from 'react';
const SvgHome = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 50 50"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.125}
      d="M7.813 20.703V43.75a1.563 1.563 0 0 0 1.562 1.563h9.375V32.03a2.343 2.343 0 0 1 2.344-2.343h7.812a2.343 2.343 0 0 1 2.344 2.343v13.282h9.375a1.563 1.563 0 0 0 1.563-1.563V20.703"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.125}
      d="M46.875 25 26.064 5.078c-.489-.516-1.63-.521-2.128 0L3.125 25m35.938-7.52V6.25h-4.688v6.738"
    />
  </svg>
);
export default SvgHome;
