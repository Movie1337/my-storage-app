import { materialTemplates } from '../mock/materials';
import type {
  CalculatorInput,
  CalculatorResult,
  CalculatorSummary,
  MaterialItem,
  ToolItem,
} from '../types/calculator';

const BASE_AREA = 45;
const BASE_HEIGHT = 2.7;

const roundQuantity = (value: number) => Math.max(1, Math.ceil(value));

const scaleMaterial = (
  item: Omit<MaterialItem, 'quantity'> & {
    baseQuantity: number;
    areaFactor: number;
    heightFactor?: number;
  },
  area: number,
  height: number,
): MaterialItem => {
  const areaRatio = area / BASE_AREA;
  const heightRatio = height / BASE_HEIGHT;
  const scaled =
    item.baseQuantity * item.areaFactor * areaRatio +
    item.baseQuantity * (item.heightFactor ?? 0) * Math.max(0, heightRatio - 1);

  const { baseQuantity, areaFactor, heightFactor, ...material } = item;
  return {
    ...material,
    quantity: roundQuantity(scaled),
  };
};

const getTotal = (items: MaterialItem[], key: 'weight' | 'volume') =>
  items.reduce((sum, item) => sum + item.quantity * item[key], 0);

export const createSummary = (
  materials: MaterialItem[],
  consumables: MaterialItem[],
  tools: ToolItem[],
): CalculatorSummary => {
  const selectedTools = tools.filter((tool) => tool.selected);
  const countedItems = [...materials, ...consumables, ...selectedTools];
  const totalBags = materials
    .filter((item) => item.unit.toLowerCase().includes('мешок'))
    .reduce((sum, item) => sum + item.quantity, 0);

  return {
    materialPositions: materials.length,
    consumablePositions: consumables.length,
    toolPositions: selectedTools.length,
    totalItems: countedItems.reduce((sum, item) => sum + item.quantity, 0),
    totalBags,
    totalWeight: Number(getTotal(countedItems, 'weight').toFixed(1)),
    totalVolume: Number(getTotal(countedItems, 'volume').toFixed(2)),
  };
};

export const calculateMaterials = ({
  area,
  height,
  style,
}: CalculatorInput): CalculatorResult => {
  const template = materialTemplates[style];
  const materials = template.materials.map((item) => scaleMaterial(item, area, height));
  const consumables = template.consumables.map((item) => scaleMaterial(item, area, height));
  const tools: ToolItem[] = template.tools.map((item) => ({
    ...scaleMaterial(item, area, height),
    selected: true,
  }));

  return {
    materials,
    consumables,
    tools,
    summary: createSummary(materials, consumables, tools),
  };
};
