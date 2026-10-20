"""Prepare real FiveK image pairs for illustrative history diagrams.

Run with uv run --python 3.11 --with rawpy --with pillow.
The first 20 dataset scenes are display examples, not a retrieved user history.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import json
import urllib.request

import rawpy
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / 'evidence'
NATIVE = EVIDENCE / 'fivek-native' / 'history-pairs'
ASSETS = ROOT / 'public' / 'assets' / 'history-pairs'
DATA = ROOT / 'data'
THUMBNAILS = EVIDENCE / 'fivek-thumbnails'
for folder in [NATIVE, ASSETS, DATA, THUMBNAILS]:
    folder.mkdir(parents=True, exist_ok=True)
sources = json.loads((EVIDENCE / 'history-pairs.json').read_text())['pairs']


def prepare(source):
    ident = source['id']
    key = source['scene']
    original_url = source['original_url']
    expert_url = source['expert_url']
    original = NATIVE / f'{key}.dng'
    expert = THUMBNAILS / f'{key}.jpg'
    if not original.exists():
        with urllib.request.urlopen(original_url, timeout=60) as response:
            original.write_bytes(response.read())
    if not expert.exists():
        with urllib.request.urlopen(expert_url, timeout=60) as response:
            expert.write_bytes(response.read())
    with rawpy.imread(str(original)) as raw:
        image = Image.fromarray(raw.postprocess(use_camera_wb=True, output_bps=8))
    edited = ImageOps.exif_transpose(Image.open(expert)).convert('RGB')
    record = {'id': ident, 'scene': key, 'expert': 'C'}
    for name, specimen in [('original', image), ('edited', edited)]:
        specimen.thumbnail((320, 320), Image.Resampling.LANCZOS)
        path = ASSETS / f'{ident}-{name}.jpg'
        specimen.save(path, quality=92, subsampling=0)
        record[name] = f'assets/history-pairs/{path.name}'
    print(f'Prepared real pair {ident}: original + Expert C', flush=True)
    evidence = {**record, 'original_url': original_url, 'expert_url': expert_url,
                'original_source_sha256': hashlib.sha256(original.read_bytes()).hexdigest(),
                'expert_source_sha256': hashlib.sha256(expert.read_bytes()).hexdigest(),
                'asset_sha256': {name: hashlib.sha256((ROOT / 'public' / record[name]).read_bytes()).hexdigest()
                                 for name in ['original', 'edited']}}
    return record, evidence


with ThreadPoolExecutor(max_workers=4) as pool:
    pairs = list(pool.map(prepare, sources))
(DATA / 'history-pairs.json').write_text(json.dumps([r for r, _ in pairs], indent=2) + '\n')
query = Image.open(ROOT / 'public/assets/fivek/cnn-input.png').convert('RGBA')
mask = Image.open(ROOT / 'public/assets/next-step/illustrative-mask.png').convert('L')
overlay = Image.new('RGBA', query.size, (213, 225, 230, 0))
overlay.putalpha(mask.point(lambda value: round(value * 0.62)))
query = Image.alpha_composite(query, overlay)
ImageDraw.Draw(query).rectangle(mask.getbbox(), outline='#437a95', width=2)
query_asset = ASSETS / 'unspecified-query.png'
query.save(query_asset)
(EVIDENCE / 'history-pairs.json').write_text(json.dumps({
    'scope': 'Real FiveK original / Expert C pairs. Pool membership and reference selection are illustrative, not a measured retrieval or a real user history.',
    'preprocessing': 'Original DNG: camera white balance, 8-bit RGB, maximum side 320. Edited image: official Expert C gallery thumbnail. No synthetic edits or model predictions.',
    'illustrative_reference_ids': ['0001', '0006', '0016'],
    'pairs': [e for _, e in pairs],
    'unspecified_query': {
        'source': 'assets/fivek/cnn-input.png',
        'explicit_mask': 'assets/next-step/illustrative-mask.png',
        'asset': 'assets/history-pairs/unspecified-query.png',
        'operation': 'Original RGB with translucent blue overlay on M = 1; remaining pixels unchanged. Illustrative rectangle mask, not a semantic segmentation output.',
        'sha256': hashlib.sha256(query_asset.read_bytes()).hexdigest(),
    },
}, indent=2) + '\n')
