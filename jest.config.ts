import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  rootDir: 'src',
  testPathIgnorePatterns: ['docker/'],
  testMatch: ['<rootDir>/**/*.test.ts'],
};
export default config;
