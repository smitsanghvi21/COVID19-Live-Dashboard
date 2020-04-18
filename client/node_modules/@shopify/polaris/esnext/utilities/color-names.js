export function normalizeName(name) {
    return name
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase();
}
export function constructColorName(baseName, property, suffix) {
    const name = normalizeName(baseName);
    const propertyName = property ? `-${normalizeName(property)}` : '';
    const constructedSuffix = suffix ? `-${suffix}` : '';
    return `--${name}${propertyName}${constructedSuffix}`;
}
