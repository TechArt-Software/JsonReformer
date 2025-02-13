import { ScriptArray, Property, Reformer } from './ReformerModel';
import EvalProperty from './actions/EvalProperty';
import SetProperty from './actions/SetProperty';
import { FilterProperty } from './actions/FilterProperty';

export const PropertyReformer = (scripts: ScriptArray) => {

    // assign scripts to local scripts property
    const _scripts = scripts;

    const reform = (reformer: Reformer, input: any, property: Property ) => {
        const newValue = reformer[property];
        const propertyScript = reformer.scripts ?? _scripts;

        if (propertyScript) {
            switch (propertyScript[0].action.toLowerCase()) {
                case 'filter':
                    return FilterProperty(input, property, propertyScript);
                default:
                    break;
            }
            return EvalProperty(input, property, newValue, propertyScript);
        } 
        return SetProperty(input, property, newValue);
    };

    return {
        reform
    };
};

export default PropertyReformer;