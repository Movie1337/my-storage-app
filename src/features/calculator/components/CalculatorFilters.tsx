import { Box, Button, FormControlLabel, MenuItem, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import type { ApartmentType, CalculatorInput, FinishStyle } from '../../../types/calculator';
import { apartmentOptions, finishStyleOptions } from '../../objects/model/options';

interface CalculatorFiltersProps {
  value: CalculatorInput;
  loading: boolean;
  onChange: (value: CalculatorInput) => void;
  onCalculate: () => void;
}

export function CalculatorFilters({ value, loading, onChange, onCalculate }: CalculatorFiltersProps) {
  const update = <TKey extends keyof CalculatorInput>(key: TKey, nextValue: CalculatorInput[TKey]) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2.5}>
        <Typography variant="h2">Параметры расчета</Typography>

        <TextField
          select
          label="Тип квартиры"
          value={value.apartmentType}
          onChange={(event) => update('apartmentType', event.target.value as ApartmentType)}
          fullWidth
        >
          {apartmentOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr' }, gap: 2 }}>
          <TextField
            label="Площадь, м2"
            type="number"
            value={value.area}
            inputProps={{ min: 18, max: 160, step: 1 }}
            onChange={(event) => update('area', Number(event.target.value))}
          />
          <TextField
            label="Высота потолков, м"
            type="number"
            value={value.height}
            inputProps={{ min: 2.4, max: 4.2, step: 0.1 }}
            onChange={(event) => update('height', Number(event.target.value))}
          />
        </Box>

        <TextField
          select
          label="Стиль отделки"
          value={value.style}
          onChange={(event) => update('style', event.target.value as FinishStyle)}
          fullWidth
        >
          {finishStyleOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={value.includeTools}
              onChange={(event) => update('includeTools', event.target.checked)}
            />
          }
          label="Добавить инструмент"
        />

        <Button
          size="large"
          variant="contained"
          startIcon={<CalculateOutlinedIcon />}
          disabled={loading}
          onClick={onCalculate}
        >
          Рассчитать
        </Button>
      </Stack>
    </Paper>
  );
}
