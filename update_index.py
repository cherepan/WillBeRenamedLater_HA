

import os
import re

INDEX_PATH = "index.md"
BLACKLIST_DIR = "blacklist"
WHITELIST_DIR = "whitelist"

def read_entries(directory):
    entries = []
    for filename in sorted(os.listdir(directory)):
        if filename.endswith(".md"):
            name = filename[:-3].replace("_", " ")
            link = f"{directory}/{filename}"
            entries.append(f"- [{name}]({link})")
    return "\n".join(entries)

def update_section(content, section_title, new_list):
    pattern = rf"(## {re.escape(section_title)}.*?\n)(.*?)(\n---|\Z)"  # matches section body
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        raise ValueError(f"Section '{section_title}' not found in index.md")
    before = match.group(1)
    after = match.group(3)
    return content[:match.start()] + before + new_list + after + content[match.end():]


def update_index():
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    blacklist_md = read_entries(BLACKLIST_DIR)
    whitelist_md = read_entries(WHITELIST_DIR)

    content = update_section(content, "Blacklist — Problematic Supervisors", "\n" + blacklist_md + "\n")
    content = update_section(content, "Whitelist — Positive Examples", "\n" + whitelist_md + "\n")

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print("[+] index.md sections updated.")

if __name__ == "__main__":
    update_index()
    
