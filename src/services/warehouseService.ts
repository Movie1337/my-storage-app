import { warehouseMaterials } from '../features/warehouse/mock/materials';
import type { MaterialCategory, WarehouseMaterial } from '../types/calculator';

export interface WarehouseService {
  getMaterials(): Promise<WarehouseMaterial[]>;
  findByCategories(categories: MaterialCategory[]): Promise<WarehouseMaterial[]>;
}

export class MockWarehouseService implements WarehouseService {
  async getMaterials() {
    return warehouseMaterials;
  }

  async findByCategories(categories: MaterialCategory[]) {
    return warehouseMaterials.filter((material) => categories.includes(material.category));
  }
}

export const warehouseService: WarehouseService = new MockWarehouseService();
