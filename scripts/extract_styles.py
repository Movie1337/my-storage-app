import json
import re
from pathlib import Path
import xlrd

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / 'project' / 'docs'
OUT_JSON = ROOT / 'src' / 'mock' / 'styles.json'
OUT_TYPES = ROOT / 'src' / 'types' / 'styles.ts'

STYLE_ALIASES = {
    'Прованс': 'provence',
    'Гранж': 'grunge',
    'Муар': 'moire',
}

CATEGORY_HINTS = [
    ('штукатур', 'plaster'),
    ('шпакл', 'putty'),
    ('грунт', 'primer'),
    ('краск', 'paint'),
    ('плитк', 'tile'),
    ('ламин', 'laminate'),
    ('двер', 'doors'),
    ('труб', 'plumbing'),
    ('муфт', 'plumbing'),
    ('кран', 'plumbing'),
    ('угол', 'plumbing'),
    ('тройник', 'plumbing'),
    ('профил', 'plumbing'),
    ('сантех', 'plumbing'),
    ('электр', 'electrics'),
    ('кабель', 'electrics'),
    ('розет', 'electrics'),
    ('выключ', 'electrics'),
    ('свет', 'electrics'),
    ('пена', 'consumables'),
    ('лента', 'consumables'),
    ('пленк', 'consumables'),
    ('саморез', 'consumables'),
    ('дюбел', 'consumables'),
    ('сетк', 'consumables'),
    ('затир', 'consumables'),
    ('клей', 'consumables'),
    ('гипсокар', 'consumables'),
    ('монтаж', 'consumables'),
    ('валик', 'tools'),
    ('кист', 'tools'),
    ('шпатель', 'tools'),
    ('уровен', 'tools'),
    ('правил', 'tools'),
    ('плиткорез', 'tools'),
    ('миксер', 'tools'),
    ('кельм', 'tools'),
    ('гермет', 'tools'),
    ('респира', 'consumables'),
]


def infer_category(name: str) -> str:
    text = (name or '').lower()
    for keyword, cat in CATEGORY_HINTS:
        if keyword in text:
            return cat
    return 'consumables'


def slug(value: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]+', '-', str(value).strip().lower()).strip('-') or 'item'


def parse_workbook(path: Path, style_name: str):
    wb = xlrd.open_workbook(path)
    sheet = wb.sheet_by_name('Лист1')
    rows = []
    for row_idx in range(sheet.nrows):
        vals = []
        for col_idx in range(sheet.ncols):
            cell = sheet.cell_value(row_idx, col_idx)
            if isinstance(cell, float) and cell.is_integer():
                cell = int(cell)
            vals.append(cell)
        rows.append(vals)

    header_row = None
    for idx, row in enumerate(rows):
        if any(isinstance(v, str) and ('Код товара' in v or 'Количество' in v or 'Ед. измерения' in v) for v in row):
            header_row = idx
            break
    if header_row is None:
        raise RuntimeError(f'Header row not found in {path.name}')

    headers = []
    for value in rows[header_row]:
        if value is None or value == '':
            headers.append('')
        else:
            headers.append(str(value).strip())

    material_rows = []
    for row in rows[header_row + 1:]:
        if not row:
            continue
        if not any(isinstance(v, str) and v.strip() for v in row):
            continue
        if all((v is None or v == '' or (isinstance(v, float) and v == 0)) for v in row):
            continue
        if any(isinstance(v, str) and ('Строительные материалы' in v or 'Инженерные системы' in v) for v in row):
            continue
        if len(row) < 3:
            continue
        if isinstance(row[1], str) and ('Название' in row[1] or 'Код товара' in row[1]):
            continue
        material_rows.append(row)

    materials = []
    for row in material_rows:
        if not row:
            continue
        article = ''
        name = ''
        quantity = 0
        unit = ''
        price = 0

        for idx in range(len(row)):
            value = row[idx]
            if isinstance(value, str) and value.strip() and idx < len(headers):
                header = headers[idx]
                if header and 'код товара' not in header.lower() and 'количество' not in header.lower() and 'ед. измер' not in header.lower() and 'выдано' not in header.lower() and 'остаток' not in header.lower() and 'ответственный' not in header.lower():
                    if value.strip() and not value.strip().startswith('Смета'):
                        name = value.strip()
                        break

        for idx, header in enumerate(headers):
            value = row[idx] if idx < len(row) else ''
            if not header:
                continue
            key = header.lower()
            if 'код товара' in key:
                article = str(value).strip() if value not in ('', None) else ''
            elif 'количество' in key:
                quantity = float(value) if value not in ('', None) else 0
            elif 'ед. измер' in key:
                unit = str(value).strip() if value not in ('', None) else ''
            elif 'цена' in key and 'розница' in key:
                price = float(value) if value not in ('', None) else 0

        if not name:
            continue

        materials.append({
            'article': str(article),
            'name': name,
            'unit': unit or 'шт',
            'quantity': float(quantity),
            'category': infer_category(name),
            'price': round(float(price), 2),
            'image': None,
        })

    return materials


def main():
    style_files = {
        'Прованс': DOCS / 'Прованс.xls',
        'Гранж': DOCS / 'Гранж.xls',
        'Муар': DOCS / 'Муар.xls',
    }

    materials = []
    styles = []
    style_materials = []
    material_index = {}

    for style_name, path in style_files.items():
        if not path.exists():
            raise FileNotFoundError(path)

        style_id = STYLE_ALIASES[style_name]
        styles.append({'id': style_id, 'name': style_name})

        for item in parse_workbook(path, style_name):
            key = (str(item.get('article', '')).strip(), str(item.get('name', '')).strip())
            if key not in material_index:
                material_id = f"material-{slug(item.get('article') or item.get('name'))}"
                material_index[key] = material_id
                materials.append({
                    'id': material_id,
                    'article': str(item.get('article', '')),
                    'name': item.get('name', ''),
                    'unit': item.get('unit', 'шт'),
                    'quantity': item.get('quantity', 0),
                    'category': item.get('category', 'consumables'),
                    'price': item.get('price', 0),
                    'image': item.get('image', None),
                })

            style_materials.append({
                'styleId': style_id,
                'materialId': material_index[key],
                'quantity': item.get('quantity', 0),
            })

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    payload = {'materials': materials, 'styles': styles, 'style_materials': style_materials}
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    type_content = '''export interface StyleDefinition {
  id: string;
  name: string;
}

export interface MaterialDefinition {
  id: string;
  article: string;
  name: string;
  unit: string;
  quantity: number;
  category: string;
  price: number;
  image: string | null;
}

export interface StyleMaterialLink {
  styleId: string;
  materialId: string;
  quantity: number;
}

export interface StylesData {
  materials: MaterialDefinition[];
  styles: StyleDefinition[];
  style_materials: StyleMaterialLink[];
}
'''
    OUT_TYPES.write_text(type_content, encoding='utf-8')

    print(f'Wrote {OUT_JSON}')
    print(f'Wrote {OUT_TYPES}')


if __name__ == '__main__':
    main()
