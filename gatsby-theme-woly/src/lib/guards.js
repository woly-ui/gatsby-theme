import { mapComponentName } from './constants';

const hiddenCategories = [mapComponentName, 'hidden'];

const hiddenCategory = new RegExp(
  `\\b[A-Za-z]+\\-*(${hiddenCategories.join('|')})$`,
  'g',
);

export const isHiddenCategory = (category) => {
  if (typeof category !== 'string') {
    console.log('Category is not a string or not provided');
  }
  return hiddenCategory.test(category);
};
