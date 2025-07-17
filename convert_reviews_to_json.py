import csv
import json
import argparse
from datetime import datetime
import uuid

def normalize_date(date_str):
    try:
        dt = datetime.strptime(date_str, "%m/%d/%Y %H:%M:%S")
        return dt.date().isoformat()
    except:
        return None

def find_column(header, keywords):
    for col in header:
        if all(k.lower() in col.lower() for k in keywords):
            return col
    return None

def map_rating(value):
    if "yes" in value.lower():
        return 5
    if "warn" in value.lower():
        return 3
    if "no" in value.lower():
        return 1
    return 0

parser = argparse.ArgumentParser(description="Convert raw CSV reviews to structured JSON.")
parser.add_argument("--input_file", default="submissions.csv", help="Path to the input CSV file")
parser.add_argument("--output_file", default="reviews.json", help="Path to the output JSON file")
args = parser.parse_args()

input_file = "data/"+args.input_file
output_file = "data/"+args.output_file

with open(input_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    header = reader.fieldnames

    col_timestamp = find_column(header, ["timestamp"])
    col_professor = find_column(header, ["pi name"])
    col_institution = find_column(header, ["institution"])
    col_position = find_column(header, ["position", "period"])
    col_experience = find_column(header, ["experience"])
    col_recommend = find_column(header, ["recommend"])
    col_email = find_column(header, ["email"])

    reviews = []
    for row in reader:
        review = {
            "id": str(uuid.uuid4())[:8],
            "date": normalize_date(row.get(col_timestamp, "")),
            "professor": row.get(col_professor, "").strip(),
            "institution": row.get(col_institution, "").strip(),
            "position": row.get(col_position, "").strip(),
            "text": row.get(col_experience, "").strip(),
            "rating": map_rating(row.get(col_recommend, "")),
            "email": row.get(col_email, "").strip()
        }
        reviews.append(review)

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(reviews, f, indent=2, ensure_ascii=False)

print(f"✅ {len(reviews)} reviews written to {output_file}")
