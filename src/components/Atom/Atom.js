import './Atom.scss';
import Orbital from './Orbital/Orbital';

const Atom = ({ orbitals = [], size, icon = null, fade = false }) => {
  return (
    <div className={`atom-container ${fade ? 'atom--fade' : ''}`}>
      <div className="atom__nucleus" style={{
        height: `${size}px`,
        width: `${size}px`,
      }}>
        {icon}
      </div>
      {orbitals.map((orbital, index) => orbital && <Orbital key={"orbital-"+(index+1)} index={index} orbital={orbital} size={size} />)}
    </div>
  )
}

export default Atom;