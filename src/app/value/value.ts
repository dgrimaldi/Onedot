/**
 * Creation of a value class
 */
export class Value {
  domain: string;
  domIsEditable: boolean;
  range: string;
  ranIsEditable: boolean;
  id: number;
  duplicate: number[];
  chain: number[];
  fork: number[];
  cycle: number[];

  constructor(domain: string,
              range: string) {
    this.domain = domain;
    this.domIsEditable = false;
    this.range = range;
    this.ranIsEditable = false;
    this.id = -1;
    this.duplicate = [];
    this.chain = [];
    this.fork = [];
    this.cycle = [];
  }

}
