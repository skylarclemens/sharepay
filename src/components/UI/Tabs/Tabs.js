import './Tabs.scss';
import Button from '../Buttons/Button/Button';
import { motion } from 'framer-motion';

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

export default Tabs;