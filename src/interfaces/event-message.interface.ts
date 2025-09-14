export interface DataMessage {
  [tag: string]: number;
}

export interface EventMessage {
  timestamp: number;
  values: DataMessage;
}
