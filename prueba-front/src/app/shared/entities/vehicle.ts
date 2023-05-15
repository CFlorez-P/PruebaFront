export interface Vehicle {

  estacion :string;
  sentido : string;
  hora: number;
  categoria :string;
  fecha :string;
  cantidad :number;
  valorTabulado :number;

  [key: string]: string | number;
}
