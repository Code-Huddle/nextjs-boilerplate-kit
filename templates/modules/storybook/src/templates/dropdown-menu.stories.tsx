import type { Meta, StoryObj } from '@storybook/react';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Settings from 'lucide-react/dist/esm/icons/settings';
import User from 'lucide-react/dist/esm/icons/user';

import type React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

type DropdownMenuDemoProps = {
  triggerVariant?: ButtonVariant;
  triggerSize?: ButtonSize;
  triggerClassName?: string;
  triggerText?: string;
  menuWidth?: string;
  menuAlign?: 'start' | 'end' | 'center';
  menuSide?: 'top' | 'right' | 'bottom' | 'left';
  showIcons?: boolean;
  showShortcuts?: boolean;
  labelClassName?: string;
  itemClassName?: string;
  separatorClassName?: string;
  contentClassName?: string;
  shortcutClassName?: string;
};

const DropdownMenuDemo: React.FC<DropdownMenuDemoProps> = ({
  triggerVariant = 'outline',
  triggerSize = 'default',
  triggerClassName,
  triggerText = 'Open Menu',
  menuWidth = 'w-56',
  menuAlign = 'start',
  menuSide = 'bottom',
  showIcons = true,
  showShortcuts = true,
  labelClassName = 'font-semibold',
  itemClassName = 'cursor-pointer',
  separatorClassName = 'bg-muted',
  contentClassName = 'rounded-md',
  shortcutClassName = 'text-muted-foreground',
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          {triggerText}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={`${menuWidth} ${contentClassName}`}
        align={menuAlign}
        side={menuSide}
      >
        <DropdownMenuLabel className={labelClassName}>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className={separatorClassName} />
        <div>
          <DropdownMenuItem className={itemClassName}>
            {showIcons && <User className="mr-2 size-4" />}
            Profile
            {showShortcuts && (
              <DropdownMenuShortcut className={shortcutClassName}>⇧⌘P</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClassName}>
            {showIcons && <CreditCard className="mr-2 size-4" />}
            Billing
            {showShortcuts && (
              <DropdownMenuShortcut className={shortcutClassName}>⌘B</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClassName}>
            {showIcons && <Settings className="mr-2 size-4" />}
            Settings
            {showShortcuts && (
              <DropdownMenuShortcut className={shortcutClassName}>⌘S</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CheckboxDropdownDemo: React.FC<DropdownMenuDemoProps> = (props) => {
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={props.triggerVariant}
          size={props.triggerSize}
          className={props.triggerClassName}
        >
          {props.triggerText || 'Preferences'}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={`${props.menuWidth} ${props.contentClassName}`}
        align={props.menuAlign}
        side={props.menuSide}
      >
        <DropdownMenuLabel className={props.labelClassName}>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator className={props.separatorClassName} />

        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
          className={props.itemClassName}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          className={props.itemClassName}
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const RadioDropdownDemo: React.FC<DropdownMenuDemoProps> = (props) => {
  const [position, setPosition] = useState('bottom');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={props.triggerVariant}
          size={props.triggerSize}
          className={props.triggerClassName}
        >
          {props.triggerText || 'Select Position'}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={`${props.menuWidth} ${props.contentClassName}`}
        align={props.menuAlign}
        side={props.menuSide}
      >
        <DropdownMenuLabel className={props.labelClassName}>Menu Position</DropdownMenuLabel>
        <DropdownMenuSeparator className={props.separatorClassName} />

        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top" className={props.itemClassName}>
            Top
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom" className={props.itemClassName}>
            Bottom
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right" className={props.itemClassName}>
            Right
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const meta: Meta<typeof DropdownMenuDemo> = {
  title: 'Templates/DropdownMenu',
  component: DropdownMenuDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully customizable dropdown menu component that supports icons, keyboard shortcuts, and flexible styling options.',
      },
    },
  },
  argTypes: {
    triggerVariant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Select one of the typed variants for the ShadCN button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'outline' },
      },
    },
    triggerSize: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Select one of the typed sizes for the ShadCN button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    triggerClassName: {
      control: 'text',
      description:
        'Any additional classes (e.g. "bg-red-500 text-white") to override the button style.',
      table: {
        type: { summary: 'string' },
      },
    },
    triggerText: {
      control: 'text',
      description: 'The text content of the trigger button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Open Menu' },
      },
    },
    menuWidth: {
      control: 'text',
      description: 'Tailwind classes to control menu width (e.g. "w-32", "w-full").',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'w-56' },
      },
    },
    menuAlign: {
      control: 'select',
      options: ['start', 'end', 'center'],
      description: 'Alignment of the menu relative to its trigger.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'start' },
      },
    },
    menuSide: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Which side the menu appears from the trigger.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'bottom' },
      },
    },
    showIcons: {
      control: 'boolean',
      description: 'Whether to show icons beside each item.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showShortcuts: {
      control: 'boolean',
      description: 'Whether to show keyboard shortcuts on the right.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    labelClassName: {
      control: 'text',
      description: 'Additional classes for the dropdown label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'font-semibold' },
      },
    },
    itemClassName: {
      control: 'text',
      description: 'Additional classes for each dropdown item.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'cursor-pointer' },
      },
    },
    separatorClassName: {
      control: 'text',
      description: 'Additional classes for the separator line.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'bg-muted' },
      },
    },
    contentClassName: {
      control: 'text',
      description: 'Additional classes for the menu content wrapper.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'rounded-md' },
      },
    },
    shortcutClassName: {
      control: 'text',
      description: 'Additional classes for the keyboard shortcut text.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text-muted-foreground' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenuDemo>;

export const Basic: Story = {
  args: {
    triggerVariant: 'outline',
    triggerSize: 'default',
    triggerText: 'Open Menu',
    menuWidth: 'w-56',
    showIcons: true,
    showShortcuts: true,
    labelClassName: 'font-semibold',
    itemClassName: 'cursor-pointer',
    separatorClassName: 'bg-muted',
    contentClassName: 'rounded-md',
    shortcutClassName: 'text-muted-foreground',
  },
};

export const WithCheckboxes: Story = {
  render: args => <CheckboxDropdownDemo {...args} />,
  args: {
    triggerText: 'Preferences',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A dropdown menu variant that includes checkbox items for toggling options.',
      },
    },
  },
};

export const WithRadioItems: Story = {
  render: args => <RadioDropdownDemo {...args} />,
  args: {
    triggerText: 'Select Position',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A dropdown menu variant that includes radio items for selecting a single option from a list.',
      },
    },
  },
};
