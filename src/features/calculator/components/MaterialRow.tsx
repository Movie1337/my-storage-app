import { Box, Checkbox, Chip, Paper, Stack, Tooltip, Typography } from '@mui/material';
import type { CalculatedMaterial } from '../../../types/calculator';
import { formatCurrency } from '../../../shared/lib/formatters';
import { QuantityStepper } from './QuantityStepper';

interface MaterialRowProps {
  item: CalculatedMaterial;
  onQuantityChange: (id: string, quantity: number) => void;
  onToggle?: (id: string, selected: boolean) => void;
}

export function MaterialRow({ item, onQuantityChange, onToggle }: MaterialRowProps) {
  const disabled = item.group === 'tools' && !item.selected;
  const stockColor = item.quantity > item.available ? 'error' : item.available < 10 ? 'warning' : 'success';

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
            md: '82px minmax(180px, 1fr) 90px 96px 92px 116px',
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

        <Chip
          size="small"
          color={stockColor}
          variant="outlined"
          label={`${item.available} на складе`}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        />

        <Typography sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 700 }}>
          {formatCurrency(item.price)}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent={{ xs: 'space-between', md: 'flex-end' }} spacing={1}>
          {item.group === 'tools' && onToggle ? (
            <Tooltip title={item.selected ? 'Отключить инструмент' : 'Добавить инструмент'}>
              <Checkbox
                checked={item.selected}
                onChange={(event) => onToggle(item.id, event.target.checked)}
                inputProps={{ 'aria-label': 'Добавить инструмент в расчет' }}
              />
            </Tooltip>
          ) : null}
          <QuantityStepper
            value={item.quantity}
            disabled={disabled}
            onChange={(quantity) => onQuantityChange(item.id, quantity)}
          />
        </Stack>
      </Box>
    </Paper>
  );
}
