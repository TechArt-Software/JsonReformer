import { ScriptArray, Property, Reformer, PropertyStatus, Script } from './ReformerModel';
import EvalProperty from './actions/EvalProperty';
import SetProperty from './actions/SetProperty';
import GetProperty from './actions/GetProperty';
import { FilterProperty } from './actions/FilterProperty';

export const PropertyReformer = (scripts: ScriptArray) => {

    // assign scripts to local scripts property
    const _scripts = scripts;

    const processScript = (input: any, property: Property, propertyScript: Script, currentValue: any, newValue: any) => {
        const action = propertyScript?.action;
        if(!action){
            return EvalProperty(input, property, currentValue, newValue, propertyScript);
        }

        switch (action.toLowerCase()) {
            case 'filter':
                return FilterProperty(currentValue, propertyScript);
            default:
                break;
        }
        throw new Error(`Invalid action: ${action}`);
    }

    const reform = (reformer: Reformer, input: any, property: Property ): PropertyStatus => {
        try
        {
            const newValue = reformer[property];
            const propertyScripts = reformer.scripts ?? _scripts;

            if (propertyScripts) {
                propertyScripts.forEach(propertyScript => {
                    const currentValue = GetProperty(input, property);
                    const result = processScript(input, property, propertyScript, currentValue, newValue);
                    SetProperty(input, property, result);
                });
            } else {
                SetProperty(input, property, newValue);
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