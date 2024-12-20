import { render, screen, fireEvent } from '@testing-library/react';
import VideoUrlInput from '@/components/videoUrlInput';
import { validYoutbeUrlLink } from '@/lib/utils';

// Mock the validYoutbeUrlLink function
jest.mock('@/lib/utils', () => ({
  validYoutbeUrlLink: jest.fn(),
}));

describe('VideoUrlInput', () => {
  test('shows error message for invalid URL', () => {
    (validYoutbeUrlLink as jest.Mock).mockReturnValue('');
    
    render(<VideoUrlInput />);
    const inputElement = screen.getByPlaceholderText(/Paste your YouTube video link/i);
    const buttonElement = screen.getByRole('button', { name: /Submit/i });
    
    fireEvent.change(inputElement, { target: { value: 'https://invalid-url' } });
    fireEvent.click(buttonElement);
    
    expect(screen.getByText(/Invalid YouTube URL/i)).toBeInTheDocument();
  });

  test('shows success message for valid URL and triggers redirection', () => {
    (validYoutbeUrlLink as jest.Mock).mockReturnValue('D55ctBYF3AY');
    
    render(<VideoUrlInput />);
    const inputElement = screen.getByPlaceholderText(/Paste your YouTube video link/i);
    const buttonElement = screen.getByRole('button', { name: /Submit/i });
    
    fireEvent.change(inputElement, { target: { value: 'https://www.youtube.com/watch?v=D55ctBYF3AY' } });
    fireEvent.click(buttonElement);
    
    expect(screen.getByText(/valid YouTube URL. You will be redirected shortly/i)).toBeInTheDocument();
  });
});
