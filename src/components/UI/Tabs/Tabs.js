import './Tabs.scss';
import Button from '../Buttons/Button/Button';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Tabs = ({ tabs, selected, setSelected, ...props }) => {
  return (
    <div className="tabs" {...props}>
    {tabs.map((tab) => {
      return (
        <Button key={tab.id} className={`button--text tab tab-${tab.id} ${selected === tab.id ? 'active' : ''}`} onClick={() => setSelected(tab.id)}>
          {tab.label}
          {selected === tab.id ? (
            <motion.span layoutId="tab-bubble" className="active-tab"
              transition={{
                type: 'spring',
                bounce: 0.1,
                duration: 0.6
              }}></motion.span>
          ) : null}
        </Button>
      )
    })}
    </div>
  )
}

Tabs.propTypes = {
  /**
   * List of tabs for the component to display
   */
  tabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  /**
   * The currently selected tab
   * */
  selected: PropTypes.string.isRequired,
  /**
   * Callback function to set the selected tab
   * @param {string} tab - The tab id
   */
  setSelected: PropTypes.func.isRequired,
}

export default Tabs;