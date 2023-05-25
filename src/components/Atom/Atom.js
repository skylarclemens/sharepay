import './Atom.scss';
import Orbital from './Orbital/Orbital';

const Atom = ({ orbitals = [], size, fade = false }) => {
  return (
    <div className={`atom-container ${fade ? 'atom--fade' : ''}`}>
      <div className="atom__nucleus" style={{
        height: `${size}px`,
        width: `${size}px`,
      }}></div>
      {orbitals.map((orbital, index) => <Orbital key={"orbital-"+(index+1)} index={index} orbital={orbital} electrons={orbital.electrons} size={size} />)}
    </div>
  )
}

export default Atom;