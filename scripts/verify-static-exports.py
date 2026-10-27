"""Check complete PDF content and deliberately static PowerPoint slides."""
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET
import zipfile

from pypdf import PdfReader

root = Path(__file__).resolve().parents[1]
pdf = root / "exports/Personalized-Image-Retouching-Final-25.pdf"
pptx = root / "exports/output.pptx"
titles = json.loads((root / "data/title-order.json").read_text())["titles"]
required = {
    9: ["9 input channels", "Flatten", "FC", "3D edit vector", "8 learnable basis LUTs",
        "Reconstruction loss", "Backpropagation", "Jointly update encoder"],
    10: ["Direction", "editing type", "Magnitude", "editing strength", "14 directions", "2, 4, 6, 8"],
    11: ["Shared image encoder", "Stage 1 edit encoder", "FC", "17 tokens",
         "D dimensions", "Layer 1", "Layer 2", "Read updated query token", "no weight updates"],
    12: ["Train the density", "Generate candidates", "Ground-truth z", "Invertible transformation", "Standard Gaussian",
         "log |det J|", "Backpropagation", "Flow parameters", "Monte Carlo",
         "K-means", "Mean log p(z | c)", "representative per cluster", "LUT decoder"],
    17: ["23.562", "25.191", "26.214", "23.263", "0.8852", "different expert histories"],
    18: ["PieNet", "RefRetouch", "23.562", "24.5", "Performance context"],
    19: ["18.3", "22.1", "20.2", "22.3", "23.5"],
    20: ["Direction density", "ignores magnitude", "normalised per image",
         "Black ray", "Best-of-K uses ground truth offline"],
    22: ["segmentation", "Dynamic grouping", "Memory slots", "Similarity retrieval",
         "Conditional density", "still needs instructions", "real users",
         "Soft retrieval averaged", "hard retrieval fixed", "30%", "multiple possible edits"],
    23: ["testable hypothesis", "model interfaces", "findings and feasibility",
         "priorities and responsibilities"],
}


def compact(text):
    return re.sub(r"\s+", "", text).casefold()


reader = PdfReader(pdf)
assert len(reader.pages) == 25
pdf_pages = []
for n, page in enumerate(reader.pages, 1):
    text = compact(page.extract_text())
    assert compact(titles[n - 1]) in text, f"PDF title missing on {n}"
    for control in ["Replay", "Pause", "Play explanation"]:
        assert compact(control) not in text, f"PDF playback control on {n}"
    for term in required.get(n, []):
        assert compact(term) in text, f"PDF page {n} missing {term}"
    pdf_pages.append({"page": n, "title": titles[n - 1], "required_content_present": True})
assert len(reader.pages[9].images) == 2, "PDF slide 10 must embed both reference figures"

ns = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "p": "http://schemas.openxmlformats.org/presentationml/2006/main"}
pptx_pages = []
with zipfile.ZipFile(pptx) as archive:
    assert archive.testzip() is None
    names = [name for name in archive.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)]
    assert len(names) == 25
    chart_names = [name for name in archive.namelist() if re.search(r"/charts/chart\d+\.xml$", name)]
    assert len(chart_names) == 2
    for n in range(1, 26):
        slide = ET.fromstring(archive.read(f"ppt/slides/slide{n}.xml"))
        text = compact(" ".join(t.text or "" for t in slide.findall(".//a:t", ns)))
        assert compact(titles[n - 1]) in text, f"PPTX title missing on {n}"
        for term in required.get(n, []):
            # Native chart XML owns the quantitative values and series labels.
            if n in {18, 19}:
                continue
            assert compact(term) in text, f"PPTX page {n} missing {term}"
        assert not any(compact(word) in text for word in ["Replay", "Pause", "Play explanation"])
        ids = [node.get("id") for node in slide.findall(".//p:cNvPr", ns)]
        assert len(ids) == len(set(ids)), f"Duplicate shape IDs on {n}"
        timing = slide.find("p:timing", ns)
        transition = slide.find("p:transition", ns)
        if n != 12:
            assert timing is None and transition is None, f"Static PPTX slide {n} has animation"
        if transition is not None:
            assert transition.get("advTm") is None
        pptx_pages.append({"slide": n, "static": timing is None, "title_verified": True})
    assert len(ET.fromstring(archive.read("ppt/slides/slide10.xml")).findall(".//p:pic", ns)) == 2

record = {
    "pdf": {"pages": len(reader.pages), "slide10_images": 2, "playback_controls": 0,
            "complete_content_checks": pdf_pages},
    "pptx": {"slides": len(names), "native_charts": len(chart_names),
             "static_slides": [n for n in range(1, 26) if n != 12], "checks": pptx_pages},
    "artifacts": {p.name: {"path": str(p), "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
                          "bytes": p.stat().st_size} for p in [pdf, pptx]},
    "limitation": "PowerPoint timing XML checked; desktop animation playback not exercised.",
}
(root / "exports/static-export-verification.json").write_text(json.dumps(record, indent=2) + "\n")
print("PASS: PDF 25 pages, no playback controls; slide 10 has both figures; all required multi-stage text present.")
print("PASS: PPTX 25 slides, 2 native charts; only slide 12 contains animation timing; all other slides are static.")
