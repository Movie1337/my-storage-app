import { InputAdornment, TextField } from '@mui/material';

interface AreaInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function AreaInput({ value, onChange }: AreaInputProps) {
  return (
    <TextField
      fullWidth
      label="Площадь квартиры"
      type="number"
      value={value}
      inputProps={{ min: 10, step: 1 }}
      InputProps={{
        endAdornment: <InputAdornment position="end">м²</InputAdornment>,
      }}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
