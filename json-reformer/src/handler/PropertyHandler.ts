import { Property, Script } from '../reformer/ReformerModel';
import { FilterProperty } from '../actions/FilterProperty';
import { EvalProperty } from '../actions/EvalProperty';

const PropertyHandler = (input: any) => {

    function getValue(property: Property): any {
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

    function setValue(property: Property, newValue: any): any {
        let current: any = input;

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
    }

    const processValue = (property: Property, propertyScript: Script, currentValue: any, newValue: any) : any => {
        const action = propertyScript?.action;
        if(!action){
            return EvalProperty(input, property, currentValue, newValue, propertyScript.body);
        }

        switch (action.toLowerCase()) {
            case 'filter':
                return FilterProperty(currentValue, propertyScript.body);
            case 'eval':
            case 'evaluate':
                return EvalProperty(input, property, currentValue, newValue, propertyScript.body);
            default:
                break;
        }
        throw new Error(`Invalid action: ${action}`);
    }

    return { getValue, setValue, processValue };
};

export default PropertyHandler;