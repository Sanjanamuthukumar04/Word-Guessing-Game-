export const WORD_LENGTH = 5;
export const MAX_GUESSES = 5;
export const MAX_WORDS_PER_DAY = 3; // Add this if missing

export const LETTER_STATES = {
  CORRECT: 'correct',
  PRESENT: 'present',
  ABSENT: 'absent'
};

export const COLORS = {
  [LETTER_STATES.CORRECT]: '#6aaa64',
  [LETTER_STATES.PRESENT]: '#c9b458',
  [LETTER_STATES.ABSENT]: '#787c7e'
};