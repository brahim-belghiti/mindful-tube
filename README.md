# Mindful Tube

Watch the video. Get back to work.

Mindful Tube is a minimalist web app that lets you watch YouTube videos (and playlists) without the recommendation feed, comments, or anything else pulling you off track. Paste a link, watch distraction-free, take notes, and leave.

---

## Features

- **Distraction-free player** — no sidebar, no recommendations, no comments
- **Playlist support** — paste a playlist URL and watch videos in order
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

![homepage](https://user-images.githubusercontent.com/91473510/196261828-404631b0-d639-40d4-958f-38f089a33a3d.png)
![homepage dark](https://user-images.githubusercontent.com/91473510/196261941-81003729-c416-4572-89c2-0af2f3f8cfd3.png)
![focus view](https://user-images.githubusercontent.com/91473510/175263261-fb279205-dd05-45ac-afc9-1c8ebd68791f.png)
![done page](https://user-images.githubusercontent.com/91473510/175609692-85806950-fa61-4970-b57a-257588632141.png)

---

## License

MIT
