import type { Meta, StoryObj } from '@storybook/react';
import { ModifiedCard } from '@/components/ui/modified-card';

const meta = {
  title: 'Templates/ModifiedCard',
  component: ModifiedCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    imageSrc: {
      control: { type: 'text' },
      description: 'URL of the card image',
    },
    title: {
      control: { type: 'text' },
      description: 'Card title',
    },
    description: {
      control: { type: 'text' },
      description: 'Card description',
    },
    buttonText: {
      control: { type: 'text' },
      description: 'Text displayed on the primary button',
    },
    badges: {
      control: { type: 'object' },
      description: 'Array of badge texts to display above the title',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows loading state with animations',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables all interactions with the card',
    },
    imageAspectRatio: {
      control: { type: 'select' },
      options: ['square', 'video', 'wide'],
      description: 'Controls the aspect ratio of the image',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'bordered', 'minimal'],
      description: 'Visual variant of the card',
    },
    secondaryButton: {
      control: { type: 'object' },
      description: 'Configuration for optional secondary button',
    },
    className: {
      control: { type: 'text' },
      description: 'Classes for the main card container',
    },
    imageWrapperClassName: {
      control: { type: 'text' },
      description: 'Classes for the image container',
    },
    imageClassName: {
      control: { type: 'text' },
      description: 'Classes for the image element',
    },
    headerClassName: {
      control: { type: 'text' },
      description: 'Classes for the header section',
    },
    titleClassName: {
      control: { type: 'text' },
      description: 'Classes for the title text',
    },
    descriptionClassName: {
      control: { type: 'text' },
      description: 'Classes for the description text',
    },
    footerClassName: {
      control: { type: 'text' },
      description: 'Classes for the footer section',
    },
    buttonClassName: {
      control: { type: 'text' },
      description: 'Classes for the primary button',
    },
    badgeClassName: {
      control: { type: 'text' },
      description: 'Classes for the badges',
    },
    onButtonClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof ModifiedCard>;

export default meta;
type Story = StoryObj<typeof ModifiedCard>;

export const Default: Story = {
  args: {
    imageSrc: '/assets/images/dog.jpg',
    title: 'Product Name',
    description: 'High-quality product with amazing features that will exceed your expectations.',
    buttonText: 'Buy Now',
    onButtonClick: () => {},
    badges: ['New', 'Featured'],
    imageAspectRatio: 'video',
    variant: 'default',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const WithSecondaryButton: Story = {
  args: {
    ...Default.args,
    secondaryButton: {
      text: 'Learn More',
      onClick: () => {},
      className: 'hover:bg-secondary/80',
    },
  },
};

export const MinimalVariant: Story = {
  args: {
    ...Default.args,
    variant: 'minimal',
    className: 'bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200',
  },
};

export const BorderedVariant: Story = {
  args: {
    ...Default.args,
    variant: 'bordered',
    className: 'hover:border-primary/80',
  },
};

export const SquareImage: Story = {
  args: {
    ...Default.args,
    imageAspectRatio: 'square',
  },
};

export const WithHoverEffects: Story = {
  args: {
    ...Default.args,
    className: 'transform transition-all duration-300 hover:scale-105 hover:shadow-lg',
    imageClassName: 'transition-transform duration-300 hover:scale-110',
    buttonClassName: 'transition-colors duration-300',
  },
};

export const CustomSize: Story = {
  args: {
    ...Default.args,
    className: 'w-80 bg-gradient-to-r from-blue-500 to-purple-500 text-white',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Responsive: Story = {
  args: {
    ...Default.args,
    className: 'w-full sm:w-64 md:w-72 lg:w-80',
  },
};
