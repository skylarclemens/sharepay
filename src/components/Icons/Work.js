import * as React from 'react';
const SvgWork = (props) => (
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
      strokeLinejoin="round"
      strokeWidth={3.125}
      d="M42.188 12.5H7.812a4.688 4.688 0 0 0-4.687 4.688v21.875a4.688 4.688 0 0 0 4.688 4.687h34.374a4.688 4.688 0 0 0 4.688-4.688V17.189a4.688 4.688 0 0 0-4.688-4.688Z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.125}
      d="M14.063 12.5V9.375a3.125 3.125 0 0 1 3.124-3.125h15.625a3.125 3.125 0 0 1 3.126 3.125V12.5m10.937 10.938H3.125m28.125 0v2.343a.781.781 0 0 1-.781.782H19.53a.781.781 0 0 1-.781-.782v-2.343"
    />
  </svg>
);
export default SvgWork;
