import { ScriptArray, Property, Reformer, PropertyStatus } from './ReformerModel';
import PropertyHandler from '../handler/PropertyHandler';

export const PropertyReformer = (scripts: ScriptArray) => {

    // assign scripts to local scripts property
    const _scripts = scripts;

    const reform = (reformer: Reformer, input: any, property: Property ): PropertyStatus => {
        try
        {
            const { getValue, setValue, processValue } = PropertyHandler(input);

            const newValue = reformer[property];
            const propertyScripts = reformer.scripts ?? _scripts;

            if (propertyScripts) {
                propertyScripts.forEach(propertyScript => {
                    const currentValue = getValue(property);
                    const result = processValue(property, propertyScript, currentValue, newValue);
                    setValue(property, result);
                });
            } else {
                setValue(property, newValue);
            }
            return null;
        } catch (error: any) {
            return error;
        }
    };

    return {
        reform
    };
};

export default PropertyReformer;