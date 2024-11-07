import React from 'react';
const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>, clickEvent: ()=>void) => {
  if (event.key == 'Enter' || event.key == ' ') {
    event.preventDefault();
    clickEvent();
  }
};
export default keyDownHandler;
