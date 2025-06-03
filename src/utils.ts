import { jsonrepair } from 'jsonrepair';

export const parseJSON = (json: string): any => {
  return JSON.parse(jsonrepair(json));
}
