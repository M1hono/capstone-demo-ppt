"""Refresh the existing four transaction roles and execute exact rollback checks."""
from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import zipfile

root = Path(__file__).resolve().parents[1]
roles = root.parent / "ppt-transaction"
baseline = roles / "ENDFIELD_BASELINE"
expected = json.loads((roles / "endfield-baseline-hashes.json").read_text())
excluded = {"node_modules", ".git", "tmp", "dist", "exports", "__pycache__"}
role_names = ["MODIFIED_FILE.zip", "DIFF_FILE.patch", "VERIFICATION.txt", "ROLLBACK.sh"]
commands = []


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def files(directory):
    return {str(p.relative_to(directory)): p
            for p in directory.rglob("*")
            if p.is_file() and not p.is_symlink()
            and not any(part in excluded for part in p.relative_to(directory).parts)}


def hashes(directory):
    return {name: digest(path) for name, path in sorted(files(directory).items())}


def run(argv, directory, phase):
    result = subprocess.run(argv, cwd=directory, text=True, capture_output=True)
    record = {"phase": phase, "cwd": str(directory), "command": argv,
              "input": "local evidence and slide index",
              "stdout": result.stdout, "stderr": result.stderr, "exit_status": result.returncode}
    commands.append(record)
    if result.returncode:
        raise RuntimeError(json.dumps(record, indent=2))
    return result


assert hashes(baseline) == dict(sorted(expected.items())), "Pristine baseline changed"
original = run(["node", "scripts/validate-evidence.mjs"], baseline, "BASELINE")
modified = run(["node", "scripts/validate-evidence.mjs"], root, "MODIFIED")
assert "52 pages" in original.stdout and "25 pages" in modified.stdout
run([sys.executable, "scripts/verify-static-exports.py"], root, "EXPORT_VERIFICATION")
manifest = hashes(root)
work = Path(tempfile.mkdtemp(prefix="soft3888-final-transaction-", dir="/private/tmp"))
history = roles / "history" / work.name
history.mkdir(parents=True)
for name in role_names:
    if (roles / name).exists():
        shutil.copy2(roles / name, history / name)

repo = work / "patch-repo"
shutil.copytree(baseline, repo)
run(["git", "init", "-q"], repo, "PATCH_BASE_INIT")
run(["git", "add", "-A"], repo, "PATCH_BASE_STAGE")
run(["git", "-c", "user.name=Presentation verification", "-c",
     "user.email=verification@localhost", "-c", "commit.gpgsign=false",
     "commit", "-qm", "Pristine source"], repo, "PATCH_BASE_COMMIT")
for name in expected:
    if name not in manifest:
        (repo / name).unlink()
for name, source in files(root).items():
    target = repo / name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
run(["git", "add", "-A"], repo, "PATCH_MODIFIED_STAGE")
patch = subprocess.run(["git", "diff", "--cached", "--binary", "--full-index", "HEAD"],
                       cwd=repo, capture_output=True, check=True).stdout
assert patch.startswith(b"diff --git") and patch.strip()
(roles / "DIFF_FILE.patch").write_bytes(patch)

archive = roles / "MODIFIED_FILE.zip"


def write_archive(source):
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as output:
        for name, path in sorted(files(source).items()):
            output.write(path, name)


write_archive(root)
added = sorted(set(manifest) - set(expected))
rollback = """#!/bin/sh
set -eu
if [ "$#" -ne 1 ] || [ ! -d "$1" ]; then
  printf '%s\\n' 'Usage: ROLLBACK.sh /absolute/path/to/target-copy' >&2
  exit 2
fi
case "$1" in /*) ;; *) exit 2 ;; esac
target=$(CDPATH= cd -- "$1" && pwd -P)
transaction_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
live=''
if [ -d "$transaction_dir/../presentation" ]; then
  live=$(CDPATH= cd -- "$transaction_dir/../presentation" && pwd -P)
fi
if [ "$target" = "$live" ] || [ ! -f "$target/slides.md" ]; then
  printf '%s\\n' 'Rollback requires a separate presentation copy.' >&2
  exit 2
fi
while IFS= read -r relative
do
  [ -n "$relative" ] || continue
  rm -f -- "$target/$relative"
done <<'ADDED_FILES'
""" + "\n".join(added) + """
ADDED_FILES
tar -xzf "$transaction_dir/ENDFIELD_BASELINE.tar.gz" -C "$target"
printf 'Restored pristine 52-slide source to %s\\n' "$target"
"""
(roles / "ROLLBACK.sh").write_text(rollback)
os.chmod(roles / "ROLLBACK.sh", 0o755)
restored = work / "rollback-copy"
restored.mkdir()
with zipfile.ZipFile(archive) as source:
    source.extractall(restored)
run([str(roles / "ROLLBACK.sh"), str(restored)], root, "ROLLBACK_EXECUTION")
rolled = run(["node", "scripts/validate-evidence.mjs"], restored, "ROLLBACK")
assert rolled.stdout == original.stdout and rolled.stderr == original.stderr
assert hashes(restored) == hashes(baseline), "Rollback hash mismatch"

