import type { ApartmentOption } from '../types/calculator';

export const apartments: ApartmentOption[] = [
  { id: 'studio', label: 'Студия', rooms: 0 },
  { id: 'one-room', label: '1-комнатная', rooms: 1 },
  { id: 'two-room', label: '2-комнатная', rooms: 2 },
  { id: 'three-room', label: '3-комнатная', rooms: 3 },
];

export const getApartmentLabel = (id: ApartmentOption['id']) =>
  apartments.find((apartment) => apartment.id === id)?.label ?? 'Квартира';
