import { EntityParser } from '../xml-parser/entity-parser';
import type { XmlNode } from '../xml-parser/entity-parser';
import type { EntityType } from '../constants';

export type EntityRecord = Record<string, string | undefined>;
export type EntityRecords<T extends EntityType = EntityType> = Record<T, EntityRecord[]>;
export type EntityFilter = (record: XmlNode) => boolean;

export const readEntityFile = <T extends EntityType>(
  filename: string,
  entities: readonly T[],
  compareFunc: EntityFilter = () => true
): Promise<EntityRecords<T>> => {
  return new Promise((resolve, reject) => {
    const records = Object.fromEntries(entities.map(entity => [entity, [] as EntityRecord[]])) as EntityRecords<T>;
    const reader = new EntityParser(filename, { entitySet: new Set(entities) });
    reader.on('record', (node: XmlNode) => {
      if (!compareFunc(node)) return;
      const record: EntityRecord = {};
      for (const [key, value] of Object.entries(node)) {
        // Whitespace between child fields is XML formatting, not a record field.
        if (key === 'text' && node.children?.length && typeof value === 'string' && !value.trim()) continue;
        if (key !== '_tag' && key !== '_level' && key !== 'children') {
          Object.defineProperty(record, key, { value, enumerable: true, writable: true, configurable: true });
        }
      }
      for (const child of node.children ?? []) {
        Object.defineProperty(record, child._tag, {
          value: child.text ?? '', enumerable: true, writable: true, configurable: true
        });
      }
      records[node._tag as T].push(record);
    });
    reader.on('end', () => {
      reader.destroy();
      resolve(records);
    });
    reader.on('error', (error: Error) => {
      reader.destroy();
      reject(error);
    });
  });
};
