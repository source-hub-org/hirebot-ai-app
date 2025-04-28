import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizOption from "@/components/QuizOption";

describe("QuizOption", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it("renders option text correctly", () => {
    render(
      <QuizOption
        id="a"
        text="Test Option"
        isSelected={false}
        onSelect={mockOnSelect}
      />,
    );

    expect(screen.getByText("Test Option")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", () => {
    render(
      <QuizOption
        id="a"
        text="Test Option"
        isSelected={false}
        onSelect={mockOnSelect}
      />,
    );

    fireEvent.click(screen.getByText("Test Option"));
    expect(mockOnSelect).toHaveBeenCalledWith("a");
  });

  it("shows selected state when isSelected is true", () => {
    render(
      <QuizOption
        id="a"
        text="Test Option"
        isSelected={true}
        onSelect={mockOnSelect}
      />,
    );

    const option = screen.getByText("Test Option").closest(".quiz-option");
    expect(option).toHaveClass("border-2");
    expect(option).toHaveClass("border-primary");
  });

  it("shows unselected state when isSelected is false", () => {
    render(
      <QuizOption
        id="a"
        text="Test Option"
        isSelected={false}
        onSelect={mockOnSelect}
      />,
    );

    const option = screen.getByText("Test Option").closest(".quiz-option");
    expect(option).toHaveClass("border");
    expect(option).toHaveClass("border-gray-200");
  });
});
