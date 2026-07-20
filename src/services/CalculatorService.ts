import type { MaterialDefinition } from '../types/styles';
import { materialService } from './MaterialService';
import { styleService } from './StyleService';

interface CalculatedMaterialLike extends MaterialDefinition {
  displayCategoryLabel: string;
  displayCategory: string;
}

export interface CalculatorInputLike {
  apartmentType: string;
  area: number;
  ceilingHeight: number;
  styleId: string;
}

export interface CalculatorService {
  calculate(input: CalculatorInputLike): Promise<CalculatedMaterialLike[]>;
}

class CalculatorServiceImpl implements CalculatorService {
  private getGroup(category: string): 'materials' | 'consumables' | 'tools' {
    if (category === 'consumables' || category === 'technical') {
      return 'consumables';
    }
    if (category === 'tools') {
      return 'tools';
    }
    return 'materials';
  }

  private normalizeCategory(category: string): string {
    if (category === 'tools') {
      return 'tools';
    }
    if (category === 'consumables' || category === 'technical') {
      return 'consumables';
    }
    return 'materials';
  }

  private getDisplayCategory(material: { name: string; category: string }): { label: string; key: string } {
    const rawCategory = (material.category || '').toLowerCase();
    const text = material.name.toLowerCase();

    if (rawCategory === 'plumbing') {
      if (/(труба|угол|тройник|муфта|переход|шланг|подводка|фит|кран|резьб|врез|канализа|водороз|хомут|канал|трубоп|профил|потол|переходник)/.test(text)) {
        return { label: 'Инженерные системы', key: 'engineering' };
      }
      if (/(смес|ванн|раков|сифон|инстал|душ|унитаз|мойк|биде|душевая|зерк|шайб|кнопк)/.test(text)) {
        return { label: 'Сантехника', key: 'plumbing' };
      }
      return { label: 'Инженерные системы', key: 'engineering' };
    }
    if (rawCategory === 'fasteners') {
      return { label: 'Крепеж', key: 'fasteners' };
    }
    if (rawCategory === 'doors') {
      return { label: 'Двери', key: 'doors' };
    }
    if (rawCategory === 'electrics') {
      return { label: 'Электрика', key: 'electrics' };
    }
    if (rawCategory === 'tools') {
      return { label: 'Инструмент', key: 'tools' };
    }
    if (rawCategory === 'technical') {
      return { label: 'Технические товары', key: 'technical' };
    }
    if (rawCategory === 'finish') {
      return { label: 'Финишная отделка', key: 'finish' };
    }
    if (rawCategory === 'building') {
      return { label: 'Строительный материал', key: 'building' };
    }

    return { label: 'Строительный материал', key: 'building' };
  }

  async calculate(input: CalculatorInputLike): Promise<CalculatedMaterialLike[]> {
    const [materials, style] = await Promise.all([
      materialService.getAllMaterials(),
      styleService.getStyleById(input.styleId),
    ]);

    if (!style) {
      return Promise.resolve([]);
    }

    const styleMaterials = await styleService.getMaterialsByStyle(style.id);

    const areaFactor = input.area > 0 ? 0.35 + input.area / 220 : 0.8;
    const heightFactor = input.ceilingHeight > 0 ? 0.8 + (input.ceilingHeight - 2.7) * 0.06 : 0.9;
    const baseMultiplier = Math.max(0.5, Math.min(1.05, areaFactor * heightFactor));

    const computed = styleMaterials
      .map((material) => {
        const text = material.name.toLowerCase();
        if (/(натяж|потолки?)/.test(text)) {
          return null;
        }

        const category = this.normalizeCategory(material.category);
        const displayCategory = this.getDisplayCategory(material);
        const categoryFactor = /(профил|труб|муфт|кран|угол|тройник|сантех|смес|раков|сифон|инстал|душ|двер|розет|кабель|автомат|щит|свет)/.test(text)
          ? 0.15
          : /(пена|лента|пленк|саморез|дюбел|сетк|затир|клей|гипсокар|монтаж|паста|гермет)/.test(text)
            ? 0.18
            : /(валик|кист|шпатель|уровен|правил|плиткорез|миксер|кельм)/.test(text)
              ? 0.12
              : 0.2;

        const quantity = Math.max(1, Math.round(material.quantity * baseMultiplier * categoryFactor));

        return {
          ...material,
          category,
          quantity,
          displayCategoryLabel: displayCategory.label,
          displayCategory: displayCategory.key,
        };
      })
      .filter((item): item is CalculatedMaterialLike => item !== null);

    return Promise.resolve(computed);
  }
}

export const calculatorService = new CalculatorServiceImpl();
