import { Script, PropertyStatus, Property } from '../reformer/ReformerModel';

/// <summary>
/// Set a property value in a nested object, given a key path using value from script.
/// </summary>
export function EvalProperty(input: any, property: Property, currentValue: any, newValue: any, script: string): any {    
    const evalProperty = new Function('input', 'property', 'currentValue', 'newValue', script);
    return evalProperty(input, property, currentValue, newValue);
}