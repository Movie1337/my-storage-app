import { useMemo, useState } from 'react';
import { Alert, Box, Container, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { CalculatorFilters } from '../features/calculator/components/CalculatorFilters';
import { MaterialSection } from '../features/calculator/components/MaterialSection';
import { SummaryPanel } from '../features/calculator/components/SummaryPanel';
import { useCalculator } from '../features/calculator/model/useCalculator';

export function CalculatorPage() {
  const {
    input,
    result,
    summary,
    loading,
    styleName,
    setInput,
    calculate,
    createRequest,
    updateQuantity,
    toggleTool,
  } = useCalculator();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const sections = useMemo(() => {
    if (!result) {
      return [] as Array<{ title: string; items: typeof result.materials; group: 'materials' | 'consumables' | 'tools' }>;
    }

    const allItems = [...result.materials, ...result.consumables, ...(input.includeTools ? result.tools : [])];
    const grouped = new Map<string, typeof result.materials>();

    allItems.forEach((item) => {
      const existing = grouped.get(item.displayCategoryLabel) ?? [];
      grouped.set(item.displayCategoryLabel, [...existing, item]);
    });

    const order = ['Строительный материал', 'Инженерные системы', 'Сантехника', 'Крепеж', 'Финишная отделка', 'Электрика', 'Инструмент', 'Технические товары', 'Двери'];

    return order.map((title) => {
      const items = (grouped.get(title) ?? []).slice(0, 5);
      return {
        title,
        items,
        group: title === 'Инструмент' ? 'tools' : title === 'Технические товары' ? 'consumables' : 'materials',
      };
    });
  }, [input.includeTools, result]);

  const handleCreateRequest = async () => {
    await createRequest();
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl">
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography component="h1" variant="h1">
              Расчет материалов для ремонта квартиры
            </Typography>
            <Typography color="text.secondary">
              ERP-калькулятор склада: расчет потребности, остатков и заявки на выдачу материалов.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '300px minmax(0, 1fr) 340px' },
              gap: 2,
              alignItems: 'start',
            }}
          >
            <CalculatorFilters
              value={input}
              loading={loading}
              onChange={setInput}
              onCalculate={calculate}
            />

            <Stack spacing={2}>
              {result ? (
                <>
                  {sections.map((section) => (
                    <MaterialSection
                      key={section.title}
                      title={section.title}
                      items={section.items}
                      onQuantityChange={(id, quantity, group) => updateQuantity(group, id, quantity)}
                      onToggle={section.group === 'tools' ? toggleTool : undefined}
                    />
                  ))}
                </>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    border: '1px dashed',
                    borderColor: 'divider',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h2">Заполните параметры и запустите расчет</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Список материалов появится здесь после обращения к сервисному слою.
                  </Typography>
                </Paper>
              )}
            </Stack>

            <SummaryPanel
              input={input}
              summary={summary}
              styleName={styleName}
              disabled={!result}
              onCreateRequest={handleCreateRequest}
            />
          </Box>
        </Stack>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3200}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          Заявка на выдачу материалов успешно создана
        </Alert>
      </Snackbar>
    </Box>
  );
}
