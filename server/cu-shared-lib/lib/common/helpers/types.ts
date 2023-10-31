export type InjectAuth<T> = T & {
  userId: number;
};

export type Nullable<T> = T | null;
