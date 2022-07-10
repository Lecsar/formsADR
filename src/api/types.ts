export interface Country {
  id: number;
  name?: string;
  purpose?: string;
  start?: string;
  end?: string;
}

export interface FormValues {
  name?: string;
  age?: number;
  gender?: string;
  countries?: Country[];
}
