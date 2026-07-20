import { Box, Checkbox, Chip, Paper, Stack, Tooltip, Typography } from '@mui/material';
import type { CalculatedMaterial } from '../../../types/calculator';
import { QuantityStepper } from './QuantityStepper';

interface MaterialRowProps {
  item: CalculatedMaterial;
  onQuantityChange: (id: string, quantity: number, group: CalculatedMaterial['group']) => void;
  onToggle?: (id: string, selected: boolean) => void;
}

export function MaterialRow({ item, onQuantityChange, onToggle }: MaterialRowProps) {
  const disabled = item.group === 'tools' && !item.selected;
  const required = Math.max(item.quantity, 1);
  const ratio = item.available / required;
  const stockColor = ratio >= 0.5 ? 'success' : ratio >= 0.1 ? 'warning' : 'error';

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 1,
        opacity: disabled ? 0.55 : 1,
        bgcolor: disabled ? 'action.hover' : 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '72px minmax(0, 1fr)',
            md: '82px minmax(180px, 1fr) 90px 120px',
          },
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 1, bgcolor: 'background.default' }}
        />

        <Stack spacing={0.4} sx={{ minWidth: 0 }}>
          <Typography variant="h3" noWrap title={item.name}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Артикул {item.article}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: { md: 'none' } }}>
            {item.unit} · остаток {item.available}
          </Typography>
        </Stack>

        <Typography color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
          {item.unit}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Chip
            size="small"
            color={stockColor}
            variant="outlined"
            label={`${item.available} на складе`}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent={{ xs: 'space-between', md: 'flex-end' }} spacing={1}>
          <QuantityStepper
            value={item.quantity}
            disabled={disabled}
            onChange={(quantity) => onQuantityChange(item.id, quantity, item.group)}
          />
          {item.group === 'tools' && onToggle ? (
            <Tooltip title={item.selected ? 'Отключить инструмент' : 'Добавить инструмент'}>
              <Checkbox
                checked={item.selected}
                onChange={(event) => onToggle(item.id, event.target.checked)}
                inputProps={{ 'aria-label': 'Добавить инструмент в расчет' }}
              />
            </Tooltip>
          ) : null}
        </Stack>
      </Box>
    </Paper>
  );
}
