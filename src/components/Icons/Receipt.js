import * as React from 'react';
const SvgReceipt = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 59 50"
    {...props}
  >
    <path
      fill="url(#Receipt_svg__a)"
      d="M13.615 18.182a2.275 2.275 0 0 1 2.27-2.272h27.23a2.267 2.267 0 0 1 2.27 2.272 2.268 2.268 0 0 1-2.27 2.273h-27.23a2.268 2.268 0 0 1-2.27-2.273Zm2.27 11.364h27.23a2.268 2.268 0 0 0 2.27-2.273 2.275 2.275 0 0 0-2.27-2.272h-27.23a2.268 2.268 0 0 0-2.27 2.272 2.275 2.275 0 0 0 2.27 2.273ZM59 4.546v43.182a2.275 2.275 0 0 1-2.168 2.27 2.265 2.265 0 0 1-1.117-.238l-8.061-4.037-8.062 4.037a2.266 2.266 0 0 1-2.03 0L29.5 45.723l-8.061 4.037a2.267 2.267 0 0 1-2.031 0l-8.062-4.037-8.061 4.037a2.265 2.265 0 0 1-2.997-.925A2.275 2.275 0 0 1 0 47.728V4.546A4.55 4.55 0 0 1 1.33 1.33 4.535 4.535 0 0 1 4.537 0h49.923c1.204 0 2.359.479 3.21 1.331A4.55 4.55 0 0 1 59 4.546Zm-4.538 0H4.538v39.506l5.793-2.903a2.266 2.266 0 0 1 2.03 0l8.062 4.04 8.062-4.04a2.267 2.267 0 0 1 2.03 0l8.062 4.04 8.061-4.04a2.266 2.266 0 0 1 2.031 0l5.793 2.903V4.546Z"
    />
    <defs>
      <linearGradient
        id="Receipt_svg__a"
        x1={-19.5}
        x2={68.5}
        y1={47.5}
        y2={0}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#729B94" />
        <stop offset={1} stopColor="#729B79" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgReceipt;