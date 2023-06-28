import { ICONS } from "../../constants/icons";

const Icon = ({ name, ...props }) => {
  const IconComponent = ICONS[name];
  return (
    IconComponent && <IconComponent {...props} />
  )
}

export default Icon;