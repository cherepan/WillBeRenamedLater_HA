
import requests
import os
import subprocess
from datetime import datetime

# === CONFIG ===
CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT66r9EM_WqxXZuAPGiTMsenm2_bkOCNczzSeBUq4jUI6CknrE8ALmM8YBXctQfSNharej2xIGrK4w2/pub?output=csv"
LOCAL_CSV_PATH = "data/submissions.csv"
COMMIT_MESSAGE = f"Update submissions ({datetime.now().strftime('%Y-%m-%d %H:%M')})"

# === DOWNLOAD CSV ===
def download_csv(url, save_path):
    print("[*] Downloading CSV from Google Sheets...")
    response = requests.get(url)
    response.raise_for_status()
    
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "wb") as f:
        f.write(response.content)
    print(f"[+] Saved to {save_path}")


# === MAIN ===
if __name__ == "__main__":
    download_csv(CSV_URL, LOCAL_CSV_PATH)

