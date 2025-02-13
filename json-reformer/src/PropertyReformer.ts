import { ScriptArray, Property, Reformer, PropertyStatus, Script } from './ReformerModel';
import EvalProperty from './actions/EvalProperty';
import SetProperty from './actions/SetProperty';
import GetProperty from './actions/GetProperty';
import { FilterProperty } from './actions/FilterProperty';

export const PropertyReformer = (scripts: ScriptArray) => {

    // assign scripts to local scripts property
    const _scripts = scripts;

    const reform = (reformer: Reformer, input: any, property: Property ): PropertyStatus => {
        try
        {
            const newValue = reformer[property];
            const propertyScripts = reformer.scripts ?? _scripts;

            if (propertyScripts) {
                propertyScripts.forEach(propertyScript => {
                    const currentValue = GetProperty(input, property);
                    const result = processScript(propertyScript, currentValue, newValue);
                    SetProperty(input, property, result);
                });
            } else {
                SetProperty(input, property, newValue);
            }
            return null;
        } catch (error: any) {
            return error;
        }

        function processScript(propertyScript: Script, currentValue: any, newValue: any) {
            switch (propertyScript.action.toLowerCase()) {
                case 'filter':
                    return FilterProperty(currentValue, propertyScript);
                default:
                    break;
            }
            return EvalProperty(input, property, currentValue, newValue, propertyScript);
        }
    };

    return {
        reform
    };
};

export default PropertyReformer;