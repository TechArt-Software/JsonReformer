interface Script {
  action: string;
  parameters: string;
  body: string;
}

// Alias property type as string
type Property = string;

export type PropertyStatus = string | undefined | null | Error;

// Status of all reformers
export type ReformersStatus = Map<Property, PropertyStatus>;

export type ScriptArray = Array<Script> | undefined | null;

export default interface ReformerModel {
    reformers: Array<{ [property: Property]: any, scripts?: ScriptArray }>;
    scripts?: ScriptArray;
}