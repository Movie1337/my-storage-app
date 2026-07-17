import { InputAdornment, TextField } from '@mui/material';

interface HeightSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function HeightSelector({ value, onChange }: HeightSelectorProps) {
  return (
    <TextField
      fullWidth
      label="Высота потолка"
      type="number"
      value={value}
      inputProps={{ min: 2.2, max: 4.5, step: 0.1 }}
      InputProps={{
        endAdornment: <InputAdornment position="end">м</InputAdornment>,
      }}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
