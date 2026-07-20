import type { MaterialDefinition, StylesData } from '../types/styles';
import stylesDataJson from '../mock/styles.json';

export interface MaterialService {
  getAllMaterials(): Promise<MaterialDefinition[]>;
  getMaterialById(id: string): Promise<MaterialDefinition | null>;
  getMaterialByArticle(article: string): Promise<MaterialDefinition | null>;
}

type LegacyStylesData = Record<string, MaterialDefinition[]>;

class MaterialServiceImpl implements MaterialService {
  private readonly data = stylesDataJson as unknown as StylesData | LegacyStylesData;

  private getCatalog(): StylesData {
    if (Array.isArray((this.data as StylesData).materials)) {
      return this.data as StylesData;
    }

    const styleEntries = Object.entries(this.data as LegacyStylesData).filter(([, items]) => Array.isArray(items));
    const materials = styleEntries.flatMap(([, items]) => (items as MaterialDefinition[]).map((item) => ({ ...item })));

    return {
      materials,
      styles: styleEntries.map(([name]) => ({ id: name.toLowerCase(), name })),
      style_materials: styleEntries.flatMap(([styleName, items]) =>
        (items as MaterialDefinition[]).map((item) => ({ styleId: styleName.toLowerCase(), materialId: item.id, quantity: item.quantity })),
      ),
    };
  }

  async getAllMaterials(): Promise<MaterialDefinition[]> {
    return Promise.resolve(this.getCatalog().materials);
  }

  async getMaterialById(id: string): Promise<MaterialDefinition | null> {
    const material = this.getCatalog().materials.find((item) => item.id === id) ?? null;
    return Promise.resolve(material);
  }

  async getMaterialByArticle(article: string): Promise<MaterialDefinition | null> {
    const normalized = article.trim().toLowerCase();
    const material = this.getCatalog().materials.find((item) => item.article.trim().toLowerCase() === normalized) ?? null;
    return Promise.resolve(material);
  }
}

export const materialService = new MaterialServiceImpl();
