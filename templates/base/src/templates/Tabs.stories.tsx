import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Define interface for custom props
type TabsStoryProps = {
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  gap?: string;
  headingClassName?: string;
  textClassName?: string;
} & React.ComponentProps<typeof Tabs>;

const meta = {
  title: 'Templates/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A set of layered sections of content that are displayed one at a time.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The value of the tab that should be active when initially rendered.',
    },
    className: {
      control: 'text',
      description: 'Custom classes for the root tabs container.',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<TabsStoryProps>;

export const Default: Story = {
  args: {
    defaultValue: 'password',
    className: '',
    tabsListClassName: 'text-yellow-400',
    tabsTriggerClassName: '',
    tabsContentClassName: '',
    gap: '',
    headingClassName: 'text-lg font-medium',
    textClassName: 'text-sm text-muted-foreground',
  },

  render: ({
    defaultValue,
    className,
    tabsListClassName,
    tabsTriggerClassName,
    tabsContentClassName,
    gap,
    headingClassName,
    textClassName,
    ...args
  }) => (
    <Tabs defaultValue={defaultValue} className={className} {...args}>
      <TabsList className={tabsListClassName}>
        <TabsTrigger value="account" className={tabsTriggerClassName}>Account</TabsTrigger>
        <TabsTrigger value="password" className={tabsTriggerClassName}>Password</TabsTrigger>
        <TabsTrigger value="settings" className={tabsTriggerClassName}>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className={cn(tabsContentClassName, gap)}>
        <div className="space-y-4">
          <h3 className={headingClassName}>Account Settings</h3>
          <p className={textClassName}>
            Manage your account settings and preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password" className={cn(tabsContentClassName, gap)}>
        <div className="space-y-4">
          <h3 className={headingClassName}>Password Settings</h3>
          <p className={textClassName}>
            Change your password and security preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className={cn(tabsContentClassName, gap)}>
        <div className="space-y-4">
          <h3 className={headingClassName}>General Settings</h3>
          <p className={textClassName}>
            Configure your general application settings.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  args: {
    ...Default.args,
    className: 'flex gap-6',
    tabsListClassName: 'flex-col h-auto',
    defaultValue: 'tab1',
  },

  render: ({
    defaultValue,
    className,
    tabsListClassName,
    tabsTriggerClassName,
    tabsContentClassName,
    gap,
    headingClassName,
    textClassName,
    ...args
  }) => (
    <Tabs defaultValue={defaultValue} className={className} {...args}>
      <TabsList className={tabsListClassName}>
        <TabsTrigger value="tab1" className={tabsTriggerClassName}>Tab 1</TabsTrigger>
        <TabsTrigger value="tab2" className={tabsTriggerClassName}>Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" className={tabsTriggerClassName}>Tab 3</TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="tab1" className={cn(tabsContentClassName, gap)}>
          <h3 className={headingClassName}>Content for Tab 1</h3>
          <p className={textClassName}>This is the content for Tab 1.</p>
        </TabsContent>
        <TabsContent value="tab2" className={cn(tabsContentClassName, gap)}>
          <h3 className={headingClassName}>Content for Tab 2</h3>
          <p className={textClassName}>This is the content for Tab 2.</p>
        </TabsContent>
        <TabsContent value="tab3" className={cn(tabsContentClassName, gap)}>
          <h3 className={headingClassName}>Content for Tab 3</h3>
          <p className={textClassName}>This is the content for Tab 3.</p>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

export const CustomStyledTabs: Story = {
  args: {
    ...Default.args,
    className: 'w-[400px]',
    tabsListClassName: 'grid w-full grid-cols-3',
    defaultValue: 'music',
  },
  render: ({
    defaultValue,
    className,
    tabsListClassName,
    tabsTriggerClassName,
    tabsContentClassName,
    gap,
    headingClassName,
    textClassName,
    ...args
  }) => (
    <Tabs defaultValue={defaultValue} className={className} {...args}>
      <TabsList className={tabsListClassName}>
        <TabsTrigger value="music" className={tabsTriggerClassName}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 size-4"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          Music
        </TabsTrigger>
        <TabsTrigger value="photos" className={tabsTriggerClassName}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 size-4"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          Photos
        </TabsTrigger>
        <TabsTrigger value="videos" className={tabsTriggerClassName}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 size-4"
          >
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </svg>
          Videos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="music" className={cn(tabsContentClassName, gap)}>
        <h3 className={headingClassName}>Music Library</h3>
        <p className={textClassName}>
          Access and manage your music collection.
        </p>
      </TabsContent>
      <TabsContent value="photos" className={cn(tabsContentClassName, gap)}>
        <h3 className={headingClassName}>Photo Gallery</h3>
        <p className={textClassName}>
          View and organize your photo collection.
        </p>
      </TabsContent>
      <TabsContent value="videos" className={cn(tabsContentClassName, gap)}>
        <h3 className={headingClassName}>Video Library</h3>
        <p className={textClassName}>
          Browse and manage your video content.
        </p>
      </TabsContent>
    </Tabs>
  ),
};
