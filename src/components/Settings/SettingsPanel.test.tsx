import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import SettingsPanel from './SettingsPanel';

describe('SettingsPanel Component', () => {
  it('should render without crashing', () => {
    render(<SettingsPanel />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should display heading', () => {
    render(<SettingsPanel />);
    const heading = screen.getByRole('heading', { name: /^settings$/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('should display placeholder message', () => {
    render(<SettingsPanel />);
    expect(screen.getByText(/Application settings will be displayed here/i)).toBeInTheDocument();
  });

  it('should have correct container structure', () => {
    render(<SettingsPanel />);
    const container = screen.getByText('Settings').parentElement;
    expect(container).toHaveClass('space-y-6');
  });

  it('should have styled content card', () => {
    render(<SettingsPanel />);
    const card = screen.getByText(/Application settings/i).parentElement;
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'p-6', 'shadow-sm');
  });
});
