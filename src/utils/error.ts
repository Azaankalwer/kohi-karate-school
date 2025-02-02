export function isFirebaseError(error: any): boolean {
  return error?.code !== undefined && typeof error.code === 'string';
}

export function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (isFirebaseError(error)) {
    return `Firebase error: ${error.code}`;
  }
  
  return 'An unexpected error occurred';
}

export function logError(error: any, context?: string): void {
  const message = getErrorMessage(error);
  const contextPrefix = context ? `[${context}] ` : '';
  console.error(`${contextPrefix}${message}`, error);
}