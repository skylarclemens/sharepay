import './Tabs.scss';

const Tabs = ({ leftTab, rightTab, selected, setSelected }) => {

  return (
    <div className="tabs">
      <button type="button" className={`tab button button--icon left-tab ${selected === 'left' && 'selected'}`} onClick={() => setSelected('left')}>
        {leftTab}
      </button>
      <button type="button" className={`tab button button--icon right-tab
      ${selected === 'right' && 'selected'}`} onClick={() => setSelected('right')}>
        {rightTab}
      </button>
    </div>
  )
}

export default Tabs;