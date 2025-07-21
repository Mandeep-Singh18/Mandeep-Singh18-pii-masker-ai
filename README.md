# 🔒 PII Masker AI

A full-stack AI-powered web application that detects and masks Personally Identifiable Information (PII) like names, Aadhaar numbers, phone numbers, emails, and addresses from uploaded ID card images.
 — and lets users **download the masked image**

Built using FastAPI, EasyOCR, spaCy, OpenCV, React, and Tailwind CSS.

---

## 🖼️ Live Demo (GIF/Screenshot)

Upload Aadhaar card → detect text → mask PII → show result

  <img width="1855" height="870" alt="Screenshot 2025-07-21 165016" src="https://github.com/user-attachments/assets/71c17ed4-b6e3-412d-9a18-3a854ab60d13" />
  
   ![masked_output](https://github.com/user-attachments/assets/4bffd6c9-7be6-44e5-acab-27dc98261611)


## 🚀 Tech Stack

| Layer        | Technology                        |
|--------------|------------------------------------|
| Frontend     | React, Tailwind CSS                |
| Backend      | FastAPI (Python)                   |
| OCR Engine   | EasyOCR                            |
| PII Detection| Regex + spaCy Named Entity Recognition |
| Image Masking| OpenCV                             |

---

## 🎯 Features

- 📤 Upload Aadhaar or ID card images
- 🧠 Detects PII using OCR + NLP
- 🖌️ Masks sensitive text directly on the image
- 🖼️ Displays and downloads the masked result
- 🧩 Beautiful and responsive UI with Tailwind CSS

---

## 📂 Project Structure

```
pii-masker-ai/
├── backend/
│ └── main.py # FastAPI + OCR + PII logic
├── frontend/
│ ├── App.jsx # React app with Tailwind UI
│ └── ...
├── requirements.txt # Python dependencies
├── README.md # Project info
└── masked/ # Output folder for redacted images
```



## ⚙️ Setup Instructions

### 🔧 Backend (FastAPI + Python)

```
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload
```

App runs at: http://localhost:8000/docs (Swagger UI for testing)

### 🌐 Frontend (React + Tailwind CSS)

```
cd frontend
npm install
npm run dev   # or npm start (depending on your setup)
```
App runs at: http://localhost:5173 (Vite default port)



## 💡 How It Works

  User uploads image via frontend

  Backend reads image and extracts text using EasyOCR

  Text is scanned using:

  🧠 Regex (for Aadhaar, phone, email, DOB)

  🧠 spaCy NER (for names, addresses, locations)

  Bounding boxes of detected PII are masked using OpenCV

  Resulting masked image is returned and shown in frontend
