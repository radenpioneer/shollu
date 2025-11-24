import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import AboutDialog from './AboutDialog';

describe('AboutDialog Component', () => {
  it('should render without crashing', () => {
    render(<AboutDialog />);
    expect(screen.getByText('About Shollu')).toBeInTheDocument();
  });

  it('should display main heading', () => {
    render(<AboutDialog />);
    const heading = screen.getByRole('heading', { name: /about shollu/i, level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('should display version number', () => {
    render(<AboutDialog />);
    expect(screen.getByText('Shollu v4.0.0')).toBeInTheDocument();
  });

  it('should display subtitle', () => {
    render(<AboutDialog />);
    expect(screen.getByText('Islamic Prayer Time Reminder')).toBeInTheDocument();
  });

  it('should display description', () => {
    render(<AboutDialog />);
    expect(
      screen.getByText(/A modern, cross-platform prayer time reminder application/i)
    ).toBeInTheDocument();
  });

  it('should display original author credit', () => {
    render(<AboutDialog />);
    expect(screen.getByText(/Original Shollu © 2005-2012 Ebta Setiawan/i)).toBeInTheDocument();
  });

  it('should display rewrite credit', () => {
    render(<AboutDialog />);
    expect(screen.getByText(/Rewrite © 2024/i)).toBeInTheDocument();
  });

  it('should have correct container structure', () => {
    render(<AboutDialog />);
    const container = screen.getByText('About Shollu').parentElement;
    expect(container).toHaveClass('space-y-6');
  });

  it('should have styled content card', () => {
    render(<AboutDialog />);
    const card = screen.getByText('Shollu v4.0.0').closest('.bg-white');
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'p-6', 'shadow-sm');
  });

  it('should have proper heading hierarchy', () => {
    render(<AboutDialog />);
    const mainHeading = screen.getByRole('heading', { level: 2 });
    const versionHeading = screen.getByRole('heading', { level: 3 });

    expect(mainHeading).toBeInTheDocument();
    expect(versionHeading).toBeInTheDocument();
  });

  it('should have multiple sections with spacing', () => {
    render(<AboutDialog />);
    const innerContainer = screen.getByText('Shollu v4.0.0').closest('.space-y-4');
    expect(innerContainer).toBeInTheDocument();
  });
});
