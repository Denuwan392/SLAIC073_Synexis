import os
import csv
import re
import pandas as pd
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-lite')

# Target schema
TARGET_COLUMNS = [
    "Route",
    "Bus",
    "service",
    "Departs",
    "Arrives"
]

def is_horizontal_split_row(row):
    """Detect if row is part of a horizontal table split (e.g., two tables side by side)"""
    non_empty = [cell for cell in row if cell.strip() != ""]
    total_cells = len(row)

    # If row is completely empty → skip
    if len(non_empty) == 0:
        return True

    # If row has only 1 non-empty cell → likely VALID (e.g., bus type list)
    if len(non_empty) == 1:
        return False  # ← THIS IS THE FIX! Don’t skip single-value rows

    # If more than half cells are empty → likely garbage/split
    if len(non_empty) < total_cells / 2:
        return True

    # Otherwise, assume it's valid
    return False

def clean_cell(cell):
    """Clean individual cell: strip, remove extra spaces, handle None"""
    if pd.isna(cell) or cell is None:
        return ""
    return str(cell).strip()

def extract_and_translate_with_gemini(original_data, filename=""):
    """
    Use Gemini to:
    - Infer Direction, Bus Run Number, Service Type
    - Translate any English text to Sinhala
    - Return dict with keys: Route, Bus, service, Departs, Arrives
    """
    prompt = f"""
You are a Sri Lankan public transport data standardizer.
Given this raw CSV row data from file "{filename}":

{original_data}

Your task:
1. Extract or infer:
   - Route: as "[Source] to [Destination]" or "[Direction]" (e.g., "Colombo to Wegoda")
   - Bus: assign a simple run number like "Bus 1", "Bus 2", etc. based on row order
   - service: classify as "Normal" or "Luxery" based on bus type or context. Default to "Normal".
   - Departs: departure time in HH:MM format
   - Arrives: arrival time in HH:MM format

2. Translate any non-Sinhala text (especially in service or Route) into Sinhala script.
   Example: "Private (Colombo 1)" → "පෞද්ගලික (කො. 1)", "Luxery" → "උසස්"

3. Return a JSON object with keys: "Route", "Bus", "service", "Departs", "Arrives"
   - All values must be strings.
   - If value cannot be determined, use empty string "".
   - Do not include any other text or explanation.

Example Output:
{{"Route": "කොළඹ සිට වැගොඩ දක්වා", "Bus": "Bus 1", "service": "Normal", "Departs": "04:45", "Arrives": "05:00"}}
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Clean JSON-like response (Gemini sometimes adds ```json...```)
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]

        import json
        result = json.loads(text)

        # Validate keys
        for key in TARGET_COLUMNS:
            if key not in result:
                result[key] = ""

        return result

    except Exception as e:
        print(f"[Gemini Error] {e} | Data: {original_data}")
        # Return empty fallback
        return {key: "" for key in TARGET_COLUMNS}

def process_csv_file(filepath):
    """Process one CSV file, return list of standardized rows"""
    rows_out = []
    filename = os.path.basename(filepath)

    try:
        # Try reading with pandas to handle malformed/empty rows better
        df = pd.read_csv(filepath, dtype=str, keep_default_na=False)
    except Exception as e:
        print(f"⚠️  Could not read {filename}: {e}")
        return rows_out

    # Remove rows that are likely horizontal splits or garbage
    cleaned_rows = []
    for idx, row in df.iterrows():
        row_list = [clean_cell(row[col]) for col in df.columns]
        if not is_horizontal_split_row(row_list):
            cleaned_rows.append(row.to_dict())
        else:
            print(f"🗑️  Skipped likely horizontal split row in {filename}: {row_list}")

    # Process each valid row with Gemini
    for i, row_dict in enumerate(cleaned_rows):
        # Convert row to string representation for Gemini
        row_str = "; ".join([f"{k}: {v}" for k, v in row_dict.items() if v.strip() != ""])

        if not row_str.strip():
            continue

        standardized = extract_and_translate_with_gemini(row_str, filename)
        standardized["Bus"] = f"Bus {i+1}"  # Override with simple numbering per file

        rows_out.append(standardized)

    print(f"✅ Processed {len(rows_out)} rows from {filename}")
    return rows_out

def main():
    INPUT_DIR = "csv_outputs"
    OUTPUT_FILE = "consolidated_output.csv"

    if not os.path.exists(INPUT_DIR):
        os.makedirs(INPUT_DIR)
        print(f"📁 Created {INPUT_DIR}, please add CSV files there.")
        return

    all_rows = []

    for file in os.listdir(INPUT_DIR):
        if file.endswith(".csv"):
            filepath = os.path.join(INPUT_DIR, file)
            rows = process_csv_file(filepath)
            all_rows.extend(rows)

    # Write to output CSV
    with open(OUTPUT_FILE, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=TARGET_COLUMNS)
        writer.writeheader()
        for row in all_rows:
            writer.writerow(row)

    print(f"\n🎉 Consolidated {len(all_rows)} rows into {OUTPUT_FILE}")

if __name__ == "__main__":
    main()