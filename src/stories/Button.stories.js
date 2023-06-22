import Button from "../components/UI/Buttons/Button/Button";

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    variant: 'primary',
    size: 'medium',
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    variant: 'secondary'
  },
};

export const Text = {
  args: {
    ...Primary.args,
    variant: 'text',
  }
}

export const Medium = {
  args: {
    ...Primary.args,
    size: 'medium',
  }
}

export const Small = {
  args: {
    ...Primary.args,
    size: 'small',
  },
};
