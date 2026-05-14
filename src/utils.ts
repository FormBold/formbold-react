import { Config, DeepRequired, FormValues } from './types';

/**
 * Merges the provided configuration object with the default configuration,
 * overriding any properties that are specified in the provided object.
 *
 * @param config - The configuration object to merge with the default configuration.
 * @returns The merged configuration object.
 */
export const mergeConfig = (defaultConfig: DeepRequired<Config>, config: Config = {}) => {
  const errorMessages = { ...defaultConfig.errorMessages, ...(config.errorMessages ?? {}) };
  return { ...defaultConfig, ...config, errorMessages };
};

export const toFormValues = (formData: FormData): FormValues => {
  const values: FormValues = {};

  for (const [key, rawValue] of formData.entries()) {
    const currentValue = values[key];

    if (currentValue === undefined) {
      values[key] = rawValue;
      continue;
    }

    values[key] = Array.isArray(currentValue) ? [...currentValue, rawValue] : [currentValue, rawValue];
  }

  return values;
};

export const isValueEmpty = (value: FormDataEntryValue | FormDataEntryValue[] | undefined) => {
  if (value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0 || value.every(item => item === '');
  }

  return value === '';
};
