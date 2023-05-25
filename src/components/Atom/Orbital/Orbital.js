import Avatar from "../../Avatar/Avatar";
import { useState, useEffect, useRef } from "react";

const Orbital = ({ orbital = [], index, size = 0 }) => {
  const orbitalRef = useRef(null);
  const [angles, setAngles] = useState([]);
  const [positions, setPositions] = useState([]);
  const orbitalSize = size * (index/2 + 1.5);
  const radius = orbitalSize / 2;

  useEffect(() => {
    const newPositions = [];
    orbital.forEach((electron, electronIndex) => {
      if(!positions[electronIndex]) {
        const angle = Math.random()*2*Math.PI;
        let x = Math.round(orbitalSize/2 + radius * Math.cos(angle) - 35/2),
            y = Math.round(orbitalSize/2 + radius * Math.sin(angle) - 35/2);
        newPositions.push({x, y});
      }
    });
    setPositions(positions => [...positions, ...newPositions]);
  }, [orbital]);

  return (
    <div className="atom__orbital" ref={orbitalRef} style={{
      height: `${orbitalSize}px`,
      width: `${orbitalSize}px`,
    }}>
      {orbital.map((electron, electronIndex) => {
        return (
          <div className="atom__electron-container"
            key={'electron-'+(electronIndex+1)+'-'+(index+1)}
            style={{
              top: positions[electronIndex]?.y,
              left: positions[electronIndex]?.x,
          }}>
            <Avatar
              url={electron.url}
              size={35}
              classes={`white-border atom__electron ${'atom__electron--' + (electronIndex+1)}`} />
          </div>
        )}
      )}
    </div>
  )
}

export default Orbital;