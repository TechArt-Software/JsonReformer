import ReformerModel, { ReformersStatus } from './ReformerModel';
import setPropertyValue from './ObjectUtils';
/// <summary>
/// ObjectReformer module to 
/// </summary>
export const ObjectReformer = (model: ReformerModel) => {

    // assign model to local Model property
    const _model = model;

    // Status of property in reformers
    let _reformersStatus: ReformersStatus = new Map();

    /// <summary>
    /// Reform the input object according to the reformer model.
    /// </summary>
    const reform = (input: any) => {
        try {
            if (!input) {
                throw new Error("Invalid input");
            }

            for (let reformer of _model.reformers) {
                const propertyPath = Object.keys(reformer)[0];
                // Skip if property is already reformed
                if(_reformersStatus.has(propertyPath)) {
                    continue;
                }
                const newValue = reformer[propertyPath];
                const status = setPropertyValue(input, propertyPath, newValue, reformer.scripts ? reformer.scripts : _model.scripts);
                _reformersStatus.set(propertyPath, status);
            }
            return input;
        } catch (error: any) {
            throw new Error(`Invalid JSON input:  ${error.message}` );
        }
    }

    return {
        reform
    };
  };