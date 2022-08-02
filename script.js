function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);

    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '×':
            return multiply(a, b);
        case '÷':
            return divide(a, b);        
    }
}

const digits = document.querySelectorAll('.digit');
const clearButton = document.querySelector("#clear");
const deleteButton = document.querySelector("#delete");
const displayHighLine = document.querySelector("#high-line");
const displayLowLine = document.querySelector("#low-line");

digits.forEach(digitButton => digitButton.addEventListener("click", digitEventListener));

clearButton.addEventListener("click", e => {
    displayHighLine.textContent = '';
    displayLowLine.textContent = '0';
    operator = '';
    isDigitLastButtonPressed = false;
});

deleteButton.addEventListener("click", e => {
    if (displayLowLine.textContent == 0) {
        return;
    }

    displayLowLine.textContent = displayLowLine.textContent.slice(0, -1);

    if (displayLowLine.textContent === '') {
        displayLowLine.textContent = 0;
    }
});

let firstOperand, secondOperand, operator;
let isDigitLastButtonPressed = false;

const operatorButtons = document.querySelectorAll(".operation");
operatorButtons.forEach(operatorButton => operatorButton.addEventListener("click", operatorEventListener));

const equalsButton = document.querySelector("#equals");
equalsButton.addEventListener("click", equalsEventListener);

function digitEventListener(e) {
    // handle initial 0 at the display
    if (displayLowLine.textContent == 0) {
        displayLowLine.textContent = '';
    }

    if (!isDigitLastButtonPressed) {
        displayLowLine.textContent = '';
        isDigitLastButtonPressed = true;
    }

    if (displayHighLine.textContent.includes("=")) {
        operator = '';
        displayHighLine.textContent = '';
    }

    displayLowLine.textContent = displayLowLine.textContent + e.target.textContent;
}

function operatorEventListener(e) {
    if (operator && isDigitLastButtonPressed) {
        secondOperand = displayLowLine.textContent;
        displayLowLine.textContent = operate(operator, firstOperand, secondOperand);
    }

    firstOperand = +displayLowLine.textContent;
    secondOperand = firstOperand;
    operator = e.target.textContent;
    displayHighLine.textContent = `${firstOperand} ${operator}`;
    isDigitLastButtonPressed = false;
}

function equalsEventListener(e) {
    if (!operator) {
        return;
    }

    if (isDigitLastButtonPressed) {
        secondOperand = displayLowLine.textContent;
    }
    
    let result = operate(operator, firstOperand, secondOperand);
    displayHighLine.textContent = `${firstOperand} ${operator} ${secondOperand} =`
    firstOperand = result;
    displayLowLine.textContent = result;
    isDigitLastButtonPressed = false;
}

