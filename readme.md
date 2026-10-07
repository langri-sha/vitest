# @langri-sha/vitest

[Vitest], re-exported together with [`nock`] for mocking HTTP requests and
[`tempy`]'s `temporaryDirectory`, so tests import everything from one place.

## Usage

Install the required dependencies:

```sh
npm install -D vitest @langri-sha/vitest
```

Then import your test helpers from here:

```js
// some.test.js
import { expect, nock, temporaryDirectory, test } from '@langri-sha/vitest'
```

[vitest]: https://vitest.dev/
[`nock`]: https://github.com/nock/nock
[`tempy`]: https://github.com/sindresorhus/tempy
