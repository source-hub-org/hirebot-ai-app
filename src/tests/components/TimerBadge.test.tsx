import React from 'react';
import { render, screen } from '@testing-library/react';
import TimerBadge from '@/components/TimerBadge';

describe('TimerBadge', () => {
  it('renders time correctly', () => {
    render(<TimerBadge time="10:30" />);
    
    expect(screen.getByText('10:30')).toBeInTheDocument();
  });
  
  it('has the correct styling classes', () => {
    render(<TimerBadge time="10:30" />);
    
    const badge = screen.getByText('10:30').closest('.timer-badge');
    expect(badge).toHaveClass('timer-badge');
  });
});