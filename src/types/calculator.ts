export type ApartmentType = 'studio' | 'one-room' | 'two-room' | 'three-room';

export type FinishStyle = 'provence' | 'grunge' | 'moire';

export type MaterialCategory =
  | 'plaster'
  | 'putty'
  | 'primer'
  | 'paint'
  | 'tile'
  | 'laminate'
  | 'doors'
  | 'plumbing'
  | 'electrics'
  | 'consumables'
  | 'tools';

export type MaterialDisplayCategory = 'building' | 'plumbing' | 'fasteners' | 'finish' | 'electrics' | 'tools' | 'technical' | 'doors';

export type CalculationGroup = 'materials' | 'consumables' | 'tools';

export interface ApartmentOption {
  id: ApartmentType;
  label: string;
  recommendedArea: number;
}

export interface FinishStyleOption {
  id: FinishStyle;
  name: string;
  description: string;
}

export interface WarehouseMaterial {
  id: string;
  article: string;
  name: string;
  category: MaterialCategory;
  unit: string;
  price: number;
  weight: number;
  volume: number;
  stock: number;
  reserved: number;
  available: number;
  image: string;
}

export interface CalculatedMaterial extends WarehouseMaterial {
  group: CalculationGroup;
  quantity: number;
  selected: boolean;
  displayCategoryLabel: string;
}

export interface CalculatorInput {
  apartmentType: ApartmentType;
  area: number;
  height: number;
  style: FinishStyle;
  includeTools: boolean;
}

export interface CalculatorSummary {
  objectLabel: string;
  materialPositions: number;
  consumablePositions: number;
  toolPositions: number;
  totalPositions: number;
  totalQuantity: number;
  totalWeight: number;
  totalVolume: number;
  totalCost: number;
}

export interface CalculatorResult {
  materials: CalculatedMaterial[];
  consumables: CalculatedMaterial[];
  tools: CalculatedMaterial[];
  summary: CalculatorSummary;
}
