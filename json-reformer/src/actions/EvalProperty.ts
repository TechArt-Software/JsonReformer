import { Script, PropertyStatus, Property } from '../ReformerModel';
import SetProperty from './SetProperty';

/// <summary>
/// Set a property value in a nested object, given a key path using value from script.
/// </summary>
function EvalProperty(input: any, property: Property, currentValue: any, newValue: any, script: Script): PropertyStatus {
    try {       
        const evalProperty = new Function('input', 'property', 'currentValue', 'newValue', script.body);
        const result = evalProperty(input, property, currentValue, newValue);
        SetProperty(input, property, result);
        return null;
    } catch (error: any) {
        return error;
    }
}

export default EvalProperty;