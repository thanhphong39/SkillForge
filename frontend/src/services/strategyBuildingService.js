import api from './api';

const strategyBuildingService = {
  // Get full B2 state (analysis items + swot items + candidates)
  getBuilding: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/strategy-building`),

  // Analysis items (SO/WO/ST/WT)
  upsertAnalysisItems: (strategyId, items) =>
    api.put(`/bsc-strategies/${strategyId}/analysis-items`, { items }),

  // SWOT
  createSwotItem: (strategyId, data) =>
    api.post(`/bsc-strategies/${strategyId}/swot-items`, data),
  // data: { swotType, sourceAnalysisItemId } → returns StrategyBuildingResponse

  deleteSwotItem: (swotItemId) =>
    api.delete(`/swot-items/${swotItemId}`),

  // Candidate Strategies
  listCandidateStrategies: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/candidate-strategies`),

  createCandidateStrategy: (strategyId, data) =>
    api.post(`/bsc-strategies/${strategyId}/candidate-strategies`, data),
  // data: { strategyGroup, name, description?, swotItemIds, displayOrder? }

  updateCandidateStrategy: (candidateStrategyId, data) =>
    api.put(`/candidate-strategies/${candidateStrategyId}`, data),

  deleteCandidateStrategy: (candidateStrategyId) =>
    api.delete(`/candidate-strategies/${candidateStrategyId}`),

  complete: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/strategy-building/complete`),
};

export default strategyBuildingService;
