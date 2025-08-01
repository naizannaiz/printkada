# College Printing Shop

A web app for uploading documents, paying online, and tracking print status.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/college-printing-shop.git
cd college-printing-shop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

- Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

- Fill in your Firebase credentials in `.env` (see below).

### 4. Start the development server

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Environment Variables

Create a `.env` file in the root directory with the following content:

```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

> **Note:** You can find these values in your Firebase project settings.

---

## 📝 Features

- Upload PDF files for printing
- Select print type and side
- Pay online via UPI QR code
- Get a unique print token after payment
- Check print status and token history for the last 2 days
- Admin dashboard for managing print queue

---

## 📁 Project Structure

- `src/pages/` — Main pages (Upload, Payment, Success, Check Status, Admin)
- `src/components/` — Reusable UI components
- `src/context/` — React context for global state
- `src/firebase.js` — Firebase configuration

---

## ❓ Troubleshooting

- If you see a blank page, check the browser console for errors.
- Make sure your `.env` is set up and Firebase is enabled for Authentication, Firestore, and Storage.
- If you have issues, try deleting `node_modules` and running `npm install` again.

---

## 📄 License

MIT