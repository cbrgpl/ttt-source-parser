type JSONValue =
    | string
    | number
    | boolean
    | IJSONObject
    | JSONArray
    | null;

type JSONArray = Array<JSONValue>

export interface IJSONObject {
  [x: string]: JSONValue;
}
