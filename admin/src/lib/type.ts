// export interface User {
//     status: string;
//     avatar: any;
//     _id: string;
//     name: string;
//     email: string;
//     role: "admin" | "user" | "deliveryman";
//     createdAt: string;
//     updatedAt: string;
// }


export interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  _id: string;
}

export interface User {
  createdAt: any;
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user" | "deliveryman";
  addresses: Address[];
  cart: unknown[];   // replace `unknown` with a real CartItem type once you have one
  wishlist: unknown[]; // same — replace with a real Product/id type

}

export type Brand = {
  _id: string;
  name: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Category ={
  _id: string;
  name: string;
  image?: string;
  categoryType: "Featured" | "Hot Categories"| "Top Categories";
  createdAt: string;
}

export type Product ={
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock:number;
  averageRating: number;
  image: string;
  category: Category;
  brand: Brand;
  createdAt: string;
}


export interface StatsData {
  counts: {
    users: number;
    products: number;
    categories: number;
    brands: number;
    orders: number;
    totalRevenue: number;

  };

  roles: {name: string; value: number}[];
  categories: {name: string; value: number}[],
  brands: {name: string; value: number}[];
}