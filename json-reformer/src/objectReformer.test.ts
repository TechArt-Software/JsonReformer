import { objectReformer } from './objectReformer'; 

describe('test objectReformer', () => {
  it('reform throw error for null input', () => {
    // Arrange
    const input = null;
    const reformer = objectReformer();

    // Act
    const reform = reformer.reform;
    
    // Assert
    expect(() => reform(input,{})).toThrowError('Invalid JSON input');

  });
});