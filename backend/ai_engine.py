import cv2
import numpy as np

class DroneBoundarySegmentor:
    def __init__(self):
        print("[AI] Engine Initialized: Geometric Boundary Extraction")

    def predict_mask(self, image_path: str) -> np.ndarray:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image at {image_path}")

        h, w = image.shape[:2]

        # 1. Grayscale & Contrast Enhancement
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)

        # 2. Gaussian Blur to blend micro-architectural edges
        blurred = cv2.GaussianBlur(enhanced, (15, 15), 0)

        # 3. Adaptive Thresholding to separate structure from ground
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 21, 5
        )

        # 4. Strong Morphological Closing to merge broken stadium sections into ONE solid region
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25))
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=3)

        # 5. Extract Contours
        contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        mask = np.zeros((h, w), dtype=np.uint8)

        min_area = (h * w) * 0.01  # Ignore small noise

        for cnt in contours:
            if cv2.contourArea(cnt) > min_area:
                
                # OPTION A: Minimum Enclosing Circle (Best for stadiums, round fields)
                (x, y), radius = cv2.minEnclosingCircle(cnt)
                cv2.circle(mask, (int(x), int(y)), int(radius), 1, thickness=cv2.FILLED)

                # -------------------------------------------------------------
                # OPTION B: Convex Hull (Best for smooth, clean outer perimeter)
                # hull = cv2.convexHull(cnt)
                # cv2.drawContours(mask, [hull], -1, 1, thickness=cv2.FILLED)

                # -------------------------------------------------------------
                # OPTION C: Bounding Box (Best for square/rectangular plots)
                # x, y, bw, bh = cv2.boundingRect(cnt)
                # cv2.rectangle(mask, (x, y), (x + bw, y + bh), 1, thickness=cv2.FILLED)

        return mask