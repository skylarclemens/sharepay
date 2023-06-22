import Button from "../components/UI/Button/Button";

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    label: 'Button',
  },
};

export const Text = {
  args: {
    variant: 'text',
    label: 'Button',
  }
}

export const Medium = {
  args: {
    size: 'medium',
    label: 'Button',
  }
}

export const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
