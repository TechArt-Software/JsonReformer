import { EvalProperty } from "./EvalProperty";

describe('EvalProperty', () => {
    it('should evaluate a script and return the result', () => {
        // Arrange
        const input = { 
            prop1: {
                prop11: {
                    prop111: [
                        { prop1111: 1111 },
                    ]
                }
            }
        };
        const scriptBody = "return newValue + currentValue;";
        const property = 'prop1.prop11.prop111[0].prop1111';
        const currentValue = 1111;
        const newValue = 3333;

        // Act
        const result = EvalProperty(input, property, currentValue, newValue, scriptBody);

        // Assert
        expect(result).toEqual(4444);
    });

    it('should evaluate a script with input, property, currentValue, newValue and return the result', () => {
        // Arrange
        const input = { 
            prop1: {
                prop11: {
                    prop111: [
                        { prop1111: 1111 },
                    ]
                }
            }
        };
        const scriptBody = "return input + property + currentValue + newValue;";
        const property = 'prop1.prop11.prop111[0].prop1111';
        const currentValue = 1111;
        const newValue = 3333;

        // Act
        const result = EvalProperty(input, property, currentValue, newValue, scriptBody);

        // Assert
        expect(result).toEqual("[object Object]prop1.prop11.prop111[0].prop111111113333");
    });
});