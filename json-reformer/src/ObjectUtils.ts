import { ScriptArray } from './ReformerModel';

/// <summary>
/// Set a property value in a nested object, given a key path.
/// </summary>
function setPropertyValue(input: any, propertyPath: string, newValue: any, scripts?: ScriptArray): boolean {
    if (scripts) {
        return _evalProperty(input, propertyPath, newValue, scripts);
    } else {
        return _setProperty(input, propertyPath, newValue);
    }
}

const _getProperty = (input: any, keyPath: string): any => {
    return keyPath.split('.').reduce((acc: any, part: string) => 
      acc && typeof acc === 'object' ? acc[part] : undefined, input);
};
  
function _setProperty(input: any, keyPath: string, newValue: any): boolean {
    let current: any = input;
    const keys = keyPath.split(".");
    
    keys.forEach((key, index) => {
        const match = key.match(/(.+?)\[(\d+)]/);
        
        if (match) {
            const [_, arrayKey, arrayIndex] = match;
            const idx = Number(arrayIndex);
            
            current[arrayKey] ??= [];
            if (!Array.isArray(current[arrayKey])) {
                throw new Error(`${arrayKey} is not an array`);
            }

            current = (index === keys.length - 1) 
                ? (current[arrayKey][idx] = newValue) 
                : (current[arrayKey][idx] ??= {});
        } else {
            current = (index === keys.length - 1) 
                ? (current[key] = newValue) 
                : (current[key] ??= {});
        }
    });
    return true;
}

/// <summary>
/// Set a property value in a nested object, given a key path using value from script.
/// </summary>
function _evalProperty(input: any, propertyPath: string, newValue: any, scripts: ScriptArray): boolean {
    try {
        const property = propertyPath
            .replace(/\[(\d+)]/g, ".$1") // Convert array indices to dot notation
            .split(".")
            .map(key => (/^\d+$/.test(key) ? `[${key}]` : `.${key}`))
            .join("")
            .replace(/^\./, ""); // Ensure no leading dot for eval;

        if (!scripts || scripts.length === 0) {
            throw new Error('Scripts array is undefined or empty');
        }

        const currentValue = _getProperty(input, property);
        scripts?.forEach(({ action, parameters, body }) => {
            const evalProperty = new Function('input', 'property', 'currentValue', 'newValue', body);
            const result = evalProperty(input, property, currentValue, newValue);
            _setProperty(input, propertyPath, result);
        });
        return true;
    } catch (error: any) {
        throw new Error(`Failed to set value at path "${propertyPath}": ${error.message}`);
    }
}

export default setPropertyValue;