import { getApartmentLabel } from '../features/objects/model/options';
import type {
  CalculatedMaterial,
  CalculationGroup,
  CalculatorInput,
  CalculatorResult,
  CalculatorSummary,
  FinishStyle,
  MaterialCategory,
  WarehouseMaterial,
} from '../types/calculator';
import { warehouseService } from './warehouseService';

type RecipeLine = {
  category: MaterialCategory;
  group: CalculationGroup;
  coverage: number;
  waste: number;
  priority: number;
};

const styleRecipes: Record<FinishStyle, RecipeLine[]> = {
  provence: [
    { category: 'plaster', group: 'materials', coverage: 5.5, waste: 1.12, priority: 0 },
    { category: 'putty', group: 'materials', coverage: 18, waste: 1.08, priority: 0 },
    { category: 'primer', group: 'materials', coverage: 38, waste: 1.05, priority: 0 },
    { category: 'paint', group: 'materials', coverage: 32, waste: 1.12, priority: 0 },
    { category: 'laminate', group: 'materials', coverage: 1, waste: 1.1, priority: 0 },
    { category: 'doors', group: 'materials', coverage: 18, waste: 1, priority: 0 },
    { category: 'plumbing', group: 'materials', coverage: 28, waste: 1, priority: 0 },
    { category: 'electrics', group: 'materials', coverage: 5, waste: 1.1, priority: 0 },
  ],
  grunge: [
    { category: 'plaster', group: 'materials', coverage: 4.8, waste: 1.15, priority: 2 },
    { category: 'putty', group: 'materials', coverage: 22, waste: 1.06, priority: 3 },
    { category: 'primer', group: 'materials', coverage: 32, waste: 1.08, priority: 1 },
    { category: 'paint', group: 'materials', coverage: 24, waste: 1.14, priority: 2 },
    { category: 'tile', group: 'materials', coverage: 3.2, waste: 1.12, priority: 1 },
    { category: 'laminate', group: 'materials', coverage: 1.15, waste: 1.08, priority: 3 },
    { category: 'doors', group: 'materials', coverage: 20, waste: 1, priority: 2 },
    { category: 'electrics', group: 'materials', coverage: 4.2, waste: 1.15, priority: 1 },
  ],
  moire: [
    { category: 'plaster', group: 'materials', coverage: 5.8, waste: 1.1, priority: 1 },
    { category: 'putty', group: 'materials', coverage: 16, waste: 1.08, priority: 1 },
    { category: 'primer', group: 'materials', coverage: 28, waste: 1.06, priority: 3 },
    { category: 'paint', group: 'materials', coverage: 20, waste: 1.16, priority: 3 },
    { category: 'tile', group: 'materials', coverage: 3.8, waste: 1.1, priority: 0 },
    { category: 'laminate', group: 'materials', coverage: 1.1, waste: 1.08, priority: 1 },
    { category: 'doors', group: 'materials', coverage: 22, waste: 1, priority: 3 },
    { category: 'plumbing', group: 'materials', coverage: 30, waste: 1, priority: 1 },
    { category: 'electrics', group: 'materials', coverage: 4.8, waste: 1.1, priority: 0 },
  ],
};

const consumableRecipe: RecipeLine[] = [
  { category: 'consumables', group: 'consumables', coverage: 9, waste: 1.08, priority: 0 },
  { category: 'consumables', group: 'consumables', coverage: 14, waste: 1.05, priority: 1 },
  { category: 'consumables', group: 'consumables', coverage: 18, waste: 1.05, priority: 2 },
  { category: 'consumables', group: 'consumables', coverage: 22, waste: 1.04, priority: 3 },
  { category: 'consumables', group: 'consumables', coverage: 28, waste: 1.03, priority: 4 },
];

const toolRecipe: RecipeLine[] = [
  { category: 'tools', group: 'tools', coverage: 50, waste: 1, priority: 0 },
  { category: 'tools', group: 'tools', coverage: 55, waste: 1, priority: 1 },
  { category: 'tools', group: 'tools', coverage: 60, waste: 1, priority: 2 },
  { category: 'tools', group: 'tools', coverage: 65, waste: 1, priority: 3 },
  { category: 'tools', group: 'tools', coverage: 70, waste: 1, priority: 4 },
  { category: 'tools', group: 'tools', coverage: 75, waste: 1, priority: 5 },
];

const getWorkArea = ({ area, height }: CalculatorInput) => {
  const floorArea = area;
  const wallArea = area * height * 1.75;
  return floorArea + wallArea;
};

const pickMaterial = (
  catalog: WarehouseMaterial[],
  category: MaterialCategory,
  priority: number,
) => {
  const categoryItems = catalog.filter((material) => material.category === category);
  return categoryItems[priority % categoryItems.length];
};

const toCalculated = (
  material: WarehouseMaterial,
  quantity: number,
  group: CalculationGroup,
  selected = true,
): CalculatedMaterial => ({
  ...material,
  group,
  quantity: Math.max(1, Math.ceil(quantity)),
  selected,
});

export const calculateMaterials = async (input: CalculatorInput): Promise<CalculatedMaterial[]> => {
  const catalog = await warehouseService.getMaterials();
  const workArea = getWorkArea(input);

  return styleRecipes[input.style].map((line) => {
    const material = pickMaterial(catalog, line.category, line.priority);
    const quantityBase = line.category === 'doors' ? input.area / line.coverage : workArea / line.coverage;
    return toCalculated(material, quantityBase * line.waste, line.group);
  });
};

export const calculateConsumables = async (input: CalculatorInput): Promise<CalculatedMaterial[]> => {
  const catalog = await warehouseService.getMaterials();
  const workArea = getWorkArea(input);

  return consumableRecipe.map((line) => {
    const material = pickMaterial(catalog, line.category, line.priority);
    return toCalculated(material, (workArea / line.coverage) * line.waste, 'consumables');
  });
};

export const calculateTools = async (input: CalculatorInput): Promise<CalculatedMaterial[]> => {
  const catalog = await warehouseService.getMaterials();
  const multiplier = input.area > 65 ? 2 : 1;

  return toolRecipe.map((line) => {
    const material = pickMaterial(catalog, line.category, line.priority);
    return toCalculated(material, multiplier, 'tools', input.includeTools);
  });
};

export const calculateSummary = (
  input: CalculatorInput,
  materials: CalculatedMaterial[],
  consumables: CalculatedMaterial[],
  tools: CalculatedMaterial[],
): CalculatorSummary => {
  const selectedTools = input.includeTools ? tools.filter((tool) => tool.selected) : [];
  const items = [...materials, ...consumables, ...selectedTools];

  return {
    objectLabel: `${getApartmentLabel(input.apartmentType)}, ${input.area} м2, потолки ${input.height} м`,
    materialPositions: materials.length,
    consumablePositions: consumables.length,
    toolPositions: selectedTools.length,
    totalPositions: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalWeight: Number(items.reduce((sum, item) => sum + item.quantity * item.weight, 0).toFixed(1)),
    totalVolume: Number(items.reduce((sum, item) => sum + item.quantity * item.volume, 0).toFixed(2)),
    totalCost: Math.round(items.reduce((sum, item) => sum + item.quantity * item.price, 0)),
  };
};

export const calculateRepairRequest = async (
  input: CalculatorInput,
): Promise<CalculatorResult> => {
  const [materials, consumables, tools] = await Promise.all([
    calculateMaterials(input),
    calculateConsumables(input),
    calculateTools(input),
  ]);

  return {
    materials,
    consumables,
    tools,
    summary: calculateSummary(input, materials, consumables, tools),
  };
};
