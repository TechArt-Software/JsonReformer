import { ObjectReformer } from './ObjectReformer'; 
import ReformerMode from './ReformerModel';

describe('test objectReformer', () => {
  it('reform throw error for null input', () => {
    // Arrange
    const input = null;
    const reformer = ObjectReformer({} as ReformerMode);

    // Act
    const reform = reformer.reform;
    
    // Assert
    expect(() => reform(input).toThrowError('Invalid JSON input'));
  });

  it('reform loop on all ReformerModel elemets', () => {
    // Arrange
    const input = { 
      prop0: 0, 
      prop1: {
        prop10: 1,
        prop11: 11,
      } };
    const reformerModel = { reformers: [{ "prop0": 100 }, { "prop1.prop11": 1100 }] };
    const reformer = ObjectReformer(reformerModel);
    

    // Act
    const result = reformer.reform(input);

    // Assert
    expect(result.prop0).toEqual(100);
    expect(result.prop1.prop11).toEqual(1100);

  });
});