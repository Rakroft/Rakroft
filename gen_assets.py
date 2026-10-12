"""Genera hero-*.svg y stack-*.svg. Edita TIERS o NAME y vuelve a ejecutar: python gen_assets.py"""
from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path(__file__).parent
SANS = "'Segoe UI', Inter, Helvetica, Arial, sans-serif"
MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

THEMES = {
    "light": dict(bg="#F7FAFC", card="#FFFFFF", line="#DCE4EE", text="#0F172A", muted="#5B6B80",
                  teal="#0F9D8F", blue="#2563EB", violet="#7C3AED", amber="#D97706", glow=0.16, chip="#EEF3F9"),
    "dark": dict(bg="#0B1220", card="#111B2E", line="#24324A", text="#E8EEF7", muted="#8FA1BA",
                 teal="#2DD4BF", blue="#60A5FA", violet="#A78BFA", amber="#FBBF24", glow=0.22, chip="#16233A"),
}

NAME = "Adrián Ortega Martínez"
ROLE = "Administración de sistemas y redes"
SUB = "Estudiante de 2º de ASIR en Barcelona"
STATUS = "Disponible ya para prácticas y empleo"
HERO_CHIPS = ["Linux", "Windows Server", "Active Directory", "Redes", "Virtualización"]

# titulo, subtitulo, color, chips
TIERS = [
    ("Sistemas y redes", "Lo que trabajo en ASIR", "teal",
     ["Linux", "Windows Server", "Active Directory", "Redes", "Virtualización"]),
    ("Scripting y datos", "Automatizar y consultar", "blue", ["Python", "Bash", "MySQL"]),
    ("Web", "Páginas y estilos", "violet", ["HTML", "CSS"]),
]

# nodos de la red del banner: (x, y, color, radio)
NODES = [(830, 70, "teal", 9), (960, 48, "blue", 6), (1090, 90, "violet", 8), (900, 150, "blue", 12),
         (1030, 170, "teal", 7), (1120, 220, "amber", 6), (800, 235, "violet", 7), (950, 250, "teal", 9),
         (1060, 255, "blue", 5)]
EDGES = [(0, 1), (1, 2), (0, 3), (1, 3), (3, 4), (2, 4), (4, 5), (3, 6), (3, 7), (4, 7), (7, 8), (4, 8), (2, 5)]


def cw(text, size):
    return len(text) * size * 0.56 + 26


def hero(t):
    p = THEMES[t]
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 290" width="1200" height="290" role="img" '
         f'aria-label="{escape(NAME)}, {escape(ROLE)}. {escape(SUB)}.">',
         f'<defs><radialGradient id="g" cx="82%" cy="45%" r="55%"><stop offset="0" stop-color="{p["blue"]}" '
         f'stop-opacity="{p["glow"]}"/><stop offset="1" stop-color="{p["blue"]}" stop-opacity="0"/></radialGradient>'
         f'<linearGradient id="bar" x1="0" x2="1"><stop offset="0" stop-color="{p["teal"]}"/>'
         f'<stop offset="1" stop-color="{p["blue"]}"/></linearGradient></defs>',
         f'<rect x="1" y="1" width="1198" height="288" rx="22" fill="{p["bg"]}" stroke="{p["line"]}" stroke-width="2"/>',
         '<rect x="1" y="1" width="1198" height="288" rx="22" fill="url(#g)"/>']
    # red decorativa
    for a, b in EDGES:
        x1, y1, _, _ = NODES[a]; x2, y2, _, _ = NODES[b]
        s.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{p["line"]}" stroke-width="2"/>')
    for x, y, c, r in NODES:
        s.append(f'<circle cx="{x}" cy="{y}" r="{r+7}" fill="{p[c]}" opacity="0.14"/>'
                 f'<circle cx="{x}" cy="{y}" r="{r}" fill="{p[c]}"/>')
    # estado
    w = cw(STATUS, 14) + 14
    s.append(f'<rect x="56" y="36" width="{w:.0f}" height="30" rx="15" fill="{p["chip"]}" stroke="{p["line"]}"/>'
             f'<circle cx="76" cy="51" r="5" fill="{p["teal"]}"/>'
             f'<text x="90" y="56" font-family="{SANS}" font-size="14" fill="{p["muted"]}">{escape(STATUS)}</text>')
    # titulos
    s.append(f'<text x="56" y="128" font-family="{SANS}" font-size="52" font-weight="700" fill="{p["text"]}">{escape(NAME)}</text>')
    s.append(f'<rect x="58" y="146" width="64" height="5" rx="2.5" fill="url(#bar)"/>')
    s.append(f'<text x="56" y="188" font-family="{SANS}" font-size="25" font-weight="600" fill="{p["teal"]}">{escape(ROLE)}</text>')
    s.append(f'<text x="56" y="216" font-family="{SANS}" font-size="18" fill="{p["muted"]}">{escape(SUB)}</text>')
    x = 56
    for c in HERO_CHIPS:
        w = cw(c, 14)
        s.append(f'<rect x="{x}" y="236" width="{w:.0f}" height="30" rx="8" fill="{p["card"]}" stroke="{p["line"]}"/>'
                 f'<text x="{x + w/2:.0f}" y="256" text-anchor="middle" font-family="{MONO}" font-size="14" fill="{p["text"]}">{escape(c)}</text>')
        x += w + 10
    s.append("</svg>")
    return "\n".join(s)


