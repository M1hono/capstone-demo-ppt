"""Export report-derived figures with explicit protocol and provenance notes."""
from pathlib import Path
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
E = json.loads((ROOT / 'data/report-evidence.json').read_text())
OUT = ROOT / 'public/figures'
OUT.mkdir(exist_ok=True)
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 11, 'axes.spines.top': False, 'axes.spines.right': False, 'svg.fonttype': 'none', 'pdf.fonttype': 42})
COLORS = ['#0f62fe', '#007d79', '#6929c4']

def save(fig, name, note):
    fig.text(.06, .025, note, fontsize=9, color='#45505d', va='bottom')
    fig.subplots_adjust(bottom=.23, top=.88, left=(.27 if name in ('ppsd-comparison','conditioning-ablations') else .22 if name=='inference-benchmark' else .1), right=.97)
    for ext in ['svg', 'png', 'pdf']:
        fig.savefig(OUT / f'{name}.{ext}', dpi=220, facecolor='white')
    plt.close(fig)

for metric in ['psnr', 'ssim']:
    fig, ax = plt.subplots(figsize=(10.5, 5.7))
    for key, label, color, marker in zip(['top1', 'best3', 'best5'], ['Top-1', 'Best-of-3 (oracle)', 'Best-of-5 (oracle)'], COLORS, ['o','s','^']):
        ax.plot(E['fivek']['experts'], E['fivek'][metric][key], color=color, marker=marker, label=label, linewidth=2)
    ax.set_ylabel('PSNR (dB)' if metric == 'psnr' else 'SSIM')
    ax.set_xlabel('Expert / reported aggregate')
    ax.set_title('FiveK: reported candidate fidelity', loc='left', fontsize=16, pad=18)
    ax.grid(axis='y', color='#e0e5eb'); ax.set_axisbelow(True); ax.legend(frameon=False, ncols=3, fontsize=9)
    if metric == 'psnr': ax.set_ylim(20, 29)
    else: ax.set_ylim(.86, .94)
    save(fig, f'fivek-{metric}', 'Source: supplied report §3.5.1. Best-of-K uses ground truth offline; it measures coverage.\nPSNR matches the archived 120-query diagnostic. Final-run holdout protocol is unverified; SSIM is report-only.')

fig, axes = plt.subplots(1, 2, figsize=(12, 7), sharey=True)
rows = E['ppsd']; positions = np.arange(len(rows)); colors = ['#98a4b4'] * 9 + [COLORS[0]]
for ax, metric, title in zip(axes, ['psnr','ssim'], ['PSNR (dB)', 'SSIM']):
    ax.barh(positions, [r[metric] for r in rows], color=colors)
    ax.set_xlim(0, 29 if metric=='psnr' else 1); ax.set_xlabel(title); ax.grid(axis='x', alpha=.2); ax.set_axisbelow(True)
    for i, row in enumerate(rows): ax.text(row[metric]+(.3 if metric=='psnr' else .01), i, f'{row[metric]:.3f}', va='center', fontsize=9)
axes[0].set_yticks(positions, [r['method'] for r in rows]); axes[0].invert_yaxis()
fig.suptitle('PPSD: external comparison context', x=.29, ha='left', fontsize=16)
fig.subplots_adjust(wspace=.15)
save(fig, 'ppsd-comparison', 'Source: report §3.5.2 / PrefLUT Table 1(A). Baselines: 471 training users, 16 references; ours: 250 / 8.\nProtocols differ. Ours SSIM 0.841 is transcribed from the table; the report also says SSIM was not provided.')
fig, ax = plt.subplots(figsize=(10.5, 5.8))
rows=E['ablations']; positions=np.arange(len(rows)); values=[r['psnr'] for r in rows]
ax.barh(positions, values, color=['#98a4b4']*4+[COLORS[0]])
ax.set_yticks(positions,[r['name'] for r in rows]);ax.invert_yaxis();ax.set_xlim(0,27);ax.set_xlabel('PSNR (dB)')
for i,r in enumerate(rows):ax.text(r['psnr']+.3,i,f"{r['psnr']:.1f}  ({r['delta']:+.1f})",va='center')
ax.set_title('Conditioning-input ablations',loc='left',fontsize=16,pad=18)
save(fig,'conditioning-ablations','Source: supplied report §3.6. Parentheses: change from complete model (23.5 dB).\nWrong-image intervention changes the conditioner input only; the decoder still renders the original query.')

fig, axes=plt.subplots(2,2,figsize=(12,8.8)); rows=E['benchmark']['rows']; labels=[f"B{r['batch']} {r['mode']} / {r['history']}" for r in rows]
for ax,key,title in zip(axes.flat,['mean','p95','throughput','memory'],['Mean (ms / batch)','P95 (ms / batch)','Throughput (images / s)','Peak allocated CUDA (MiB)']):
    ax.barh(range(6),[r[key] for r in rows],color=[COLORS[0] if r['batch']==1 else COLORS[1] for r in rows]);ax.set_yticks(range(6),labels,fontsize=8);ax.invert_yaxis();ax.set_title(title,loc='left',fontsize=12);ax.grid(axis='x',alpha=.2);ax.set_axisbelow(True)
    maximum=max(r[key] for r in rows);ax.set_xlim(0,maximum*1.28)
    for i,r in enumerate(rows):ax.text(r[key]+maximum*.02,i,f"{r[key]:.1f}" if key=='memory' else f"{r[key]:.3f}",fontsize=8,va='center')
fig.suptitle('GPU inference: RTX 4060 Laptop',x=.2,ha='left',fontsize=16);fig.subplots_adjust(hspace=.4,wspace=.6)
save(fig,'inference-benchmark','Source: report §3.7. 256² RGB; history 8; MC 256; 5 outputs. Warm-up 3, repetitions 10.\nGPU-resident inputs; historical z cached in every row. Excludes I/O, transfers, loading, metrics and spherical search.\nP95 is a small-sample estimate. Allocated CUDA memory is not total process VRAM.')

fig,ax=plt.subplots(figsize=(10.5,5.7));rows=E['robustness']['rows']
ax.plot([r['scale'] for r in rows],[r['psnr'] for r in rows],'-o',color=COLORS[0]);ax.set_xlabel('Gaussian noise scale × training-set latent standard deviation');ax.set_ylabel('PSNR against target (dB)');ax.set_ylim(26,31);ax.grid(alpha=.2);ax.set_title('Decoder robustness diagnostic: 10 images',loc='left',fontsize=16,pad=18)
for r in rows:ax.annotate(f"{r['psnr']:.3f}",(r['scale'],r['psnr']),textcoords='offset points',xytext=(0,12 if r['scale']!=.01 else 28),ha='center',fontsize=9)
save(fig,'decoder-robustness','Source: unmodified phase2_diag.txt §8 at commit 9d85b9b. A separate 10-image diagnostic.\nThis provides limited local stability evidence; it is not a dataset-level reconstruction result.')
print(f'Exported six figure sets as SVG, PNG and PDF. matplotlib={matplotlib.__version__}; numpy={np.__version__}')
