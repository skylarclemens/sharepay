import './Refresh.scss';
import { useEffect, useRef, useState } from 'react';
import refreshImg from '../../images/Refresh.svg';

const Refresh = ({ onRefresh = null, loading = false }) => {
  const [startPoint, setStartPoint] = useState(0);
  const [pullDifference, setPullDifference] = useState(0);
  const [isLoading, setIsLoading] = useState(loading);
  const refreshContainer = useRef(null);

  const onInternalRefresh = () => {
    setIsLoading(false);
  }

  const initLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      onInternalRefresh();
      onRefresh();
    }, 1000);
  }

  const pullStart = (e) => {
    setStartPoint(e.touches[0].screenY);
  }

  const pull = (e) => {
    let { screenY } = e.touches[0];
    const pullLength = startPoint < screenY ? Math.abs(screenY - startPoint) : 0;
    setPullDifference(pullLength);
  }

  const pullEnd = () => {
    setPullDifference(0);
    setStartPoint(0);
    if (pullDifference > 200) {
      initLoading();
    }
  }

  useEffect(() => {
    window.addEventListener("touchstart", pullStart);
    window.addEventListener("touchmove", pull);
    window.addEventListener("touchend", pullEnd);
    return () => {
      window.removeEventListener("touchstart", pullStart);
      window.removeEventListener("touchmove", pull);
      window.removeEventListener("touchend", pullEnd);
    };
  })

  return (
    <div ref={refreshContainer} className={`refresh ${isLoading ? 'refresh--loading' : ''}`}
      style={{
        marginTop: pullDifference ? (pullDifference / 3.5) - 48 : "",
        opacity: (pullDifference > 110 || isLoading) ? 1 : 0,
        transition: 'margin-top 0.2s ease-out, opacity 0.4s ease-in-out',
      }}>
      <div className={`refresh__icon`}>
        <img src={refreshImg} style={{
          transform: `rotate(${pullDifference}deg)`,
        }} alt="Refresh Icon" />
      </div>
    </div>
  )
}

export default Refresh;