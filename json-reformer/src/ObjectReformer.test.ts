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

  it('reform loop on all ReformerModel elemets and set value on the given property', () => {
    // Arrange
    const input = { 
      prop0: 0, 
      prop1: {
        prop10: 1,
        prop11: 11,
        prop12: {
          prop120: 120,
          prop121: 121,
          prop122: [
            { prop1220: 1220 },
            { prop1221: 1221 },
            { prop1222: 1222 } 
          ]
        }
      } };
    const reformerModel = { reformers: [{ "prop0": 100 }, { "prop1.prop11": 1100 }, { "prop1.prop12.prop122[1]": { propWXYZ : 1234 } }] };
    const reformer = ObjectReformer(reformerModel);
    
    // Act
    const result = reformer.reform(input);

    // Assert
    expect(result.prop0).toEqual(100);
    expect(result.prop1.prop11).toEqual(1100);
    expect(result.prop1.prop12.prop122[1].propWXYZ).toEqual(1234);
  });

  it('reform loop on all ReformerModel elemets and evaluate to set new  value on the given property using script', () => {
    // Arrange
    const input = { 
      prop0: 0, 
      prop1: {
        prop10: 1,
        prop11: 11,
        prop12: {
          prop120: 120,
          prop121: 121,
          prop122: [
            { prop1220: 1220 },
            { prop1221: 1221 },
            { prop1222: 1222 } 
          ]
        }
      } };
    const reformerModel = {
                            reformers: [
                              {
                                "prop0": 100
                              },
                              {
                                "prop1.prop11": 1100
                              },
                              {
                                "prop1.prop12.prop122[1]": {
                                  "propWXYZ": 1234
                                }
                              }
                            ],
                            scripts: [
                                      {
                                        "action": "setProperty",
                                        "parameters": "input, property, currentValue, newValue",
                                        "body": "return newValue"
                                      }
                                    ]
                          };
    const reformer = ObjectReformer(reformerModel);
    
    // Act
    const result = reformer.reform(input);

    // Assert
    expect(result.prop0).toEqual(100);
    expect(result.prop1.prop11).toEqual(1100);
    expect(result.prop1.prop12.prop122[1].propWXYZ).toEqual(1234);
  });

  it('reform loop on all ReformerModel elemets and evaluate the value on the given property using script', () => {
    // Arrange
    const input = { 
      prop1: {
        prop11: {
          prop111: [
            { prop1111: 1111 },
            { prop2222: 2222 },
          ]
        }
      } };
    const reformerModel = {
                            reformers: [
                              {
                                "prop1.prop11.prop111[0].prop1111": 1234
                              }
                            ],
                            scripts: [
                                      {
                                        "action": "setProperty",
                                        "parameters": "input, property, currentValue, newValue",
                                        "body": "return input.prop1.prop11.prop111[1].prop2222"
                                      }
                                    ]
                          };
    const reformer = ObjectReformer(reformerModel);
    
    // Act
    const result = reformer.reform(input);

    // Assert
    expect(result.prop1.prop11.prop111[0].prop1111).toEqual(2222);
  });


  it('reform loop on all ReformerModel elemets and evaluate sum of the currentValue and newValue', () => {
    // Arrange
    const input = { 
      prop1: {
        prop11: {
          prop111: [
            { prop1111: 1111 },
          ]
        }
      } };
    const reformerModel = {
                            reformers: [
                              {
                                "prop1.prop11.prop111[0].prop1111": 2222
                              }
                            ],
                            scripts: [
                                      {
                                        "action": "setProperty",
                                        "parameters": "input, property, currentValue, newValue",
                                        "body": "return currentValue + newValue"
                                      }
                                    ]
                          };
    const reformer = ObjectReformer(reformerModel);
    
    // Act
    const result = reformer.reform(input);

    // Assert
    expect(result.prop1.prop11.prop111[0].prop1111).toEqual(3333);
  });
});