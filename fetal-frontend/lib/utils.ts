import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates an initial state object for a form from a list of feature names.
 * @param features - An array of strings representing form field names.
 * @returns An object with each feature name as a key and an empty string as the value.
 */
export const createInitialFeaturesState = (features: readonly string[]) =>
  Object.fromEntries(features.map(feature => [feature, ""]))
