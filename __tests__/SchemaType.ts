import {isSchemaType} from "../lib/SchemaType";

describe('isSchemaType', () => {
    it('should reject scalar values', () => {
        for (let scalar of ['string', 123, true, null, void 0]) {
            expect(isSchemaType(scalar)).toBe(false);
        }
    });

    it('should accept values with a string `attributeName` property', () => {
        expect(isSchemaType({
            type: 'Boolean',
            attributeName: 'boolProp'
        })).toBe(true);
    });

    it('should reject values with a non-string `attributeName` property', () => {
        expect(isSchemaType({
            type: 'Boolean',
            attributeName: 123
        })).toBe(false);
    });

    describe('keyable types', () => {
        for (let dataType of ['Binary', 'Number', 'String']) {
            it(
                `should accept ${dataType} type declarations with a keyConfiguration`,
                () => {
                    expect(isSchemaType({
                        type: dataType,
                        keyConfiguration: {type: 'HASH'},
                    })).toBe(true);
                }
            );

            it(
                `should reject ${dataType} type declarations with a keyConfiguration without a 'type' property`,
                () => {
                    expect(isSchemaType({
                        type: dataType,
                        keyConfiguration: {foo: 'HASH'},
                    })).toBe(false);
                }
            );

            it(
                `should reject ${dataType} type declarations with a scalar keyConfiguration`,
                () => {
                    for (let scalar of ['string', 123, null, true]) {
                        expect(isSchemaType({
                            type: dataType,
                            keyConfiguration: scalar,
                        })).toBe(false);
                    }
                }
            );

            it(
                `should accept ${dataType} type declarations with an array of indexKeyConfigurations`,
                () => {
                    expect(isSchemaType({
                        type: dataType,
                        indexKeyConfigurations: [{type: 'HASH', indexName: 'foo'}],
                    })).toBe(true);
                }
            );

            it(
                `should reject ${dataType} type declarations whose indexKeyConfigurations lack an index name`,
                () => {
                    expect(isSchemaType({
                        type: dataType,
                        indexKeyConfigurations: [{type: 'HASH'}],
                    })).toBe(false);
                }
            );

            it(
                `should reject ${dataType} type declarations with a single, valid indexKeyConfiguration`,
                () => {
                    expect(isSchemaType({
                        type: dataType,
                        indexKeyConfigurations: {type: 'HASH', indexName: 'foo'},
                    })).toBe(false);
                }
            );

            it(
                `should reject ${dataType} type declarations with scalar indexKeyConfiguration`,
                () => {
                    for (let scalar of ['string', 123, null, true, void 0]) {
                        expect(isSchemaType({
                            type: dataType,
                            indexKeyConfigurations: [scalar],
                        })).toBe(false);
                    }
                }
            );
        }
    });

    describe('Binary types', () => {
        it('should accept Binary types', () => {
            expect(isSchemaType({type: 'Binary'})).toBe(true);
        });
    });

    describe('BinarySet types', () => {
        it('should accept BinarySet types', () => {
            expect(isSchemaType({type: 'BinarySet'})).toBe(true);
        });
    });

    describe('Boolean types', () => {
        it('should accept Boolean types', () => {
            expect(isSchemaType({type: 'Boolean'})).toBe(true);
        });
    });

    describe('Custom types', () => {
        it(
            'should accept Custom types with a defined marshaller and unmarshaller',
            () => {
                expect(isSchemaType({
                    type: 'Custom',
                    marshall: () => {},
                    unmarshall: () => {},
                })).toBe(true);
            }
        );

        it('should reject Custom types without a defined marshaller', () => {
            expect(isSchemaType({
                type: 'Custom',
                unmarshall: () => {},
            })).toBe(false);
        });

        it('should reject Custom types without a defined unmarshaller', () => {
            expect(isSchemaType({
                type: 'Custom',
                marshall: () => {},
            })).toBe(false);
        });
    });

    describe('Date types', () => {
        it('should accept Date types', () => {
            expect(isSchemaType({type: 'Date'})).toBe(true);
        });
    });

    describe('List types', () => {
        it('should accept List types', () => {
            expect(isSchemaType({
                type: 'List',
                memberType: {type: 'Boolean'},
            })).toBe(true);
        });

        it('should reject List types without a defined memberType', () => {
            expect(isSchemaType({type: 'List'})).toBe(false);
        });

        it('should reject List types with malformed memberTypes', () => {
            expect(isSchemaType({
                type: 'List',
                memberType: 'Boolean',
            })).toBe(false);
        });
    });

    describe('Map types', () => {
        it('should accept Map types', () => {
            expect(isSchemaType({
                type: 'Map',
                memberType: {type: 'Boolean'},
            })).toBe(true);
        });

        it('should reject Map types without a defined memberType', () => {
            expect(isSchemaType({type: 'Map'})).toBe(false);
        });

        it('should reject Map types with malformed memberTypes', () => {
            expect(isSchemaType({
                type: 'Map',
                memberType: 'Boolean',
            })).toBe(false);
        });
    });

    describe('Null types', () => {
        it('should accept Null types', () => {
            expect(isSchemaType({type: 'Null'})).toBe(true);
        });
    });

    describe('Number types', () => {
        it('should accept Number types', () => {
            expect(isSchemaType({type: 'Number'})).toBe(true);
        });
    });

    describe('NumberSet types', () => {
        it('should accept NumberSet types', () => {
            expect(isSchemaType({type: 'NumberSet'})).toBe(true);
        });
    });

    describe('String types', () => {
        it('should accept String types', () => {
            expect(isSchemaType({type: 'String'})).toBe(true);
        });
    });

    describe('StringSet types', () => {
        it('should accept StringSet types', () => {
            expect(isSchemaType({type: 'StringSet'})).toBe(true);
        });
    });

    describe('Tuple types', () => {
        it('should accept Tuple types', () => {
            expect(isSchemaType({
                type: 'Tuple',
                members: [{type: 'Boolean'}, {type: 'String'}],
            })).toBe(true);
        });

        it('should reject Tuple types without defined members', () => {
            expect(isSchemaType({type: 'Tuple'})).toBe(false);
        });

        it('should reject Tuple types with malformed members', () => {
            expect(isSchemaType({
                type: 'Tuple',
                members: ['Boolean', 'String'],
            })).toBe(false);
        });
    });
});