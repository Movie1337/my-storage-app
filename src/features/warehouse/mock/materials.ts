import type { MaterialCategory, WarehouseMaterial } from '../../../types/calculator';

type CatalogSeed = {
  category: MaterialCategory;
  prefix: string;
  names: string[];
  unit: string;
  price: number;
  weight: number;
  volume: number;
};

const image = (category: MaterialCategory, label: string) => {
  const colors: Record<MaterialCategory, string> = {
    plaster: '#d8dee5',
    putty: '#e9e3d3',
    primer: '#d5e8df',
    paint: '#d9e6f2',
    tile: '#e6e0da',
    laminate: '#d9c8ad',
    doors: '#d7b58c',
    plumbing: '#d5e8ef',
    electrics: '#f0e0a8',
    consumables: '#e5ddd5',
    tools: '#d8e1dc',
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="132" viewBox="0 0 180 132"><rect width="180" height="132" rx="8" fill="${colors[category]}"/><rect x="18" y="18" width="144" height="96" rx="6" fill="#fff" opacity=".88"/><text x="90" y="72" text-anchor="middle" font-family="Arial" font-size="16" font-weight="700" fill="#25312c">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const seeds: CatalogSeed[] = [
  {
    category: 'plaster',
    prefix: 'PL',
    names: ['Knauf MP75', 'Волма Слой', 'Ceresit CT 24', 'Основит Гипсвелл', 'Старатели', 'Unis Теплон', 'Litokol Basis', 'Perfekta Гипстар', 'Bergauf Easy Band', 'Forman 10'],
    unit: 'мешок 30 кг',
    price: 560,
    weight: 30,
    volume: 0.045,
  },
  {
    category: 'putty',
    prefix: 'PT',
    names: ['Sheetrock SuperFinish', 'Knauf Rotband Finish', 'Vetonit LR+', 'Ceresit CT 225', 'Волма Финиш', 'Основит Эконсилк', 'Danogips Dano Top', 'Semin CE 78', 'Perfekta Финишная', 'Старатели KR'],
    unit: 'ведро 20 кг',
    price: 980,
    weight: 20,
    volume: 0.026,
  },
  {
    category: 'primer',
    prefix: 'GR',
    names: ['Глубокого проникновения', 'Бетонконтакт', 'Акриловая универсальная', 'Кварц-грунт', 'Влагозащитная', 'Для декоративных покрытий', 'Адгезионная', 'Антисептическая'],
    unit: 'канистра 10 л',
    price: 730,
    weight: 10,
    volume: 0.012,
  },
  {
    category: 'paint',
    prefix: 'PA',
    names: ['Матовая интерьерная', 'Моющаяся белая', 'Декоративный бетон', 'Муар шелк', 'Акриловая глубокоматовая', 'Для потолков', 'Латексная Pro', 'Фактурная песок', 'Сатиновая база A', 'Износостойкая кухня'],
    unit: 'ведро 10 л',
    price: 2850,
    weight: 14,
    volume: 0.014,
  },
  {
    category: 'tile',
    prefix: 'TL',
    names: ['Керамогранит светлый камень', 'Керамогранит графит', 'Плитка кабанчик белая', 'Плитка мраморная', 'Мозаика стеклянная', 'Плитка бетон', 'Керамогранит песочный', 'Плитка под дерево'],
    unit: 'м2',
    price: 1650,
    weight: 21,
    volume: 0.018,
  },
  {
    category: 'laminate',
    prefix: 'LM',
    names: ['Дуб светлый 33 класс', 'Дуб натуральный', 'Орех дымчатый', 'Графитовый ясень', 'Сосна прованс', 'Каменный серый', 'Дуб шале', 'Дуб мокко'],
    unit: 'м2',
    price: 1180,
    weight: 8.2,
    volume: 0.017,
  },
  {
    category: 'doors',
    prefix: 'DR',
    names: ['Дверь белая эмаль', 'Дверь шпон дуб', 'Дверь графит матовая', 'Дверь скрытого монтажа', 'Коробка телескопическая', 'Наличник МДФ', 'Добор 100 мм', 'Фурнитура комплект'],
    unit: 'шт',
    price: 7400,
    weight: 24,
    volume: 0.09,
  },
  {
    category: 'plumbing',
    prefix: 'SN',
    names: ['Унитаз напольный', 'Инсталляция', 'Смеситель раковина', 'Смеситель ванна', 'Ванна акриловая', 'Душевой комплект', 'Раковина 60 см', 'Сифон комплект'],
    unit: 'шт',
    price: 5200,
    weight: 12,
    volume: 0.08,
  },
  {
    category: 'electrics',
    prefix: 'EL',
    names: ['Кабель ВВГнг 3х2.5', 'Кабель ВВГнг 3х1.5', 'Подрозетник', 'Розетка белая', 'Выключатель', 'Автомат 16А', 'Щит распределительный', 'Гофра ПВХ', 'Клемма Wago', 'Светильник точечный'],
    unit: 'шт',
    price: 420,
    weight: 0.8,
    volume: 0.004,
  },
  {
    category: 'consumables',
    prefix: 'CS',
    names: ['Лента малярная 48 мм', 'Пленка укрывная', 'Саморезы универсальные', 'Дюбели распорные', 'Сетка шлифовальная', 'Мешки строительные', 'Пена монтажная', 'Герметик санитарный', 'Крестики для плитки', 'Ведро строительное'],
    unit: 'упаковка',
    price: 360,
    weight: 1.1,
    volume: 0.006,
  },
  {
    category: 'tools',
    prefix: 'IT',
    names: ['Валик малярный', 'Кисть плоская', 'Шпатель 350 мм', 'Правило алюминиевое', 'Уровень строительный', 'Лазерный нивелир', 'Плиткорез ручной', 'Миксер строительный', 'Кельма', 'Пистолет для герметика'],
    unit: 'шт',
    price: 1450,
    weight: 1.5,
    volume: 0.012,
  },
];

export const warehouseMaterials: WarehouseMaterial[] = seeds.flatMap((seed) =>
  seed.names.map((name, index) => {
    const stock = 24 + ((index + seed.prefix.charCodeAt(0)) % 7) * 13;
    const reserved = (index * 3) % 11;
    const article = `${seed.prefix}-${String(index + 1).padStart(3, '0')}`;

    return {
      id: `${seed.category}-${index + 1}`,
      article,
      name,
      category: seed.category,
      unit: seed.unit,
      price: seed.price + index * Math.round(seed.price * 0.07),
      weight: Number((seed.weight + index * seed.weight * 0.015).toFixed(2)),
      volume: Number((seed.volume + index * seed.volume * 0.02).toFixed(3)),
      stock,
      reserved,
      available: stock - reserved,
      image: image(seed.category, article),
    };
  }),
);
