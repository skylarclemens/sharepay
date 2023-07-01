import * as React from 'react';
const SvgGifts = (props) => (
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
      strokeMiterlimit={10}
      strokeWidth={3.125}
      d="M25 10.156v5.469m0-5.469a5.468 5.468 0 1 1 5.469 5.469H25m0-5.469a5.469 5.469 0 1 0-5.469 5.469H25"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.125}
      d="M40.625 15.625H9.375A3.125 3.125 0 0 0 6.25 18.75v4.688c0 1.725 1.4 3.125 3.125 3.125h31.25c1.726 0 3.125-1.4 3.125-3.125V18.75c0-1.726-1.4-3.125-3.125-3.125Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.125}
      d="M40.625 26.563v14.062a4.688 4.688 0 0 1-4.688 4.688H14.064a4.688 4.688 0 0 1-4.688-4.688V26.562M25 15.626v29.688"
    />
  </svg>
);
export default SvgGifts;
