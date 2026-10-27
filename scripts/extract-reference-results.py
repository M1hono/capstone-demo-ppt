"""Extract literal result panels from the supplied PPTX, with crop provenance."""
from pathlib import Path
import hashlib
import io
import json
import zipfile

from PIL import Image

root = Path(__file__).resolve().parents[1]
reference = root.parents[2] / "13汇报.pptx"
output = root / "public/assets/reference-deck/results"
originals = root / "public/evidence/reference-figures"
output.mkdir(parents=True, exist_ok=True)
originals.mkdir(parents=True, exist_ok=True)
records = []


def source(archive, name):
    raw = archive.read("ppt/media/" + name)
    (originals / name).write_bytes(raw)
    return Image.open(io.BytesIO(raw)).convert("RGBA")


def crop(image, name, box, owner, transparent=False):
    result = image.crop(box)
    if transparent:
        pixels = result.load()
        for y in range(result.height):
            for x in range(result.width):
                r, g, b, a = pixels[x, y]
                if min(r, g, b) >= 245:
                    pixels[x, y] = (r, g, b, 0)
    path = output / name
    result.save(path)
    records.append({"asset": str(path.relative_to(root / "public")), "source_media": owner,
                    "crop_xyxy": box, "white_canvas_removed": transparent,
                    "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})


with zipfile.ZipFile(reference) as archive:
    fivek = source(archive, "image9.png")
    rows = [(168, 416), (487, 735), (805, 1053), (1124, 1372), (1443, 1691)]
    columns = [(0, 247), (248, 494), (495, 741), (742, 988), (990, 1237)]
    crop(fivek, "fivek-input.png", (0, 168, 247, 416), "image9.png")
    for expert, (top, bottom) in zip("ABCDE", rows):
        for label, (left, right) in zip(["input", "target", "top1", "best3", "best5"], columns):
            if label != "input":
                crop(fivek, f"fivek-{expert}-{label}.png", (left, top, right, bottom), "image9.png")
        crop(fivek, f"fivek-{expert}-samples.png", (1240, top, 1630, bottom), "image9.png", True)
        crop(fivek, f"fivek-{expert}-density.png", (1630, top, 2048, bottom), "image9.png", True)

    ppsd = source(archive, "image10.png")
    ppsd_columns = [[(28, 211), (215, 399), (403, 586), (591, 774), (778, 961)],
                    [(997, 1180), (1185, 1368), (1372, 1556), (1560, 1743), (1747, 1931)]]
    for row, (top, bottom) in enumerate([(184, 367), (819, 1002), (1454, 1637)]):
        for side, columns in enumerate(ppsd_columns):
            number = row * 2 + side + 1
            for label, (left, right) in zip(["input", "target", "c1", "c2", "c3"], columns):
                crop(ppsd, f"ppsd-{number}-{label}.png", (left, top, right, bottom), "image10.png")

    concept = source(archive, "image1.png")
    # Preserve photographic pixels, including bright sky and highlights.
    protected = [(97, 104, 508, 359), (43, 442, 149, 513), (187, 442, 280, 513),
                 (324, 442, 428, 513), (458, 442, 563, 513), (629, 25, 879, 188),
                 (1245, 69, 1496, 234), (1211, 465, 1463, 597)]
    pixels = concept.load()
    for y in range(concept.height):
        for x in range(concept.width):
            if any(l <= x < r and t <= y < b for l, t, r, b in protected):
                continue
            red, green, blue, alpha = pixels[x, y]
            if min(red, green, blue) >= 245:
                pixels[x, y] = (red, green, blue, 0)
    concept.save(output / "candidate-concept.png")
    records.append({"asset": "assets/reference-deck/results/candidate-concept.png",
                    "source_media": "image1.png", "protected_photo_rectangles": protected,
                    "sha256": hashlib.sha256((output / "candidate-concept.png").read_bytes()).hexdigest()})

(output / "provenance.json").write_text(json.dumps({
    "reference": str(reference), "reference_sha256": hashlib.sha256(reference.read_bytes()).hexdigest(),
    "records": records, "meaning": "Literal supplied examples; no generated or newly evaluated model outputs."
}, indent=2) + "\n")
print(f"Extracted {len(records)} figure panels; original media preserved; no model outputs generated.")
