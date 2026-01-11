# 🎵 Groove

A stunning, glassmorphic music player built with **React** and **Framer Motion**. Groove creates an immersive listening experience by dynamically fetching audio, synced-style lyrics, and high-resolution album art, all wrapped in a modern, cinematic UI.

![Project Preview](![alt text](/image.png))
*(Note: Replace the image link above with an actual screenshot of your application)*

## ✨ Features

* **Cinematic Visuals:** The background dynamically adapts to the album art of the current track, heavily blurred for a moody, immersive feel.
* **Spinning Vinyl Controller:** A unique, floating playback control that features the album art on a spinning record. It serves as the primary play/pause toggle, ensuring seamless mobile compatibility.
* **Smart Search:** Uses the **iTunes Search API** as a "middleman" to autocorrect typos and normalize metadata (e.g., converting "do i wanna know" to "Do I Wanna Know? - Arctic Monkeys") before fetching lyrics.
* **Glassmorphism UI:** Sleek, translucent search bar and interface elements that blur the background behind them.
* **Lyrics Display:** Clean, readable lyrics with premium typography and scrolling support.
* **Mobile Optimized:** Handles mobile autoplay restrictions gracefully using the vinyl interaction model.
* **Developer Friendly:** Includes a built-in **"Mock Mode"** to develop the UI without burning YouTube API quota.

## 🛠️ Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **APIs:**
    * **YouTube Data API v3:** For audio/video playback.
    * **Lyrics.ovh:** For fetching song lyrics.
    * **iTunes Search API:** For metadata normalization and fuzzy search.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone [https://github.com/yourusername/groove.git](https://github.com/yourusername/groove.git)
cd groove
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment Variables
Create a .env file in the root of your project folder
```bash
touch .env
```

### 4. Add your Youtube data API Key to the env file
```bash
VITE_GOOGLE_API_KEY=your_youtube_api_key_here
```
Important: Ensure your API key has the YouTube Data API v3 service enabled in the Google Cloud Console.

### 5. Run the development Server
```bash
npm run dev
```