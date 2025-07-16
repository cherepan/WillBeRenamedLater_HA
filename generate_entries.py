

import csv
import os
from datetime import datetime
import re

# === CONFIG ===
CSV_PATH = "data/submissions.csv"
BLACKLIST_DIR = "blacklist"
WHITELIST_DIR = "whitelist"

os.makedirs(BLACKLIST_DIR, exist_ok=True)
os.makedirs(WHITELIST_DIR, exist_ok=True)

def slugify(name):
    return re.sub(r'\W+', '_', name.strip())


def make_markdown(timestamp, pi_name, institution, position, recommendation, experience):
    sentiment = "Positive" if "yes" in recommendation.lower() else "Negative"
    rec_header = "Recommendation"
    rec_text = "**Would you recommend this PI/lab to others?**\n**" + recommendation.strip().capitalize() + "**"

    return f"""---
layout: default
title: "{pi_name} ({institution})"
---

## {pi_name} — {sentiment} Experience

- **Institution:** {institution}
- **Position:** {position}
- **Period:** (see details in entry)

### Experience

{experience.strip()}

### {rec_header}

{rec_text}
"""





def write_entry(entry):

    if len(entry) < 6 or not entry[1].strip():
        print(f"[!] Skipping incomplete row: {entry}")
        return

    timestamp     = entry[0].strip()
    pi_name       = entry[1].strip()
    institution   = entry[2].strip()
    position      = entry[3].strip()
    recommendation = entry[5].strip().lower()
    experience    = entry[4].strip()


    print('-----  timestamp  ',timestamp )

    print('----- pi_name  ', pi_name )
    print('----- institution  ',institution )
    print('----- position  ', position)
    print('-----  recommendation ', recommendation)
    print('-----  experience ', experience)
    content = make_markdown(timestamp, pi_name, institution, position, recommendation, experience)
    filename = slugify(pi_name) + ".md"

    target_dir = BLACKLIST_DIR if recommendation.startswith("no") or "warn" in recommendation else WHITELIST_DIR
    filepath = os.path.join(target_dir, filename)

    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    if os.path.exists(filepath):
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(f"\n\n---\n\n_Submission added on {now}_\n\n")
            f.write(content)
    else:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

    print(f"[+] Written: {filepath}")



def process_csv(csv_path):
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)  # skip header
        for row in reader:
            write_entry(row)

if __name__ == "__main__":
    process_csv(CSV_PATH)
