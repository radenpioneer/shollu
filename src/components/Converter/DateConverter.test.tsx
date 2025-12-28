import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import DateConverter from './DateConverter';

describe('DateConverter Component', () => {
  it('should render without crashing', () => {
    render(<DateConverter />);
    expect(screen.getByText('Date Converter')).toBeInTheDocument();
  });

  it('should display heading', () => {
    render(<DateConverter />);
    const heading = screen.getByRole('heading', { name: /date converter/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('should display placeholder message', () => {
    render(<DateConverter />);
    expect(screen.getByText(/Hijri ↔ Gregorian date converter/i)).toBeInTheDocument();
  });

  it('should have correct container structure', () => {
    render(<DateConverter />);
    const container = screen.getByText('Date Converter').parentElement;
    expect(container).toHaveClass('space-y-6');
  });

  it('should have styled content card', () => {
    render(<DateConverter />);
    const card = screen.getByText(/Hijri ↔ Gregorian/i).parentElement;
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'p-6', 'shadow-sm');
  });
});
