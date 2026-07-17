import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import type { CalculatorInput, CalculatorSummary } from '../../types/calculator';
import { getApartmentLabel } from '../../mock/apartments';
import { getStyleName } from '../../mock/styles';

interface SummaryCardProps {
  input: CalculatorInput;
  summary: CalculatorSummary;
  disabled?: boolean;
  onIssue: () => void;
}

export function SummaryCard({ input, summary, disabled = false, onIssue }: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        position: { md: 'sticky' },
        top: 24,
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography color="text.secondary" variant="body2">
            Объект
          </Typography>
          <Typography variant="h3">{getApartmentLabel(input.apartmentType)} квартира</Typography>
          <Typography>{input.area} м²</Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography color="text.secondary" variant="body2">
            Стиль
          </Typography>
          <Typography variant="h3">{getStyleName(input.style)}</Typography>
        </Stack>

        <Divider />
        <SummaryLine label="Основные материалы" value={`${summary.materialPositions} позиций`} />
        <SummaryLine label="Расходники" value={`${summary.consumablePositions} позиций`} />
        <SummaryLine label="Инструмент" value={`${summary.toolPositions} позиций`} />
        <Divider />

        <Stack spacing={1}>
          <Typography variant="h3">Итого</Typography>
          <SummaryLine label="Количество материалов" value={`${summary.totalItems} ед.`} />
          <SummaryLine label="Количество мешков" value={`${summary.totalBags} шт.`} />
          <SummaryLine label="Общий вес" value={`${summary.totalWeight} кг`} />
          <SummaryLine label="Общий объем" value={`${summary.totalVolume} м³`} />
        </Stack>

        <Button
          disabled={disabled}
          fullWidth
          size="large"
          variant="contained"
          startIcon={<Inventory2OutlinedIcon />}
          onClick={onIssue}
        >
          Выдать со склада
        </Button>
      </Stack>
    </Paper>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
}
