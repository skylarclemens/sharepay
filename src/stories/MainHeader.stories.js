import MainHeader from "../components/Layout/Headers/MainHeader/MainHeader";

export default {
  title: 'Layout/Header/MainHeader',
  component: MainHeader,
  parameters: {
    docs: {
      iframeHeight: 400,
    }
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    title: 'Title',
  }
}