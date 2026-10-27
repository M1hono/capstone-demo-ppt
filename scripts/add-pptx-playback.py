"""Add entrance fades only where appropriate; keep information-dense pages static."""
from pathlib import Path
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

P = "http://schemas.openxmlformats.org/presentationml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
NS = {"p": P, "a": A}
for prefix, uri in NS.items():
    ET.register_namespace(prefix, uri)
ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
ET.register_namespace("a16", "http://schemas.microsoft.com/office/drawing/2014/main")


def node(parent, tag, **attrs):
    return ET.SubElement(parent, f"{{{P}}}{tag}", {k: str(v) for k, v in attrs.items()})


def condition(parent, delay):
    node(node(parent, "stCondLst"), "cond", delay=delay)


path = Path(sys.argv[1]).resolve()
root = Path(__file__).resolve().parents[1]
words = json.loads((root / "data/playback-timing.json").read_text())["scriptWords"]
records = []
with zipfile.ZipFile(path) as archive:
    entries = {item.filename: (item, archive.read(item.filename)) for item in archive.infolist()}
for name, (info, data) in entries.items():
    match = re.fullmatch(r"ppt/slides/slide(\d+)\.xml", name)
    if not match:
        continue
    number = int(match[1])
    slide = ET.fromstring(data)
    tree = slide.find("p:cSld/p:spTree", NS)
    # The exporter reserves ID 1 for an empty placeholder; keep the group ID unique.
    tree.find("p:nvGrpSpPr/p:cNvPr", NS).set("id", "0")
    for element in list(slide):
        if element.tag in {f"{{{P}}}timing", f"{{{P}}}transition"}:
            slide.remove(element)
    if number != 12:
        entries[name] = (info, ET.tostring(slide, encoding="utf-8", xml_declaration=True))
        records.append({"slide": number, "automaticEntranceEffects": 0,
                        "lastStartMs": 0, "automaticSlideAdvance": False,
                        "static": True})
        continue
    transition = node(slide, "transition", spd="fast", advClick="1")
    node(transition, "fade")
    timing = node(slide, "timing")
    root_time = node(node(node(timing, "tnLst"), "par"), "cTn",
                     id=1, dur="indefinite", restart="never", nodeType="tmRoot")
    seq = node(node(root_time, "childTnLst"), "seq", concurrent=1, nextAc="seek")
    main = node(seq, "cTn", id=2, dur="indefinite", nodeType="mainSeq")
    start = node(node(node(main, "childTnLst"), "par"), "cTn", id=3, fill="hold")
    condition(start, 0)
    effects = node(start, "childTnLst")
    next_id = 4
    targets = []
    interval = round(min(1200, max(650, words[number - 1] * 35 / 3)))
    for shape in tree:
        # Keep every formula and explanatory label visible from slide entry.
        if shape.tag != f"{{{P}}}pic":
            continue
        shape_id = shape.find(".//p:cNvPr", NS)
        off = shape.find(".//a:xfrm/a:off", NS)
        if off is None:
            off = shape.find(".//p:xfrm/a:off", NS)
        if shape_id is None or off is None:
            continue
        text = "".join(t.text or "" for t in shape.findall(".//a:t", NS)).strip()
        if not text and shape.tag not in {f"{{{P}}}pic", f"{{{P}}}graphicFrame"}:
            continue
        x, y = int(off.get("x")) / 9525, int(off.get("y")) / 9525
        if not 105 <= y <= 650:
            continue
        group = min(2, max(0, int(x / 430)))
        delay = group * interval
        effect = node(node(effects, "par"), "cTn", id=next_id, presetID=10,
                      presetClass="entr", presetSubtype=0, fill="hold", nodeType="withEffect")
        next_id += 1
        condition(effect, delay)
        children = node(effect, "childTnLst")
        setting = node(children, "set")
        behavior = node(setting, "cBhvr")
        setting_time = node(behavior, "cTn", id=next_id, dur=1, fill="hold")
        next_id += 1
        condition(setting_time, 0)
        node(node(behavior, "tgtEl"), "spTgt", spid=shape_id.get("id"))
        node(node(behavior, "attrNameLst"), "attrName").text = "style.visibility"
        node(node(setting, "to"), "strVal", val="visible")
        animation = node(children, "animEffect", transition="in", filter="fade")
        behavior = node(animation, "cBhvr")
        node(behavior, "cTn", id=next_id, dur=300)
        next_id += 1
        node(node(behavior, "tgtEl"), "spTgt", spid=shape_id.get("id"))
        targets.append({"shapeId": shape_id.get("id"), "delayMs": delay})
    ids = [e.get("id") for e in slide.findall(".//p:cTn", NS)]
    assert len(ids) == len(set(ids))
    shape_ids = [e.get("id") for e in slide.findall(".//p:cNvPr", NS)]
    assert len(shape_ids) == len(set(shape_ids))
    assert all(t["shapeId"] in shape_ids for t in targets)
    assert targets and transition.get("advTm") is None
    entries[name] = (info, ET.tostring(slide, encoding="utf-8", xml_declaration=True))
    records.append({"slide": number, "automaticEntranceEffects": len(targets),
                    "lastStartMs": max(t["delayMs"] for t in targets),
                    "automaticSlideAdvance": False})
temporary = path.with_suffix(".timing.pptx")
with zipfile.ZipFile(temporary, "w", zipfile.ZIP_DEFLATED) as archive:
    for info, data in entries.values():
        archive.writestr(info, data)
with zipfile.ZipFile(temporary) as archive:
    assert archive.testzip() is None
    for name in archive.namelist():
        if name.endswith(".xml"):
            ET.fromstring(archive.read(name))
temporary.replace(path)
(root / "tmp/slides/final-25/pptx-playback.json").write_text(
    json.dumps(sorted(records, key=lambda row: row["slide"]), indent=2) + "\n")
print(f"Added automatic fades to {sum(not r.get('static') for r in records)} slides; all other slides stay static; slide advancement stays manual.")
