import { FilterProperty } from "./FilterProperty";

describe('FilterProperty', () => {
    it('should evaluate a script and return the result', () => {
        // Arrange
        const input = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
        ];
        const scriptBody = ".where(x => x.id > 1).select(x => x.name)";
        const expected = ['Bob', 'Charlie'];

        // Act
        const result = FilterProperty(input, scriptBody);

        // Assert
        expect(result).toEqual(expected);
    });
    
});