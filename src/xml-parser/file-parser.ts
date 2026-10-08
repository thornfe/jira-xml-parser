import { createReadStream, type ReadStream } from 'fs';
import { EventEmitter } from 'events';
import { SAXStream, type Tag } from '../sax-ts/sax-stream';

export interface XmlNode {
  _tag: string;
  _level: number;
  text?: string;
  children?: XmlNode[];
  [key: string]: unknown;
}

/** Read the whole document, retaining only one selected top-level element at a time. */
export class FileParser extends EventEmitter {
  private readonly parser = new SAXStream();
  private readonly stream: ReadStream;
  private readonly nodes: XmlNode[] = [];
  private level = 0;
  private selected = false;
  private stopped = false;

  constructor(filename: string, select: (tag: Tag) => boolean) {
    super();
    this.stream = createReadStream(filename);
    const fail = (error: Error) => {
      if (this.stopped) return;
      this.destroy();
      this.emit('error', error);
    };
    this.stream.on('error', fail);
    this.parser.on('error', fail);
    this.parser.on('opentag', (tag: Tag) => {
      this.level++;
      if (this.level === 2) this.selected = select(tag);
      if (!this.selected || this.level < 2) return;
      const node: XmlNode = { _tag: tag.name, _level: this.level };
      for (const [key, value] of Object.entries(tag.attributes)) {
        if (key !== '_tag' && key !== '_level') {
          Object.defineProperty(node, key, { value, enumerable: true, writable: true, configurable: true });
        }
      }
      const parent = this.nodes[this.nodes.length - 1];
      if (parent) (parent.children ??= []).push(node);
      this.nodes.push(node);
    });
    const appendText = (text: string) => {
      const node = this.nodes[this.nodes.length - 1];
      if (this.selected && node) node.text = (node.text ?? '') + text;
    };
    this.parser.on('text', appendText);
    this.parser.on('cdata', appendText);
    this.parser.on('closetag', () => {
      if (this.selected && this.level >= 2) {
        const node = this.nodes.pop();
        if (this.level === 2 && node) this.emit('record', node);
      }
      if (this.level === 2) this.selected = false;
      this.level--;
    });
    this.parser.on('finish', () => {
      if (!this.stopped) this.emit('end');
    });
    this.stream.pipe(this.parser);
  }

  public pause(): void { this.stream.pause(); }
  public resume(): void { this.stream.resume(); }
  public clearBuffers(): void { this.parser._parser.clearBuffers(); }
  public destroy(): void {
    if (this.stopped) return;
    this.stopped = true;
    this.stream.unpipe(this.parser);
    this.stream.destroy();
    this.parser.destroy();
    this.nodes.length = 0;
  }
}
