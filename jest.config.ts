/** @jest-config-loader ts-node */

import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    roots: ['<rootDir>/src'],
    testMatch: [
      '**/__tests__/**/*.ts',
      '**/?(*.)+(spec|test).ts'
    ],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts',
    ],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  };
};