# Mindful Tube

Watch the video. Get back to work.

Mindful Tube is a minimalist web app that lets you watch YouTube videos (and playlists) without the recommendation feed, comments, or anything else pulling you off track. Paste a link, watch distraction-free, take notes, and leave.

---

## Features

- **Distraction-free player** — no sidebar, no recommendations, no comments
- **Playlist support** — paste a playlist URL and watch videos in order
- **Your own lists** — build named lists of videos, drag to reorder them, and play them end to end. A deliberate queue you assembled, not a feed
- **Add to a list from anywhere** — from the player while watching, or from your watch history on the home page
- **Built-in markdown notes** — write notes alongside the video with a full MDX editor
- **Clickable timestamps** — insert the current video timestamp into your notes; click it in preview to seek
- **Auto-save** — notes are saved automatically to `localStorage`, keyed per video
- **Export notes** — download your notes as a `.md` file named after the video title
- **Watch history** — your last 10 videos are shown on the home page
- **Resizable notes panel** — drag to resize, or collapse it entirely
- **Dark / light mode** — system-aware with a manual toggle
- **Keyboard shortcuts** — `Ctrl+S` save · `Ctrl+E` collapse panel · `Ctrl+P` toggle preview
- **"Done" page** — a finish screen with your notes after the video ends
- **PWA** — installable as a standalone app

---

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- [React](https://react.dev/) 19
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v3
- [MDXEditor](https://mdxeditor.dev/) — rich markdown editing
- [react-youtube](https://github.com/tjallingt/react-youtube) — YouTube player wrapper
- [marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/DOMPurify) — safe markdown preview
- [lucide-react](https://lucide.dev/) — icons

---

## Getting started

```bash
# install dependencies
npm install

# run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# build for production
npm run build
npm start

# run tests
npm test
```

---

## Usage

1. Paste a YouTube video or playlist URL on the home page
2. Watch the video in the focus view — notes panel is on the right
3. Use the **Timestamp** button to capture moments linked to the video position
4. When you're done, you land on the finish page where you can review your notes
5. Click **Watch another video** to go again

---

## Screenshots



<img width="1920" height="1080" alt="Screenshot From 2026-06-11 21-58-54" src="https://github.com/user-attachments/assets/a308a034-afec-4c93-a0a9-c532020e8163" />
<img width="1920" height="1080" alt="Screenshot From 2026-06-11 21-57-28" src="https://github.com/user-attachments/assets/71be9bb3-6573-4485-98dd-35032bcd043a" />



---

## License

MIT
