import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizCard from '@/components/QuizCard';

describe('QuizCard', () => {
  it('renders children correctly', () => {
    render(
      <QuizCard>
        <div data-testid="test-child">Test Content</div>
      </QuizCard>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('has the correct styling classes', () => {
    render(
      <QuizCard>
        <div>Test Content</div>
      </QuizCard>
    );
    
    const card = screen.getByText('Test Content').closest('.quiz-card');
    expect(card).toHaveClass('quiz-card');
  });
});