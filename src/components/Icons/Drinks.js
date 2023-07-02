import * as React from 'react';
const SvgDrinks = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 50 50"
    {...props}
  >
    <path
      fill="#fff"
      d="m35.938 16.272 4.687-4.688-2.21-2.209-5.145 5.145c-.293.293-.457.69-.458 1.105v6.25H21.76l1.786 25h13.847l1.786-25h-3.24v-5.603ZM34.483 43.75h-8.03L25.115 25h10.706l-1.338 18.75Z"
    />
    <path
      fill="#fff"
      d="M23.438 1.563h-7.813a1.563 1.563 0 0 0-1.563 1.562v11.516c-1.667.947-4.687 3.403-4.687 8.796v21.875a1.563 1.563 0 0 0 1.563 1.563h7.812V43.75H12.5V23.437c0-5.865 4.688-6.687 4.688-6.687V4.687h4.687v10.938H25v-12.5a1.563 1.563 0 0 0-1.563-1.563Z"
    />
  </svg>
);
export default SvgDrinks;