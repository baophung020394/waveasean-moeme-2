export interface User {
  ptCommand: string;
  ptGroup: string;
  ptDevice: string;
  result: string;
  params: {
    [key: string]: any;
  };
}
