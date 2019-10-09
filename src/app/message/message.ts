/**
 * Creation of a message class
 */
export class Message {
  content: string;
  type: boolean;

  constructor(content: string,
              type: boolean) {
    this.content = content;
    this.type = type;
  }
}
