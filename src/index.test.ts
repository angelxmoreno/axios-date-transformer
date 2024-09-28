import MockAdapter from 'axios-mock-adapter';

import { createAxiosDateTransformer } from './index';

describe('axios-date-transformer', () => {
    test('transforms date strings to Date objects', async () => {
        const originalObject = {
            name: 'John Doe',
            dob: '1980-01-25',
            issues: {
                alpha: new Date('2022-01-25T12:30:00.000Z'),
                beta: new Date('2022-01-26T09:45:00.000Z'),
            },
        };
        const jsonResponse = JSON.stringify(originalObject);
        const axiosInstance = createAxiosDateTransformer({
            baseURL: 'https://example.org',
        });

        // Create a mock adapter for the axios instance
        const mock = new MockAdapter(axiosInstance);

        // Mock the axios request with the resolved value
        mock.onGet('/api/data').reply(200, jsonResponse);

        // Make the request
        const { data } = await axiosInstance.get('/api/data');

        // Assert that the 'dob' property is an instance of Date
        expect(data.dob).toBeInstanceOf(Date);

        // Assert that the date value of 'data.dob' is the same as 'response.dob'
        expect(data.dob.toISOString()).toEqual(new Date(originalObject.dob).toISOString());

        // Assert that the 'issues.alpha' property is an instance of Date
        expect(data.issues.alpha).toBeInstanceOf(Date);

        // Assert that the date value of 'data.issues.alpha' is the same as 'response.issues.alpha'
        expect(data.issues.alpha.toISOString()).toEqual(originalObject.issues.alpha.toISOString());

        // Assert that the 'issues.beta' property is an instance of Date
        expect(data.issues.beta).toBeInstanceOf(Date);

        // Assert that the date value of 'data.issues.beta' is the same as 'response.issues.beta'
        expect(data.issues.beta.toISOString()).toEqual(originalObject.issues.beta.toISOString());

        // Restore the mock adapter
        mock.restore();
    });
});
