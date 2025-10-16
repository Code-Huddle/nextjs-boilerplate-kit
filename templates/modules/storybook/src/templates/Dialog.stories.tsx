import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Interface for style controls
type DialogStyles = {
  trigger: string;
  content: string;
  header: string;
  title: string;
  description: string;
  body: string;
  footer: string;
  closeButton: string;
};

// Extend the DialogProps type to include our style controls
type ExtendedDialogProps = {
  styles?: DialogStyles;
  nestedStyles?: DialogStyles;
} & React.ComponentProps<typeof Dialog>;

const meta: Meta<ExtendedDialogProps> = {
  title: 'Templates/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog that interrupts the user with important content and expects a response.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Dialog root level props
    defaultOpen: {
      control: 'boolean',
      description: 'The open state of the dialog when it is initially rendered',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    modal: {
      control: 'boolean',
      description: 'Whether to block keyboard/mouse interaction with content outside the dialog',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    // Style controls for all sub-components
    styles: {
      control: 'object',
      description: 'Custom className strings for each component',
    },
  },
};

export default meta;
type Story = StoryObj<ExtendedDialogProps>;

// Default styles object to avoid repetition
const defaultStyles: DialogStyles = {
  trigger: '',
  content: '',
  header: '',
  title: '',
  description: '',
  body: '',
  footer: '',
  closeButton: '',
};

/**
 * Basic usage of the Dialog component with default styling.
 */
export const Default: Story = {
  args: {
    styles: {
      ...defaultStyles,
      content: 'sm:max-w-[425px]',
      body: 'py-4',
    },
  },
  render: ({ styles = defaultStyles, ...args }) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline" className={styles.trigger}>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>Example Dialog</DialogTitle>
          <DialogDescription className={styles.description}>
            This is a basic example of the Dialog component with default styling.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.body}>
          Your main content goes here.
        </div>
        <DialogFooter className={styles.footer}>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Customized dialog with different widths, padding, and colors.
 */
export const Customized: Story = {
  args: {
    styles: {
      ...defaultStyles,
      content: 'max-w-[800px] p-8 bg-slate-50',
      header: 'space-y-3',
      title: 'text-2xl font-bold text-primary',
      description: 'text-base',
      body: 'py-6',
      footer: 'gap-2',
    },

    defaultOpen: false,
    modal: false,
  },
  render: ({ styles = defaultStyles, ...args }) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button className={styles.trigger}>Custom Styled Dialog</Button>
      </DialogTrigger>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>
            Customized Dialog
          </DialogTitle>
          <DialogDescription className={styles.description}>
            This dialog demonstrates custom styling possibilities.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.body}>
          Content with custom padding and width.
        </div>
        <DialogFooter className={styles.footer}>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * A smaller dialog suitable for simple confirmations or alerts.
 */
export const Compact: Story = {
  args: {
    styles: {
      ...defaultStyles,
      content: 'max-w-sm p-4',
      footer: 'mt-4',
    },
  },
  render: ({ styles = defaultStyles, ...args }) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline" className={styles.trigger}>Show Compact Dialog</Button>
      </DialogTrigger>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>Confirm Action</DialogTitle>
          <DialogDescription className={styles.description}>
            Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={styles.footer}>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * A full-width dialog suitable for complex forms or detailed content.
 */
export const FullWidth: Story = {
  args: {
    styles: {
      ...defaultStyles,
      content: 'max-w-full m-4',
      body: 'grid grid-cols-2 gap-4 py-4',
    },
  },
  render: ({ styles = defaultStyles, ...args }) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button className={styles.trigger}>Open Full Width</Button>
      </DialogTrigger>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>Full Width Dialog</DialogTitle>
          <DialogDescription className={styles.description}>
            This dialog uses the maximum available width while maintaining margins.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.body}>
          <div className="rounded border p-4">Left content</div>
          <div className="rounded border p-4">Right content</div>
        </div>
        <DialogFooter className={styles.footer}>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Shows how to create nested dialogs.
 */
export const Nested: Story = {
  args: {
    styles: {
      ...defaultStyles,
      body: 'py-4',
    },

    nestedStyles: {
      ...defaultStyles,
      content: 'sm:max-w-[425px]',
    },

    defaultOpen: false,
    modal: false,
  },
  argTypes: {
    nestedStyles: {
      control: 'object',
      description: 'Custom className strings for nested dialog components',
    },
  },
  render: ({ styles = defaultStyles, nestedStyles = defaultStyles, ...args }) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button className={styles.trigger}>Open First Dialog</Button>
      </DialogTrigger>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>First Dialog</DialogTitle>
          <DialogDescription className={styles.description}>
            This dialog contains another dialog.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.body}>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className={nestedStyles.trigger}>Open Nested Dialog</Button>
            </DialogTrigger>
            <DialogContent className={nestedStyles.content}>
              <DialogHeader className={nestedStyles.header}>
                <DialogTitle className={nestedStyles.title}>Nested Dialog</DialogTitle>
                <DialogDescription className={nestedStyles.description}>
                  This is a dialog inside another dialog.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className={nestedStyles.footer}>
                <Button>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  ),
};
