import './Atom.scss';
import Orbital from './Orbital/Orbital';

const Atom = ({ orbitals = [], size, image = null, icon = null, iconFn = null, fade = false }) => {
  return (
    <div className={`atom-container ${fade ? 'atom--fade' : ''}`}>
      <div className="atom__nucleus" style={{
        height: `${size}px`,
        width: `${size}px`,
      }}>
        {image}
        {icon ? <button type="button" className="atom__icon button__no-style" onClick={iconFn}>
          <img src={icon} alt="Icon" height="20" width="20" />
        </button> : null}
      </div>
      {orbitals.map((orbital, index) => orbital && <Orbital key={"orbital-"+(index+1)} index={index} orbital={orbital} size={size} />)}
    </div>
  )
}

export default Atom;