import { ScriptArray, PropertyStatus, Property } from '../ReformerModel';
import SetProperty from './SetProperty';
import GetProperty from './GetProperty';

/// <summary>
/// Set a property value in a nested object, given a key path using value from script.
/// </summary>
function EvalProperty(input: any, property: Property, newValue: any, scripts: ScriptArray): PropertyStatus {
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
            const evalProperty = new Function('input', 'property', 'currentValue', 'newValue', body);
            const result = evalProperty(input, propertyPath, currentValue, newValue);
            SetProperty(input, property, result);
        });
        return null;
    } catch (error: any) {
        return error;
    }
}

export default EvalProperty;