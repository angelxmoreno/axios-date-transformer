import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from 'axios';

interface DateTransformerConfig<T = any> extends CreateAxiosDefaults<T> {
    // placeholder interface for future configuration
}

const recursiveDateConversion = (data: any): any => {
    if (typeof data === 'object') {
        for (const key in data) {
            if (typeof data[key] === 'string' && isDateString(data[key])) {
                data[key] = new Date(data[key]);
            } else if (typeof data[key] === 'object') {
                data[key] = recursiveDateConversion(data[key]);
            }
        }
    }

    return data;
};

const isDateString = (value: any): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;
    return dateRegex.test(value);
};

const transformDates = <T = any>(response: AxiosResponse<T>): AxiosResponse<T> => {
    if (response.data) {
        response.data = recursiveDateConversion(response.data);
    }

    return response;
};

export const createAxiosDateTransformer = <T = any>(config: DateTransformerConfig<T> = {}): AxiosInstance => {
    return addAxiosDateTransformer(axios.create(config));
};

export const addAxiosDateTransformer = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.response.use(transformDates);

    return instance;
};
