import PropertyReformer from './PropertyReformer';

describe('test PropertyReformer', () => {
    it('should reform property using the defined action', () => {
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
                                "parameters": "input, property, currentValue, newValue",
                                "body": "return newValue + currentValue;"
                                }
                            ]
                        };
        const propertyPath = 'prop1.prop11.prop111[0].prop1111';
        const reformer = PropertyReformer(null);

        // Act
        const reformed = reformer.reform(reform, input, propertyPath);

        // Assert
        expect(reformed).toBeNull();
        expect(input.prop1.prop11.prop111[0].prop1111).toEqual(4444);
    });

    it('should reform property by filtering array', () => {
        // Arrange
       const input = {
                        friends: [
                            {name: "Chris", age: 23, city: "New York"},
                            {name: "Emily", age: 19, city: "Atlanta"},
                            {name: "Joe", age: 32, city: "New York"},
                            {name: "Kevin", age: 19, city: "Atlanta"},
                            {name: "Michelle", age: 27, city: "Los Angeles"},
                            {name: "Robert", age: 45, city: "Manhattan"},
                            {name: "Sarah", age: 31, city: "New York"}
                        ]
                    };
       const reform =   {
                            reformers: [
                            {
                                friends: []
                            }
                            ],
                            scripts: [
                                {
                                    action: "filter",
                                    parameters: "input, property, currentValue, newValue",
                                    body:  `
                                        .select(friend => ({ name: friend.name, age: friend.age }))
                                        .where(friend => 
                                            friend.age >= 23 &&
                                            friend.age <= 31 &&
                                            friend.name.toLowerCase().includes('i')
                                        )
                                        .orderBy(friend => [friend.name, friend.age])
                                    `
                                }
                            ]
                        };
       const propertyPath = 'friends';
       const reformer = PropertyReformer(null);

       // Act
       const reformed = reformer.reform(reform, input, propertyPath);

       // Assert
       expect(reformed).toBeNull();
       expect(input.friends).toStrictEqual([
        {
          name: "Chris",
          age: 23,
        },
        {
          name: "Michelle",
          age: 27,
        },
      ]);
   });

   it('reformer should return Invalid action error when action is not valid', () => {
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
                            "action": "invalid",
                            "parameters": "input, property, currentValue, newValue",
                            "body": "return newValue + currentValue;"
                            }
                        ]
                    };
    const propertyPath = 'prop1.prop11.prop111[0].prop1111';
    const reformer = PropertyReformer(null);

    // Act
    const reformed = reformer.reform(reform, input, propertyPath);

    // Assert
    expect(reformed).not.toBeNull();
    const error = reformed as Error;
    expect(error.message).toEqual("Invalid action: invalid");
   });
   // eval and evaluate to be passed to the following test

    it('reformer should call EvalProperty for "eval" or "evaluate" actions twice', () => {
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
        
        const reform = {
            "prop1.prop11.prop111[0].prop1111": 3333,
            scripts: [
                {
                    "action": "eval",
                    "parameters": "input, property, currentValue, newValue",
                    "body": "return newValue + currentValue;"
                },
                {
                    "action": "evaluate",
                    "parameters": "input, property, currentValue, newValue",
                    "body": "return currentValue * 2;"
                }
            ]
        };
        
        const propertyPath = 'prop1.prop11.prop111[0].prop1111';
        const reformer = PropertyReformer(null);

        // Act
        const reformed = reformer.reform(reform, input, propertyPath);

        // Assert
        expect(reformed).toBeNull();
        expect(input.prop1.prop11.prop111[0].prop1111).toEqual(8888);
    });
});