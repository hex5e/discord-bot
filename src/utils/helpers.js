export const reverseString = (value = '') => value.split('').reverse().join('');

export const formatUserTag = (user) => {
  if (!user) return 'Unknown User';
  return `${user.username}#${user.discriminator}`;
};

export const isTruthy = (value) => Boolean(value) && value !== 'false';
