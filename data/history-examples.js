import historyPairs from './history-pairs.json'

// Presentation examples only; these identities are not measured retrieval results.
export { historyPairs }
export const referencePairs = [0, 5, 15].map(index => historyPairs[index])
export const memoryPairs = [0, 5, 15, 19].map(index => historyPairs[index])
export const databasePairs = [0, 5, 15, 3, 9, 19].map(index => historyPairs[index])
