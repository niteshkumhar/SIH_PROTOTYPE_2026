import json
import rasterio
import cv2
import numpy as np
from shapely.geometry import shape, Polygon
from shapely.ops import transform

try:
    from pyproj import Transformer
    HAS_PYPROJ = True
except ImportError:
    HAS_PYPROJ = False


def vectorize_drone_mask(geotiff_path: str, prediction_mask: np.ndarray, output_geojson_path: str):
    """
    Converts 2D prediction mask into clean, non-self-intersecting GeoJSON vectors.
    """
    with rasterio.open(geotiff_path) as src:
        transform_matrix = src.transform
        src_crs = src.crs

        # 1. Extract contours from binary prediction mask
        contours, _ = cv2.findContours(
            prediction_mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        features = []
        needs_reprojection = False
        transformer = None

        if src_crs and str(src_crs).upper() != "EPSG:4326" and HAS_PYPROJ:
            try:
                needs_reprojection = True
                transformer = Transformer.from_crs(src_crs, "EPSG:4326", always_xy=True)
            except Exception as e:
                print(f"[CRS Warning] {e}")

        for idx, cnt in enumerate(contours):
            if cv2.contourArea(cnt) < 500:
                continue

            # 2. Polygon Douglas-Peucker approximation to force < 12 vertex points
            epsilon = 0.02 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)

            # Convert pixel points to geographic coordinates using affine matrix
            geo_coords = []
            for pt in approx:
                px, py = pt[0][0], pt[0][1]
                gx, gy = transform_matrix * (px, py)
                geo_coords.append((gx, gy))

            if len(geo_coords) < 3:
                continue

            # Close polygon loop
            if geo_coords[0] != geo_coords[-1]:
                geo_coords.append(geo_coords[0])

            poly = Polygon(geo_coords)

            # Fix self-intersections automatically using Shapely buffer(0)
            if not poly.is_valid:
                poly = poly.buffer(0)

            if poly.is_empty or poly.geom_type != 'Polygon':
                continue

            # Re-project to EPSG:4326 if necessary
            if needs_reprojection and transformer:
                try:
                    poly = transform(transformer.transform, poly)
                except Exception:
                    pass

            features.append({
                "type": "Feature",
                "properties": {
                    "id": f"cadastral_parcel_{idx + 1}",
                    "source": "GeoAI_Drone_Segmentation"
                },
                "geometry": poly.__geo_interface__
            })

    geojson_data = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": features
    }

    # OVERWRITE file to prevent line accumulation
    with open(output_geojson_path, "w") as f:
        json.dump(geojson_data, f, indent=2)

    return len(features)