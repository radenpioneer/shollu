import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Custom render function for testing React components.
 * Wraps components with necessary providers if needed.
 *
 * @param ui - React element to render
 * @param options - Render options
 * @returns Render result with queries
 */
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return render(ui, { ...options });
};

export * from '@testing-library/react';
export { customRender as render };
