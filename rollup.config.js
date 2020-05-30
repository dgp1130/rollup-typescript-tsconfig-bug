import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/foo.ts',
    output: {
        name: 'foo',
        file: 'dist/foo.js',
    },
    plugins: [
        typescript({
            // Fails to build when enabled.
            // tsconfig: './tsconfig.app.json',
        }),
    ],
};