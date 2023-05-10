import './Tabs.scss';

const Tabs = ({ leftTab, rightTab, selected, setSelected }) => {

  return (
    <div className="tabs">
      <div className={`tab button button--icon left-tab ${selected === 'left' && 'selected'}`} onClick={() => setSelected('left')}>
        {leftTab}
      </div>
      <div className={`tab button button--icon right-tab
      ${selected === 'right' && 'selected'}`} onClick={() => setSelected('right')}>
        {rightTab}
      </div>
    </div>
  )
}

export default Tabs;