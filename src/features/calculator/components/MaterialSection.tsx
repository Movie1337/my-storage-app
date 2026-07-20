import { Paper, Stack, Typography } from '@mui/material';
import type { CalculatedMaterial } from '../../../types/calculator';
import { MaterialRow } from './MaterialRow';

interface MaterialSectionProps {
  title: string;
  items: CalculatedMaterial[];
  onQuantityChange: (id: string, quantity: number, group: CalculatedMaterial['group']) => void;
  onToggle?: (id: string, selected: boolean) => void;
}

export function MaterialSection({ title, items, onQuantityChange, onToggle }: MaterialSectionProps) {
  return (
    <Stack spacing={1.25}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h2">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {items.length} позиций
        </Typography>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.default',
        }}
      >
        <Stack spacing={1}>
          {items.map((item) => (
            <MaterialRow
              key={item.id}
              item={item}
              onQuantityChange={onQuantityChange}
              onToggle={onToggle}
            />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
