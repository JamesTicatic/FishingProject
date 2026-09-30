import os

files_to_update = {
    'app/layout.tsx': [
        ('Foundational Corpus for OpenSearch', 'Foundational Corpus for Postgres Vector Search'),
        ('href="/api/stories"', 'href="/api/search"'),
        ('Stories JSON API Endpoint', 'Vector Search API')
    ],
    'app/page.tsx': [
        ('OpenSearch Content Corpus Ready', 'Postgres Vector Search Ready')
    ],
    'components/Navbar.tsx': [
        ('href="/api/stories"', 'href="/api/search"'),
        ('OpenSearch API', 'Vector Search API')
    ]
}

for filepath, replacements in files_to_update.items():
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
