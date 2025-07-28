import fetch from 'node-fetch';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function handler(event) {
  const id = event.queryStringParameters.id;
  if (!id) return { statusCode: 400, body: 'Missing id' };

  const snap = await getDoc(doc(db, 'files', id));
  if (!snap.exists()) return { statusCode: 404, body: 'File not found' };

  const data = snap.data();
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getFile?file_id=${data.file_id}`);
  const fileData = await res.json();

  const filePath = fileData.result.file_path;
  const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`;

  return { statusCode: 302, headers: { Location: fileUrl }, body: '' };
}
