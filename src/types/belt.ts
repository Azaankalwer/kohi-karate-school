export interface Belt {
  id: string;
  name: string;
  order: number;
  color: string;
  backgroundColor: string;
  textColor: string;
}

export interface CreateBeltInput {
  name: string;
  order: number;
  color: string;
  backgroundColor: string;
  textColor: string;
}