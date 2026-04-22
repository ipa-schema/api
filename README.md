# @ipa-schema/api

## types

1. `ApiResponse<T>`

## utils

1. `parseApiResponse<T>(r: any): Promise<ApiResponse<T>>`
2. `positiveApiResponse({data})`
3. `negativeApiResponse({error})`
4. `toApiError(error: any): ApiError`
5. `toPager(pager: any): Pager`
6. `PageResult<T>`

## TODO

- [x] add unit tests
