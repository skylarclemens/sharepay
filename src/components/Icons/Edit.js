import * as React from 'react';
const SvgEdit = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12.2 4.2 15.4 1 21 6.6l-3.2 3.2m-5.6-5.6L1.331 15.069c-.212.212-.331.5-.331.8V21h5.131c.3 0 .588-.12.8-.331L17.8 9.8m-5.6-5.6 5.6 5.6"
    />
  </svg>
);
export default SvgEdit;
