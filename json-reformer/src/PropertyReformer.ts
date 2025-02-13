import { ScriptArray, Property, Reformer } from './ReformerModel';
import EvalProperty from './actions/EvalProperty';
import SetProperty from './actions/SetProperty';
import GetProperty from './actions/GetProperty';
import { FilterProperty } from './actions/FilterProperty';

export const PropertyReformer = (scripts: ScriptArray) => {

    // assign scripts to local scripts property
    const _scripts = scripts;

    const reform = (reformer: Reformer, input: any, property: Property ) => {
        const newValue = reformer[property];
        const propertyScripts = reformer.scripts ?? _scripts;

        if (propertyScripts) {

            for(let propertyScript of propertyScripts) {
                const currentValue = GetProperty(input, property);
                switch (propertyScript.action.toLowerCase()) {
                    case 'filter':
                        return FilterProperty(input, property, currentValue, propertyScript);
                    default:
                        break;
                }
                return EvalProperty(input, property, currentValue, newValue, propertyScript);
            }
        } 
        return SetProperty(input, property, newValue);
    };

    return {
        reform
    };
};

export default PropertyReformer;