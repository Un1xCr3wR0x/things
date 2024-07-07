/**
 * 
 * @param obj 
 * @returns Camel case
 */
export function convertKeysToCamelCase(obj) {
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const pascalCaseKey = key;
        const firstCharLowerCase = pascalCaseKey.charAt(0).toLowerCase();
        const camelCaseKey = firstCharLowerCase + pascalCaseKey.slice(1);
        result[camelCaseKey] = obj[key];
      }
    }
    return result;
  }