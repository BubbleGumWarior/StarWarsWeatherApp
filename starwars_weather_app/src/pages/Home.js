import Space from "../components/CanvasComponent";
import Cockpit from "../components/Cockpit";
import Hologram from "../components/Hologram";
import ButtonComponent from "../components/ButtonComponent";

import React, { useState } from 'react';

function Home() {
  const [hyperSpace, setHyperSpace] = useState(false);

  const handleButtonClick = () => {
    setHyperSpace(true);
    setTimeout(() => {
      setHyperSpace(false);
    }, 10000);
  };

  return (
    <div>
      <Hologram onButtonClick={handleButtonClick}/>
      <Cockpit/>
      <Space hyperSpace={hyperSpace} />
    </div>
  );
  }
  
export default Home;