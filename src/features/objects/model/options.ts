import type { ApartmentOption, FinishStyleOption } from '../../../types/calculator';

export const apartmentOptions: ApartmentOption[] = [
  { id: 'studio', label: 'Студия', recommendedArea: 32 },
  { id: 'one-room', label: '1-комнатная', recommendedArea: 45 },
  { id: 'two-room', label: '2-комнатная', recommendedArea: 62 },
  { id: 'three-room', label: '3-комнатная', recommendedArea: 82 },
];

export const finishStyleOptions: FinishStyleOption[] = [
  {
    id: 'provence',
    name: 'Прованс',
    description: 'Светлая отделка, крашеные стены, спокойный ламинат и белые двери.',
  },
  {
    id: 'grunge',
    name: 'Гранж',
    description: 'Более плотные черновые смеси, графитовые покрытия и акцентная электрика.',
  },
  {
    id: 'moire',
    name: 'Муар',
    description: 'Декоративные покрытия, кварцевые грунты и спокойная плитка под камень.',
  },
];

export const getApartmentLabel = (id: ApartmentOption['id']) =>
  apartmentOptions.find((option) => option.id === id)?.label ?? id;

export const getFinishStyleName = (id: FinishStyleOption['id']) =>
  finishStyleOptions.find((option) => option.id === id)?.name ?? id;
