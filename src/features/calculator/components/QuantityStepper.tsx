import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface QuantityStepperProps {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function QuantityStepper({ value, disabled = false, onChange }: QuantityStepperProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Tooltip title="Уменьшить">
        <span>
          <IconButton
            size="small"
            disabled={disabled || value <= 1}
            onClick={() => onChange(Math.max(1, value - 1))}
            aria-label="Уменьшить количество"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Typography sx={{ minWidth: 34, textAlign: 'center', fontWeight: 800 }}>{value}</Typography>
      <Tooltip title="Увеличить">
        <span>
          <IconButton
            size="small"
            disabled={disabled}
            onClick={() => onChange(value + 1)}
            aria-label="Увеличить количество"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
