import fetch from 'node-fetch';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
  const body = JSON.parse(event.body);
  const chatId = body.message?.chat?.id;
  const file = body.message?.document;

  if (!chatId || !file) return { statusCode: 200, body: 'ignored' };

  if (chatId.toString() !== process.env.ADMIN_ID) {
    return { statusCode: 200, body: 'Not authorized' };
  }

  const uniqueId = Date.now().toString(36);
  await setDoc(doc(db, 'files', uniqueId), {
    file_id: file.file_id,
    file_name: file.file_name,
    timestamp: Date.now()
  });

  const link = `https://${process.env.SITE_URL}/.netlify/functions/download?id=${uniqueId}`;

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: "Shareable Link: " + link }),
  });

  return { statusCode: 200, body: 'ok' };
}
