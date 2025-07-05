document.addEventListener('DOMContentLoaded', () => {
  const calculator = {
    currentOperand: '0',
    previousOperand: '',
    operation: undefined,
    memory: 0,
    overwrite: false
  };

  const currentOperandElement = document.getElementById('current-operand');
  const previousOperandElement = document.getElementById('previous-operand');
  const numberButtons = document.querySelectorAll('.number-btn');
  const operatorButtons = document.querySelectorAll('.operator-btn');
  const equalsButton = document.querySelector('[data-action="equals"]');
  const clearButton = document.querySelector('[data-action="clear"]');
  const deleteButton = document.querySelector('[data-action="delete"]');
  const decimalButton = document.querySelector('[data-action="decimal"]');
  const percentageButton = document.querySelector('[data-action="percentage"]');
  const memoryButtons = document.querySelectorAll('[data-action^="memory"]');
  const memoryFunctions = document.getElementById('memory-functions');
  const advancedToggle = document.getElementById('advanced-toggle');

  function updateDisplay() {
    currentOperandElement.innerText = calculator.currentOperand;
    if (calculator.operation) {
      const op = { add: '+', subtract: '-', multiply: '×', divide: '÷' };
      previousOperandElement.innerText = `${calculator.previousOperand} ${op[calculator.operation]}`;
    } else {
      previousOperandElement.innerText = calculator.previousOperand;
    }
  }

  function appendNumber(number) {
    if (calculator.currentOperand === '0' || calculator.overwrite) {
      calculator.currentOperand = number;
      calculator.overwrite = false;
    } else {
      calculator.currentOperand += number;
    }
    updateDisplay();
  }

  function appendDecimal() {
    if (calculator.overwrite) {
      calculator.currentOperand = '0.';
      calculator.overwrite = false;
    } else if (!calculator.currentOperand.includes('.')) {
      calculator.currentOperand += '.';
    }
    updateDisplay();
  }

  function chooseOperation(op) {
    if (calculator.currentOperand === '0' && calculator.previousOperand === '') return;
    if (calculator.previousOperand === '') {
      calculator.previousOperand = calculator.currentOperand;
      calculator.currentOperand = '0';
    } else if (!calculator.overwrite) {
      compute();
    }
    calculator.operation = op;
    calculator.overwrite = true;
    updateDisplay();
  }

  function compute() {
    const prev = parseFloat(calculator.previousOperand);
    const current = parseFloat(calculator.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (calculator.operation) {
      case 'add': result = prev + current; break;
      case 'subtract': result = prev - current; break;
      case 'multiply': result = prev * current; break;
      case 'divide':
        if (current === 0) {
          alert("Cannot divide by zero!");
          clear();
          return;
        }
        result = prev / current;
        break;
    }

    calculator.currentOperand = result.toString().includes('.') ? parseFloat(result).toFixed(8).replace(/\.?0+$/, '') : result.toString();
    calculator.operation = undefined;
    calculator.previousOperand = '';
    calculator.overwrite = true;
    updateDisplay();
  }

  function clear() {
    calculator.currentOperand = '0';
    calculator.previousOperand = '';
    calculator.operation = undefined;
    calculator.overwrite = false;
    updateDisplay();
  }

  function deleteNumber() {
    if (calculator.overwrite) {
      calculator.currentOperand = '0';
      calculator.overwrite = false;
    } else if (calculator.currentOperand.length === 1) {
      calculator.currentOperand = '0';
    } else {
      calculator.currentOperand = calculator.currentOperand.slice(0, -1);
    }
    updateDisplay();
  }

  function percentage() {
    const current = parseFloat(calculator.currentOperand);
    if (!isNaN(current)) {
      calculator.currentOperand = (current / 100).toString();
      updateDisplay();
    }
  }

  function handleMemory(action) {
    const current = parseFloat(calculator.currentOperand);
    switch (action) {
      case 'memory-clear':
        calculator.memory = 0;
        break;
      case 'memory-recall':
        if (calculator.memory !== 0) {
          calculator.currentOperand = calculator.memory.toString();
          calculator.overwrite = true;
          updateDisplay();
        }
        break;
      case 'memory-add':
        calculator.memory += isNaN(current) ? 0 : current;
        break;
      case 'memory-subtract':
        calculator.memory -= isNaN(current) ? 0 : current;
        break;
    }

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg';
    notification.innerText = `Memory: ${calculator.memory}`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => notification.remove(), 300);
    }, 1500);
  }

  numberButtons.forEach(button => button.addEventListener('click', () => appendNumber(button.dataset.number)));
  operatorButtons.forEach(button => button.addEventListener('click', () => chooseOperation(button.dataset.action)));
  equalsButton.addEventListener('click', compute);
  clearButton.addEventListener('click', clear);
  deleteButton.addEventListener('click', deleteNumber);
  decimalButton.addEventListener('click', appendDecimal);
  percentageButton.addEventListener('click', percentage);
  memoryButtons.forEach(button => button.addEventListener('click', () => handleMemory(button.dataset.action)));
  advancedToggle.addEventListener('click', () => {
    memoryFunctions.classList.toggle('hidden');
    advancedToggle.innerHTML = memoryFunctions.classList.contains('hidden') ?
      '<i class="fas fa-calculator mr-1"></i> Advanced Functions' :
      '<i class="fas fa-times mr-1"></i> Close';
  });

  document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if (e.key === '.') appendDecimal();
    else if (e.key === '%') percentage();
    else if (e.key === '=' || e.key === 'Enter') compute();
    else if (e.key === 'Backspace') deleteNumber();
    else if (e.key === 'Escape') clear();
    else if (['+', '-', '*', '/'].includes(e.key)) {
      chooseOperation(
        e.key === '+' ? 'add' :
        e.key === '-' ? 'subtract' :
        e.key === '*' ? 'multiply' : 'divide'
      );
    }
  });

  updateDisplay();
});
