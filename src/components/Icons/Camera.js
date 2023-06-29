import * as React from 'react';
const SvgCamera = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.324 5.227-.936-1.479a1.013 1.013 0 0 0-.77-.373H7.382c-.303 0-.574.143-.77.373l-.937 1.479c-.197.23-.451.398-.754.398h-2.11A1.125 1.125 0 0 0 1.688 6.75v6.75a1.125 1.125 0 0 0 1.125 1.125h12.374a1.125 1.125 0 0 0 1.126-1.125V6.75a1.125 1.125 0 0 0-1.125-1.125h-2.075c-.304 0-.592-.168-.79-.398Z"
    />
    <path
      stroke="#fff"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M9 12.375A2.813 2.813 0 1 0 9 6.75a2.813 2.813 0 0 0 0 5.625Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.36 5.555V4.78h-.844v.774"
    />
  </svg>
);
export default SvgCamera;
