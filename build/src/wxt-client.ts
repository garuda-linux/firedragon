import type { ExperimentApiDefinition } from './types/wxt';

declare global {
    export abstract class ExtensionAPI {
        abstract getAPI(context: any): any;
    }
    export namespace ExtensionCommon {
        export class EventManager {
            constructor(options: {
                context: any;
                name: string;
                register(fire: { async: (data: any) => void }): () => void;
            });

            api(): any;
        }
    }
    export namespace ExtensionUtils {
        export function makeDataURI(iconUrl: string): Promise<string>;
    }
}

export function defineExperimentApi(options: ExperimentApiDefinition): ExperimentApiDefinition {
    return options;
}

export * from './types/wxt';
