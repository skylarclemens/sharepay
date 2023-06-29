import './ActionSheet.scss';
import Button from '../Buttons/Button/Button';
import PropTypes from 'prop-types';

const ActionSheet = ({ options, header, open }) => {
  return (
    <div className={`action-sheet ${open ? 'action-sheet--open' : ''}`}>
      {header && <div className="header">{header}</div>}
      {options.map((option) => {
        return (
          <Button key={option.id}
            variant="text"
            className="action"
            onClick={option.action}>
            {option.text}
          </Button>
        )
      })}
    </div>
  )
}

ActionSheet.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    action: PropTypes.func,
  })).isRequired,
  header: PropTypes.string,
  open: PropTypes.bool.isRequired,
}

export default ActionSheet;