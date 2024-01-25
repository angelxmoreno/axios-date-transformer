# axios-date-transformer

[![codecov](https://codecov.io/gh/angelxmoreno/axios-date-transformer/graph/badge.svg?token=4FRU5EL2J2)](https://codecov.io/gh/angelxmoreno/axios-date-transformer)

An Axios transformer for seamlessly converting ISO 8601 formatted date strings with millisecond precision to JavaScript Date objects. Simplify handling of Date objects in JSON responses with this lightweight utility.

## Installation

```sh
npm install axios-date-transformer
```

or

```sh
yarn add axios-date-transformer
```

## Usage

### Creating a new axios instance

```ts
import { createAxiosDateTransformer } from 'axios-date-transformer';

// Create an Axios instance with the date transformer
const axiosInstance = createAxiosDateTransformer({
    baseURL: 'https://example.org',
});

// Use axiosInstance for your requests
axiosInstance
    .get('/api/data')
    .then(response => {
        // Date strings in the response data are automatically converted to Date objects
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
```

### Adding the transformer to an already existing instance of axios

```ts
import { addAxiosDateTransformer } from 'axios-date-transformer';

// Create an Axios instance with the date transformer
const axiosInstance = axios.create({
    baseURL: 'https://example.org',
});
const axiosWithTransformer = addAxiosDateTransformer(axiosInstance);

// Use axiosInstance for your requests
axiosWithTransformer
    .get('/api/data')
    .then(response => {
        // Date strings in the response data are automatically converted to Date objects
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
```

## Contributing

If you find a bug or have an enhancement suggestion, feel free to open an issue or submit a pull request. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
