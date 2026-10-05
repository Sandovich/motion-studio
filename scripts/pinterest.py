#!/usr/bin/env python3
"""Поиск референсов на Pinterest без логина и без API-ключа.

Через публичный веб-эндпоинт pinterest.com/resource/... (тот же, что у сайта
без входа). Никаких сторонних пакетов: стандартная библиотека + Pillow для листа.

  python scripts/pinterest.py search "vox editorial collage" -n 40 -o refs/vox
  python scripts/pinterest.py board https://www.pinterest.com/<user>/<board>/ -n 100 -o refs/board
  python scripts/pinterest.py pin https://www.pinterest.com/pin/<id>/ -o refs/one
  python scripts/pinterest.py similar <pin_id|url> -n 30 -o refs/similar   # поиск по ключевым словам пина

В папке: NN_<id>.<ext> (736 px; --orig — оригиналы), pins.tsv (номер, ссылка на пин, источник,
описание, размеры, url картинки), sheet.jpg — лист-превью с номерами для выбора.
--no-download — только pins.tsv и лист.

ВАЖНО: картинки с Pinterest чужие (авторские права у авторов). По умолчанию это
РЕФЕРЕНСЫ стиля и композиции. В ролик — только с подписью источника (правило
пользователя) или если источник — общественное достояние; для публичного репо
ничего отсюда не коммитить.
"""
import argparse, json, os, re, sys, time, urllib.parse, urllib.request

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
BASE = "https://www.pinterest.com"


def call(resource, options, source_url, handler):
    """GET /resource/<R>/get/. Заголовок X-Pinterest-PWS-Handler обязан
    соответствовать типу страницы, иначе 403/404."""
    q = urllib.parse.urlencode({"source_url": source_url,
                                "data": json.dumps({"options": options, "context": {}})})
    req = urllib.request.Request(f"{BASE}/resource/{resource}/get/?{q}", headers={
        "User-Agent": UA, "Accept": "application/json", "X-Pinterest-PWS-Handler": handler})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.load(r)["resource_response"]
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < 4:
                time.sleep(3 * (attempt + 1)); continue
            raise SystemExit(f"Pinterest ответил {e.code} на {resource} — эндпоинт мог измениться")
        except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as e:
            # из РФ связь с pinterest.com периодически пропадает на минуту-другую
            if attempt < 4:
                print(f"  связь с Pinterest оборвалась ({e}), повтор через {5 * (attempt + 1)} с…", file=sys.stderr)
                time.sleep(5 * (attempt + 1)); continue
            raise SystemExit("Pinterest недоступен — попробуй позже или через VPN")


def pin_id(s):
    m = re.search(r"(\d{6,})", s)
    if not m: raise SystemExit(f"не вижу id пина в: {s}")
    return m.group(1)


def search(query, n):
    out, bm = [], None
    src = "/search/pins/?q=" + urllib.parse.quote(query)
    while len(out) < n:
        opts = {"query": query, "scope": "pins", "page_size": 25}
        if bm: opts["bookmarks"] = [bm]
        r = call("BaseSearchResource", opts, src, "www/search/[scope].js")
        res = (r.get("data") or {}).get("results") or []
        out += [p for p in res if p.get("images") and p.get("type", "pin") == "pin"]
        bm = r.get("bookmark")
        if not res or not bm or bm == "-end-": break
        time.sleep(0.6)
    return out[:n]


def board(url, n):
    path = urllib.parse.urlparse(url).path.strip("/").split("/")
    if len(path) < 2: raise SystemExit("нужна ссылка вида https://www.pinterest.com/<user>/<board>/")
    user, slug = path[0], path[1]
    burl = f"/{user}/{slug}/"
    h = "www/[username]/[slug].js"
    b = call("BoardResource", {"username": user, "slug": slug, "field_set_key": "detailed"}, burl, h)["data"]
    print(f"доска: {b.get('name')} · пинов {b.get('pin_count')}", file=sys.stderr)
    out, bm = [], None
    while len(out) < n:
        opts = {"board_id": b["id"], "board_url": burl, "page_size": 25, "field_set_key": "react_grid_pin"}
        if bm: opts["bookmarks"] = [bm]
        r = call("BoardFeedResource", opts, burl, h)
        res = r.get("data") or []
        out += [p for p in res if p.get("images")]
        bm = r.get("bookmark")
        if not res or not bm or bm == "-end-": break
        time.sleep(0.6)
    return out[:n]


def one_pin(s):
    pid = pin_id(s)
    return call("PinResource", {"id": pid, "field_set_key": "detailed"}, f"/pin/{pid}/", "www/pin/[id].js")["data"]


