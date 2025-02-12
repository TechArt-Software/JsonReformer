import { ScriptArray, PropertyStatus, Property, Reformer } from './ReformerModel';

export const PropertyReformer = (scripts: ScriptArray) => {

    // assign scripts to local scripts property
    const _scripts = scripts;

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

            const currentValue = _getProperty(input, propertyPath);
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

    const reform = (reformer: Reformer, input: any, property: Property ) => {
        const newValue = reformer[property];
        const propertyScript = reformer.scripts ?? scripts;

        if (propertyScript) {
            return EvalProperty(input, property, newValue, propertyScript);
        } 
        return SetProperty(input, property, newValue);
    };

    return {
        reform
    };
};

export default PropertyReformer;