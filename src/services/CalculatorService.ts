import type { MaterialDefinition } from '../types/styles';
import { materialService } from './MaterialService';
import { styleService } from './StyleService';

export interface CalculatorInputLike {
  apartmentType: string;
  area: number;
  ceilingHeight: number;
  styleId: string;
}

export interface CalculatorService {
  calculate(input: CalculatorInputLike): Promise<MaterialDefinition[]>;
}

class CalculatorServiceImpl implements CalculatorService {
  private getGroup(category: string): 'materials' | 'consumables' | 'tools' {
    if (category === 'consumables') {
      return 'consumables';
    }
    if (category === 'tools') {
      return 'tools';
    }
    return 'materials';
  }

  private normalizeCategory(name: string): string {
    const text = name.toLowerCase();
    if (/(штукатур|гипс|шпакл|грунт|краск|плитк|ламин|двер|труб|муфт|кран|профил|сантех|розет|кабель|электр|свет)/.test(text)) {
      return 'materials';
    }
    if (/(пена|лента|пленк|саморез|дюбел|сетк|затир|клей|гипсокар|респира|монтаж|паста|смазк)/.test(text)) {
      return 'consumables';
    }
    if (/(валик|кист|шпатель|уровен|правил|плиткорез|миксер|кельм|гермет)/.test(text)) {
      return 'tools';
    }
    return 'materials';
  }

  async calculate(input: CalculatorInputLike): Promise<MaterialDefinition[]> {
    const [materials, style] = await Promise.all([
      materialService.getAllMaterials(),
      styleService.getStyleById(input.styleId),
    ]);

    if (!style) {
      return Promise.resolve([]);
    }

    const styleMaterials = await styleService.getMaterialsByStyle(style.id);

    const areaFactor = input.area > 0 ? input.area / 36 : 1;
    const heightFactor = input.ceilingHeight > 0 ? input.ceilingHeight / 2.7 : 1;
    const multiplier = areaFactor * heightFactor;

    return Promise.resolve(
      styleMaterials.map((material) => {
        const category = this.normalizeCategory(material.name);
        return {
          ...material,
          category,
          quantity: Number((material.quantity * multiplier).toFixed(2)),
        };
      }),
    );
  }
}

export const calculatorService = new CalculatorServiceImpl();
