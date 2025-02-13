import { Script, PropertyStatus, Property } from '../ReformerModel';

/// <summary>
/// Set a property value in a nested object, given a key path using value from script.
/// </summary>
function EvalProperty(input: any, property: Property, currentValue: any, newValue: any, script: Script): any {    
    const evalProperty = new Function('input', 'property', 'currentValue', 'newValue', script.body);
    return evalProperty(input, property, currentValue, newValue);
}

export default EvalProperty;