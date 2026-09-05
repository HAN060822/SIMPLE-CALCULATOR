# Simple Calculator

A beginner-friendly calculator website built with plain HTML, CSS, and JavaScript. It performs addition, subtraction, multiplication, division, and decimal calculations directly in a web browser. It has no backend, build step, or external libraries, so it is ready for GitHub Pages.

## Project Structure

```
Simple-Calculator/
├── index.html
├── style.css
├── script.js
└── README.md
```

- `index.html` creates the calculator's display and buttons, and connects the CSS and JavaScript files.
- `style.css` controls the layout, colours, button states, and responsive sizing.
- `script.js` listens for button clicks, remembers the current calculation, and updates the display.
- `README.md` explains the project and how to use it.

## How the Calculator Works

1. Clicking a number button adds that number to the display.
2. Clicking an operator saves the first number and waits for the next number.
3. Clicking `=` performs the selected calculation and shows the result.
4. Clicking `C` clears the calculator and starts again at zero.
5. The decimal-point button prevents more than one decimal point in a number. Dividing by zero displays `Error`.

The JavaScript keeps track of four small pieces of state: the visible value, the first number, the selected operator, and whether the calculator is waiting for a second number. This is a simple example of how an interactive program remembers what a user has done.

## How to Run Locally

1. Open the `Simple-Calculator` folder.
2. Double-click `index.html`, or right-click it and choose a web browser.
3. Use the on-screen buttons to calculate.

No installation, server, or backend is required. To publish it with GitHub Pages, upload this folder to a GitHub repository and set Pages to deploy from the branch/folder containing `index.html`.

## What You Can Learn

- How HTML gives a webpage structure.
- How CSS creates a responsive visual layout with Grid.
- How JavaScript responds to clicks with event listeners.
- How `data-*` attributes connect HTML buttons to JavaScript actions.
- How variables and functions store and process application state.
- How separate files work together in a static website.

## Future Improvements

- Add keyboard input for numbers and operators.
- Add a dark-mode switch.
- Save and show calculation history.
- Add scientific functions such as square root, powers, and percentages.
- Add memory functions such as MC, MR, M+, and M-.
- Improve error handling for very large numbers and invalid calculations.
