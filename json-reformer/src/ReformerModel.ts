interface Script {
  action: string;
  parameters: string;
  body: string;
}

export type ScriptArray = Array<Script> | undefined;

export default interface ReformerModel {
    reformers: Array<{ [key: string]: any }>;
    scripts?: ScriptArray;
}