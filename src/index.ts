import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from 'axios';

/**
 * Configuration options specifically for the Date Transformer.
 */
type DateTransformerConfig = {
    /**
     * An optional array of strings specifying the field names
     * that should be converted to Date objects. If provided,
     * only these fields will be parsed as dates.
     */
    allowlist?: string[];
};

/**
 * Extended Axios configuration that includes the Date Transformer options.
 */
type DateTransformerAxiosConfig<T = any> = CreateAxiosDefaults<T> & DateTransformerConfig;

const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?)?$/;

/**
 * Determines if a given string value matches the ISO date format.
 * @param value - The value to be checked.
 * @returns `true` if the value is a valid ISO date string, otherwise `false`.
 */
const isDateString = (value: any): boolean => {
    return dateRegex.test(value);
};

/**
 * Checks if a given key is present in the allowlist.
 * @param key - The key to be checked.
 * @param allowlist - An optional array of keys to be converted.
 * @returns `true` if the allowlist is undefined, empty, or if the key is in the allowlist.
 */
const isAllowed = (key: string, allowlist?: string[]): boolean => {
    return !allowlist || allowlist.length === 0 || allowlist.includes(key);
};

/**
 * Determines if a given value should be converted to a Date object.
 * @param key - The key of the value to be converted.
 * @param value - The value to be checked.
 * @param allowlist - An optional array of keys that should be converted.
 * @returns `true` if the value should be converted, otherwise `false`.
 */
const shouldConvert = (key: string, value: any, allowlist?: string[]): boolean => {
    return typeof value === 'string' && isDateString(value) && isAllowed(key, allowlist);
};

/**
 * Recursively traverses an object and converts allowed fields to Date objects.
 * @param data - The data to be traversed and transformed.
 * @param allowlist - An optional array of keys that should be converted to Date objects.
 * @returns The transformed data with Date objects where applicable.
 */
const recursiveDateConversion = (data: any, allowlist?: string[]): any => {
    if (!data || typeof data !== 'object') {
        return data;
    }

    for (const key in data) {
        if (shouldConvert(key, data[key], allowlist)) {
            data[key] = new Date(data[key]);
        } else if (typeof data[key] === 'object') {
            data[key] = recursiveDateConversion(data[key], allowlist);
        }
    }

    return data;
};

/**
 * Transforms date strings in the Axios response data to Date objects based on the allowlist.
 * @param response - The Axios response object.
 * @param allowlist - An optional array of keys that should be converted to Date objects.
 * @returns The transformed Axios response.
 */
const transformDates = <T = any>(response: AxiosResponse<T>, allowlist?: string[]): AxiosResponse<T> => {
    if (response.data) {
        response.data = recursiveDateConversion(response.data, allowlist);
    }

    return response;
};

/**
 * Creates a new Axios instance with the date transformer interceptor applied.
 * @param config - The configuration for the Axios instance, including the date transformer options.
 * @returns A new Axios instance with date transformation enabled.
 */
export const createAxiosDateTransformer = <T = any>(config: DateTransformerAxiosConfig<T> = {}): AxiosInstance => {
    return addAxiosDateTransformer(axios.create(config), config);
};

/**
 * Adds the date transformer interceptor to an existing Axios instance.
 * @param instance - The Axios instance to which the interceptor should be added.
 * @param dateTransformerConfig - Configuration options for the date transformer, including an optional allowlist.
 * @returns The Axios instance with the date transformer applied.
 */
export const addAxiosDateTransformer = (
    instance: AxiosInstance,
    dateTransformerConfig?: DateTransformerConfig,
): AxiosInstance => {
    const allowlist = dateTransformerConfig?.allowlist;
    instance.interceptors.response.use(response => transformDates(response, allowlist));
    return instance;
};
