import { render, screen } from '@testing-library/react';
import { KpiCard } from '../KpiCard';
import { describe, it, expect } from 'vitest';

describe('KpiCard', () => {
  const mockProps = {
    title: 'Test KPI',
    value: '100',
    change: 10,
    icon: <span data-testid="test-icon">Icon</span>,
    color: 'bg-blue-500',
  };

  it('renders the KPI card with correct content', () => {
    render(<KpiCard {...mockProps} />);

    expect(screen.getByText('Test KPI')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('displays positive change correctly', () => {
    render(<KpiCard {...mockProps} change={15} />);

    expect(screen.getByText('+15')).toBeInTheDocument();
  });

  it('displays negative change correctly', () => {
    render(<KpiCard {...mockProps} change={-5} />);

    expect(screen.getByText('-5')).toBeInTheDocument();
  });

  it('applies the correct background color', () => {
    render(<KpiCard {...mockProps} />);

    const card = screen.getByRole('article');
    expect(card).toHaveClass('bg-blue-500');
  });

  it('renders without change value', () => {
    const propsWithoutChange: {
      title: string;
      value: string;
      change?: number;
      icon: JSX.Element;
      color: string;
    } = { ...mockProps };
    delete propsWithoutChange.change;

    render(<KpiCard {...propsWithoutChange} />);

    expect(screen.getByText('Test KPI')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.queryByText(/[+-]\d+/)).not.toBeInTheDocument();
  });
});
