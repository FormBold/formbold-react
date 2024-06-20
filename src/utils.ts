import { Config } from "./types";

/**
 * Merges the provided configuration object with the default configuration,
 * overriding any properties that are specified in the provided object.
 *
 * @param config - The configuration object to merge with the default configuration.
 * @returns The merged configuration object.
 */
export const mergeConfig = (defaultConfig: Required<Config>, config: Config = {}) => {
    const errorMessages = { ...defaultConfig.errorsMessages, ...(config.errorsMessages ?? {}) };
    return { ...defaultConfig, ...config, errorMessages };
  };