export const objectReformer = () => {
    
    const reform = (input: any, model: object) => {
        try {
            if (!input) {
                throw new Error("Invalid input");
            }

            input.name = input.name + "_modified";
    
            return input;
        } catch (error) {
            throw new Error("Invalid JSON input");
        }
    }

    return {
        reform
    };
  };