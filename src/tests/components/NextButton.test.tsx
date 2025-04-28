import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NextButton from "@/components/NextButton";

describe("NextButton", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders "Câu tiếp theo" text when not last question', () => {
    render(
      <NextButton
        onClick={mockOnClick}
        disabled={false}
        isLastQuestion={false}
      />,
    );

    expect(screen.getByText("Câu tiếp theo")).toBeInTheDocument();
  });

  it('renders "Nộp bài" text when is last question', () => {
    render(
      <NextButton
        onClick={mockOnClick}
        disabled={false}
        isLastQuestion={true}
      />,
    );

    expect(screen.getByText("Nộp bài")).toBeInTheDocument();
  });

  it("calls onClick when clicked and not disabled", () => {
    render(
      <NextButton
        onClick={mockOnClick}
        disabled={false}
        isLastQuestion={false}
      />,
    );

    fireEvent.click(screen.getByText("Câu tiếp theo"));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("does not call onClick when clicked and disabled", () => {
    render(
      <NextButton
        onClick={mockOnClick}
        disabled={true}
        isLastQuestion={false}
      />,
    );

    fireEvent.click(screen.getByText("Câu tiếp theo"));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("has disabled styling when disabled", () => {
    render(
      <NextButton
        onClick={mockOnClick}
        disabled={true}
        isLastQuestion={false}
      />,
    );

    const button = screen.getByText("Câu tiếp theo");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });
});
