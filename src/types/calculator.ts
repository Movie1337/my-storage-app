export type ApartmentType = 'studio' | 'one-room' | 'two-room' | 'three-room';

export type FinishStyle = 'provence' | 'grunge' | 'moire';

export type MaterialCategory = 'materials' | 'consumables' | 'tools';

export interface ApartmentOption {
  id: ApartmentType;
  label: string;
  rooms: number;
}

export interface FinishStyleOption {
  id: FinishStyle;
  name: string;
  description: string;
}

export interface MaterialItem {
  id: string;
  article: string;
  name: string;
  image: string;
  category: MaterialCategory;
  unit: string;
  quantity: number;
  weight: number;
  volume: number;
}

export interface ToolItem extends MaterialItem {
  selected: boolean;
}

export interface CalculatorInput {
  apartmentType: ApartmentType;
  area: number;
  height: number;
  style: FinishStyle;
}

export interface CalculatorSummary {
  materialPositions: number;
  consumablePositions: number;
  toolPositions: number;
  totalItems: number;
  totalBags: number;
  totalWeight: number;
  totalVolume: number;
}

export interface CalculatorResult {
  materials: MaterialItem[];
  consumables: MaterialItem[];
  tools: ToolItem[];
  summary: CalculatorSummary;
}
