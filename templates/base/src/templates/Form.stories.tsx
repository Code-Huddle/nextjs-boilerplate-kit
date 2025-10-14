import type { Meta, StoryObj } from '@storybook/react';
// Import types for Storybook metadata and story objects.
import { useForm } from 'react-hook-form';
// Import custom UI components for building forms, such as form container, controls, labels, and error messages.
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

/**
 * Defines the structure of form data with username and email fields.
 */
type FormData = {
  username: string;
  email: string;
};

/**
 * Props interface for the FormComponent.
 * Provides extensive customization options for form styling and layout.
 */
type FormComponentProps = {
  /** Classes applied to the form container */
  formClassName?: string;
  /** Vertical spacing between form items */
  formItemSpacing?: string;

  /** Custom classes for form item containers */
  formItemClassName?: string;
  /** Padding applied to form items */
  formItemPadding?: string;
  /** Border styling for form items */
  formItemBorder?: string;
  /** Border radius for form items */
  formItemRounding?: string;

  /** Custom classes for form labels */
  labelClassName?: string;
  /** Text size for labels */
  labelSize?: string;
  /** Font weight for labels */
  labelWeight?: 'font-normal' | 'font-medium' | 'font-semibold';

  /** Custom classes for input fields */
  inputClassName?: string;
  /** Height of input fields */
  inputSize?: string;
  /** Padding for input fields */
  inputPadding?: 'px-2 py-1' | 'px-3 py-2' | 'px-4 py-3' | string;
  /** Border style for input fields */
  inputBorder?: 'border' | 'border-2' | 'border-0';
  /** Border radius for input fields */
  inputRounding?: 'rounded-none' | 'rounded-sm' | 'rounded-md' | 'rounded-lg';

  /** Custom classes for the submit button */
  buttonClassName?: string;
  /** Height of the submit button */
  buttonSize?: 'h-8' | 'h-10' | 'h-12' | string;
  /** Width of the submit button */
  buttonWidth?: 'w-auto' | 'w-full';
  /** Visual style variant for the button */
  buttonVariant?: 'default' | 'outline' | 'ghost';
};

/**
 * A highly customizable form component that supports username and email inputs.
 *
 * Features:
 * - Flexible styling through Tailwind classes
 * - Comprehensive form validation
 * - Responsive design
 * - Multiple button variants
 * - Customizable spacing and layout
 *
 * @param props - Configuration options for styling and behavior
 * @returns A styled form component with username and email fields
 */
