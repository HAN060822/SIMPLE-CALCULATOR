// Get the parts of the page that JavaScript needs to update or listen to.
const display = document.querySelector('.calculator__display');
const keys = document.querySelector('.calculator__keys');

// These variables remember the calculator's current state between button clicks.
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Put the current value into the display screen.
function updateDisplay() {
  display.value = displayValue;
}

// Add a number to the display, replacing the starting zero when needed.
function inputNumber(number) {
  if (waitingForSecondOperand || displayValue === 'Error') {
    displayValue = number;
    waitingForSecondOperand = false;
  } else {
    displayValue = displayValue === '0' ? number : displayValue + number;
  }
}

// Add one decimal point. Each number may only contain one decimal point.
function inputDecimal() {
  if (waitingForSecondOperand || displayValue === 'Error') {
    displayValue = '0.';
    waitingForSecondOperand = false;
    return;
  }

  if (!displayValue.includes('.')) {
    displayValue += '.';
  }
}

// Do one calculation using the selected operator.
function calculate(left, right, selectedOperator) {
  switch (selectedOperator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      // Division by zero is not a valid calculation.
      return right === 0 ? 'Error' : left / right;
    default:
      return right;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(displayValue);

  // If an operator is pressed twice, simply replace the previous one.
  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  // If there is already a first number and operator, calculate before continuing.
  if (firstOperand !== null && operator) {
    const result = calculate(firstOperand, inputValue, operator);
    displayValue = String(result);
    firstOperand = result === 'Error' ? null : result;
  } else {
    firstOperand = inputValue;
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
}

function handleEquals() {
  // There is nothing to calculate until a number and operator have been chosen.
  if (firstOperand === null || !operator || waitingForSecondOperand) {
    return;
  }

  const result = calculate(firstOperand, Number(displayValue), operator);
  displayValue = String(result);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;
}

function clearCalculator() {
  displayValue = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
}

// One listener on the button container handles clicks from every calculator key.
keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const { action, value } = button.dataset;

  if (action === 'number') inputNumber(value);
  if (action === 'decimal') inputDecimal();
  if (action === 'operator') handleOperator(value);
  if (action === 'equals') handleEquals();
  if (action === 'clear') clearCalculator();

  updateDisplay();
});

updateDisplay();
