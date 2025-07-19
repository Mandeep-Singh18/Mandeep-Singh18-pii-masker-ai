from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import cv2
import numpy as np
import os
import re
import uuid
import spacy


app = FastAPI()
nlp = spacy.load("en_core_web_sm")
reader = easyocr.Reader(['en'])  # load model once

# CORS is enabled so React can communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Regex for detecting common PII
PII_PATTERNS = {
    "aadhaar": r"\b\d{4} \d{4} \d{4}\b",
    "dob": r"\b\d{2}[-/]\d{2}[-/]\d{4}\b",
    "phone": r"\b\d{10}\b",
    "email": r"\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b"
}

# Here I read the uploaded image, run OCR, and loop through each line of text.
@app.post("/upload/")       
async def upload(file: UploadFile = File(...)):
    # Read image
    image_data = await file.read()
    image_array = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # OCR
    results = reader.readtext(image)

    text_blocks = []  # Collect all OCR texts for spaCy
    for box, text, _ in results:
        text_blocks.append((box, text))

        # Use spaCy to detect names, addresses
    for box, text in text_blocks:
        doc = nlp(text)
        detected = False

        # Regex detection
        for label, pattern in PII_PATTERNS.items():
            if re.search(pattern, text):
                detected = True
                break

        # NER detection
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "GPE", "LOC"]:  # Names or addresses
                detected = True
                break

        if detected:
            pts = np.array(box, dtype=np.int32)
            pts = pts.reshape((-1, 1, 2))
            cv2.fillPoly(image, [pts], (0, 0, 0))   # Mask the detected PII area by drawing a black box


    # Save output
    output_path = f"masked/{uuid.uuid4().hex}.jpg"
    os.makedirs("masked", exist_ok=True)
    cv2.imwrite(output_path, image)
    return FileResponse(output_path)
