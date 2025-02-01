/// <summary>
/// Set a property value in a nested object, given a key path.
/// </summary>
function setPropertyValue(input: any, propertyPath: string, newValue: any, script?: string): void {
    if (script) {
        return evalSetPropertyValue(input, propertyPath, newValue, script);
    } else {
        return _setProperty(input, propertyPath, newValue);
    }
}

const _getProperty = (input: any, keyPath: string): any => {
    return keyPath.split('.').reduce((acc: any, part: string) => 
      acc && typeof acc === 'object' ? acc[part] : undefined, input);
};
  
function _setProperty(input: any, keyPath: string, newValue: any): void {
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
}

/// <summary>
/// Set a property value in a nested object, given a key path.
/// </summary>
function evalSetPropertyValue(input: any, propertyPath: string, newValue: any, script: string): void {
    try {
        const property = propertyPath
            .replace(/\[(\d+)]/g, ".$1") // Convert array indices to dot notation
            .split(".")
            .map(key => (/^\d+$/.test(key) ? `[${key}]` : `.${key}`))
            .join("")
            .replace(/^\./, ""); // Ensure no leading dot for eval

        const setProperty = new Function('input', 'newValue', `
            input.${property} = newValue;
        `);
        return setProperty(input, newValue);
        // return eval(`input.${property} = newValue`);
    } catch (error: any) {
        throw new Error(`Failed to set value at path "${propertyPath}": ${error.message}`);
    }
}

export default setPropertyValue;