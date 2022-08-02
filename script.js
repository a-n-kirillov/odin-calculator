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
const screen = document.querySelector("#screen");
const displayHighLine = document.querySelector("#high-line");
const displayLowLine = document.querySelector("#low-line");

const hightLineFontSize = displayHighLine.style.fontSize;
const lowLineFontSize = displayLowLine.style.fontSize;

const maxDigitStorage = getMaximumDigitStorage(screen, displayLowLine);

digits.forEach(digitButton => digitButton.addEventListener("click", digitEventListener));

clearButton.addEventListener("click", clearEventListener);

deleteButton.addEventListener("click", deleteEventListener);

let firstOperand, secondOperand, operator;
let isDigitLastButtonPressed = false;

const operatorButtons = document.querySelectorAll(".operation");
operatorButtons.forEach(operatorButton => operatorButton.addEventListener("click", operatorEventListener));

const equalsButton = document.querySelector("#equals");
equalsButton.addEventListener("click", equalsEventListener);

// handle division by zero
let inErrorState = false;
let previousOperator;
let previousSecondOperand;
document.addEventListener("click", divisionByZeroHandler, {capture: false});
document.addEventListener("click", errorResetHandler, {capture: true});

function clearEventListener(e) {
    previousOperator = null;
    previousSecondOperand = null;
    inErrorState = false;
    displayHighLine.textContent = '';
    displayLowLine.style.fontSize = lowLineFontSize;
    firstOperand = 0;
    displayLowLine.textContent = '0';
    operator = '';
    isDigitLastButtonPressed = false;
};

function deleteEventListener(e) {
    if (displayLowLine.textContent == 0) {
        return;
    }

    displayLowLine.textContent = displayLowLine.textContent.slice(0, -1);

    if (displayLowLine.textContent === '') {
        displayLowLine.textContent = 0;
    }
}

function digitEventListener(e) {
    if (!isDigitLastButtonPressed) {
        displayLowLine.textContent = '';
        isDigitLastButtonPressed = true;
    }

    if (displayHighLine.textContent.includes("=")) {
        operator = '';
        displayHighLine.textContent = '';
    }

    let updatedNumber;

    if (displayLowLine.textContent.includes('.')) {
        updatedNumber = displayLowLine.textContent + e.target.textContent;
    } else {
        updatedNumber = Number(displayLowLine.textContent) + e.target.textContent;
    }

    displayLowLine.textContent = getNumberWithoutOverflow(updatedNumber);
}

function operatorEventListener(e) {
    if (operator && isDigitLastButtonPressed) {
        secondOperand = displayLowLine.textContent;
        displayLowLine.textContent = getResultWithoutOverflow(operator, firstOperand, secondOperand);
    }

    firstOperand = +displayLowLine.textContent;
    secondOperand = firstOperand;
    operator = e.target.textContent;
    displayHighLine.textContent = `${getNumberWithoutOverflow(firstOperand)} ${operator}`;
    isDigitLastButtonPressed = false;
}

function equalsEventListener(e) {
    if (!operator) {
        return;
    }

    if (isDigitLastButtonPressed) {
        secondOperand = Number(displayLowLine.textContent);
    }
    
    let result = getResultWithoutOverflow(operator, firstOperand, secondOperand);
    displayHighLine.textContent = `${getNumberWithoutOverflow(firstOperand)} ${operator} ${getNumberWithoutOverflow(secondOperand)} =`
    firstOperand = Number(result);
    displayLowLine.textContent = result;
    isDigitLastButtonPressed = false;
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }

function getMaximumDigitStorage(screen, line) {
    while (!isOverflown(screen)) {
        line.textContent += '8';
    }

    let maxLineLength = line.textContent.length - 2;
    line.textContent = '0';
    return maxLineLength;
}

function getResultWithoutOverflow(operator, firstOperand, secondOperand) {
    previousOperator = operator;
    previousSecondOperand = secondOperand;
    
    let result = operate(operator, firstOperand, secondOperand);
    return getNumberWithoutOverflow(result); 
}

function getNumberWithoutOverflow(number) {
    number = String(number);
    if (!isNumberOverflowing(number)) {
        return number[0] === '0' && number.length > 1 ? number.slice(1) : number;
    }

    // magic number explanation:
    // as first guess it is expected that
    // e+{digit} should work without overflow
    let fractionDigitsCount = maxDigitStorage - 3;
    let numberAsExponential = number;
    
    while (isNumberOverflowing(numberAsExponential)) {
        numberAsExponential = Number.parseFloat(numberAsExponential).toExponential(fractionDigitsCount);
        fractionDigitsCount--;
    }

    return numberAsExponential;
}

function isNumberOverflowing(number) {
    number = String(number);
    return number.length > maxDigitStorage;
}

function divisionByZeroHandler(e) {
    if (previousOperator === "÷" && previousSecondOperand == 0) {
        displayHighLine.textContent = '';
        displayLowLine.style.fontSize = "26px";
        displayLowLine.textContent = "Invalid operation: divide by 0";
        inErrorState = true;
    }
}

function errorResetHandler(e) {
    if (inErrorState) {
        clearEventListener(e);
    }

    if ((displayLowLine.textContent.includes('.') || displayLowLine.textContent.includes('e')) && e.target.textContent === '.') {
        e.stopPropagation();
    }
}