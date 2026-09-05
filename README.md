# Simple Calculator

A beginner-friendly calculator website made with only HTML, CSS, and JavaScript. It runs entirely in a browser—no backend, installation, framework, or library is needed—so it is compatible with GitHub Pages.

## Project Structure

```
Simple-Calculator/
├── index.html
├── style.css
├── script.js
└── README.md
```

- `index.html` creates the display, calculator keys, memory controls, theme button, and history area.
- `style.css` controls layout, colours, responsive design, and the dark theme.
- `script.js` reacts to button and keyboard input, performs calculations, saves history and memory, and updates the page.
- `README.md` explains the project.

## Features

- Addition, subtraction, multiplication, division, and decimal numbers
- Powers (`xʸ`), square root (`√`), and percentage (`%`)
- Keyboard input
- Light and dark theme switch (the choice is remembered)
- Up to ten saved calculation-history entries (the history is remembered)
- Memory controls: **MC** clears memory, **MR** recalls it, **M+** adds to it, and **M−** subtracts from it
- Friendly error handling for division by zero, negative square roots, non-finite results, and extremely large results

## How the Calculator Works

The JavaScript stores the current display value, first number, selected operator, and whether it is waiting for a second number. When you press `=`, it uses those values to calculate a result and adds a readable equation to the history.

The calculator uses browser `localStorage` for the history, memory value, and theme choice. That means they normally remain available after refreshing the page, but they stay only in the current browser.

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `0`–`9`, `.` | Enter numbers and decimals |
| `+`, `-`, `*`, `/`, `^` | Choose an operation |
| `Enter` or `=` | Calculate |
| `%` | Convert the current number to a percentage |
| `S` | Square root |
| `C` or `Esc` | Clear |

## How to Run Locally

1. Open the `Simple-Calculator` folder.
2. Double-click `index.html`, or open it from a browser.
3. Use the on-screen keys or keyboard shortcuts.

To deploy with GitHub Pages, upload the folder to a repository and set GitHub Pages to publish from the branch and folder that contains `index.html`.

## What You Can Learn

- HTML page structure and accessible labels
- CSS Grid, custom properties, media queries, and theme styling
- JavaScript variables, functions, conditionals, events, and DOM updates
- Application state: remembering a multi-step calculation
- `data-*` attributes for connecting buttons to JavaScript actions
- `localStorage` for simple browser-side persistence

## Future Improvements

- Add parentheses and a fuller scientific-calculator layout.
- Allow history entries to be clicked and reused.
- Add a configurable maximum history length.
- Add accessibility preferences such as larger text.
- Add automated tests for calculation functions.
