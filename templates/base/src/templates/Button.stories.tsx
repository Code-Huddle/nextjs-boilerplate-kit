import type { Meta, StoryObj } from '@storybook/react';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Plus from 'lucide-react/dist/esm/icons/plus';
import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * The Button component is a fundamental UI element that follows the shadcn design system.
 * It supports multiple variants, sizes, and states to accommodate different use cases.
 */
const meta = {
  title: 'Templates/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Overview
A versatile button component that serves as a core building block for user interactions.
It supports multiple variants, sizes, and states with full keyboard navigation and focus management.

## Features
- Multiple style variants (default, destructive, outline, secondary, ghost, link)
- Four sizes (default, sm, lg, icon)
- Support for icons and loading states
- Full keyboard navigation
- Focus management
- Custom styling support via className

## Usage Guidelines
- Use \`default\` variant for primary actions
- Use \`destructive\` for dangerous actions
- Use \`outline\` or \`ghost\` for secondary actions
- Include clear, action-oriented text
- Add icons when they enhance meaning (*****PLEASE NOTE THAT ADD LESS CONTENT WHEN YOU ARE USING THE ICONS AND THEN CHECK THE ICONS*******)
- Maintain consistent sizing within views

## Accessibility
- Keyboard navigable
- Clear focus states
- Proper ARIA labels for icon buttons
- Loading state management
`,
      },
    },
  },
  argTypes: {
    variant: {
      description: 'The visual style of the button',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      control: { type: 'select' },
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      description: 'The size of the button',
      options: ['default', 'sm', 'lg', 'icon'],
      control: { type: 'select' },
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      description: 'Whether the button is disabled',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      description: 'The content of the button',
      control: 'text',
    },
    asChild: {
      description: 'Whether to render as a child component using Radix Slot',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

// Basic Template
const Template: Story = {
  render: args => <Button {...args} />,
};

export const Default = {
  ...Template,
  args: {
    children: 'Default Button',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'The primary button style, used for main actions.',
      },
    },
  },
};

export const Destructive = {
  ...Template,
  args: {
    children: 'Destructive Button',
    variant: 'destructive',
  },
  parameters: {
    docs: {
      description: {
        story: 'Used for destructive actions that require user attention.',
      },
    },
  },
};

export const Outline = {
  ...Template,
  args: {
    children: 'Outline Button',
    variant: 'outline',
    className: 'rounded-full',
  },
  parameters: {
    docs: {
      description: {
        story: 'A subtle button style for secondary actions.',
      },
    },
  },
};

export const Secondary = {
  ...Template,
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Alternative primary action style.',
      },
    },
  },
};

export const Ghost = {
  ...Template,
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal button style for subtle actions.',
      },
    },
  },
};

export const Link = {
  ...Template,
  args: {
    children: 'Link Style Button',
    variant: 'link',
  },
  parameters: {
    docs: {
      description: {
        story: 'Appears and behaves like a hyperlink.',
      },
    },
  },
};

export const Small = {
  ...Template,
  args: {
    children: 'Small Button',
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact size for tight spaces.',
      },
    },
  },
};

export const Large = {
  ...Template,
  args: {
    children: 'Large Button',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Larger size for prominent actions.',
      },
    },
  },
};

export const WithIcon = {
  ...Template,
  args: {
    children: (
      <>
        <Mail className="mr-2 size-4" />
        Login with Email
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with an icon for enhanced visual communication.',
      },
    },
  },
};

export const IconOnly = {
  ...Template,
  args: {
    'children': <Plus className="size-4" />,
    'size': 'icon',
    'aria-label': 'Add item',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only button with proper accessibility label.',
      },
    },
  },
};

export const Disabled = {
  ...Template,
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button in disabled state.',
      },
    },
  },
};

export const Loading = {
  ...Template,
  args: {
    children: (
      <>
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading
      </>
    ),
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with spinner animation.',
      },
    },
  },
};
