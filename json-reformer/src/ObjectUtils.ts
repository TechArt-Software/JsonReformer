/// <summary>
/// Set a property value in a nested object, given a key path.
/// </summary>
function setPropertyValue(input: any, propertyPath: string, newValue: any, script?: string): void {
    if (script) {
        evalSetPropertyValue(input, propertyPath, newValue, script);
    } else {
        calcSetPropertyValue(input, propertyPath, newValue);
    }
}

 function calcSetPropertyValue (input: any, keyPath: string, newValue: any): void {
    const keys = keyPath.split(".");
    let current: any = input;
    
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
    
        // Check for array access like "array[1]"
        const arrayMatch = key.match(/(.+?)\[(\d+)]/);
        if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const arrayIndex = parseInt(arrayMatch[2], 10);
        
            if (!current[arrayKey]) {
                current[arrayKey] = []; // Initialize the array if it doesn't exist
            }
            if (!Array.isArray(current[arrayKey])) {
                throw new Error(`${arrayKey} is not an array`);
            }
            
            if (i === keys.length - 1) {
                // If it's the last key, set the value
                current[arrayKey][arrayIndex] = newValue;
            } else {
                // If it's not the last key, ensure the array element is initialized
                if (!current[arrayKey][arrayIndex]) {
                current[arrayKey][arrayIndex] = {};
                }
                current = current[arrayKey][arrayIndex];
            }
        } else {
            // Regular object key access
            if (i === keys.length - 1) {
                // If it's the last key, set the value
                current[key] = newValue;
            } else {
                // If it's not the last key, ensure the object is initialized
                if (!current[key]) {
                current[key] = {};
                }
                current = current[key];
            }
        }
    }
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
        setProperty(input, newValue);
        // return eval(`input.${property} = newValue`);
    } catch (error: any) {
        throw new Error(`Failed to set value at path "${propertyPath}": ${error.message}`);
    }
}

export default setPropertyValue;