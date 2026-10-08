import { FileParser } from './file-parser';
export type { XmlNode } from './file-parser';

export interface ObjectReaderOptions {
  tableSet: Set<string>;
}

export class ObjectParser extends FileParser {
  constructor(filename: string, options: ObjectReaderOptions) {
    super(filename, tag => tag.name === 'data' && options.tableSet.has(tag.attributes.tableName));
  }
}
