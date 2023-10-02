import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    preset: 'jest-preset-angular',
    roots: ['src'],
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
    testEnvironment: 'jest-environment-puppeteer',
};

export default config;
