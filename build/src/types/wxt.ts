export interface ScalarTypeDefinition {
    type: 'boolean' | 'integer' | 'string';
}

export interface FunctionTypeDefinition {
    type: 'function';
    async?: boolean;
    parameters: Named<MaybeOptional<TypeDefinition>>[];
    returns?: MaybeOptional<TypeDefinition>;
}

export interface ArrayTypeDefinition {
    type: 'array';
    description?: string;
    items: TypeDefinition;
}

export interface ObjectTypeDefinition {
    type: 'object';
    properties?: Record<string, TypeDefinition>;
}

export interface UnionTypeDefinition {
    choices: TypeDefinition[];
    description?: string;
}

export type TypeDefinition =
    | ScalarTypeDefinition
    | FunctionTypeDefinition
    | ArrayTypeDefinition
    | ObjectTypeDefinition
    | UnionTypeDefinition;

export type Named<T extends TypeDefinition> = T & {
    name: string;
    description?: string;
};

export type MaybeOptional<T extends TypeDefinition> = T & {
    optional?: boolean;
};

export interface ExperimentApiRegistration {
    scope: 'parent' | 'child';
    events?: string[];
    paths?: string[][];
}

export interface ExperimentApiDefinitions {
    namespace?: string;
    description?: string;
    events?: Named<FunctionTypeDefinition>[];
    functions?: Named<FunctionTypeDefinition>[];
}

export interface ExperimentApiOptions {
    registration: ExperimentApiRegistration;
    definitions: ExperimentApiDefinitions;
}

export interface ExperimentApiDefinition extends ExperimentApiOptions {
    main(): void;
}
