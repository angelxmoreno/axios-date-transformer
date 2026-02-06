# axios-date-transformer

[![Maintainability](https://api.codeclimate.com/v1/badges/f9e98576a38e8bfe88c9/maintainability)](https://codeclimate.com/github/angelxmoreno/axios-date-transformer/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f9e98576a38e8bfe88c9/test_coverage)](https://codeclimate.com/github/angelxmoreno/axios-date-transformer/test_coverage)
[![codecov](https://codecov.io/gh/angelxmoreno/axios-date-transformer/graph/badge.svg?token=4FRU5EL2J2)](https://codecov.io/gh/angelxmoreno/axios-date-transformer)
[![Build on Main](https://github.com/angelxmoreno/axios-date-transformer/actions/workflows/manual-build.yml/badge.svg)](https://github.com/angelxmoreno/axios-date-transformer/actions/workflows/manual-build.yml)
[![License](https://img.shields.io/github/license/angelxmoreno/axios-date-transformer?label=License)](https://github.com/angelxmoreno/axios-date-transformer/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/angelxmoreno/axios-date-transformer?label=Last%20Commit)](https://github.com/angelxmoreno/axios-date-transformer/commits/main)
[![dependencies](https://img.shields.io/librariesio/release/npm/axios-date-transformer?color=%23007a1f&style=flat-square)](https://libraries.io/npm/axios-date-transformer)

An Axios transformer for seamlessly converting ISO 8601 formatted date strings with millisecond precision to JavaScript Date objects. Simplify handling of Date objects in JSON responses with this lightweight utility.

The transformer safely skips `null` values while recursively traversing response objects.

## Installation

```sh
npm install axios-date-transformer
```

or

```sh
yarn add axios-date-transformer
```

or

```sh
bun i axios-date-transformer
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
    }).catch(error => {
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
    }).catch(error => {
        console.error(error);
    });
```

### Using the `allowlist` Feature

The `allowlist` feature allows you to specify which fields in the response should be converted to `Date` objects. This option is useful when only certain fields need to be treated as dates, and it prevents unintended transformations of other fields that match the ISO 8601 date format.

```ts
import { createAxiosDateTransformer } from 'axios-date-transformer';

// Create an Axios instance with the date transformer and an allowlist
const axiosInstance = createAxiosDateTransformer({
    baseURL: 'https://example.org',
    allowlist: ['createdAt', 'updatedAt'], // Only convert these fields to Date objects
});

axiosInstance.get('/api/data').then(response => {
    console.log(response.data);
});
```

### Default Behavior without the `allowlist` Option

If no `allowlist` is specified, all fields matching the ISO 8601 date format (e.g., `YYYY-MM-DDTHH:mm:ss.sssZ`) will be converted to `Date` objects. This can lead to unintended conversions for fields that look like dates but are actually strings meant to be used as IDs, usernames, or other non-date fields.

#### Potential Issue without `allowlist`

If you have fields that visually match the date format but are not intended to be `Date` objects, those fields will also be transformed. For example:

```json
{
  "username": "1980-01-25T00:00:00Z",
  "createdAt": "2023-09-28T12:00:00Z"
}
```

In the above response, `username` is likely meant to be a string, but the transformer will convert it to a `Date` object, causing unexpected behavior in your application.

#### Acknowledgment

Thanks to [@OlliL](https://github.com/OlliL) for highlighting this potential issue in [issue #11](https://github.com/angelxmoreno/axios-date-transformer/issues/11).

### Contributing

If you find a bug or have an enhancement suggestion, feel free to open an issue or submit a pull request. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
