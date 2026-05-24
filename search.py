import os

files = ['index.html', 'style.css', 'app.js']
search_terms = ['chennai', 'central', 'address', 'location', 'road', 'mumbai', 'delhi', 'bangalore']

for file in files:
    if not os.path.exists(file):
        print(f"File not found: {file}")
        continue
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for index, line in enumerate(lines):
            for term in search_terms:
                if term in line.lower():
                    print(f"[{file}:{index + 1}] ({term}): {line.strip()}")
