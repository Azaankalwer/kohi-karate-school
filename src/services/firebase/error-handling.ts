export class FirebaseError extends Error {
  code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'FirebaseError';
    this.code = code;
  }
}

export function handleFirebaseError(error: any): string {
  if (error?.code) {
    switch (error.code) {
      case 'unavailable':
        return 'The service is currently unavailable. Please check your internet connection.';
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'not-found':
        return 'The requested resource was not found.';
      case 'already-exists':
        return 'This record already exists.';
      case 'failed-precondition':
        return 'Operation failed due to the current state of the system.';
      case 'invalid-argument':
        return 'Invalid data provided for this operation.';
      default:
        return `An error occurred: ${error.message}`;
    }
  }
  return error?.message || 'An unexpected error occurred. Please try again.';
}

export function createFirebaseError(error: any): FirebaseError {
  const message = handleFirebaseError(error);
  return new FirebaseError(message, error?.code);
}