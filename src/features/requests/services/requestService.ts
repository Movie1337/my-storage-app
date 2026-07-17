import { oneCClient } from '../../../api/oneCClient';
import type { CalculatedMaterial, CalculatorInput, CalculatorSummary } from '../../../types/calculator';

export interface MaterialIssueRequest {
  object: CalculatorInput;
  items: CalculatedMaterial[];
  summary: CalculatorSummary;
}

export interface RequestService {
  createMaterialIssueRequest(payload: MaterialIssueRequest): Promise<{ id: string }>;
}

export class MockRequestService implements RequestService {
  async createMaterialIssueRequest(payload: MaterialIssueRequest) {
    await oneCClient.post('/material-requests', payload);
    return { id: `REQ-${Date.now()}` };
  }
}

export const requestService: RequestService = new MockRequestService();
