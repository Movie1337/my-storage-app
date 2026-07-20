import type { MaterialDefinition, StyleDefinition, StylesData } from '../types/styles';
import stylesDataJson from '../mock/styles.json';

export interface StyleService {
  getStyles(): Promise<StyleDefinition[]>;
  getStyleById(id: string): Promise<StyleDefinition | null>;
  getMaterialsByStyle(styleId: string): Promise<MaterialDefinition[]>;
}

type LegacyStylesData = Record<string, MaterialDefinition[]>;

class StyleServiceImpl implements StyleService {
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

  async getStyles(): Promise<StyleDefinition[]> {
    return Promise.resolve(this.getCatalog().styles);
  }

  async getStyleById(id: string): Promise<StyleDefinition | null> {
    const catalog = this.getCatalog();
    const normalized = id.toLowerCase();
    const style = catalog.styles.find((item) => item.id.toLowerCase() === normalized) ?? null;
    return Promise.resolve(style);
  }

  async getMaterialsByStyle(styleId: string): Promise<MaterialDefinition[]> {
    const catalog = this.getCatalog();
    const normalized = styleId.toLowerCase();
    const styleMaterialIds = catalog.style_materials
      .filter((link) => link.styleId.toLowerCase() === normalized)
      .map((link) => link.materialId);

    const materials = catalog.materials.filter((material) => styleMaterialIds.includes(material.id));
    return Promise.resolve(materials);
  }
}

export const styleService = new StyleServiceImpl();
