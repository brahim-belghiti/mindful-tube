import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoUrlInput from '@/components/videoUrlInput';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => {
  mockPush.mockClear();
});

const submit = (value: string) => {
  render(<VideoUrlInput />);
  fireEvent.change(screen.getByPlaceholderText(/paste a youtube video or playlist/i), {
    target: { value },
  });
  fireEvent.click(screen.getByRole('button', { name: /watch video/i }));
};

describe('VideoUrlInput', () => {
  test('shows an error and does not navigate for an invalid URL', () => {
    submit('https://example.com/not-a-video');
    expect(screen.getByRole('alert')).toHaveTextContent(/valid YouTube video or playlist URL/i);
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('navigates to the focus view for a video URL', () => {
    submit('https://www.youtube.com/watch?v=D55ctBYF3AY');
    expect(mockPush).toHaveBeenCalledWith('/focus?id=D55ctBYF3AY');
  });

  test('navigates to the focus view for a playlist URL', () => {
    submit('https://www.youtube.com/playlist?list=PLabc123');
    expect(mockPush).toHaveBeenCalledWith('/focus?list=PLabc123');
  });

  test('passes both the video and the playlist when a URL has both', () => {
    submit('https://www.youtube.com/watch?v=D55ctBYF3AY&list=PLabc123');
    expect(mockPush).toHaveBeenCalledWith('/focus?id=D55ctBYF3AY&list=PLabc123');
  });
});
