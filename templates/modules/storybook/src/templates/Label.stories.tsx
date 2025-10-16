import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Create interfaces for our custom props
type StoryProps = {
  inputClassName?: string;
  labelText?: string;
  placeholder?: string;
} & ComponentProps<typeof Label>;

/**
 * The Label component is an accessible label built on top of Radix UI's Label primitive.
 * It provides proper association with form controls and maintains consistent styling
 * across the application.
 *
 * @see {@link https://ui.shadcn.com/docs/components/label Label Documentation}
 */
const meta: Meta<StoryProps> = {
  title: 'Templates/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An accessible label component built with Radix UI Label primitive.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for label styling',
    },
    inputClassName: {
      control: 'text',
      description: 'Additional CSS classes for input styling',
    },
    htmlFor: {
      control: 'text',
      description: 'Associates the label with a form control',
    },
    labelText: {
      control: 'text',
      description: 'Text content of the label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
  },
  tags: ['autodocs', 'form', 'accessibility'],
};

export default meta;
type Story = StoryObj<StoryProps>;

/**
 * Basic label example.
 */
export const Default: Story = {
  args: {
    children: 'Email address',
    className: 'text-amber-700',
  },
};

/**
 * Label with associated input field.
 */
export const WithInput: Story = {
  args: {
    className: '',
    inputClassName: 'text-amber-600',
    htmlFor: 'custom-email',
    labelText: 'Email',
    placeholder: '',
  },

  render: args => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label
        className={args.className}
        htmlFor={args.htmlFor}
      >
        {args.labelText}
      </Label>
      <Input
        type="email"
        id={args.htmlFor}
        placeholder={args.placeholder}
        className={args.inputClassName}
      />
    </div>
  ),
};

/**
 * Label with required indicator.
 */
export const Required: Story = {
  args: {
    className: 'font-bold',
    inputClassName: 'border-2',
    htmlFor: 'custom-required',
    labelText: 'Username',
    placeholder: 'Enter username',
  },

  render: args => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label
        className={args.className}
        htmlFor={args.htmlFor}
      >
        {args.labelText}
        {' '}
        <span className="text-destructive">*</span>
      </Label>
      <Input
        id={args.htmlFor}
        required
        placeholder={args.placeholder}
        className={args.inputClassName}
      />
    </div>
  ),
};

/**
 * Label in disabled state.
 */
export const Disabled: Story = {
  args: {
    className: 'opacity-70',
    inputClassName: 'bg-gray-100',
    htmlFor: 'custom-disabled',
    labelText: 'Disabled field',
    placeholder: 'This field is disabled',
  },

  render: args => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label
        className={args.className}
        htmlFor={args.htmlFor}
      >
        {args.labelText}
      </Label>
      <Input
        id={args.htmlFor}
        disabled
        placeholder={args.placeholder}
        className={args.inputClassName}
      />
    </div>
  ),
};

/**
 * Label with description.
 */
export const WithDescription: Story = {
  args: {
    className: 'font-medium',
    inputClassName: 'border-dashed',
    htmlFor: 'custom-picture',
    labelText: 'Profile picture',
    placeholder: 'Select a file',
  },

  render: args => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label
        className={args.className}
        htmlFor={args.htmlFor}
      >
        {args.labelText}
      </Label>
      <Input
        id={args.htmlFor}
        type="file"
        placeholder={args.placeholder}
        className={args.inputClassName}
      />
      <p className="text-sm text-muted-foreground">
        Upload a profile picture. Must be a PNG or JPG file.
      </p>
    </div>
  ),
};
