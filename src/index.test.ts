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

    // Combined test object covering various scenarios: strings, nested objects, arrays, and multiple date fields
    const originalObject = {
        name: 'John Doe',
        dob: '1980-01-25',
        joinedAt: '2023-09-28T12:00:00Z',
        issues: {
            alpha: '2022-01-25T12:30:00.000Z',
            beta: new Date('2024-01-26T09:45:00.000Z'),
        },
        users: [
            {
                id: '123',
                registeredAt: '2023-09-28T12:00:00Z',
                events: [
                    {
                        eventId: 'abc',
                        eventDate: '2023-10-01T09:00:00Z',
                    },
                ],
            },
        ],
    };
    const jsonResponse = JSON.stringify(originalObject);

    test('transforms date strings to Date objects for all fields', async () => {
        const axiosInstance = initializeAxiosInstance(baseURL);

        // Create a mock adapter for the Axios instance
        const mock = createMockAdapter(axiosInstance, url, jsonResponse);

        // Make the request
        const { data } = await axiosInstance.get(url);

        // Assert conversions for top-level date fields
        assertDateConversion(data.dob, new Date(originalObject.dob));
        assertDateConversion(data.joinedAt, new Date(originalObject.joinedAt));

        // Assert conversions for nested object fields
        assertDateConversion(data.issues.alpha, new Date(originalObject.issues.alpha));
        assertDateConversion(data.issues.beta, originalObject.issues.beta);

        // Assert conversions for arrays and nested dates
        expect(Array.isArray(data.users)).toBe(true);
        assertDateConversion(data.users[0].registeredAt, new Date(originalObject.users[0].registeredAt));
        assertDateConversion(data.users[0].events[0].eventDate, new Date(originalObject.users[0].events[0].eventDate));

        // Restore the mock adapter
        mock.restore();
    });

    test('returns null response data unchanged', async () => {
        const axiosInstance = initializeAxiosInstance(baseURL);
        const mock = createMockAdapter(axiosInstance, url, 'null');

        const { data } = await axiosInstance.get(url);

        expect(data).toBeNull();

        mock.restore();
    });

    test('handles nested null fields without throwing', async () => {
        const axiosInstance = initializeAxiosInstance(baseURL);
        const payloadWithNulls = JSON.stringify({
            createdAt: '2024-01-26T09:45:00.000Z',
            meta: null,
            nested: {
                lastSeenAt: '2024-01-26T09:45:00.000Z',
                profile: null,
            },
        });
        const mock = createMockAdapter(axiosInstance, url, payloadWithNulls);

        const { data } = await axiosInstance.get(url);

        assertDateConversion(data.createdAt, new Date('2024-01-26T09:45:00.000Z'));
        expect(data.meta).toBeNull();
        assertDateConversion(data.nested.lastSeenAt, new Date('2024-01-26T09:45:00.000Z'));
        expect(data.nested.profile).toBeNull();

        mock.restore();
    });

    test('transforms only date strings in the allowlist', async () => {
        const allowlist = ['beta', 'registeredAt'];
        const axiosInstance = initializeAxiosInstance(baseURL, allowlist);

        // Create a mock adapter for the Axios instance
        const mock = createMockAdapter(axiosInstance, url, jsonResponse);

        // Make the request
        const { data } = await axiosInstance.get(url);

        // Assert that non-allowlisted fields remain as strings
        assertStringValue(data.dob, originalObject.dob);
        assertStringValue(data.joinedAt, originalObject.joinedAt);
        assertStringValue(data.issues.alpha, originalObject.issues.alpha);

        // Assert that only the allowlisted fields are converted to Date objects
        assertDateConversion(data.issues.beta, originalObject.issues.beta);
        assertDateConversion(data.users[0].registeredAt, new Date(originalObject.users[0].registeredAt));

        // Assert that eventDate, which is not in the allowlist, remains a string
        assertStringValue(data.users[0].events[0].eventDate, originalObject.users[0].events[0].eventDate);

        // Restore the mock adapter
        mock.restore();
    });
});