const FormComponent = (props: FormComponentProps) => {
  const form = useForm<FormData>({
    defaultValues: {
      username: '',
      email: '',
    },
  });
  // Console the output
  function onSubmit(data: FormData) {
    // eslint-disable-next-line no-console
    console.log(data);
  }

  const getButtonStyles = (variant: FormComponentProps['buttonVariant']) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors';
    const variantStyles = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border-2 border-primary text-primary hover:bg-primary/10',
      ghost: 'text-primary hover:bg-primary/10',
    }[variant || 'default'];

    return `${baseStyles} ${variantStyles}`;
  };

  const inputClasses = `
    ${props.inputClassName || ''}
    ${props.inputSize || ''}
    ${props.inputPadding || ''}
    ${props.inputBorder || ''}
    ${props.inputRounding || ''}
    w-full bg-background
  `.trim();

  const labelClasses = `
    ${props.labelClassName || ''}
    ${props.labelSize || ''}
    ${props.labelWeight || ''}
    block
  `.trim();

  const buttonClasses = `
    ${props.buttonClassName || ''}
    ${props.buttonSize || ''}
    ${props.buttonWidth || ''}
    ${props.inputRounding || ''}
    ${getButtonStyles(props.buttonVariant)}
  `.trim();

  return (
    (
      <Form {...form}>
        {/* The main form container component. It spreads the form object (from useForm) into the Form component. */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          // The native <form> element handles form submission.
          // Uses react-hook-form's handleSubmit method to manage form validation and submission logic.
          className={`${props.formClassName || ''} ${props.formItemSpacing || ''}`}
        // Dynamically applies additional class names for styling based on the provided props.
        >
          <FormField
            control={form.control}
            name="username"
            // Defines a form field for the "username" input, binding it to react-hook-form's control and state.
            render={({ field }) => (
            // Renders the field using the provided configuration from react-hook-form.
              (
                <FormItem className={`
          ${props.formItemClassName || ''}
          ${props.formItemPadding || ''}
          ${props.formItemBorder || ''}
          ${props.formItemRounding || ''}
        `.trim()}
                >
                  {/* Form item wrapper for consistent styling. Dynamically applies class names based on props. */}
                  <FormLabel className={labelClasses}>
                    {/* Label for the input field, styled using labelClasses */}
                    Username
                  </FormLabel>
                  <FormControl>
                    {/* Wraps the actual input field, ensuring styling and integration with the form system. */}
                    <input
                      {...field}
                      // Binds the input field to react-hook-form, ensuring its value and onChange handler are managed.
                      className={inputClasses}
                      // Applies consistent input styling via inputClasses.
                      placeholder="Enter username"
                      // Placeholder text guiding the user on what to input.
                    />
                  </FormControl>
                  <FormMessage />
                  {/* Displays validation error messages related to this field, if any. */}
                </FormItem>
              )
            )}
          />

          <FormField
            control={form.control}
            name="email"
            // Defines a form field for the "email" input, similar to the "username" field above.
            render={({ field }) => (
              <FormItem className={`
          ${props.formItemClassName || ''}
          ${props.formItemPadding || ''}
          ${props.formItemBorder || ''}
          ${props.formItemRounding || ''}
        `.trim()}
              >
                {/* Form item wrapper for consistent styling. Dynamically applies class names based on props. */}
                <FormLabel className={labelClasses}>
                  {/* Label for the email input field */}
                  Email
                </FormLabel>
                <FormControl>
                  {/* Wraps the actual input field */}
                  <input
                    {...field}
                    // Binds the email input field to react-hook-form.
                    type="email"
                    // Specifies the input type as "email" for proper validation and keyboard handling.
                    className={inputClasses}
                    // Applies consistent styling to the input field.
                    placeholder="Enter email"
                  // Placeholder text for the email field.
                  />
                </FormControl>
                <FormMessage />
                {/* Displays validation error messages for the email field, if any. */}
              </FormItem>
            )}
          />

          <button type="submit" className={buttonClasses}>
            {/* Submit button to trigger form submission, styled using buttonClasses */}
            Submit
          </button>
        </form>
      </Form>
    )
  );
};
const meta = {
  title: 'Templates/Form',
  component: FormComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Form Container Controls
    formClassName: {
      control: 'text',
      description: 'Base form container classes. Example: "w-full max-w-md space-x-4"',
      table: {
        category: 'Form Container',
        defaultValue: { summary: 'w-full max-w-md' },
      },
    },
    formItemSpacing: {
      control: {
        type: 'text',
      },
      description: 'Vertical spacing between form items. Predefined options: space-y-2, space-y-4, space-y-6, space-y-8, or custom value',
      table: {
        category: 'Form Container',
      },
    },

    // Form Item Controls
    formItemClassName: {
      control: 'text',
      description: 'Custom classes for form item container',
      table: {
        category: 'Form Item',
      },
    },
    formItemPadding: {
      control: {
        type: 'text',
      },
      description: 'Padding classes for form items. Example: p-4, py-2 px-4',
      table: {
        category: 'Form Item',
      },
    },
    formItemBorder: {
      control: {
        type: 'text',
      },
      description: 'Border classes for form items. Example: border-2 border-gray-200',
      table: {
        category: 'Form Item',
      },
    },
    formItemRounding: {
      control: {
        type: 'text',
      },
      description: 'Border radius classes for form items. Predefined: rounded-none, rounded-sm, rounded-md, rounded-lg, or custom',
      table: {
        category: 'Form Item',
      },
    },

    // Label Controls
    labelClassName: {
      control: 'text',
      description: 'Custom classes for form labels',
      table: {
        category: 'Label',
      },
    },
    labelSize: {
      control: {
        type: 'text',
      },
      description: 'Label text size. Predefined: text-sm, text-base, text-lg, or custom',
      table: {
        category: 'Label',
      },
    },
    labelWeight: {
      control: {
        type: 'text',
      },
      description: 'Label font weight. Predefined: font-normal, font-medium, font-semibold, or custom',
      table: {
        category: 'Label',
      },
    },

    // Input Controls
    inputClassName: {
      control: 'text',
      description: 'Custom classes for input fields',
      table: {
        category: 'Input',
      },
    },
    inputSize: {
      control: {
        type: 'text',
      },
      description: 'Input field height. Predefined: h-8, h-10, h-12, or custom value',
      table: {
        category: 'Input',
      },
    },
    inputPadding: {
      control: {
        type: 'text',
      },
      description: 'Input field padding. Predefined: px-2 py-1, px-3 py-2, px-4 py-3, or custom',
      table: {
        category: 'Input',
      },
    },
    inputBorder: {
      control: {
        type: 'text',
      },
      description: 'Input border style. Predefined: border, border-2, border-0, or custom',
      table: {
        category: 'Input',
      },
    },
    inputRounding: {
      control: {
        type: 'text',
      },
      description: 'Input border radius. Predefined: rounded-none, rounded-sm, rounded-md, rounded-lg, or custom',
      table: {
        category: 'Input',
      },
    },

    // Button Controls
    buttonClassName: {
      control: 'text',
      description: 'Custom classes for submit button',
      table: {
        category: 'Button',
      },
    },
    buttonSize: {
      control: {
        type: 'text',
      },
      description: 'Button height. Predefined: h-8, h-10, h-12, or custom value',
      table: {
        category: 'Button',
      },
    },
    buttonWidth: {
      control: {
        type: 'text',
      },
      description: 'Button width. Predefined: w-auto, w-full, or custom value',
      table: {
        category: 'Button',
      },
    },
    buttonVariant: {
      control: {
        type: 'text',
      },
      description: 'Button visual style. Options: default, outline, ghost, or custom classes',
      table: {
        category: 'Button',
      },
    },
  },
} satisfies Meta<typeof FormComponent>;

