
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let newValue = 0;

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        inputDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        inputDot();
      } else if (e.key === '+') {
        e.preventDefault();
        performOperation('+');
      } else if (e.key === '-') {
        e.preventDefault();
        performOperation('-');
      } else if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        performOperation('×');
      } else if (e.key === '/' || e.key === 'ð') {
        e.preventDefault();
        performOperation('÷');
      } else if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        performOperation('=');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearDisplay();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        if (display !== '0' && !waitingForOperand) {
          setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, operator, prevValue, waitingForOperand]);

  return (
    <div className="p-4 h-full">
      <h2 className="text-2xl font-semibold mb-4">Calculator</h2>
      <div className="bg-white/50 rounded-lg p-4 max-w-[300px] mx-auto">
        <div className="bg-gray-100 p-4 text-right text-2xl font-medium rounded mb-4 break-all">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" onClick={clearDisplay} className="col-span-2">
            AC
          </Button>
          <Button variant="outline" onClick={() => performOperation('÷')}>÷</Button>
          <Button variant="outline" onClick={() => performOperation('×')}>×</Button>

          <Button onClick={() => inputDigit('7')}>7</Button>
          <Button onClick={() => inputDigit('8')}>8</Button>
          <Button onClick={() => inputDigit('9')}>9</Button>
          <Button variant="outline" onClick={() => performOperation('-')}>-</Button>

          <Button onClick={() => inputDigit('4')}>4</Button>
          <Button onClick={() => inputDigit('5')}>5</Button>
          <Button onClick={() => inputDigit('6')}>6</Button>
          <Button variant="outline" onClick={() => performOperation('+')}>+</Button>

          <Button onClick={() => inputDigit('1')}>1</Button>
          <Button onClick={() => inputDigit('2')}>2</Button>
          <Button onClick={() => inputDigit('3')}>3</Button>
          <Button variant="secondary" onClick={() => performOperation('=')} className="row-span-2">
            =
          </Button>

          <Button onClick={() => inputDigit('0')} className="col-span-2">0</Button>
          <Button onClick={inputDot}>.</Button>
        </div>
      </div>
    </div>
  );
};
