import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import ScheduleView from './ScheduleView';

describe('ScheduleView Component', () => {
  it('should render without crashing', () => {
    render(<ScheduleView />);
    expect(screen.getByText('Prayer Schedule')).toBeInTheDocument();
  });

  it('should display heading', () => {
    render(<ScheduleView />);
    const heading = screen.getByRole('heading', { name: /prayer schedule/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('should display placeholder message', () => {
    render(<ScheduleView />);
    expect(screen.getByText(/Schedule for yesterday, today, and tomorrow/i)).toBeInTheDocument();
  });

  it('should have correct container structure', () => {
    render(<ScheduleView />);
    const container = screen.getByText('Prayer Schedule').parentElement;
    expect(container).toHaveClass('space-y-6');
  });

  it('should have styled content card', () => {
    render(<ScheduleView />);
    const card = screen.getByText(/Schedule for yesterday/i).parentElement;
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'p-6', 'shadow-sm');
  });
});
