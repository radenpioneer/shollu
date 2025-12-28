import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import App from './App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByText('Shollu')).toBeInTheDocument();
  });

  it('should render AppLayout', () => {
    render(<App />);

    // Check for key elements from AppLayout
    expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });

  it('should render sidebar navigation', () => {
    render(<App />);
    expect(screen.getAllByText('Prayer Times').length).toBeGreaterThan(0);
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render header with clock', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should render main content area', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
