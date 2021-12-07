export interface Segment {
  id: number;
  duration: number;
  start: number;
  end: number;
  url: string;

  data?: ArrayBuffer;
}
