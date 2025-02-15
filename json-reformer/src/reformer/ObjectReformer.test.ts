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

  it('reform loop on all ReformerModel elemets and evaluate sum of values in an array', () => {
    // Arrange
    const input = {
      "array": [
        {
          "one": 1
        },
        {
          "two": 2
        },
        {
          "three": 3
        }
      ],
      "Sum": 0
    };
    const reformerModel = {
            reformers: [
              {
                Sum: 0
              }
            ],
            scripts: [
              {
                body: "return input.array.reduce((acc, obj) => acc + Object.values(obj)[0], 0)"
              }
            ]
          };
    const reformer = ObjectReformer(reformerModel);
    
    // Act
    const result = reformer.reform(input);

    // Assert
    expect(result.Sum).toEqual(6);
  });

  it('reform loop on all ReformerModel elemets, evaluate the value on a given property using script has precedence over general script', () => {
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
                                "prop1.prop11.prop111[0].prop1111": 3333,
                                scripts: [
                                  {
                                    "body": "return currentValue + newValue"
                                  }
                                ]
                              },
                              {
                                "prop1.prop11.prop111[0].prop1111": 1111
                              }
                            ],
                            scripts: [
                                      {
                                        "body": "return input.prop1.prop11.prop111[1].prop2222"
                                      }
                                    ]
                          };
    const reformer = ObjectReformer(reformerModel);
    
    // Act
    const result = reformer.reform(input);

    // Assert
    expect(result.prop1.prop11.prop111[0].prop1111).toEqual(4444);
  });

  it('reform loop on all ReformerModel elemets, only evaluate the first property when duplicate is defined', () => {
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
                                "prop1.prop11.prop111[0].prop1111": 3333
                              },
                              {
                                "prop1.prop11.prop111[0].prop1111": 1111
                              }
                            ],
                            scripts: [
                                      {
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

  it('reform loop on all ReformerModel elemets, log the properties evaluation errors', () => { 
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
                                "prop1.prop11.prop111[0].prop1111": 3333,
                                scripts: [
                                  {
                                    "body": "throw new Error('Property evaluation error')"
                                  }
                                ]
                              },
                              {
                                "prop1.prop11.prop111[1].prop2222": 4444,
                                scripts: [
                                  {
                                    "body": "return newValue"
                                  }
                                ]
                              }
                            ]
                          };
    const reformer = ObjectReformer(reformerModel);
    
    // Act
    const result = reformer.reform(input);
    const reformerStatus = reformer.status;
    
    // Assert
    const prop1ReformerStatus = reformerStatus.get('prop1.prop11.prop111[0].prop1111');
    expect(result.prop1.prop11.prop111[0].prop1111).toEqual(1111);
    expect(result.prop1.prop11.prop111[1].prop2222).toEqual(4444);
    expect(prop1ReformerStatus).toBeInstanceOf(Error);
    expect(prop1ReformerStatus?.toString()).toEqual("Error: Property evaluation error");
  });
});