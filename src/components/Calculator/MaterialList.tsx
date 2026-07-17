import { Stack, Typography } from '@mui/material';
import type { MaterialItem, ToolItem } from '../../types/calculator';
import { MaterialCard } from './MaterialCard';

interface MaterialListProps {
  title: string;
  items: Array<MaterialItem | ToolItem>;
  isTool?: boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onToolToggle?: (id: string, selected: boolean) => void;
}

export function MaterialList({
  title,
  items,
  isTool = false,
  onQuantityChange,
  onToolToggle,
}: MaterialListProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between">
        <Typography variant="h2">{title}</Typography>
        <Typography color="text.secondary" variant="body2">
          {items.length} позиций
        </Typography>
      </Stack>
      {items.map((item) => (
        <MaterialCard
          key={item.id}
          item={item}
          isTool={isTool}
          onQuantityChange={onQuantityChange}
          onToolToggle={onToolToggle}
        />
      ))}
    </Stack>
  );
}
