
import { Property } from '../reformer/ReformerModel';

function SetProperty(input: any, property: Property, newValue: any): any {
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

export default SetProperty;