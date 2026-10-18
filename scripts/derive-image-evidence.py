"""Reproducible display-image diagnostics; not measurements of model predictions."""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
OUT = PUBLIC / 'assets/image-diagnostics'
OUT.mkdir(exist_ok=True)
names = ['original'] + ['expert-' + c for c in 'ABCDE']
source = {n: PUBLIC / ('assets/fivek/' + n + '.png') for n in names}
size = Image.open(source['original']).size
arrays = {n: np.asarray(Image.open(p).convert('RGB').resize(size, Image.Resampling.LANCZOS), dtype=np.float64) for n, p in source.items()}
weights = np.array([.2126, .7152, .0722])
luma = {n: np.sum(a * weights, axis=2) for n, a in arrays.items()}
record = {
    'kind': 'Derived display-image diagnostics',
    'scope': 'One FiveK scene, a0412-_DGW6297; input and expert references, never model outputs.',
    'alignment': 'RGB images resized to original display dimensions using Pillow Lanczos.',
    'size': list(size), 'pixels': size[0] * size[1],
    'luma': 'Y prime = 0.2126 R + 0.7152 G + 0.0722 B on encoded 8-bit display RGB; not linear luminance.',
    'histogram': '64 bins over [0,256); counts, no smoothing.',
    'toneGrid': '32 by 32 joint histogram; rows = reference luma, columns = input luma; [0,256).',
    'difference': 'Mean absolute RGB difference in 8-bit levels; reference resized to input dimensions.',
    'sources': {n: {'path': str(p.relative_to(PUBLIC)), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for n, p in source.items()},
    'images': {}, 'experts': {}, 'matrix': [], 'generated': {},
}
for n, a in arrays.items():
    record['images'][n] = {
        'histograms': {c: np.histogram(a[:, :, i], bins=64, range=(0, 256))[0].tolist() for i, c in enumerate('RGB')},
        'means': a.mean(axis=(0, 1)).round(5).tolist(),
    }
    record['images'][n]['histograms']['Y'] = np.histogram(luma[n], bins=64, range=(0, 256))[0].tolist()
    if n == 'original':
        continue
    d = np.abs(a - arrays['original']).mean(axis=2)
    t = np.minimum(d / 80, 1)[:, :, None]
    stops = np.array([[245, 247, 250], [15, 98, 254], [105, 41, 196]])
    heat = np.where(t <= .5, stops[0] + t * 2 * (stops[1] - stops[0]), stops[1] + (t - .5) * 2 * (stops[2] - stops[1]))
    Image.fromarray(np.round(heat).astype('uint8')).save(OUT / (n + '-heat.png'))
    Image.fromarray(a.astype('uint8')).save(OUT / (n + '-aligned.png'))
    masks = {}
    for threshold in [10, 25, 50]:
        mask = d >= threshold
        overlay = arrays['original'] * .3
        overlay[mask] = [0, 180, 170]
        name = n + '-threshold-' + str(threshold) + '.png'
        Image.fromarray(overlay.astype('uint8')).save(OUT / name)
        masks[str(threshold)] = {'fraction': float(mask.mean()), 'image': 'assets/image-diagnostics/' + name}
    record['experts'][n[-1]] = {
        'mae': float(d.mean()),
        'meanShift': (a - arrays['original']).mean(axis=(0, 1)).round(5).tolist(),
        'tone': np.histogram2d(luma[n].ravel(), luma['original'].ravel(), bins=32, range=((0, 256), (0, 256)))[0].astype(int).tolist(),
        'heat': 'assets/image-diagnostics/' + n + '-heat.png',
        'aligned': 'assets/image-diagnostics/' + n + '-aligned.png',
        'thresholds': masks,
    }
record['matrix'] = [[float(np.abs(arrays[a] - arrays[b]).mean()) for b in names] for a in names]
for p in sorted(OUT.glob('*.png')):
    record['generated'][str(p.relative_to(PUBLIC))] = hashlib.sha256(p.read_bytes()).hexdigest()
encoded = json.dumps(record, indent=2) + '\n'
(ROOT / 'data/image-diagnostics.json').write_text(encoded)
(PUBLIC / 'evidence/image-diagnostics.json').write_text(encoded)
print(json.dumps({'images': len(source), 'derived_images': len(record['generated']), 'pixels_each': record['pixels'], 'histogram_totals': {n: sum(v['histograms']['Y']) for n, v in record['images'].items()}, 'reference_mae': {n: round(v['mae'], 4) for n, v in record['experts'].items()}}))
