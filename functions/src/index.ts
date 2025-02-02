import * as admin from 'firebase-admin';
import { sendEmail } from './email';

admin.initializeApp();

export { sendEmail };