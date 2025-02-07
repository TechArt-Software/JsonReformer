interface Script {
  action: string;
  parameters: string;
  body: string;
}

// Alias property type as string
type Property = string;

type PropertyStatus = boolean;

// Status of all reformers
export type ReformersStatus = Map<Property, PropertyStatus>;

export type ScriptArray = Array<Script> | undefined;

export default interface ReformerModel {
    reformers: Array<{ [property: Property]: any, scripts?: ScriptArray }>;
    scripts?: ScriptArray;
}