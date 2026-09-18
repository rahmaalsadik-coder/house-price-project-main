export const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"] as const;
export const TRANSACTION_OPTIONS = ["New Property", "Resale", "Rent/Lease", "Other"] as const;
export const OWNERSHIP_OPTIONS = [
  "Freehold",
  "Leasehold",
  "Co-operative Society",
  "Power Of Attorney",
] as const;
export const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North - East",
  "North - West",
  "South - East",
  "South -West",
] as const;

export type Furnishing = (typeof FURNISHING_OPTIONS)[number];
export type Transaction = (typeof TRANSACTION_OPTIONS)[number];
export type Ownership = (typeof OWNERSHIP_OPTIONS)[number];
export type Facing = (typeof FACING_OPTIONS)[number];

/** Mirrors backend/app/schemas/prediction.py: PredictionRequest */
export interface PredictionRequest {
  location: string;
  area_sqft: number;
  floor_num?: number | null;
  bathroom_num: number;
  balcony_num?: number | null;
  carpark_num?: number | null;
  furnishing?: Furnishing | null;
  transaction?: Transaction | null;
  ownership?: Ownership | null;
  facing?: Facing | null;
}

/** Mirrors backend/app/schemas/prediction.py: PredictionResponse */
export interface PredictionResponse {
  predicted_price: number;
}
