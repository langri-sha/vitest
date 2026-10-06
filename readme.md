# @langri-sha/vitest

Provides some useful helpers that are commonly used for authoring tests.

## Usage

Install the required dependencies:

```sh
npm install -D vitest @langri-sha/vitest
```

Then import your Vitest dependencies from here:

```js
// some.test.js
import { expect, test, temporaryDirectory } from '@langri-sha/vitest'

test(/*...*/)
```

## See

- [`vitest`]
- [`tempy`]

[`vitest`]: https://vitest.dev/
[`tempy`]: https://github.com/sindresorhus/tempy
