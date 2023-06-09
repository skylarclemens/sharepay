import './Atom.scss';
import Orbital from './Orbital/Orbital';

const Atom = ({ orbitals = [], numOrbitals = null, size, nucleusColor, image = null, icon = null, iconFn = null, fade = false, children }) => {
  return (
    <div className={`atom-container ${fade ? 'atom--fade' : ''}`}>
      <div className="atom__nucleus" style={{
        height: `${size}px`,
        width: `${size}px`,
        backgroundColor: nucleusColor,
      }}>
        {image}
        {icon ? (
          <div className="atom__icon">
            {icon}
          </div>
        ) : null}
        {children}
      </div>
      {numOrbitals ? [...Array(numOrbitals)].map((_, index) => <Orbital key={"orbital-"+(index+1)} numOrbitals={true} index={index} size={size} />) : null}
      {orbitals.length ? orbitals.map((orbital, index) => orbital && <Orbital key={"orbital-"+(index+1)} index={index} orbital={orbital} size={size} />) : null}
    </div>
  )
}

export default Atom;