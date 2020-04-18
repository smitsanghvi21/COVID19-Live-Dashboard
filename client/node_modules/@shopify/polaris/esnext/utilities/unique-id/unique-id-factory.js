export class UniqueIdFactory {
    constructor(idGeneratorFactory) {
        this.idGenerators = {};
        this.idGeneratorFactory = idGeneratorFactory;
    }
    nextId(prefix) {
        if (!this.idGenerators[prefix]) {
            this.idGenerators[prefix] = this.idGeneratorFactory(prefix);
        }
        return this.idGenerators[prefix]();
    }
}
export function globalIdGeneratorFactory(prefix = '') {
    let index = 1;
    return () => `Polaris${prefix}${index++}`;
}
