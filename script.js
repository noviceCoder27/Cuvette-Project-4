let resultOnScreen = result = '0';
const givenOperators = ['+','-','x','/'];
let operationWithZero = false

window.onload = () => {
    output();
}

const output = () => {
    const outputScreen = document.querySelector('.screen');
    if (!operationWithZero && resultOnScreen.charAt(0) === '0' && resultOnScreen.length > 1) {
        resultOnScreen = resultOnScreen.substring(1);
        result = resultOnScreen;
    }
    result = resultOnScreen; 
    outputScreen.innerHTML = `${resultOnScreen || '0'}`;
}

const reset = () => {
    resultOnScreen = '0';
    output();
}

const remove = () => {
    if(resultOnScreen.length === 1) {
        resultOnScreen = '0';
    }
    resultOnScreen = resultOnScreen.substring(0,resultOnScreen.length-1);
    output();
}

const operation = (op1,operator,op2,startIndex,endIndex) => {
    if(operator === '/' && op2 === '0') {
        result = 'ERROR';
        resultOnScreen = result;
        output();
        return;
    }
    const num1 = Number(op1);
    const num2 = Number(op2);
    let answer;
    switch(operator){
        case '+':
            answer = num1+num2;
            break;
        case '-':
            answer = num1-num2;
            break;
        case 'x':
            answer = num1*num2;
            break;
        case '/':
            answer = num1/num2;
            break;
    }
    if(result.includes('/') || result.includes('+') || result.includes('x') || result.includes('-') || result.includes('+')) {
        const expression = result.slice(startIndex,endIndex+1);
        result = result.replace(expression,answer.toString());
    }

    if(!result.includes('/') && !result.includes('+') && !result.includes('x') && !result.includes('+')) {
        if(result.length > 6) {
            result = result.substring(0,7);
        }
        resultOnScreen = result;
        output();
    }
   
}

const getLHS = (index) => {
    let lhs = [];
    while(index >=0) {
        if(index === 0) {
            if(result.charAt(0) !== '-' && givenOperators.includes(result.charAt(index))) break;
        } else {
            if(givenOperators.includes(result.charAt(index))) break;
        }
        lhs.unshift(result.charAt(index));
        index--;
    }
    return [lhs.join(''),index+1];
}

const getRHS = (index) => {
    let rhs = [];
    while(index < result.length) {
        if(givenOperators.includes(result.charAt(index))) break;
        rhs.push(result.charAt(index))
        index++;
    }
    return [rhs.join(''),index-1];
}


const assignAndOperate = (operator) => {
    let operand1 = '',operand2 = '';
    const pointer = result.indexOf(operator);
    let leftIndex = pointer - 1;
    let rightIndex = pointer + 1;
    if(pointer === 0 && operator === '-') {
        for(let i = pointer+1 ; i < result.length; i++) {
            if(result.charAt(i) === '-') {
                leftIndex = i-1;
                rightIndex = i+1;
                break;
            } else if(result.charAt(i) === '+') {
                leftIndex = i-1;
                rightIndex = i+1;
            }
        }
    } 
    if((operator === '+' && result.charAt(leftIndex) === '-') || (operator === '-' && result.charAt(leftIndex) === '+') || (operator === '-' && result.charAt(leftIndex) === '-')) {
        operator = '-';
        leftIndex--;
    } else if((operator === '+' && result.charAt(rightIndex) === '-') && (operator === '-' && result.charAt(rightIndex) === '+') || (operator === '-' && result.charAt(rightIndex) === '-')) {
        operator = '-';
        rightIndex++;
    }
    [operand1,lhs] = getLHS(leftIndex);
    [operand2,rhs] = getRHS(rightIndex);
    operation(operand1,operator,operand2,lhs,rhs);
}


const performOperation = () => {
    const lastCharacter = result.charAt(result.length-1);
    if(givenOperators.includes(lastCharacter)) result = result.substring(0,result.length-1);
    let iterations = 0;
    for(let i = 0; i< result.length;i++) {
        if((result.charAt(i) === '/' || result.charAt(i) === 'x' || result.charAt(i) === '-' || result.charAt(i) === '+')) {
            iterations++;
        } 
    }
    while(iterations > 0) {
        let count = result.split('-').length - 1;
        if(result.includes('/')) {
            assignAndOperate('/');
        } else if(result.includes('x')) {
            assignAndOperate('x');
        } else if(result.includes('-')) {
            if(count <=1 && result.includes('+')) {
                assignAndOperate('+');
            } else {
                assignAndOperate('-');
            }
        } else {
            assignAndOperate('+');
        }
        iterations--;
    }
}

const checkCondition = (btn) => {
    if(resultOnScreen.length <=6) {
        resultOnScreen += btn.innerHTML;
        result = resultOnScreen;
        output();
    }
}

const buttonFunctionality = () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.innerHTML === 'RESET') {
                operationWithZero = false;
                reset();
            } else if(btn.innerHTML === 'DEL'){
                operationWithZero = false;
                remove();
            } else if(btn.innerHTML === '=') {
                result = resultOnScreen;
                operationWithZero = false;
                performOperation();
            } else if(resultOnScreen === '0' && (btn.innerHTML === '/' || btn.innerHTML === 'x' || btn.innerHTML === '+' || btn.innerHTML === '.')) {
                resultOnScreen += btn.innerHTML;
                operationWithZero = true;
                output();
            } else {
                const lastCharacter = result.charAt(result.length -1);
                if(givenOperators.includes(lastCharacter) && givenOperators.includes(btn.innerHTML)) {
                    return;
                }
                if(resultOnScreen === '0' && isNaN(btn.innerHTML) && (btn.innerHTML === '-' || btn.innerHTML === '.')) {
                    checkCondition(btn);
                } else if(resultOnScreen === '0' && !isNaN(btn.innerHTML)) {
                    checkCondition(btn);
                } else if(resultOnScreen === '0' && isNaN(btn.innerHTML)){
                    return;
                } else {
                    checkCondition(btn);
                }
            }
        });
    });
}

buttonFunctionality();