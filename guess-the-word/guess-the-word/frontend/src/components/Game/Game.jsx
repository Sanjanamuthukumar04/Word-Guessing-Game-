import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { gameService } from '../../services/api.jsx';
import { validateWord } from '../../utils/validation.jsx';
import { MAX_GUESSES, MAX_WORDS_PER_DAY } from '../../utils/constants.jsx';
import WordRow from './WordRow.jsx';
import Keyboard from './Keyboard.jsx';
import './Game.css';

const Game = () => {
  const { user } = useAuth();
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [message, setMessage] = useState('');
  const [usedLetters, setUsedLetters] = useState({});
  const [todayGameCount, setTodayGameCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      setLoading(true);
      
      // Check daily game limit
      const gameCount = await gameService.getTodayGameCount(user.id);
      setTodayGameCount(gameCount);

      if (gameCount >= MAX_WORDS_PER_DAY) {
        setMessage(`You've reached the daily limit of ${MAX_WORDS_PER_DAY} games. Come back tomorrow!`);
        return;
      }

      // Get random word
      const word = await gameService.getRandomWord();
      setTargetWord(word.toUpperCase());
      setGuesses([]);
      setCurrentGuess('');
      setGameStatus('playing');
      setUsedLetters({});
      setMessage('');
    } catch (error) {
      setMessage('Error starting game: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (key) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      setMessage('Word must be 5 letters');
      return;
    }

    if (!validateWord(currentGuess)) {
      setMessage('Please use only uppercase letters');
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    // Update used letters for keyboard
    const newUsedLetters = { ...usedLetters };
    currentGuess.split('').forEach((letter, index) => {
      if (targetWord[index] === letter) {
        newUsedLetters[letter] = 'correct';
      } else if (targetWord.includes(letter) && newUsedLetters[letter] !== 'correct') {
        newUsedLetters[letter] = 'present';
      } else if (!newUsedLetters[letter]) {
        newUsedLetters[letter] = 'absent';
      }
    });
    setUsedLetters(newUsedLetters);

    if (currentGuess === targetWord) {
      // Player won
      setGameStatus('won');
      setMessage('Congratulations! You guessed the word!');
      await saveGameResult(true);
    } else if (newGuesses.length >= MAX_GUESSES) {
      // Player lost
      setGameStatus('lost');
      setMessage(`Better luck next time! The word was: ${targetWord}`);
      await saveGameResult(false);
    } else {
      setCurrentGuess('');
      setMessage('');
    }
  };

  const saveGameResult = async (isWin) => {
    try {
      await gameService.saveGameResult({
        user_id: user.id,
        target_word: targetWord,
        guesses: guesses.concat(currentGuess),
        is_win: isWin,
        guess_count: guesses.length + 1
      });
      setTodayGameCount(prev => prev + 1);
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  const handleNewGame = () => {
    if (todayGameCount >= MAX_WORDS_PER_DAY) {
      setMessage(`Daily limit reached. You can play again tomorrow!`);
      return;
    }
    initializeGame();
  };

  if (loading) {
    return <div className="game-container">Loading game...</div>;
  }

  if (todayGameCount >= MAX_WORDS_PER_DAY && gameStatus === 'playing') {
    return (
      <div className="game-container">
        <div className="game-card">
          <h2>Daily Limit Reached</h2>
          <p>You've played {MAX_WORDS_PER_DAY} games today. Come back tomorrow!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Guess The Word</h2>
        <p>Games today: {todayGameCount}/{MAX_WORDS_PER_DAY}</p>
      </div>

      {message && (
        <div className={`game-message ${gameStatus === 'won' ? 'success' : gameStatus === 'lost' ? 'error' : ''}`}>
          {message}
          {(gameStatus === 'won' || gameStatus === 'lost') && (
            <button className="btn btn-primary new-game-btn" onClick={handleNewGame}>
              New Game
            </button>
          )}
        </div>
      )}

      <div className="game-board">
        {Array(MAX_GUESSES).fill().map((_, index) => (
          <WordRow
            key={index}
            word={targetWord}
            guess={index < guesses.length ? guesses[index] : index === guesses.length ? currentGuess : ''}
            isSubmitted={index < guesses.length}
          />
        ))}
      </div>

      <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />

      <div className="game-instructions">
        <p>💚 Correct letter, correct position</p>
        <p>🟡 Correct letter, wrong position</p>
        <p>⚫ Letter not in word</p>
      </div>
    </div>
  );
};

// MAKE SURE THIS EXPORT IS AT THE END
export default Game;