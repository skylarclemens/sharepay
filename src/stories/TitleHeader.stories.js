import TitleHeader from "../components/Layout/Headers/TitleHeader/TitleHeader";

export default {
  title: 'Layout/Header/TitleHeader',
  component: TitleHeader,
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
    backgroundColor: '#f4f6f8',
    color: '#787878'
  }
}