import PropertyReformer from './PropertyReformer';
import ReformerModel, { ReformersStatus} from './ReformerModel';

describe('test PropertyReformer', () => {
    it('should reform property', () => {
         // Arrange
        const input = { 
            prop1: {
            prop11: {
                prop111: [
                { prop1111: 1111 },
                ]
            }
            } };
        const reform = {
                            "prop1.prop11.prop111[0].prop1111": 3333,
                            scripts: [
                                {
                                "action": "setProperty",
                                "parameters": "input, property, currentValue, newValue",
                                "body": "return newValue + currentValue;"
                                }
                            ]
                        };
        const propertyPath = 'prop1.prop11.prop111[0].prop1111';
        const newValue = 3333;
        const reformer = PropertyReformer();

        // Act
        const reformed = reformer.reform(input, propertyPath, newValue, reform.scripts);

        // Assert
        expect(reformed).toBeNull();
        expect(input.prop1.prop11.prop111[0].prop1111).toEqual(4444);
    });
});