import { options } from '../utils/sort.js';

const generateSortOptions = () =>
  Object.entries(options).map(([optionName, isDisabledOption]) => ({
    name: optionName,
    // @ts-ignore
    disabled: isDisabledOption(optionName),
  }));

export { generateSortOptions };