def stack(t):
    p = THEMES[t]
    cardw, gap, pad, chh, sp = 368, 24, 24, 34, 10
    layouts, maxh = [], 0
    for title, sub, col, chips in TIERS:
        x, y, rows = 0, 0, []
        for c in chips:
            w = cw(c, 15)
            if x + w > cardw - 2 * pad:
                x, y = 0, y + chh + sp
            rows.append((c, x, y, w)); x += w + sp
        h = 100 + y + chh + 24
        layouts.append(rows); maxh = max(maxh, h)
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 {maxh+4}" width="1200" height="{maxh+4}" role="img" '
         f'aria-label="Stack en tres bloques. Sistemas y redes: {", ".join(TIERS[0][3])}. Scripting y datos: '
         f'{", ".join(TIERS[1][3])}. Web: {", ".join(TIERS[2][3])}.">']
    for i, (title, sub, col, _) in enumerate(TIERS):
        ox = 24 + i * (cardw + gap)
        s.append(f'<rect x="{ox}" y="2" width="{cardw}" height="{maxh}" rx="18" fill="{p["card"]}" stroke="{p["line"]}" stroke-width="2"/>'
                 f'<rect x="{ox}" y="2" width="6" height="{maxh}" rx="3" fill="{p[col]}"/>'
                 f'<text x="{ox+pad+4}" y="44" font-family="{SANS}" font-size="22" font-weight="700" fill="{p["text"]}">{escape(title)}</text>'
                 f'<text x="{ox+pad+4}" y="68" font-family="{SANS}" font-size="14" fill="{p["muted"]}">{escape(sub)}</text>')
        for c, x, y, w in layouts[i]:
            cx, cy = ox + pad + 4 + x, 92 + y
            s.append(f'<rect x="{cx:.0f}" y="{cy}" width="{w:.0f}" height="{chh}" rx="9" fill="{p["chip"]}" stroke="{p[col]}" stroke-opacity="0.55"/>'
                     f'<text x="{cx + w/2:.0f}" y="{cy+22}" text-anchor="middle" font-family="{MONO}" font-size="15" fill="{p["text"]}">{escape(c)}</text>')
    s.append("</svg>")
    return "\n".join(s)


for t in THEMES:
    (OUT / f"hero-{t}.svg").write_text(hero(t), encoding="utf-8")
    (OUT / f"stack-{t}.svg").write_text(stack(t), encoding="utf-8")
print("ok")
