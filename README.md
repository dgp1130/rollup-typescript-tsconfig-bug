# Rollup TypeScript Config Bug

Steps to reproduce:

1. Build the codebase and observe success:
    ```
    $ npm run build
    src/foo.ts → dist/foo.js...
    created dist/foo.js in 571ms
    ```

1. Check out broken state:
    ```
    $ git co broken
    ```

1. Build again and observe failure:
    ```
    $ npm run build
    src/foo.ts → dist/foo.js...
    [!] Error: 'bar' is not exported by src/bar.js, imported by src/foo.ts
    https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module
    src/foo.ts (2:9)
    1: // Fails to import.
    2: import { bar } from './bar';
                ^
    3: bar();
    4: //# sourceMappingURL=foo.js.map
    Error: 'bar' is not exported by src/bar.js, imported by src/foo.ts
        at error (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:217:30)
        at Module.error (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:15145:16)
        at handleMissingExport (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:15042:28)
        at Module.traceVariable (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:15520:24)
        at ModuleScope.findVariable (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:14199:39)
        at Identifier$1.bind (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:10080:40)
        at CallExpression$1.bind (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:9707:23)
        at CallExpression$1.bind (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:12164:15)
        at ExpressionStatement$1.bind (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:9707:23)
        at Program$1.bind (/home/dparker/Source/rollup-tsconfig/node_modules/rollup/dist/shared/rollup.js:9703:31)
    ```

1. Look at difference between the builds:
    ```
    $ git diff master..broken
    diff --git a/rollup.config.js b/rollup.config.js
    index b4b1e3a..f12be5d 100644
    --- a/rollup.config.js
    +++ b/rollup.config.js
    @@ -9,7 +9,7 @@ export default {
         plugins: [
             typescript({
                 // Fails to build when enabled.
    -            // tsconfig: './tsconfig.app.json',
    +            tsconfig: './tsconfig.app.json',
             }),
         ],
     };
    \ No newline at end of file
    ```

The only change is using `tsconfig.app.json` instead of `tsconfig.json`. However,
`tsconfig.app.json` simply extends `tsconfig.json` with no additional changes. These two
configurations should be equivalent!

This error only seems to reproduce when importing a CommonJS file with typescript definitions.
Importing other `.ts` files seems to work fine.

Renaming `tsconfig.json` to `tsconfig.app.json` results in a successful build. So the file name does
not appear to be the issue, but rather extending another config causes the build to fail.