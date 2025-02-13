import { PropertyStatus, Property, ScriptArray } from '../ReformerModel';
import SetProperty from './SetProperty';
import GetProperty from './GetProperty';

// Extend the Array interface to include our custom methods
declare global {
    interface Array<T> {
        select<U>(selector: (item: T) => U): U[];
        where(predicate: (item: T) => boolean): T[];
        orderBy(selector: (item: T) => any[]): T[];
    }
}

// Implement the custom methods on the Array prototype
if (!Array.prototype.select) {
    Array.prototype.select = function <T, U>(this: T[], selector: (item: T) => U): U[] {
        return this.map(selector);
    };
}

if (!Array.prototype.where) {
    Array.prototype.where = function <T>(this: T[], predicate: (item: T) => boolean): T[] {
        return this.filter(predicate);
    };
}

if (!Array.prototype.orderBy) {
    Array.prototype.orderBy = function <T>(this: T[], selector: (item: T) => any[]): T[] {
        return [...this].sort((a, b) => {
        const keyA = selector(a);
        const keyB = selector(b);
        // Compare each element of the key arrays in order
        for (let i = 0; i < Math.max(keyA.length, keyB.length); i++) {
            const valA = keyA[i];
            const valB = keyB[i];
            if (valA === valB) continue;
            return valA < valB ? -1 : 1;
        }
        return 0;
        });
    };
}

// Function that applies the query string on a given array.
// It uses the Function constructor to create a new function that takes an array ('arr')
// and returns the result of chaining the provided query string to it.
function applyQuery<T>(arr: T[], query: string): any[] {
    const queryFunction = new Function('arr', 'return arr' + query + ';');
    return queryFunction(arr);
}

export function FilterProperty(input: any, property: Property, scripts: ScriptArray): PropertyStatus {
    try {
        const propertyPath = property
            .replace(/\[(\d+)]/g, ".$1") // Convert array indices to dot notation
            .split(".")
            .map(key => (/^\d+$/.test(key) ? `[${key}]` : `.${key}`))
            .join("")
            .replace(/^\./, ""); // Ensure no leading dot for eval;

        if (!scripts || scripts.length === 0) {
            throw new Error('Scripts array is undefined or empty');
        }

        const currentValue = GetProperty(input, propertyPath);
        scripts?.forEach(({ action, parameters, body }) => {
            const filteredArray = applyQuery(currentValue, body);
            SetProperty(input, property, filteredArray);
        });
        return null;
    } catch (error: any) {
        return error;
    }
}

export {};
