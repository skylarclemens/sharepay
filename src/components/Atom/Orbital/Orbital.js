import Avatar from "../../Avatar/Avatar";
import { useState } from "react";

const Orbital = ({ orbital = [], index, size = 0 }) => {
  const [angles, setAngles] = useState([]);
  const orbitalSize = size * ((index * 0.4) + 1.4);
  const radius = orbitalSize / 2;
  const positions = [];

  for(let i = 0; i < orbital.length; i++) {
    if(angles.length < orbital.length) {
      setAngles([...angles, Math.random()*2*Math.PI]);
    }
    let x = Math.round(orbitalSize/2 + radius * Math.cos(angles[i]) - 35/2),
      y = Math.round(orbitalSize/2 + radius * Math.sin(angles[i]) - 35/2);
    positions.push({x, y});
  }

  return (
    <div className="atom__orbital" style={{
      height: `${orbitalSize}px`,
      width: `${orbitalSize}px`,
    }}>
      {orbital.map((electron, index) => {
        return (
          <div className="atom__electron-container" style={{
            top: positions[index].y,
            left: positions[index].x,
          }}>
            <Avatar
              key={'atom-' + index}
              url={electron.url}
              size={35}
              classes={`white-border atom__electron ${'atom__electron--' + (index+1)}`} />
          </div>
        )}
      )}
    </div>
  )
}

export default Orbital;