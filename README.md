# Barca OS

Barca OS is a fan-made, browser-based desktop experience styled for FC Barcelona. It simulates a lightweight operating system UI in the browser with draggable windows, a taskbar, desktop icons, and multiple mini-apps.

## Features

- Desktop environment with app icons and a taskbar
- Clickable apps:
  - Terminal
  - Notepad
  - Calculator
  - Browser
  - Chess
  - Snake
  - Settings
- Window controls: minimize, maximize, close, drag
- Theme toggle between light and dark modes
- Custom wallpaper support and wallpaper presets
- Simple terminal commands for fun responses
- Persistent wallpaper and note storage using `localStorage`

## Files

- `index.html` - Main HTML shell for the desktop UI and app icons
- `style.css` - Visual styling, theme definitions, taskbar layout, window appearance
- `script.js` - Application logic for spawning windows, app content, interactions, and game logic

## Usage

1. Open `index.html` in a web browser.
2. Click any desktop icon to launch the corresponding app.
3. Use the taskbar to switch between open apps.
4. Right-click on the desktop for a context menu with wallpaper and theme options.

## Notes

- The browser app loads external pages inside an `iframe`.
- The terminal includes built-in commands like `help`, `date`, `neofetch`, and `barca`.
- The notepad auto-saves content locally.
- Drag windows by their title bar.

## Development

No build tools are required. This project is plain HTML, CSS, and JavaScript.

To run locally, just open `index.html` in your browser.
