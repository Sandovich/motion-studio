# Собирает все промпты раздела skillry.dev/ai-videos/opus-5-5 в skillry_opus55_prompts.md/.json (рядом со скриптом запуска).
# Запуск: python scripts/fetch-skillry-prompts.py [лимит]   (без лимита ~8 минут, пауза 1 с между запросами)
import re, html, json, time, sys, urllib.request
links = sorted(set(re.findall(r'/ai-videos/opus-5-5/[A-Za-z0-9_-]+', urllib.request.urlopen(urllib.request.Request('https://skillry.dev/ai-videos/opus-5-5', headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8','replace'))))
TECH = {'Three.js','GLSL','Canvas','SVG','GSAP','WebGL','CSS','React','Remotion','HyperFrames','p5.js','Tone.js','Web Audio','D3'}
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else None
if LIMIT: links = links[:LIMIT]
out = []
for i, l in enumerate(links):
    url = 'https://skillry.dev' + l
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        s = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'replace')
    except Exception as e:
        out.append({'url': url, 'error': str(e)}); continue
    orig = re.search(r'href="(https?://[^"]+)"[^>]*>\s*View original post', s)
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', s, flags=re.S)
    t = html.unescape(re.sub(r'<[^>]+>', '\n', t))
    lines = [x.strip() for x in t.splitlines() if x.strip()]
    def after(tok, n=1):
        try: return lines[lines.index(tok) + n]
        except ValueError: return ''
    author = after('All Opus 5.5 videos', 2)
    category = after('All Opus 5.5 videos', 3)
    prompt, tags = [], []
    if 'Copy prompt' in lines:
        k = lines.index('Copy prompt') + 1
        while k < len(lines) and not lines[k].startswith('More ') and lines[k] not in TECH:
            prompt.append(lines[k]); k += 1
        while k < len(lines) and lines[k] in TECH:
            tags.append(lines[k]); k += 1
    out.append({'url': url, 'author': author, 'category': category, 'tags': tags,
                'original': orig.group(1) if orig else '', 'prompt': '\n'.join(prompt)})
    if i % 25 == 0: print(i, len(links), flush=True)
    time.sleep(1)
json.dump(out, open('skillry_opus55_prompts.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
with open('skillry_opus55_prompts.md', 'w', encoding='utf-8') as f:
    f.write("# Skillry — Opus 5.5 videos: промпты (собрано " + time.strftime("%d.%m.%Y") + ")\n\n")
    for o in out:
        if 'error' in o: continue
        f.write(f"## @{o['author']} · {o['category']} · {', '.join(o['tags'])}\n{o['url']}  \nоригинал: {o['original']}\n\n```\n{o['prompt']}\n```\n\n")
print('done', len(out), sum(1 for o in out if o.get('prompt')))
