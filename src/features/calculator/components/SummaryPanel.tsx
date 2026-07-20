import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import type { CalculatorInput, CalculatorSummary } from '../../../types/calculator';

interface SummaryPanelProps {
  input: CalculatorInput;
  summary: CalculatorSummary;
  styleName: string;
  disabled: boolean;
  onCreateRequest: () => void;
}

export function SummaryPanel({ input, summary, styleName, disabled, onCreateRequest }: SummaryPanelProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        position: { lg: 'sticky' },
        top: 24,
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={0.4}>
          <Typography color="text.secondary" variant="body2">
            Объект
          </Typography>
          <Typography variant="h3">{summary.objectLabel}</Typography>
          <Typography color="text.secondary">Стиль: {styleName}</Typography>
        </Stack>

        <Divider />
        <SummaryLine label="Позиции" value={`${summary.totalPositions} поз.`} />
        <SummaryLine label="Количество материалов" value={`${summary.totalQuantity} ед.`} />
        <SummaryLine label="Общий вес" value={`${summary.totalWeight.toFixed(1)} кг`} />
        <SummaryLine label="Общий объём" value={`${summary.totalVolume.toFixed(2)} м3`} />
        <Divider />

        <Button
          disabled={disabled}
          fullWidth
          size="large"
          variant="contained"
          startIcon={<Inventory2OutlinedIcon />}
          onClick={onCreateRequest}
        >
          Создать заявку
        </Button>
      </Stack>
    </Paper>
  );
}

function SummaryLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={strong ? 900 : 700} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
}
