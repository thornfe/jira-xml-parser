import { Writable } from 'stream';

export interface Tag {
  name: string;
  attributes: Record<string, string>;
}

export class SAXStream extends Writable {
  _parser: { clearBuffers(): void };
}