reconstructed = work / "patch-reconstruction"
shutil.copytree(baseline, reconstructed)
run(["git", "apply", "--binary", str(roles / "DIFF_FILE.patch")], reconstructed, "PATCH_RECONSTRUCTION")
assert hashes(reconstructed) == manifest, "Patch reconstruction mismatch"
assert hashes(root) == manifest, "Active source changed during rollback"
# Reapply the verified goal to the changed artifact from the reconstructed copy.
write_archive(reconstructed)

qa = json.loads((root / "exports/qa-show.json").read_text())
assert qa["pages"] == 25 and qa["problems"] == 0
reference = root.parents[2] / "13汇报.pptx"
assert digest(reference) == "6f07c8c4ab7ca30290298873dc18c643315caeb67e4daa088c9fdf38f249f7f5"
record = {
    "TARGET": str(root),
    "REFERENCE": str(reference),
    "GOAL": "25 reference-ordered slides aligned with the speech; complete academic diagrams on pages 9/11/12; clearer, more engaging page 11/12 layouts; restored reference results; static pages except 12; no playback controls; complete static PDF",
    "changed_sites": ["slides.md", "data/component-index.json", "composables/useSequence.js: enter/tick",
                      "components/WorkbenchPage.vue: no-motion/static-view",
                      "components/RetouchingEncoder.vue",
                      "components/TransformerConditioning.vue: paired tokens and query readout",
                      "components/ConditionalFlow.vue: training/inference layout and persistent content",
                      "components/LatentGeometry.vue", "public/assets/reference-deck",
                      "scripts/capture-pptx.mjs", "scripts/add-pptx-playback.py",
                      "scripts/extract-reference-results.py", "docs/reference-coverage.md"],
    "baseline_slides_sha256": expected["slides.md"],
    "modified_slides_sha256": manifest["slides.md"],
    "reference_unchanged": True,
    "baseline_source_files": len(expected),
    "modified_source_files": len(manifest),
    "rollback_hashes_match": True,
    "patch_reconstruction_matches": True,
    "browser_qa": qa,
    "static_export_verification": json.loads((root / "exports/static-export-verification.json").read_text()),
    "reference_coverage": {
        "path": str(root / "docs/reference-coverage.md"),
        "sha256": digest(root / "docs/reference-coverage.md"),
        "content": (root / "docs/reference-coverage.md").read_text(),
    },
    "result_panel_provenance": json.loads((root / "public/assets/reference-deck/results/provenance.json").read_text()),
    "background_removal": json.loads((root / "public/assets/reference-deck/transparency-provenance.json").read_text()),
    "pptx_playback_structure": json.loads((root / "tmp/slides/final-25/pptx-playback.json").read_text()),
    "native_animation_limitation": "Open XML timing, target IDs and manual slide advancement verified; playback not exercised in desktop PowerPoint.",
    "commands": commands,
    "exports": {name: {"path": str(root / "exports" / name), "sha256": digest(root / "exports" / name)}
                for name in ["output.pptx", "Personalized-Image-Retouching-Final-25.pdf"]},
    "checkpoint_remote_sha": "f5b1a4feb28b925e113af846e62f7aedb84d465b",
    "final_revision_pushed": False,
    "prior_corrected_errors": [
        {"source": "npm run build at study root", "exit_status": 1, "resolution": "Reran from presentation root; exit 0"},
        {"source": "apply_patch duplicate delete/add target", "status": "tool rejected before changes", "resolution": "Replaced exact files in one write"},
        {"source": "old development server component cache", "exit_status": 1, "resolution": "Fresh production preview"},
        {"source": "preview rebuilt during browser run", "exit_status": 1, "resolution": "Sequential build and QA"},
        {"source": "reference title extraction selected an empty decorative shape", "resolution": "Selected first nonempty text and asserted every title"},
        {"source": "page 11/12 layout checks found overflow in an intermediate revision", "resolution": "Adjusted layout spacing; final 78-state browser report has zero problems and final PDF pages visually checked"},
        {"source": "git status at study and presentation directories", "exit_status": 128, "resolution": "These source directories are not Git repositories; read the existing checkpoint-publish repository and retained its pushed checkpoint identity"}
    ],
}
run(["sh", "-n", str(roles / "ROLLBACK.sh")], root, "ROLLBACK_SYNTAX")
(roles / "final-source-hashes.json").write_text(json.dumps(manifest, indent=2) + "\n")
(roles / "VERIFICATION.txt").write_text(json.dumps(record, indent=2) + "\n")
with zipfile.ZipFile(archive) as source:
    assert source.testzip() is None
    assert json.loads(source.read("data/title-order.json"))["titles"]
assert (roles / "DIFF_FILE.patch").read_bytes() == patch
assert json.loads((roles / "VERIFICATION.txt").read_text())["rollback_hashes_match"]
for name in role_names:
    path = roles / name
    print(json.dumps({"role": name, "path": str(path.resolve()), "bytes": path.stat().st_size,
                      "sha256": digest(path)}))
for phase in ["BASELINE", "MODIFIED", "ROLLBACK"]:
    command = next(c for c in commands if c["phase"] == phase)
    print(f"{phase} exit={command['exit_status']}: {command['stdout'].splitlines()[0]}")
