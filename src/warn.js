/* @flow */
export default (message: string): void => {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */

  /* eslint-disable no-empty */
  try {
    throw new Error(message);
  } catch (e) {}
  /* eslint-enable no-empty */
};
