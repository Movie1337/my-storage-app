import type { MaterialDefinition } from '../types/styles';
import { materialService } from './MaterialService';

export interface WarehouseService {
  getStock(materialId: string): Promise<number>;
  reserve(materialId: string, quantity: number): Promise<number>;
  release(materialId: string, quantity: number): Promise<number>;
  issue(materialId: string, quantity: number): Promise<number>;
}

class WarehouseServiceImpl implements WarehouseService {
  private readonly stockByMaterialId = new Map<string, number>();

  private async getMaterial(materialId: string): Promise<MaterialDefinition | null> {
    return materialService.getMaterialById(materialId);
  }

  async getStock(materialId: string): Promise<number> {
    const material = await this.getMaterial(materialId);
    if (!material) {
      return Promise.resolve(0);
    }

    const current = this.stockByMaterialId.get(materialId) ?? 50 + Math.floor(material.id.length * 3);
    return Promise.resolve(current);
  }

  async reserve(materialId: string, quantity: number): Promise<number> {
    const current = await this.getStock(materialId);
    const next = Math.max(0, current - quantity);
    this.stockByMaterialId.set(materialId, next);
    return Promise.resolve(next);
  }

  async release(materialId: string, quantity: number): Promise<number> {
    const current = await this.getStock(materialId);
    const next = current + quantity;
    this.stockByMaterialId.set(materialId, next);
    return Promise.resolve(next);
  }

  async issue(materialId: string, quantity: number): Promise<number> {
    const current = await this.getStock(materialId);
    const next = Math.max(0, current - quantity);
    this.stockByMaterialId.set(materialId, next);
    return Promise.resolve(next);
  }
}

export const warehouseService: WarehouseService = new WarehouseServiceImpl();
