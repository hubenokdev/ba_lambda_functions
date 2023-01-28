import createError from "http-errors";
import validator from "validator";

/**
 * This is a helper function that returns True if the argument is defined,
 * and acts as a generic type-guard
 */
export function isDefined<T>(x: T | undefined | null): x is T {
  return x != null; // checks for undefined as well
}

/**
 * Assert that received variable is defined.
 *
 * @param value received variable's value
 * @param variableName variable name for error message
 * @throws HttpError if the input fails validation
 */
export function assertIsDefined(value: any | undefined, variableName: string, statsCode = 500) {
  if (!isDefined(value)) {
    throw createError(statsCode, `${variableName} is undefined`);
  }
}

export function assertIsDate(x: string | undefined | null, variableName: string, statsCode = 500) {
  if (!!x && !validator.isDate(x)) {
    throw createError(statsCode, `${variableName} is not a valid date`);
  }
}
