import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CalculatedMaterial, CalculatorInput, CalculatorResult, CalculatorSummary } from '../../../types/calculator';
import { calculatorService } from '../../../services/CalculatorService';
import { styleService } from '../../../services/StyleService';
import { warehouseService } from '../../../services/WarehouseService';
import type { MaterialDefinition } from '../../../types/styles';

const initialInput: CalculatorInput = {
  apartmentType: 'one-room',
  area: 45,
  height: 2.7,
  style: 'provence',
  includeTools: true,
};

const createEmptySummary = (input: CalculatorInput): CalculatorSummary => ({
  objectLabel: `${input.apartmentType}, ${input.area} м2, потолки ${input.height} м`,
  materialPositions: 0,
  consumablePositions: 0,
  toolPositions: 0,
  totalPositions: 0,
  totalQuantity: 0,
  totalWeight: 0,
  totalVolume: 0,
  totalCost: 0,
});

const toCalculatedMaterial = async (
  material: MaterialDefinition & { displayCategoryLabel?: string },
  group: 'materials' | 'consumables' | 'tools',
  selected = true,
): Promise<CalculatedMaterial> => {
  const stock = await warehouseService.getStock(material.id);
  const quantity = Math.max(1, Math.ceil(material.quantity));
  const approximateWeight = Number((quantity * 0.8).toFixed(2));
  const approximateVolume = Number((quantity * 0.01).toFixed(3));

  return {
    id: material.id,
    article: material.article,
    name: material.name,
    category: material.category as CalculatedMaterial['category'],
    unit: material.unit,
    price: material.price,
    image: material.image ?? '',
    weight: approximateWeight,
    volume: approximateVolume,
    stock,
    reserved: 0,
    available: stock,
    group,
    quantity,
    selected,
    displayCategoryLabel: material.displayCategoryLabel ?? 'Строительный материал',
  };
};

export function useCalculator() {
  const [input, setInput] = useState<CalculatorInput>(initialInput);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [styleName, setStyleName] = useState('Прованс');

  const summary = useMemo(() => {
    if (!result) {
      return createEmptySummary(input);
    }

    const items = [...result.materials, ...result.consumables, ...result.tools.filter((tool) => tool.selected)];
    return {
      objectLabel: `${input.apartmentType}, ${input.area} м2, потолки ${input.height} м`,
      materialPositions: result.materials.length,
      consumablePositions: result.consumables.length,
      toolPositions: result.tools.filter((tool) => tool.selected).length,
      totalPositions: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      totalWeight: Number(items.reduce((sum, item) => sum + item.quantity * item.weight, 0).toFixed(1)),
      totalVolume: Number(items.reduce((sum, item) => sum + item.quantity * item.volume, 0).toFixed(2)),
      totalCost: Math.round(items.reduce((sum, item) => sum + item.quantity * item.price, 0)),
    };
  }, [input, result]);

  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const currentInput = input;
      const materials = await calculatorService.calculate({
        apartmentType: currentInput.apartmentType,
        area: currentInput.area,
        ceilingHeight: currentInput.height,
        styleId: currentInput.style,
      });

      const style = await styleService.getStyleById(currentInput.style);
      setStyleName(style?.name ?? currentInput.style);

      const mapped = await Promise.all(
        materials.map(async (material) => {
          const category = material.category as MaterialDefinition['category'];
          const group: 'materials' | 'consumables' | 'tools' =
            category === 'consumables' || category === 'technical' ? 'consumables' : category === 'tools' ? 'tools' : 'materials';
          return toCalculatedMaterial(material, group, group !== 'tools' || currentInput.includeTools);
        }),
      );

      const materialsGroup = mapped.filter((item) => item.group === 'materials');
      const consumablesGroup = mapped.filter((item) => item.group === 'consumables');
      const toolsGroup = mapped.filter((item) => item.group === 'tools');

      setResult({
        materials: materialsGroup,
        consumables: consumablesGroup,
        tools: toolsGroup,
        summary: createEmptySummary(currentInput),
      });
    } finally {
      setLoading(false);
    }
  }, [input]);

  useEffect(() => {
    void calculate();
  }, [calculate]);

  const updateGroupItem = (
    group: keyof Pick<CalculatorResult, 'materials' | 'consumables' | 'tools'>,
    id: string,
    patch: Partial<CalculatedMaterial>,
  ) => {
    setResult((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [group]: current[group].map((item) => (item.id === id ? { ...item, ...patch } : item)),
      };
    });
  };

  const createRequest = async () => {
    if (!result) {
      return null;
    }

    const selectedTools = input.includeTools ? result.tools.filter((tool) => tool.selected) : [];
    const payload = {
      object: input,
      styleName,
      items: [...result.materials, ...result.consumables, ...selectedTools],
      summary,
    };

    console.log('Заявка успешно создана', payload);
    return payload;
  };

  return {
    input,
    result,
    summary,
    loading,
    styleName,
    setInput,
    calculate,
    createRequest,
    updateQuantity: (group: 'materials' | 'consumables' | 'tools', id: string, quantity: number) =>
      updateGroupItem(group, id, { quantity }),
    toggleTool: (id: string, selected: boolean) => updateGroupItem('tools', id, { selected }),
  };
}
