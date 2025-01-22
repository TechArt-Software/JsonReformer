import ReformerModel from './ReformerModel';

/// <summary>
/// ObjectReformer module to 
/// </summary>
export const ObjectReformer = (model: ReformerModel) => {

    // assign model to local Model property
    const Model = model;

    /// <summary>
    /// Set a property value in a nested object, given a key path.
    /// </summary>
    const setPropertyValue = (input: any, keyPath: string, newValue: any): void => {
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
    /// Reform the input object according to the reformer model.
    /// </summary>
    const reform = (input: any) => {
        try {
            if (!input) {
                throw new Error("Invalid input");
            }

            for (let reformer of Model.reformers) {
                const key = Object.keys(reformer)[0];
                const newValue = reformer[key];
                setPropertyValue(input, key, newValue);
            }
            return input;
        } catch (error) {
            throw new Error("Invalid JSON input");
        }
    }

    return {
        reform
    };
  };