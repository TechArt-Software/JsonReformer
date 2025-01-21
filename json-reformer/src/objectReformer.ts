export const objectReformer = () => {
    
    const reform = (input: any, model: object) => {
        try {
            if (!input) {
                throw new Error("Invalid input");
            }

            input.model = model;
    
            return input;
        } catch (error) {
            throw new Error("Invalid JSON input");
        }
    }

    return {
        reform
    };
  };