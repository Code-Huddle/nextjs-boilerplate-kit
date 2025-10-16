import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';

/**
 * The Input component is a flexible and customizable form control that provides various
 * input types and states for form interactions. It extends the native HTML input element
 * with enhanced styling and accessibility features.
 *
 * @component
 * @example
 * ```tsx
 * <Input placeholder="Enter text" />
 * <Input type="email" placeholder="Enter email" />
 * <Input disabled placeholder="Disabled input" />
 * ```
 */
const meta: Meta<typeof Input> = {
  title: 'Templates/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    // Adding comprehensive documentation
    docs: {
      description: {
        component: 'A flexible and customizable input component that supports various states and use cases. Built with shadcn/ui and Tailwind CSS, it provides enhanced styling and accessibility features.',
        story: 'Interactive demo showcasing different input variations and states.',
      },
    },
  },
  // Enhanced argTypes with better descriptions and control configurations
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
      description: 'Defines the type of input field. Affects keyboard, validation, and UI behavior.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when the input is empty',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When true, prevents user interaction and applies disabled styling',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling using Tailwind',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  decorators: [
    Story => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
  // Adding tags for better organization
  tags: ['autodocs', 'input', 'form-elements'],
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * Default input field with standard styling and placeholder text.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter your text',
    disabled: false,
  },
};

/**
 * Email input type with email-specific keyboard and validation.
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

/**
 * Password input with masked text entry.
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '••••••••',
  },
};

/**
 * Numeric input with number-specific keyboard and validation.
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter amount',
  },
};

/**
 * Example of a disabled input state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Cannot edit this',
  },
};

/**
 * Input with an associated label for better accessibility.
 */
export const WithLabel: Story = {
  render: args => (
    <div className="space-y-2">
      <label htmlFor="with-label" className="text-sm font-medium">
        Email address
      </label>
      <Input id="with-label" placeholder="Enter your email" {...args} />
    </div>
  ),
};

/**
 * Input displaying an error state with validation message.
 */
export const WithError: Story = {
  render: args => (
    <div className="space-y-2">
      <Input
        placeholder="Invalid input"
        className="border-red-500 focus-visible:ring-red-500"
        {...args}
      />
      <p className="text-sm text-red-500">Please enter a valid value</p>
    </div>
  ),
};

/**
 * Input displaying a success state with validation message.
 */
export const WithSuccess: Story = {
  render: args => (
    <div className="space-y-2">
      <Input
        placeholder="Valid input"
        className="border-green-500 focus-visible:ring-green-500"
        value="Correct value"
        {...args}
      />
      <p className="text-sm text-green-500">Input is valid</p>
    </div>
  ),
};

/**
 * Input with a leading icon for enhanced visual context.
 */
export const WithLeadingIcon: Story = {
  render: args => (
    <div className="relative">
      <svg
        className="absolute left-3 top-2.5 size-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <Input className="pl-10" placeholder="Search..." {...args} />
    </div>
  ),
};

/**
 * Input with a trailing icon or unit display.
 */
export const WithTrailingIcon: Story = {
  render: args => (
    <div className="relative">
      <Input className="pr-10" placeholder="Enter amount" type="number" {...args} />
      <span className="absolute right-3 top-1.5 text-gray-500">$</span>
    </div>
  ),
};

/**
 * Small-sized input variant.
 */
export const Small: Story = {
  args: {
    className: 'h-8 text-sm',
    placeholder: 'Small input',
  },
};

/**
 * Large-sized input variant.
 */
export const Large: Story = {
  args: {
    className: 'h-11 text-lg',
    placeholder: 'Large input',
  },
};

/**
 * Example of inputs used within a form context.
 */
export const WithinForm: Story = {
  render: args => (
    <form onSubmit={e => e.preventDefault()} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input id="username" placeholder="Enter username" {...args} />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input id="password" type="password" placeholder="Enter password" {...args} />
      </div>
      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Submit
      </button>
    </form>
  ),
};
