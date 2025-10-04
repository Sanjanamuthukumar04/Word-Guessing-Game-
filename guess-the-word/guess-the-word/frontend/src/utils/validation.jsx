export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z]{5,}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$%*@])[a-zA-Z\d$%*@]{5,}$/;
  return passwordRegex.test(password);
};

export const validateWord = (word) => {
  const wordRegex = /^[A-Z]{5}$/;
  return wordRegex.test(word);
};