export function calculateEuclideanDistance(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error("Os embeddings precisam ter o mesmo tamanho para comparação.");
  }
  
  const sum = embedding1.reduce((acc, val, idx) => acc + Math.pow(val - embedding2[idx], 2), 0);
  return Math.sqrt(sum);
}

export function createResponse(error: boolean, message: string, data: any = null) {
  return { error, message, data };
}
  