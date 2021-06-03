import { mapComponentName } from './constants';

const hiddenCategories = [mapComponentName, 'hidden'];

const hiddenCategory = new RegExp(
  `\\b[A-Za-z]+\\-*(${hiddenCategories.join('|')})$`,
  'g',
);

export const isHiddenCategory = (category) => {
  if (typeof category !== 'string') {
    throw new Error('Category is not a string');
  }
  return hiddenCategory.test(category);
};
