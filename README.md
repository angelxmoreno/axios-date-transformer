# axios-date-transformer

[![Maintainability](https://api.codeclimate.com/v1/badges/f9e98576a38e8bfe88c9/maintainability)](https://codeclimate.com/github/angelxmoreno/axios-date-transformer/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f9e98576a38e8bfe88c9/test_coverage)](https://codeclimate.com/github/angelxmoreno/axios-date-transformer/test_coverage)
[![codecov](https://codecov.io/gh/angelxmoreno/axios-date-transformer/graph/badge.svg?token=4FRU5EL2J2)](https://codecov.io/gh/angelxmoreno/axios-date-transformer)
[![Build on Main](https://github.com/angelxmoreno/axios-date-transformer/actions/workflows/manual-build.yml/badge.svg)](https://github.com/angelxmoreno/axios-date-transformer/actions/workflows/manual-build.yml)
[![License](https://img.shields.io/github/license/angelxmoreno/axios-date-transformer?label=License)](https://github.com/angelxmoreno/axios-date-transformer/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/angelxmoreno/axios-date-transformer?label=Last%20Commit)](https://github.com/angelxmoreno/axios-date-transformer/commits/main)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/angelxmoreno/axios-date-transformer)

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
