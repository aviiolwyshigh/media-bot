# Telegram Media Sharing Bot (Netlify + Firebase)

### 1️⃣ Firebase Setup
- Create project at https://console.firebase.google.com/
- Enable Firestore DB
- Copy web config keys

### 2️⃣ Telegram Bot
- Create bot via @BotFather
- Get token

### 3️⃣ Netlify Setup
Add Env Vars:
```
TELEGRAM_TOKEN=your_token
ADMIN_ID=your_telegram_id
SITE_URL=your-site.netlify.app
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MSG_ID=...
FIREBASE_APP_ID=...
```

### 4️⃣ Deploy
Upload folder to Netlify

### 5️⃣ Set Webhook
```
curl -F "url=https://<YOUR_NETLIFY_URL>/.netlify/functions/telegram" \
     https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook
```
