// Select the HTML elements that JavaScript needs to update or listen to.
const display = document.querySelector('.calculator__display');
const keys = document.querySelector('.calculator__keys');
const memoryKeys = document.querySelector('.memory-keys');
const historyList = document.querySelector('.history__list');
const emptyHistoryMessage = document.querySelector('.history__empty');
const clearHistoryButton = document.querySelector('.history__clear');
const themeToggle = document.querySelector('.theme-toggle');

// This limit prevents unreadable, extremely large answers from filling the display.
const MAXIMUM_RESULT = 1e15;

// Calculator state: these values remember progress between button clicks.
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
const savedMemory = Number(getStoredValue('calculatorMemory'));
let memoryValue = Number.isFinite(savedMemory) && Math.abs(savedMemory) <= MAXIMUM_RESULT
  ? savedMemory
  : 0;
let history = loadHistory();

// Storage can be blocked by browser privacy settings.
// These helpers let the calculator continue working for this page session.
function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The value still works during this page session, but it will not be saved.
  }
}

function removeStoredValue(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // There is nothing else to do when browser storage is unavailable.
  }
}
function loadHistory() {
  try {
    const savedHistory = JSON.parse(getStoredValue('calculatorHistory'));
    return Array.isArray(savedHistory) ? savedHistory : [];
  } catch {
    return [];
  }
}

function updateDisplay() {
  display.value = displayValue;
}

function formatNumber(number) {
  return Number.isInteger(number) ? String(number) : String(Number(number.toFixed(12)));
}

function setError() {
  displayValue = 'Error';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;
}

function inputNumber(number) {
  if (waitingForSecondOperand || displayValue === 'Error') {
    displayValue = number;
    waitingForSecondOperand = false;
  } else {
    displayValue = displayValue === '0' ? number : displayValue + number;
  }
}

function inputDecimal() {
  if (waitingForSecondOperand || displayValue === 'Error') {
    displayValue = '0.';
    waitingForSecondOperand = false;
  } else if (!displayValue.includes('.')) {
    displayValue += '.';
  }
}

// Calculate safely. Invalid or huge results return the word Error instead of Infinity.
function calculate(left, right, selectedOperator) {
  let result;

  if (selectedOperator === '+') result = left + right;
  if (selectedOperator === '-') result = left - right;
  if (selectedOperator === '*') result = left * right;
  if (selectedOperator === '^') result = left ** right;
  if (selectedOperator === '/') result = right === 0 ? NaN : left / right;

  if (!Number.isFinite(result) || Math.abs(result) > MAXIMUM_RESULT) return 'Error';
  return formatNumber(result);
}

function operatorSymbol(selectedOperator) {
  return ({ '/': '÷', '*': '×', '-': '−', '+': '+', '^': '^' })[selectedOperator];
}

function handleOperator(nextOperator) {
  if (displayValue === 'Error') return;
  const inputValue = Number(displayValue);

  // A second operator changes the selected operation before another number is entered.
  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand !== null && operator) {
    const result = calculate(firstOperand, inputValue, operator);
    if (result === 'Error') {
      setError();
      return;
    }
    displayValue = result;
    firstOperand = Number(result);
  } else {
    firstOperand = inputValue;
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
}

function addHistory(entry) {
  history.unshift(entry);
  history = history.slice(0, 10); // Keep the latest ten calculations.
  setStoredValue('calculatorHistory', JSON.stringify(history));
  renderHistory();
}

function handleEquals() {
  if (firstOperand === null || !operator || waitingForSecondOperand) return;

  const secondOperand = Number(displayValue);
  const equation = `${formatNumber(firstOperand)} ${operatorSymbol(operator)} ${formatNumber(secondOperand)}`;
  const result = calculate(firstOperand, secondOperand, operator);

  displayValue = result;
  addHistory(`${equation} = ${result}`);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;
}

function handlePercent() {
  if (displayValue === 'Error') return;
  const result = Number(displayValue) / 100;
  if (!Number.isFinite(result)) setError();
  else displayValue = formatNumber(result);
}

function handleSquareRoot() {
  const value = Number(displayValue);
  const result = Math.sqrt(value);

  if (
    displayValue === 'Error' ||
    !Number.isFinite(value) ||
    Math.abs(value) > MAXIMUM_RESULT ||
    !Number.isFinite(result) ||
    result > MAXIMUM_RESULT
  ) {
    setError();
  } else {
    displayValue = formatNumber(result);
  }

  // Keep waiting false so a result such as "9 + √16" can still be completed with =.
  waitingForSecondOperand = false;
}

function clearCalculator() {
  displayValue = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
}

function handleMemory(action) {
  const currentNumber = Number(displayValue);

  if (action === 'clear') memoryValue = 0;
  if (action === 'recall') {
    displayValue = formatNumber(memoryValue);
    // A recalled number can be used as the second part of a pending calculation.
    waitingForSecondOperand = operator === null;
  }
  if (action === 'add' && Number.isFinite(currentNumber)) memoryValue += currentNumber;
  if (action === 'subtract' && Number.isFinite(currentNumber)) memoryValue -= currentNumber;

  // Do not store invalid memory values.
  if (!Number.isFinite(memoryValue) || Math.abs(memoryValue) > MAXIMUM_RESULT) memoryValue = 0;
  setStoredValue('calculatorMemory', String(memoryValue));
}

function renderHistory() {
  historyList.innerHTML = '';
  emptyHistoryMessage.hidden = history.length > 0;

  history.forEach((entry) => {
    const item = document.createElement('li');
    item.textContent = entry; // textContent keeps saved history safe to display.
    historyList.append(item);
  });
}

// Event delegation: one listener can handle every calculator button.
keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, value } = button.dataset;
  if (action === 'number') inputNumber(value);
  if (action === 'decimal') inputDecimal();
  if (action === 'operator') handleOperator(value);
  if (action === 'equals') handleEquals();
  if (action === 'clear') clearCalculator();
  if (action === 'percent') handlePercent();
  if (action === 'sqrt') handleSquareRoot();
  updateDisplay();
});

memoryKeys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  handleMemory(button.dataset.memory);
  updateDisplay();
});

clearHistoryButton.addEventListener('click', () => {
  history = [];
  removeStoredValue('calculatorHistory');
  renderHistory();
});

function applyTheme(isDark) {
  document.body.classList.toggle('dark-theme', isDark);
  themeToggle.textContent = isDark ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark-theme');
  applyTheme(isDark);
  setStoredValue('calculatorTheme', isDark ? 'dark' : 'light');
});

// Keyboard support uses the same functions as button clicks.
document.addEventListener('keydown', (event) => {
  const { key } = event;
  if (/^\d$/.test(key)) inputNumber(key);
  else if (key === '.') inputDecimal();
  else if (['+', '-', '*', '/', '^'].includes(key)) handleOperator(key);
  else if (key === '%') handlePercent();
  else if (key === 'Enter' || key === '=') handleEquals();
  else if (key === 'Escape' || key.toLowerCase() === 'c') clearCalculator();
  else if (key.toLowerCase() === 's') handleSquareRoot();
  else return;

  event.preventDefault();
  updateDisplay();
});

applyTheme(getStoredValue('calculatorTheme') === 'dark');
renderHistory();
updateDisplay();
