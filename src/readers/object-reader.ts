import { ObjectParser, type XmlNode } from '../xml-parser/object-parser';

export type ObjectRecord = Record<string, string | null>;
export type ObjectRecords = Partial<Record<string, ObjectRecord[]>>;

export const readObjectFile = (filename: string, tables: readonly string[]): Promise<ObjectRecords> => {
  return new Promise((resolve, reject) => {
    const records: ObjectRecords = {};
    const reader = new ObjectParser(filename, { tableSet: new Set(tables) });
    reader.on('record', (node: XmlNode) => {
      const tableName = String(node.tableName);
      if (!Object.prototype.hasOwnProperty.call(records, tableName)) {
        Object.defineProperty(records, tableName, { value: [], enumerable: true });
      }
      const columns: string[] = [];
      for (const child of node.children ?? []) {
        if (child._tag === 'column') columns.push(String(child.name).toLowerCase());
        if (child._tag === 'row') {
          const cells = child.children ?? [];
          if (cells.length !== columns.length) throw new Error(`Column count mismatch in table ${tableName}`);
          const row = Object.fromEntries(cells.map((cell, index) => [
            columns[index], cell._tag === 'null' ? null : (cell.text ?? '')
          ]));
          records[tableName]!.push(row);
        }
      }
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
