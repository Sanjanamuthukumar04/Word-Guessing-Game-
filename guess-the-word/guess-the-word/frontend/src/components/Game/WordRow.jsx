import React from 'react';
import './WordRow.css';

const WordRow = ({ word, guess, isSubmitted }) => {
  const getLetterState = (index) => {
    if (!isSubmitted || !guess) return '';
    
    const letter = guess[index];
    if (letter === word[index]) {
      return 'correct';
    } else if (word.includes(letter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  const letters = Array(5).fill('');
  if (guess) {
    guess.split('').forEach((letter, index) => {
      letters[index] = letter;
    });
  }

  return (
    <div className="word-row">
      {letters.map((letter, index) => (
        <div
          key={index}
          className={`letter-box ${isSubmitted ? getLetterState(index) : ''} ${
            letter ? 'filled' : ''
          }`}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default WordRow;