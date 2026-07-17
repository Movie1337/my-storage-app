import type { FinishStyleOption } from '../types/calculator';

export const finishStyles: FinishStyleOption[] = [
  {
    id: 'provence',
    name: 'Прованс',
    description: 'Светлые стены, спокойный пол, классические белые элементы.',
  },
  {
    id: 'grunge',
    name: 'Гранж',
    description: 'Фактурные поверхности, темные акценты, усиленные расходники.',
  },
  {
    id: 'moire',
    name: 'Муар',
    description: 'Гладкие покрытия, декоративная краска, аккуратные профили.',
  },
];

export const getStyleName = (id: FinishStyleOption['id']) =>
  finishStyles.find((style) => style.id === id)?.name ?? 'Стиль';
