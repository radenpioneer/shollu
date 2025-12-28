import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names', () => {
    const result = cn('px-2 py-1', 'text-red-500');
    expect(result).toBe('px-2 py-1 text-red-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should handle false conditional classes', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class');
  });

  it('should resolve Tailwind conflicts (last class wins)', () => {
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('should handle multiple conflicting classes', () => {
    const result = cn('text-red-500', 'text-blue-500', 'text-green-500');
    expect(result).toBe('text-green-500');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['px-2', 'py-1'], 'text-red-500');
    expect(result).toBe('px-2 py-1 text-red-500');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'base-class': true,
      'active-class': true,
      'disabled-class': false,
    });
    expect(result).toBe('base-class active-class');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'other-class');
    expect(result).toBe('base-class other-class');
  });

  it('should handle complex mixed inputs', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn(
      'base-class',
      ['px-2', 'py-1'],
      {
        'active-class': isActive,
        'disabled-class': isDisabled,
      },
      isActive && 'conditional-class',
      'px-4' // Should override px-2
    );
    expect(result).toContain('base-class');
    expect(result).toContain('py-1');
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
    expect(result).toContain('active-class');
    expect(result).not.toContain('disabled-class');
    expect(result).toContain('conditional-class');
  });
});
