interface Script {
    action: string;
    parameters: string;
    body: string;
}
type Property = string;
type PropertyStatus = string | undefined | null | Error;
type ReformersStatus = Map<Property, PropertyStatus>;
type ScriptArray = Array<Script> | undefined | null;
type Reformer = {
    [property: Property]: any;
    scripts?: ScriptArray;
};
interface ReformerModel {
    reformers: Array<Reformer>;
    scripts?: ScriptArray;
}

declare const ObjectReformer: (model: ReformerModel) => {
    reform: (input: any) => any;
    status: ReformersStatus;
};

/**
 * Cleans up a JSON string by removing extra unused characters and
 * normalizing string literals so that newlines and extra whitespace
 * inside them are replaced with single spaces.
 *
 * @param jsonStr - The original JSON string.
 * @returns The cleaned JSON string, ready for JSON.parse.
 */
declare const ParseModel: (jsonStr: string) => string;

export { ObjectReformer, ParseModel };
