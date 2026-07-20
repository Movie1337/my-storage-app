import json
import re
from pathlib import Path

path = Path('src/mock/styles.json')
data = json.loads(path.read_text(encoding='utf-8'))


def slug(value):
    value = re.sub(r'[^a-zA-Z0-9]+', '-', str(value).strip().lower())
    return value.strip('-') or 'item'


def normalize(data):
    if isinstance(data, dict) and 'materials' in data and 'styles' in data and 'style_materials' in data:
        return data

    materials = []
    styles = []
    style_materials = []
    material_index = {}

    for style_name, items in data.items():
        style_id = slug(style_name)
        styles.append({'id': style_id, 'name': style_name})
        for item in items:
            key = (str(item.get('article', '')).strip(), str(item.get('name', '')).strip())
            if key not in material_index:
                base = slug(item.get('article') or item.get('name'))
                material_id = f'material-{base}'
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
            material_id = material_index[key]
            style_materials.append({'styleId': style_id, 'materialId': material_id, 'quantity': item.get('quantity', 0)})

    return {'materials': materials, 'styles': styles, 'style_materials': style_materials}


new_data = normalize(data)
path.write_text(json.dumps(new_data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('rewrote', path)
