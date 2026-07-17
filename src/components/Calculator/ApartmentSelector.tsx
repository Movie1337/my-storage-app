import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { apartments } from '../../mock/apartments';
import type { ApartmentType } from '../../types/calculator';

interface ApartmentSelectorProps {
  value: ApartmentType;
  onChange: (value: ApartmentType) => void;
}

export function ApartmentSelector({ value, onChange }: ApartmentSelectorProps) {
  return (
    <FormControl>
      <FormLabel>Тип квартиры</FormLabel>
      <RadioGroup
        value={value}
        onChange={(event) => onChange(event.target.value as ApartmentType)}
      >
        {apartments.map((apartment) => (
          <FormControlLabel
            key={apartment.id}
            value={apartment.id}
            control={<Radio />}
            label={apartment.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
