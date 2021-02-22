export interface Parameter {
    key: string;
    value: string;
}

export interface TransientParameter extends Parameter {
    id: string;
}

export function isValidParameterSet(parameters: Parameter[]): boolean {
    return parameters
        .filter((param) => param.key !== '')
        .filter((param) => param.value !== '')
        .length > 0;
}
