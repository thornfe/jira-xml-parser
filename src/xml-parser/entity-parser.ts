import { FileParser } from './file-parser';
export type { XmlNode } from './file-parser';

export interface EntityReaderOptions {
  entitySet: Set<string>;
}

export class EntityParser extends FileParser {
  constructor(filename: string, options: EntityReaderOptions) {
    super(filename, tag => options.entitySet.has(tag.name));
  }
}
