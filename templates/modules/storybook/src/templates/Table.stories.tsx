import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Define custom props for the table
type TableStoryProps = {
  tableStyle?: string; // Styles for the table container only
  headerRowStyle?: string; // Styles for the header row
  bodyRowStyle?: string; // Styles for the body rows
  footerRowStyle?: string; // Styles for the footer row
} & React.HTMLAttributes<HTMLTableElement>;

// Correctly define the Meta object to use TableStoryProps
const meta: Meta<TableStoryProps> = {
  title: 'templates/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          A simplified table component with four main style controls:
          
          - tableStyle: Overall table container styling (border, shadow, etc.)
          - headerRowStyle: Header row styling (background, text, borders)
          - bodyRowStyle: Body rows styling (background, hover, text)
          - footerRowStyle: Footer row styling (background, text, borders)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tableStyle: {
      control: 'text',
      description: 'Container styles (border, shadow, etc.)',
    },
    headerRowStyle: {
      control: 'text',
      description: 'Header row styles (background, text, borders)',
    },
    bodyRowStyle: {
      control: 'text',
      description: 'Body row styles (background, hover effects)',
    },
    footerRowStyle: {
      control: 'text',
      description: 'Footer row styles (background, text, borders)',
    },
  },
};

export default meta;

type Story = StoryObj<TableStoryProps>;

// Sample data
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Away', role: 'Editor' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', role: 'User' },
];

const TableStory = (props: TableStoryProps) => {
  const bgColorClass = props.tableStyle?.match(/bg-[a-z]+-\d+/)?.[0] || '';

  return (
    <div className={props.tableStyle}>
      <Table>
        <TableCaption>Table Example</TableCaption>
        <TableHeader>
          <TableRow className={props.headerRowStyle}>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} className={props.bodyRowStyle}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                    row.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : row.status === 'Away'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className={`${props.footerRowStyle} ${bgColorClass}`}>
            <TableCell colSpan={4}>
              Total Entries:
              {sampleData.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

// Stories
export const Default: Story = {
  args: {
    tableStyle: 'w-full border rounded-lg shadow-sm overflow-hidden',
    headerRowStyle: 'bg-gray-50 text-gray-700 font-semibold border-b',
    bodyRowStyle: 'border-b hover:bg-gray-50 transition-colors',
    footerRowStyle: 'border-t',
  },
  render: args => <TableStory {...args} />,
};

export const Dark: Story = {
  args: {
    tableStyle: 'w-full border rounded-lg overflow-hidden bg-gray-800 text-gray-100',
    headerRowStyle: 'bg-gray-800 font-semibold border-b border-gray-700',
    bodyRowStyle: 'border-b border-gray-700 hover:bg-gray-700 transition-colors',
    footerRowStyle: 'border-t border-gray-700',
  },
  render: args => <TableStory {...args} />,
};

export const Interactive: Story = {
  args: {
    tableStyle: 'w-full rounded-lg overflow-hidden bg-emerald-600 text-white bg-black',
    headerRowStyle: 'border-b border-gray-800',
    bodyRowStyle: 'border-b border-gray-800 hover:bg-gray-900 transition-colors',
    footerRowStyle: 'border-t border-gray-800',
  },
  render: args => <TableStory {...args} />,
};
