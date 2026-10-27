"""Remove only border-connected white canvas; retain photograph pixels."""
from collections import deque
from pathlib import Path
import hashlib
import json
from PIL import Image

root = Path(__file__).resolve().parents[1]
assets = root / "public/assets/reference-deck"
records = []
for name in ["direction-grid", "magnitude-grid", "sample-density"]:
    source = assets / f"{name}.png"
    image = Image.open(source).convert("RGBA")
    width, height = image.size
    pixels = image.load()
    protected = []
    if name == "direction-grid":
        protected = [(18, 56, 175, 214)]
        protected += [(x, y, x + 133, y + 133)
                      for x in [748, 893, 1038, 1183, 1328]
                      for y in [31, 190, 349]]
    elif name == "magnitude-grid":
        protected = [(18, 71, 177, 229)]
        protected += [(x, y, x + 141, y + 141)
                      for x in [775, 953, 1131, 1309]
                      for y in [76, 226, 376]]
    blocked = bytearray(width * height)
    for x0, y0, x1, y1 in protected:
        for y in range(max(0, y0), min(height, y1)):
            for x in range(max(0, x0), min(width, x1)):
                blocked[y * width + x] = 1
    visited = bytearray(width * height)
    queue = deque((x, y) for y in [0, height - 1] for x in range(width))
    queue.extend((x, y) for x in [0, width - 1] for y in range(height))
    count = 0
    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if visited[index] or blocked[index]:
            continue
        visited[index] = 1
        r, g, b, a = pixels[x, y]
        if min(r, g, b) < 237 or max(r, g, b) - min(r, g, b) > 16:
            continue
        pixels[x, y] = (r, g, b, 0)
        count += 1
        for nx, ny in [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]:
            if 0 <= nx < width and 0 <= ny < height:
                queue.append((nx, ny))
    output = assets / f"{name}-transparent.png"
    image.save(output)
    original = Image.open(source).convert("RGBA")
    for box in protected:
        assert original.crop(box).tobytes() == image.crop(box).tobytes()
    assert count > width * height * .1
    assert Image.open(output).mode == "RGBA"
    records.append({
        "source": source.name,
        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "output": output.name,
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        "transparentPixels": count,
        "protectedPhotoRectangles": protected,
        "protectedPixelsIdentical": True,
    })
    print(f"{output.name}: {count} canvas pixels transparent; protected photos unchanged")
(assets / "transparency-provenance.json").write_text(json.dumps(records, indent=2) + "\n")
