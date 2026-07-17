import { useMemo, useState } from 'react';
import { calculateRepairRequest, calculateSummary } from '../../../services/calculator';
import { requestService } from '../../requests/services/requestService';
import type { CalculatedMaterial, CalculatorInput, CalculatorResult } from '../../../types/calculator';

const initialInput: CalculatorInput = {
  apartmentType: 'one-room',
  area: 45,
  height: 2.7,
  style: 'provence',
  includeTools: true,
};

const emptySummary = calculateSummary(initialInput, [], [], []);

export function useCalculator() {
  const [input, setInput] = useState<CalculatorInput>(initialInput);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const summary = useMemo(() => {
    if (!result) {
      return emptySummary;
    }

    return calculateSummary(input, result.materials, result.consumables, result.tools);
  }, [input, result]);

  const calculate = async () => {
    setLoading(true);
    try {
      setResult(await calculateRepairRequest(input));
    } finally {
      setLoading(false);
    }
  };

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
    return requestService.createMaterialIssueRequest({
      object: input,
      items: [...result.materials, ...result.consumables, ...selectedTools],
      summary,
    });
  };

  return {
    input,
    result,
    summary,
    loading,
    setInput,
    calculate,
    createRequest,
    updateQuantity: (group: 'materials' | 'consumables' | 'tools', id: string, quantity: number) =>
      updateGroupItem(group, id, { quantity }),
    toggleTool: (id: string, selected: boolean) => updateGroupItem('tools', id, { selected }),
  };
}
