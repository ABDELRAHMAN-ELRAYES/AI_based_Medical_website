declare module 'onnxruntime-node' {
  export type Tensor = {
    type: string;
    data: Float32Array | Int32Array | Uint8Array;
    dims: number[];
  };

  export class InferenceSession {
    static create(path: string): Promise<InferenceSession>;
    inputNames: string[];
    outputNames: string[];
    run(feeds: Record<string, Tensor>): Promise<Record<string, Tensor>>;
  }
}
