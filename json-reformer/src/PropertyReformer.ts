import { ScriptArray, PropertyStatus, Property } from './ReformerModel';

export const PropertyReformer = () => {

    function _getProperty(input: any, property: Property): any {
        const keys = property.split(".");
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
            throw new Error(`Key path "${property}" does not exist`);
        }
        }
    
        return current;
    }
    
    function SetProperty(input: any, property: Property, newValue: any): PropertyStatus {
        let current: any = input;
        try {
            const keys = property.split(".");
            
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
            return null;
        } catch (error: any) {
            return error;
        }
    }

    /// <summary>
    /// Set a property value in a nested object, given a key path using value from script.
    /// </summary>
    function EvalProperty(input: any, propertyPath: Property, newValue: any, scripts: ScriptArray): PropertyStatus {
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
                SetProperty(input, propertyPath, result);
            });
            return null;
        } catch (error: any) {
            return error;
        }
    }

    const reform = (input: any, propertyPath: Property, newValue: any, scripts: ScriptArray ) => {
        let status;
        if (scripts) {
            status = EvalProperty(input, propertyPath, newValue, scripts);
        } else {
            status = SetProperty(input, propertyPath, newValue);
        }
        return status;
    };

    return {
        reform
    };
};

export default PropertyReformer;