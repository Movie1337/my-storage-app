import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { finishStyles } from '../../mock/styles';
import type { FinishStyle } from '../../types/calculator';

interface StyleSelectorProps {
  value: FinishStyle;
  onChange: (value: FinishStyle) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const selectedStyle = finishStyles.find((style) => style.id === value);

  return (
    <Stack spacing={1}>
      <FormControl fullWidth>
        <InputLabel id="finish-style-label">Стиль отделки</InputLabel>
        <Select
          labelId="finish-style-label"
          label="Стиль отделки"
          value={value}
          onChange={(event) => onChange(event.target.value as FinishStyle)}
        >
          {finishStyles.map((style) => (
            <MenuItem key={style.id} value={style.id}>
              {style.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedStyle && (
        <Typography color="text.secondary" variant="body2">
          {selectedStyle.description}
        </Typography>
      )}
    </Stack>
  );
}
