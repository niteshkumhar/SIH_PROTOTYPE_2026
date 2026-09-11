import os
import json
import shutil
from fastapi import FastAPI, Request, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from shapely.geometry import shape
from utils.vectorizer import vectorize_drone_mask
from ai_engine import DroneBoundarySegmentor

app = FastAPI(title="GeoAI Cadastral Production API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_segmentor = DroneBoundarySegmentor()
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
FILE_PATH = os.path.join(DATA_DIR, "parcels.geojson")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

def read_geojson_safely():
    """Safely loads GeoJSON and handles blank or corrupted files."""
    if not os.path.exists(FILE_PATH):
        return {"type": "FeatureCollection", "features": []}
    
    try:
        with open(FILE_PATH, "r") as f:
            content = f.read().strip()
            if not content:
                return {"type": "FeatureCollection", "features": []}
            return json.loads(content)
    except (json.JSONDecodeError, OSError):
        return {"type": "FeatureCollection", "features": []}

@app.get("/")
def read_root():
    return {"status": "GeoAI Cadastral Backend Active"}

@app.get("/api/v1/parcels")
def get_parcels():
    return read_geojson_safely()

@app.post("/api/v1/process-drone-image")
async def process_drone_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 1. AI Inference
    mask = ai_segmentor.predict_mask(file_path)

    # 2. Vectorization & Spatial Reprojection
    try:
        count = vectorize_drone_mask(file_path, mask, FILE_PATH)
        return {
            "status": "success",
            "parcels_detected": count,
            "message": f"Successfully extracted {count} parcels from {file.filename}"
        }
    except Exception as e:
        return {
            "status": "partial_success",
            "message": "Failed geotiff extraction, falling back.",
            "detail": str(e)
        }

@app.post("/api/v1/parcels/update")
async def update_parcel(request: Request):
    payload = await request.json()
    data = read_geojson_safely()

    target_id = payload.get("properties", {}).get("id")
    features = data.get("features", [])
    
    updated = False
    for i, feature in enumerate(features):
        if feature.get("properties", {}).get("id") == target_id:
            features[i] = payload
            updated = True
            break

    if not updated:
        features.append(payload)

    data["features"] = features

    # OVERWRITE parcels.geojson directly
    with open(FILE_PATH, "w") as f:
        json.dump(data, f, indent=2)

    return {"status": "success", "message": "Spatial layer updated"}