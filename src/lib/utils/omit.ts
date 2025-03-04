/**
 * Omit specific fields from an object.
 * @param obj The source object.
 * @param keys The keys to omit.
 * @returns A new object without the specified keys.
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }; // Create a shallow copy of the object
  for (const key of keys) {
    delete result[key]; // Delete the specified keys
  }
  return result as Omit<T, K>;
}
