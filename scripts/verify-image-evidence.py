"""Check derived measurements independently with Pillow pixel/statistics APIs."""
from pathlib import Path
import json
from math import isclose
from PIL import Image, ImageChops, ImageStat

root = Path(__file__).resolve().parents[1]
d = json.loads((root / 'data/image-diagnostics.json').read_text())
images = {name: Image.open(root / 'public' / source['path']).convert('RGB').resize(tuple(d['size']), Image.Resampling.LANCZOS) for name, source in d['sources'].items()}
for name, image in images.items():
    bins = [0] * 64
    for r, g, b in image.getdata():
        bins[min(63, int((.2126 * r + .7152 * g + .0722 * b) // 4))] += 1
    assert bins == d['images'][name]['histograms']['Y'], name
    assert all(isclose(a,b,abs_tol=.000006) for a,b in zip(ImageStat.Stat(image).mean,d['images'][name]['means']))
for i, a in enumerate(images):
    for j, b in enumerate(images):
        diff = ImageChops.difference(images[a], images[b])
        mae = sum(ImageStat.Stat(diff).mean) / 3
        assert isclose(mae,d['matrix'][i][j],abs_tol=1e-9)
        if i == 0 and j > 0:
            for threshold in [10,25,50]:
                count = sum(sum(pixel) >= threshold * 3 for pixel in diff.getdata())
                assert isclose(count / d['pixels'],d['experts'][b[-1]]['thresholds'][str(threshold)]['fraction'],abs_tol=1e-12)
print('PASS: independent Pillow verification of six luma histograms, six RGB means, 36 pairwise distances and 15 threshold fractions.')
