import { FormEvent, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { ApartmentSelector } from '../components/Calculator/ApartmentSelector';
import { AreaInput } from '../components/Calculator/AreaInput';
import { HeightSelector } from '../components/Calculator/HeightSelector';
import { MaterialList } from '../components/Calculator/MaterialList';
import { StyleSelector } from '../components/Calculator/StyleSelector';
import { SummaryCard } from '../components/Calculator/SummaryCard';
import { calculateMaterials, createSummary } from '../services/calculator';
import type { ApartmentType, CalculatorInput, CalculatorResult, FinishStyle, MaterialItem, ToolItem } from '../types/calculator';

const initialInput: CalculatorInput = {
  apartmentType: 'one-room',
  area: 45,
  height: 2.7,
  style: 'provence',
};

const emptySummary = {
  materialPositions: 0,
  consumablePositions: 0,
  toolPositions: 0,
  totalItems: 0,
  totalBags: 0,
  totalWeight: 0,
  totalVolume: 0,
};

export function CalculatorPage() {
  const [apartmentType, setApartmentType] = useState<ApartmentType>(initialInput.apartmentType);
  const [area, setArea] = useState(initialInput.area);
  const [height, setHeight] = useState(initialInput.height);
  const [style, setStyle] = useState<FinishStyle>(initialInput.style);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const input = useMemo(
    () => ({ apartmentType, area, height, style }),
    [apartmentType, area, height, style],
  );

  const summary = result ? createSummary(result.materials, result.consumables, result.tools) : null;

  const handleCalculate = (event: FormEvent) => {
    event.preventDefault();
    setResult(calculateMaterials(input));
  };

  const updateMaterialQuantity = (
    group: 'materials' | 'consumables',
    id: string,
    quantity: number,
  ) => {
    setResult((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [group]: current[group].map((item: MaterialItem) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      };
    });
  };

  const updateTool = (id: string, selected: boolean) => {
    setResult((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        tools: current.tools.map((tool: ToolItem) =>
          tool.id === id ? { ...tool, selected } : tool,
        ),
      };
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography component="h1" variant="h1">
            Расчет материалов для отделки
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 360px' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            <Stack spacing={3}>
              <Paper
                component="form"
                elevation={0}
                onSubmit={handleCalculate}
                sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
              >
                <Stack spacing={3}>
                  <Typography variant="h2">Выбор объекта</Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 3,
                    }}
                  >
                    <ApartmentSelector value={apartmentType} onChange={setApartmentType} />
                    <Stack spacing={2}>
                      <AreaInput value={area} onChange={setArea} />
                      <HeightSelector value={height} onChange={setHeight} />
                      <StyleSelector value={style} onChange={setStyle} />
                    </Stack>
                  </Box>
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    startIcon={<CalculateOutlinedIcon />}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                  >
                    Рассчитать
                  </Button>
                </Stack>
              </Paper>

              {result && (
                <Stack spacing={4}>
                  <MaterialList
                    title="Основные материалы"
                    items={result.materials}
                    onQuantityChange={(id, quantity) =>
                      updateMaterialQuantity('materials', id, quantity)
                    }
                  />
                  <MaterialList
                    title="Расходники"
                    items={result.consumables}
                    onQuantityChange={(id, quantity) =>
                      updateMaterialQuantity('consumables', id, quantity)
                    }
                  />
                  <MaterialList
                    title="Инструмент"
                    items={result.tools}
                    isTool
                    onToolToggle={updateTool}
                  />
                </Stack>
              )}
            </Stack>

            <SummaryCard
              input={input}
              summary={summary ?? emptySummary}
              disabled={!result}
              onIssue={() => setSnackbarOpen(true)}
            />
          </Box>
        </Stack>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          Материалы подготовлены к выдаче
        </Alert>
      </Snackbar>
    </Box>
  );
}
