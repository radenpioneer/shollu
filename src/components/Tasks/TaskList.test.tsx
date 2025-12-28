import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import TaskList from './TaskList';

describe('TaskList Component', () => {
  it('should render without crashing', () => {
    render(<TaskList />);
    expect(screen.getByText('Scheduled Tasks')).toBeInTheDocument();
  });

  it('should display heading', () => {
    render(<TaskList />);
    const heading = screen.getByRole('heading', { name: /scheduled tasks/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('should display placeholder message', () => {
    render(<TaskList />);
    expect(screen.getByText(/Your scheduled tasks will be displayed here/i)).toBeInTheDocument();
  });

  it('should have correct container structure', () => {
    render(<TaskList />);
    const container = screen.getByText('Scheduled Tasks').parentElement;
    expect(container).toHaveClass('space-y-6');
  });

  it('should have styled content card', () => {
    render(<TaskList />);
    const card = screen.getByText(/Your scheduled tasks/i).parentElement;
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'p-6', 'shadow-sm');
  });
});
