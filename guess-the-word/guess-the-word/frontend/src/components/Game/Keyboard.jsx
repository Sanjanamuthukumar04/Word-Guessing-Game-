import React from 'react';
import './Keyboard.css';

const Keyboard = ({ onKeyPress, usedLetters }) => {
  const firstRow = 'QWERTYUIOP'.split('');
  const secondRow = 'ASDFGHJKL'.split('');
  const thirdRow = 'ZXCVBNM'.split('');

  const getKeyState = (letter) => {
    return usedLetters[letter] || '';
  };

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {firstRow.map(letter => (
          <button
            key={letter}
            className={`key ${getKeyState(letter)}`}
            onClick={() => onKeyPress(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        {secondRow.map(letter => (
          <button
            key={letter}
            className={`key ${getKeyState(letter)}`}
            onClick={() => onKeyPress(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        <button className="key special" onClick={() => onKeyPress('ENTER')}>
          ENTER
        </button>
        {thirdRow.map(letter => (
          <button
            key={letter}
            className={`key ${getKeyState(letter)}`}
            onClick={() => onKeyPress(letter)}
          >
            {letter}
          </button>
        ))}
        <button className="key special" onClick={() => onKeyPress('BACKSPACE')}>
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Keyboard;