"""Derive presentation schematics from existing FiveK assets; no inference."""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

root = Path(__file__).resolve().parents[1]
source = root / 'public/assets/fivek'
out = root / 'public/assets/next-step'
out.mkdir(exist_ok=True)
original = Image.open(source / 'cnn-input.png').convert('RGB')
expert = Image.open(source / 'expert-D.png').convert('RGB').resize(original.size, Image.Resampling.BICUBIC)
mask = Image.new('L', original.size)
ImageDraw.Draw(mask).rectangle((112, 48, 231, 183), fill=255)
partial = Image.composite(expert, original, mask)
known = expert.convert('RGBA')
known.putalpha(mask)
# Keep all derived layers in the same untagged RGB space as the input.
for image in (expert, partial, known):
    image.info.clear()
expert.save(out / 'expert-target.png')
mask.save(out / 'illustrative-mask.png')
partial.save(out / 'partial-clue.png')
known.save(out / 'specified-edit.png')
zero = Image.open(source / 'cnn-zero.png').convert('RGB')
ImageChops.difference(original, zero).point(lambda value: min(255, value * 4)).save(out / 'zero-difference-x4.png')
assert ImageChops.difference(partial, original).getbbox() == (112, 48, 232, 184)
assert Image.composite(partial, expert, mask).tobytes() == expert.tobytes()
record = {
    'purpose': 'Slide schematics only; no model prediction or learned mask.',
    'size': list(original.size),
    'source': 'Existing FiveK 0412 input and Expert D; existing zero-control checkpoint output.',
    'derived_colour_space': 'All derived layers use the same untagged project RGB values; no inherited expert ICC profile.',
    'expert_resize': 'PIL bicubic, 500x333 to 256x256; existing project colour conversion retained.',
    'mask': {'kind': 'illustrative rectangle; not semantic segmentation', 'xyxy_exclusive': [112, 48, 232, 184]},
    'partial_clue': 'where(mask, expert_D, original); simulated explicit edit from target pixels.',
    'zero_difference': 'clip(4 * abs(saved_8bit_zero_output - saved_8bit_input), 0, 255); RGB display difference.',
    'metric_scope': 'The 0.027538985 mean absolute edit is from the original float tensor run, not recomputed from PNGs.',
    'sha256': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.glob('*.png'))},
}
(root / 'evidence/next-step-schematics.json').write_text(json.dumps(record, indent=2) + '\n')
print('Five derived assets verified; the specified edit matches the expert only inside the illustrative mask.')
