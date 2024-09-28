import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { addAxiosDateTransformer, createAxiosDateTransformer } from './index';

/**
 * Helper function to create a mock adapter and mock a GET request.
 * @param axiosInstance - The Axios instance to mock.
 * @param url - The endpoint URL to mock.
 * @param jsonResponse - The JSON response to return.
 */
const createMockAdapter = (axiosInstance: AxiosInstance, url: string, jsonResponse: string) => {
    const mock = new MockAdapter(axiosInstance);
    mock.onGet(url).reply(200, jsonResponse);
    return mock;
};

/**
 * Helper function to initialize a date-aware Axios instance.
 * @param baseURL - The base URL for the Axios instance.
 * @param allowlist - An optional allowlist for fields to convert.
 * @returns A configured Axios instance with the date transformer applied.
 */
const initializeAxiosInstance = (baseURL: string, allowlist?: string[]): AxiosInstance => {
    const axiosConfig = { baseURL };
    return allowlist
        ? addAxiosDateTransformer(axios.create(axiosConfig), { allowlist })
        : createAxiosDateTransformer(axiosConfig);
};

/**
 * Helper function to assert that a field is correctly converted to a Date object.
 * @param field - The field to check.
 * @param expectedDate - The expected Date object.
 */
const assertDateConversion = (field: any, expectedDate: Date) => {
    expect(field).toBeInstanceOf(Date);
    expect(field.toISOString()).toEqual(expectedDate.toISOString());
};

/**
 * Helper function to assert that a field remains a string and has the expected value.
 * @param field - The field to check.
 * @param expectedValue - The expected string value.
 */
const assertStringValue = (field: any, expectedValue: string) => {
    expect(typeof field).toBe('string');
    expect(field).toEqual(expectedValue);
};

describe('axios-date-transformer', () => {
    const baseURL = 'https://example.org';
    const url = '/api/data';
    const originalObject = {
        name: 'John Doe',
        dob: '1980-01-25',
        issues: {
            alpha: new Date('2022-01-25T12:30:00.000Z'),
            beta: new Date('2024-01-26T09:45:00.000Z'),
        },
    };
    const jsonResponse = JSON.stringify(originalObject);

    test('transforms date strings to Date objects', async () => {
        const axiosInstance = initializeAxiosInstance(baseURL);

        // Create a mock adapter for the Axios instance
        const mock = createMockAdapter(axiosInstance, url, jsonResponse);

        // Make the request
        const { data } = await axiosInstance.get(url);

        // Assert conversions
        assertDateConversion(data.dob, new Date(originalObject.dob));
        assertDateConversion(data.issues.alpha, originalObject.issues.alpha);
        assertDateConversion(data.issues.beta, originalObject.issues.beta);

        // Restore the mock adapter
        mock.restore();
    });

    test('transforms only date strings in the allowlist', async () => {
        const allowlist = ['beta'];
        const axiosInstance = initializeAxiosInstance(baseURL, allowlist);

        // Create a mock adapter for the Axios instance
        const mock = createMockAdapter(axiosInstance, url, jsonResponse);

        // Make the request
        const { data } = await axiosInstance.get(url);

        // Assert that non-allowlisted fields remain as strings
        assertStringValue(data.dob, originalObject.dob);
        assertStringValue(data.issues.alpha, originalObject.issues.alpha.toISOString());

        // Assert that only the allowlisted field is converted to a Date object
        assertDateConversion(data.issues.beta, originalObject.issues.beta);

        // Restore the mock adapter
        mock.restore();
    });
});
