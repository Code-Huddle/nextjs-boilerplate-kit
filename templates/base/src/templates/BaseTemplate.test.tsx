import { render, screen } from '@testing-library/react';
import { BaseTemplate } from './BaseTemplate';

describe('BaseTemplate', () => {
  it('renders page content', () => {
    render(<BaseTemplate leftNav={null}>Dashboard content</BaseTemplate>);
    expect(screen.getByRole('main')).toHaveTextContent('Dashboard content');
  });
});
