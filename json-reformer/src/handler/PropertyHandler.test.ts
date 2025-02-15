import PropertyHandler from './PropertyHandler';
import { Script } from '../reformer/ReformerModel';


describe('test PropertyHandler', () => {

    describe('test get value', () => {
        it('should return value of property', () => {
            const input = {
                a: {
                    b: {
                        c: 1
                    }
                }
            };

            const { getValue } = PropertyHandler(input);
            const result = getValue('a.b.c');

            expect(result).toBe(1);
        });

        it('should return value of property with array index', () => {
            const input = {
                a: {
                    b: [
                        { c: 1 },
                        { c: 2 }
                    ]
                }
            };

            const { getValue } = PropertyHandler(input);
            const result = getValue('a.b[1].c');

            expect(result).toBe(2);
        });

        it('should return value of property with array index', () => {
            const input = {
                a: {
                    b: [
                        { c: 1 },
                        { c: 2 }
                    ]
                }
            };

            const { getValue } = PropertyHandler(input);
            const result = getValue('a.b[1].c');

            expect(result).toBe(2);
        });

        it('should throw error if property does not exist', () => {
            const input = {
                a: {
                    b: {
                        c: 1
                    }
                }
            };

            const { getValue } = PropertyHandler(input);

            expect(() => getValue('a.b.d')).toThrowError('Key path "a.b.d" does not exist');
        });

        it('should throw error if array index is not an array', () => {
            const input = {
                a: {
                    b: {
                        c: 1
                    }
                }
            };

            const { getValue } = PropertyHandler(input);

            expect(() => getValue('a.b[0].c')).toThrowError('b is not an array');
        });

        it('should throw error if array index is not an array', () => {
            const input = {
                a: {
                    b: [
                        { c: 1 }
                    ]
                }
            };

            const { getValue } = PropertyHandler(input);

            expect(() => getValue('a.b[0].d')).toThrowError('Key path "a.b[0].d" does not exist');
        });
    });

    describe('test set value', () => {
        it('should set value of property', () => {
            const input = {
                a: {
                    b: {
                        c: 1
                    }
                }
            };

            const { setValue } = PropertyHandler(input);
            setValue('a.b.c', 2);

            expect(input.a.b.c).toBe(2);
        });

        it('should set value of property with array index', () => {
            const input = {
                a: {
                    b: [
                        { c: 1 },
                        { c: 2 }
                    ]
                }
            };

            const { setValue } = PropertyHandler(input);
            setValue('a.b[1].c', 3);

            expect(input.a.b[1].c).toBe(3);
        });

        it('should set value of property with array index', () => {
            const input = {
                a: {
                    b: [
                        { c: 1 },
                        { c: 2 }
                    ]
                }
            };

            const { setValue } = PropertyHandler(input);
            setValue('a.b[1].c', 3);

            expect(input.a.b[1].c).toBe(3);
        });

        it('should throw error if array index is not an array', () => {
            const input = {
                a: {
                    b: {
                        c: 1
                    }
                }
            };

            const { setValue } = PropertyHandler(input);

            expect(() => setValue('a.b[0].c', 2)).toThrowError('b is not an array');
        });
    });

    describe('test process value', () => {
        it('should process value of property', () => {
            const input = {
                a: {
                    b: {
                        c: 1
                    }
                }
            };

            const { processValue } = PropertyHandler(input);
            const script: Script = {
                body: 'return newValue'
            };

            const result = processValue('a.b.c', script, 1, 2);

            expect(result).toBe(2);
        });

        it('should process value of property with array index', () => {
            const input = {
                a: {
                    b: [
                        { c: 1 },
                        { c: 2 }
                    ]
                }
            };

            const { processValue } = PropertyHandler(input);
            const script: Script = {
                body: 'return newValue'
            };

            const result = processValue('a.b[1].c', script, 2, 3);

            expect(result).toBe(3);
        });

        it('should throw error if array index is not an array', () => {
            const input = {
                a: {
                    b: {
                        c: 1
                    }
                }
            };

            const { processValue } = PropertyHandler(input);
            const script: Script = {
                body: 'value'
            };

            expect(() => processValue('a.b[0].c', script, 1, 2)).toThrowError('value is not defined');
        });
    });
});