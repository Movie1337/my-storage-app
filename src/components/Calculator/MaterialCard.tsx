import {
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { MaterialItem, ToolItem } from '../../types/calculator';

interface MaterialCardProps {
  item: MaterialItem | ToolItem;
  isTool?: boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onToolToggle?: (id: string, selected: boolean) => void;
}

const isSelectableTool = (item: MaterialItem | ToolItem): item is ToolItem =>
  'selected' in item;

export function MaterialCard({
  item,
  isTool = false,
  onQuantityChange,
  onToolToggle,
}: MaterialCardProps) {
  const disabled = isTool && isSelectableTool(item) && !item.selected;

  const changeQuantity = (nextQuantity: number) => {
    onQuantityChange?.(item.id, Math.max(1, nextQuantity));
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, opacity: disabled ? 0.55 : 1 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            sx={{
              width: { xs: '100%', sm: 112 },
              height: 84,
              objectFit: 'cover',
              borderRadius: 1,
              bgcolor: 'background.default',
            }}
          />

          <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h3">{item.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              Артикул {item.article}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {item.unit} · {item.weight} кг · {item.volume} м³
            </Typography>
          </Stack>

          {isTool && isSelectableTool(item) ? (
            <Tooltip title={item.selected ? 'Отключить инструмент' : 'Добавить инструмент'}>
              <Checkbox
                checked={item.selected}
                onChange={(event) => onToolToggle?.(item.id, event.target.checked)}
              />
            </Tooltip>
          ) : (
            <Stack alignItems="center" spacing={0.5}>
              <Typography color="text.secondary" variant="caption">
                Количество
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  aria-label="Уменьшить количество"
                  size="small"
                  onClick={() => changeQuantity(item.quantity - 1)}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ minWidth: 28, textAlign: 'center' }} variant="h3">
                  {item.quantity}
                </Typography>
                <IconButton
                  aria-label="Увеличить количество"
                  size="small"
                  onClick={() => changeQuantity(item.quantity + 1)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
