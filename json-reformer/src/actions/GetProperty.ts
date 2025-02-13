
import { Property } from '../ReformerModel';

function GetProperty(input: any, property: Property): any {
    let current: any = input;
    const propertyPath = property
        .replace(/\[(\d+)]/g, ".$1") // Convert array indices to dot notation
        .split(".")
        .map(key => (/^\d+$/.test(key) ? `[${key}]` : `.${key}`))
        .join("")
        .replace(/^\./, ""); // Ensure no leading dot for eval;
    const keys = propertyPath.split(".");

    for (const key of keys) {
    const arrayMatch = key.match(/(.+?)\[(\d+)]/); // Check for array access like "array[1]"
    if (arrayMatch) {
        const arrayKey = arrayMatch[1];
        const index = parseInt(arrayMatch[2], 10);
        current = current[arrayKey];
        if (!Array.isArray(current)) {
        throw new Error(`${arrayKey} is not an array`);
        }
        current = current[index];
    } else {
        current = current[key];
    }

    if (current === undefined) {
        throw new Error(`Key path "${property}" does not exist`);
    }
    }

    return current;
}

export default GetProperty;