import ReformerModel from './ReformerModel';
import setPropertyValue from './ObjectUtils';
/// <summary>
/// ObjectReformer module to 
/// </summary>
export const ObjectReformer = (model: ReformerModel) => {

    // assign model to local Model property
    const Model = model;
    
    /// <summary>
    /// Reform the input object according to the reformer model.
    /// </summary>
    const reform = (input: any) => {
        try {
            if (!input) {
                throw new Error("Invalid input");
            }

            for (let reformer of Model.reformers) {
                const key = Object.keys(reformer)[0];
                const newValue = reformer[key];
                setPropertyValue(input, key, newValue);
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