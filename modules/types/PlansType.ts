export interface IPlan {
  _id: string;
  createdAt: string;
  deleted: boolean;
  description: string;
  features: string[];
  isDeleted: boolean;
  name: string;
  paymentPeriod: string;
  price: number;
  updatedAt: string;
}
