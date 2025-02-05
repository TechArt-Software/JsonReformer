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

function _getProperty(input: any, keyPath: string): any {
    const keys = keyPath.split(".");
    let current: any = input;
  
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
        throw new Error(`Key path "${keyPath}" does not exist`);
      }
    }
  
    return current;
  }
  
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