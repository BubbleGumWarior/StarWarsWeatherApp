import React, { useState, useEffect } from 'react';

const ButtonComponent = ({ onButtonClick }) => {
  const [hyperSpace, setHyperSpace] = useState(false);

  const handleClick = () => {
    setHyperSpace(true);
    onButtonClick();
  };

  useEffect(() => {
    let timer;
    if (hyperSpace) {
      timer = setTimeout(() => {
        setHyperSpace(false);
      }, 10000);
    }

    return () => clearTimeout(timer);
  }, [hyperSpace]);

  return (
    <button onClick={handleClick}>
      Press me to activate Hyper Space!
    </button>
  );
};

export default ButtonComponent;
