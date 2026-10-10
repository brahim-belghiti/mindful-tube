import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlaylistPanel, { PlaylistEntry } from '@/components/playlistPanel';

const entries: PlaylistEntry[] = [
  { videoId: 'aaaaaaaaaaa', title: 'First video' },
  { videoId: 'bbbbbbbbbbb', title: 'Second video' },
  { videoId: 'ccccccccccc' },
];

const noop = () => {};

describe('PlaylistPanel', () => {
  test('renders nothing while closed', () => {
    const { container } = render(
      <PlaylistPanel open={false} entries={entries} index={0} onSelect={noop} onClose={noop} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('lists titles and marks the current video', () => {
    render(<PlaylistPanel open entries={entries} index={1} onSelect={noop} onClose={noop} />);
    expect(screen.getByText('First video')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /second video/i })).toHaveAttribute(
      'aria-current',
      'true'
    );
    expect(screen.getByRole('button', { name: /first video/i })).not.toHaveAttribute('aria-current');
  });

  test('falls back to provided titles then the video id', () => {
    render(
      <PlaylistPanel
        open
        entries={entries}
        index={0}
        onSelect={noop}
        onClose={noop}
        titles={{ ccccccccccc: 'Third from cache' }}
      />
    );
    expect(screen.getByText('Third from cache')).toBeInTheDocument();
  });

  test('selecting a row reports its index and closes', () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    render(<PlaylistPanel open entries={entries} index={0} onSelect={onSelect} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /second video/i }));
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(onClose).toHaveBeenCalled();
  });

  test('closes on Escape and via the close button', () => {
    const onClose = jest.fn();
    render(<PlaylistPanel open entries={entries} index={0} onSelect={noop} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getAllByRole('button', { name: /close playlist/i })[0]);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