export default meta;
type Story = StoryObj<typeof FormComponent>;

/**
 * Basic form configuration with standard spacing and styling.
 * All styles can be customized through the controls.
 */
export const Basic: Story = {
  args: {
    formClassName: '',
    formItemSpacing: 'space-y-8',
    labelSize: 'text-sm',
    labelWeight: 'font-semibold',
    inputSize: 'h-10',
    inputPadding: 'px-3 py-2',
    inputBorder: 'border',
    inputRounding: 'rounded-md',
    buttonSize: 'h-10',
    buttonWidth: 'w-full',
    buttonVariant: 'default',
    labelClassName: '',
    formItemClassName: '',
    formItemRounding: '',
  },
};
/**
 * Modern, compact form design with refined spacing and rounded corners.
 * Demonstrates alternative styling options.
 */
export const Modern: Story = {
  args: {
    ...Basic.args,
    formClassName: 'w-full max-w-sm',
    formItemSpacing: 'space-y-4',
    labelSize: 'text-sm',
    labelWeight: 'font-medium',
    inputSize: 'h-9',
    inputPadding: 'px-3 py-1',
    inputRounding: 'rounded-lg',
    buttonSize: 'h-9',
    buttonWidth: 'w-full',
    buttonVariant: 'default',
  },
};

/**
 * Dense form layout with professional styling.
 * Shows how to create a compact enterprise layout.
 */
export const Enterprise: Story = {
  args: {
    ...Basic.args,
    formClassName: 'w-full max-w-lg',
    formItemSpacing: 'space-y-2',
    labelSize: 'text-sm',
    labelWeight: 'font-semibold',
    inputSize: 'h-8',
    inputPadding: 'px-2 py-1',
    inputRounding: 'rounded-sm',
    buttonSize: 'h-8',
    buttonWidth: 'w-auto',
    buttonVariant: 'outline',
  },
};