def similar(s, n):
    """Похожие пины без логина Pinterest не отдаёт → ищем по смыслу пина."""
    p = one_pin(s)
    words = [a.get("name") if isinstance(a, dict) else a
             for a in ((p.get("pin_join") or {}).get("visual_annotation") or [])][:4]
    q = " ".join(w for w in words if w) or p.get("auto_alt_text") or p.get("title") or p.get("grid_title")
    if not q: raise SystemExit("у пина нет ключевых слов — задай search вручную")
    print(f"ищу похожие по: {q}", file=sys.stderr)
    return [p] + [x for x in search(q, n) if x.get("id") != p.get("id")][: n - 1]


def best_image(p, orig=False):
    im = p.get("images") or {}
    order = ("orig", "736x", "564x", "474x", "236x") if orig else ("736x", "564x", "orig", "474x", "236x")
    for k in order:
        if k in im: return im[k]
    return None


def fetch(url, fn, tries=3):
    """Скачать с повторами; i.pinimg.com иногда рвёт TLS-рукопожатие."""
    err = None
    for t in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": BASE + "/"})
            with urllib.request.urlopen(req, timeout=25) as r: data = r.read()
            with open(fn, "wb") as f: f.write(data)
            return True
        except Exception as e:
            err = e; time.sleep(1.5 * (t + 1))
    print(f"  ! не скачалось {os.path.basename(fn)}: {err}", file=sys.stderr)
    return False


def save(pins, outdir, download=True, orig=False):
    from concurrent.futures import ThreadPoolExecutor
    os.makedirs(outdir, exist_ok=True)
    rows, jobs = [], []
    for i, p in enumerate(pins, 1):
        im = best_image(p, orig)
        if not im: continue
        url = im["url"]
        ext = os.path.splitext(urllib.parse.urlparse(url).path)[1] or ".jpg"
        fn = os.path.join(outdir, f"{i:02d}_{p['id']}{ext}")
        jobs.append((i, url, fn))
        desc = (p.get("title") or p.get("grid_title") or p.get("description") or p.get("auto_alt_text") or "").strip()
        desc = re.sub(r"\s+", " ", desc)[:140]
        rows.append([str(i), f"{BASE}/pin/{p['id']}/", p.get("domain") or "", p.get("link") or "",
                     desc, f"{im.get('width')}x{im.get('height')}", url])
    with open(os.path.join(outdir, "pins.tsv"), "w", encoding="utf-8") as f:
        f.write("n\tpin\tdomain\tsource_link\tdescription\tsize\timage\n")
        for r in rows: f.write("\t".join(c.replace("\t", " ") for c in r) + "\n")
    files = []
    if download:
        todo = [j for j in jobs if not os.path.exists(j[2])]
        with ThreadPoolExecutor(6) as ex:
            list(ex.map(lambda j: fetch(j[1], j[2]), todo))
        files = [(i, fn) for i, _, fn in jobs if os.path.exists(fn)]
        if files: sheet(files, os.path.join(outdir, "sheet.jpg"))
    print(f"готово: {len(rows)} пинов, скачано {len(files)} → {outdir}")


def sheet(files, out, cols=6, w=240):
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        print("  (нет Pillow — лист не собран)", file=sys.stderr); return
    tiles = []
    for i, fn in files:
        try:
            im = Image.open(fn); im.seek(0); im = im.convert("RGB")
            im = im.resize((w, max(1, int(im.height * w / im.width))))
            im = im.crop((0, 0, w, min(im.height, int(w * 1.6))))
            d = ImageDraw.Draw(im); d.rectangle((0, 0, 34, 22), fill="black"); d.text((5, 5), f"{i:02d}", fill="white")
            tiles.append(im)
        except Exception:
            continue
    if not tiles: return
    colsh = [0] * cols
    pos = []
    for t in tiles:
        c = colsh.index(min(colsh)); pos.append((c * (w + 6), colsh[c])); colsh[c] += t.height + 6
    S = Image.new("RGB", (cols * (w + 6), max(colsh)), "white")
    for t, p in zip(tiles, pos): S.paste(t, p)
    S.save(out, quality=85)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=["search", "board", "pin", "similar"])
    ap.add_argument("arg", help="запрос / ссылка на доску / ссылка или id пина")
    ap.add_argument("-n", type=int, default=30)
    ap.add_argument("-o", "--out", default="refs/pinterest")
    ap.add_argument("--no-download", action="store_true")
    ap.add_argument("--orig", action="store_true", help="качать оригиналы (по умолчанию 736 px — быстрее, для референса хватает)")
    a = ap.parse_args()
    pins = {"search": lambda: search(a.arg, a.n), "board": lambda: board(a.arg, a.n),
            "pin": lambda: [one_pin(a.arg)], "similar": lambda: similar(a.arg, a.n)}[a.cmd]()
    if not pins: raise SystemExit("ничего не найдено")
    save(pins, a.out, not a.no_download, a.orig)


if __name__ == "__main__":
    main()
