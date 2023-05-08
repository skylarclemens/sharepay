const Tabs = ({ leftTab, leftTabFn, rightTab, rightTabFn, selected }) => {
  return (
    <div className="tabs">
      <button className={`left-tab`} onClick={leftTabFn}>
        {leftTab}
      </button>
      <button className={`right-tab`} onClick={rightTabFn}>
        {rightTab}
      </button>
    </div>
  )
}

export default Tabs;