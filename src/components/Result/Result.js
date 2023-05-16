import './Result.scss';

const Result = ({ text = '', resultLeft, resultRight, resultBottom, action = null, type = null}) => {
  return (
    <div className="result" onClick={action}>
      <div className="result-main">
        {resultLeft && (
          <div className="result-left">
            {resultLeft}
          </div>
        )}
        <div className="result-info">
          <div className="result-text">
            <span>{text}</span>
          </div>
        </div>
        {resultRight && (
          <div className="result-right">
            {resultRight}
          </div>
        )}
      </div>
      {resultBottom && (
        <div className="result-bottom">
          {resultBottom}
        </div>
      )}
    </div>
  )
}

export default Result;