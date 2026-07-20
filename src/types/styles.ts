export interface StyleDefinition {
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
