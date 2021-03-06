import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";
import pkg from "./package.json";

const libraryHeader = `/*! ${pkg.name} v${pkg.version} ${new Date().toISOString().split('T')[0]} */`;
const useStrictHeader = `'use strict';`;
const fileHeader = `${libraryHeader}\n${useStrictHeader}`;

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: pkg.main,
                format: "cjs",
                banner: fileHeader,
                sourcemap: true,
            },
            {
                file: pkg.module,
                format: "es",
                banner: fileHeader,
                sourcemap: true,
            },
            {
                file: "./lib/msal-browser.js",
                format: "umd",
                name: "msal",
                banner: fileHeader,
                sourcemap: true,
            }
        ],
        plugins: [
            resolve({
                browser: true,
                only: ["@azure/msal-common"]
            }),
            typescript({
                typescript: require('typescript')
            })
        ]
    },
    // Minified version of msal
    {
        input: "src/index.ts",
        output: [
            {
                file: "./lib/msal-browser.min.js",
                format: "umd",
                name: "msal",
                banner: useStrictHeader,
                sourcemap: false,
            }
        ],
        plugins: [
            resolve({
                browser: true,
                only: ["@azure/msal-common"]
            }),
            typescript({
                typescript: require('typescript')
            }),
            uglify({
                output: {
                    preamble: libraryHeader
                }
            })
        ]
    }
]
