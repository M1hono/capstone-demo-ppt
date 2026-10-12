#!/usr/bin/env python3
"""Generate synthetic preference-sphere data for the component workbench.

Produces public/assets/sphere/sphere-data.json with the same schema that
tools/export_sphere_json.py emits from the real model, so the Slidev
component can switch from placeholder to real data without changes.

Everything is deterministic (seed per image+expert). The distributions are
mixtures of von-Mises-Fisher-like clusters so the sphere views show the same
multimodal structure the real flow produces. No metric numbers are faked:
this file carries only geometry (directions, densities, candidate ranks).
"""
import json
import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "sphere" / "sphere-data.json"
IMAGES = ["0001", "0045", "1523"]
EXPERTS = ["A", "B", "C", "D", "E"]
N_SAMPLES = 256
LAT, LON = 24, 48
DENSITY_RADIUS_DEG = 14.0
# Expert base directions: deliberately spread so each expert's sphere differs.
EXPERT_DIRS = {
    "A": [(0.55, 0.30, 0.78), (-0.20, 0.75, 0.63)],
    "B": [(0.88, -0.20, 0.42), (0.10, 0.30, 0.95)],
    "C": [(-0.45, 0.62, 0.64), (-0.75, -0.30, 0.59)],
    "D": [(0.20, -0.85, 0.49), (0.62, -0.35, 0.70)],
    "E": [(-0.35, -0.28, 0.89), (0.35, 0.60, 0.72)],
}
# Per-image rotations (small, deterministic) so same expert differs across images.
IMAGE_ROT = {"0001": 0.0, "0045": 0.9, "1523": 1.8}


def normalize(v):
    n = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / n for x in v]


def rot_y(v, a):
    c, s = math.cos(a), math.sin(a)
    return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]]


def tangent_sample(rng, center, kappa):
    """Sample a unit direction around center with angular spread ~ 1/sqrt(kappa)."""
    spread = 0.35
    # build orthonormal basis
    ref = [0.0, 0.0, 1.0] if abs(center[2]) < 0.9 else [1.0, 0.0, 0.0]
    u = normalize([center[1] * ref[2] - center[2] * ref[1], center[2] * ref[0] - center[0] * ref[2], center[0] * ref[1] - center[1] * ref[0]])
    w = [center[1] * u[2] - center[2] * u[1], center[2] * u[0] - center[0] * u[2], center[0] * u[1] - center[1] * u[0]]
    a, b = rng.gauss(0, spread), rng.gauss(0, spread)
    d = normalize([center[0] + a * u[0] + b * w[0], center[1] + a * u[1] + b * w[1], center[2] + a * u[2] + b * w[2]])
    return d


def grid_dirs(nlat, nlon):
    pts = []
    for i in range(nlat):
        la = -math.pi / 2 + (i + 0.5) * math.pi / nlat
        for j in range(nlon):
            lo = -math.pi + (j + 0.5) * 2 * math.pi / nlon
            pts.append((la, lo))
    return pts


def to_latlon(d):
    lat = math.asin(max(-1.0, min(1.0, d[2])))
    lon = math.atan2(d[1], d[0])
    return lat, lon


def main():
    cells = grid_dirs(LAT, LON)
    entries = {}
    for img in IMAGES:
        entries[img] = {}
        for exp in EXPERTS:
            rng = random.Random(f"synthetic|{img}|{exp}")
            centers = [normalize(rot_y(list(c), IMAGE_ROT[img])) for c in EXPERT_DIRS[exp]]
            weights = [rng.uniform(0.45, 0.9) for _ in centers]
            weights = [w / sum(weights) for w in weights]
            samples, mags, lps = [], [], []
            for _ in range(N_SAMPLES):
                ci = rng.choices(range(len(centers)), weights=weights)[0]
                d = tangent_sample(rng, centers[ci], 1.0)
                samples.append([round(x, 5) for x in d])
                mags.append(round(rng.uniform(0.6, 1.4), 4))
                best = max(sum(a * b for a, b in zip(d, c)) for c in centers)
                lps.append(round(2.2 * best + rng.gauss(0, 0.08), 4))
            cos_r = math.cos(math.radians(DENSITY_RADIUS_DEG))
            counts = []
            rel = []
            for la, lo in cells:
                c = normalize([math.cos(la) * math.cos(lo), math.cos(la) * math.sin(lo), math.sin(la)])
                counts.append(sum(1 for s in samples if sum(a * b for a, b in zip(s, c)) >= cos_r))
                best = max(sum(a * b for a, b in zip(c, cen)) for cen in centers)
                rel.append(round(math.exp(max(-80.0, 2.2 * (best - 1.0))), 5))
            cands = []
            order = sorted(range(len(centers)), key=lambda i: -weights[i])
            for rank, ci in enumerate(order, 1):
                cen = centers[ci]
                lp = round(2.2 * max(sum(a * b for a, b in zip(cen, cc)) for cc in centers), 4)
                cands.append({"z": [round(x * rng.uniform(0.9, 1.15), 5) for x in cen], "lp": lp, "rank": rank})
            gt_dir = tangent_sample(rng, centers[0], 1.0)
            entries[img][exp] = {
                "samples": samples,
                "mags": mags,
                "lp": lps,
                "gt": [round(x * 1.05, 5) for x in gt_dir],
                "candidates": cands,
                "density": {"lat": LAT, "lon": LON, "counts": counts},
                "prob": {"lat": LAT, "lon": LON, "rel": rel},
            }
    doc = {
        "meta": {
            "source": "synthetic",
            "dataset": "FiveK",
            "z_dim": 3,
            "mc_samples": N_SAMPLES,
            "prob_grid": [LAT, LON],
            "density_radius_deg": DENSITY_RADIUS_DEG,
            "note": "Synthetic placeholder geometry. Replace via tools/export_sphere_json.py on the GPU machine.",
        },
        "images": IMAGES,
        "experts": EXPERTS,
        "entries": entries,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(doc))
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
