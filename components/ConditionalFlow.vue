<script setup>
import { useSequence } from '../composables/useSequence'
const sequence=useSequence(['Training map','Likelihood objective','Conditional sampling','Cluster and rank'],{animate:true,intervalMs:2400})
const active=i=>!sequence.complete.value && sequence.step.value===i
const samples=Array.from({length:60},(_,i)=>({x:50+Math.sin(i*2.4)*(5+i%36),y:42+Math.cos(i*1.9)*(4+i%27)}))
</script>
<template>
  <div class="stack flow-academic">
    <div class="condition-ribbon"><strong>c</strong><b>Current image + 8 history pairs → Transformer</b><span>Shared condition · z, u ∈ ℝ³</span></div>
    <section class="flow-section training-section" data-flow-training>
      <div class="flow-section-head"><span class="phase-label">01 / TRAINING</span><h2>Train the density</h2><p>Maximise log p(z | c)</p></div>
      <div class="training-layout">
        <div class="training-chain" :class="{active:active(0)}">
          <article class="flow-card source-card"><div class="card-index">A</div><h3>Ground-truth z</h3><div class="vector-icon"><i/><i/><i/></div><p>Stage 1 encodes (O, T)</p></article>
          <span class="flow-arrow">→</span>
          <article class="flow-card flow-card-feature"><div class="card-index">B</div><h3>Conditional Flow</h3><div class="forward-symbol">f</div><p class="math-line">u = f(z; c)</p><small>Invertible transformation</small></article>
          <span class="flow-arrow">→</span>
          <article class="flow-card gaussian-card"><div class="card-index">C</div><h3>Standard Gaussian</h3><svg viewBox="0 0 130 56" role="img" aria-label="Illustrative standard Gaussian density"><path d="M4 51 C25 51 28 6 65 6 C102 6 105 51 126 51" fill="var(--pale)" stroke="var(--teal)" stroke-width="2"/><path d="M4 51 H126" stroke="var(--muted)"/></svg><p class="math-line">u ∼ N(0, I)</p></article>
        </div>
        <div class="likelihood-objective" :class="{active:active(1)}">
          <div class="objective-eyebrow">OPTIMISE THE MAP</div>
          <div class="objective-title"><h3>Conditional log-likelihood</h3><b>L = −log p(z | c)</b></div>
          <p class="density-equation">log p(z | c) = log p(u) + log |det J|</p>
          <div class="density-definitions"><span>J = ∂f(z; c) / ∂z</span><span>log p(u) = −½‖u‖² − ³⁄₂ log(2π)</span></div>
          <p class="backprop">↶ Backpropagation updates Flow parameters.</p>
        </div>
      </div>
    </section>
    <section class="flow-section inference-section" data-flow-inference>
      <div class="flow-section-head"><span class="phase-label">02 / INFERENCE</span><h2>Generate candidates</h2><p>Reverse the map, then select</p></div>
      <div class="inference-path">
        <article class="inference-node sample-node" :class="{active:active(2)}"><div class="card-index">01</div><h3>Monte Carlo</h3><svg viewBox="0 0 100 82" role="img" aria-label="Illustrative standard Gaussian samples"><circle v-for="(p,i) in samples" :key="i" :cx="p.x" :cy="p.y" r="1.8" fill="var(--blue)" data-flow-sample/></svg><p>M samples u ∼ N(0, I)</p></article><span class="flow-arrow">→</span>
        <article class="inference-node inverse-node" :class="{active:active(2)}"><div class="card-index">02</div><h3>Inverse Flow + c</h3><div class="inverse-symbol">f⁻¹</div><p class="math-line">z = f⁻¹(u; c)</p><small>M candidate edit vectors</small></article><span class="flow-arrow">→</span>
        <article class="inference-node cluster-node" :class="{active:active(3)}"><div class="card-index">03</div><h3>K-means in z space</h3><svg viewBox="0 0 150 82" role="img" aria-label="Illustrative edit samples partitioned into clusters"><g v-for="j in 3" :key="j"><circle :cx="25+(j-1)*50" :cy="j%2?30:53" r="23" fill="none" stroke="var(--line)"/><circle v-for="k in 10" :key="k" :cx="25+(j-1)*50+Math.sin(k*2.3)*15" :cy="(j%2?30:53)+Math.cos(k*2)*15" r="2" :fill="j===1?'var(--amber)':'var(--purple)'"/></g></svg><p>K groups of edit vectors</p></article><span class="flow-arrow">→</span>
        <article class="inference-node rank-node" :class="{active:active(3)}"><div class="card-index">04</div><h3>Rank clusters</h3><div class="rank-bars"><i/><i/><i/></div><p>Mean log p(z | c)</p><small>One representative per cluster</small></article><span class="flow-arrow">→</span>
        <article class="inference-node candidate-node" :class="{active:active(3)}"><div class="card-index">05</div><h3>Top-1 … Top-K</h3><div class="candidate-symbols"><span>z₁</span><span>z₂</span><span>…</span></div><p>LUT decoder + original O</p><small>Multiple retouched images</small></article>
      </div>
    </section>
    <div class="flow-takeaway"><b>Density-ranked alternatives</b><p>No query target during generation. Best-of-K uses the target only for offline evaluation.</p></div>
  </div>
</template>
<style scoped>
.flow-academic{gap:10px;height:100%}
.condition-ribbon{display:flex;align-items:center;gap:14px;min-height:42px;padding:6px 12px;background:var(--ink);color:var(--panel);border-radius:4px}
.condition-ribbon>strong{display:grid;place-items:center;background:var(--signal);color:var(--ink);font:italic 27px/1 Saira;width:34px;height:34px}
.condition-ribbon>b{font-size:19px;font-weight:500}
.condition-ribbon>span{margin-left:auto;font-size:14px;color:#d9e4e0}
.flow-section{min-width:0}
.flow-section-head{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:12px;margin:2px 0 8px}
.phase-label{font:650 11px/1.2 Saira;letter-spacing:1px;color:var(--teal)}
.flow-section-head h2{font-size:23px;margin:0;letter-spacing:-.2px}
.flow-section-head>p{font-size:14px;color:var(--muted);margin:0}
.training-layout{display:grid;grid-template-columns:1.45fr .95fr;gap:16px}
.training-chain{display:grid;grid-template-columns:minmax(0,1fr) 22px minmax(0,1fr) 22px minmax(0,1fr);gap:7px;align-items:stretch;padding:9px;border:1px solid var(--line);background:var(--panel);border-top:3px solid var(--line);transition:border-color 250ms}
.flow-card{padding:10px 11px;background:var(--surface);border:1px solid var(--line);min-width:0}
.flow-card-feature{background:#e7f0ee;border-color:#b7d2ca}
.gaussian-card{background:#f0eee6}
.flow-card h3{font-size:17px;margin:2px 0 5px;white-space:nowrap}
.card-index{font:650 10px/1 Saira;letter-spacing:1px;color:var(--muted)}
.flow-card p{font-size:13px;color:var(--muted);line-height:1.3}
.flow-card small{display:block;font-size:11px;line-height:1.25;color:var(--muted);margin-top:3px}
.flow-card svg{width:100%;height:45px;display:block;margin:2px auto 1px}
.vector-icon{height:45px;display:flex;align-items:center;justify-content:center;gap:4px}
.vector-icon i{width:17px;height:26px;border:1px solid var(--teal);background:#d8e7e1}
.forward-symbol{font:italic 38px/45px Saira;height:45px;color:var(--blue);text-align:center}
.flow-academic .math-line{font-size:16px;color:var(--ink);white-space:nowrap}
.flow-arrow{font-size:22px;color:var(--muted);align-self:center;text-align:center}
.likelihood-objective{padding:11px 14px;background:#f1f0e6;border:1px solid var(--line);border-top:3px solid var(--amber);min-width:0;transition:border-color 250ms,background 250ms}
.objective-eyebrow{font:650 10px/1.2 Saira;letter-spacing:1px;color:var(--amber);margin-bottom:7px}
.objective-title{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:7px}
.objective-title h3{font-size:16px;margin:0;white-space:nowrap}
.objective-title>b{font:600 19px/1.1 Saira;white-space:nowrap}
.density-equation{font-size:18px;line-height:1.2;white-space:nowrap}
.density-definitions{display:grid;gap:4px;font-size:12px;line-height:1.25;color:var(--muted);margin-top:8px}
.backprop{font-size:13px;color:var(--muted);border-top:1px solid var(--line);padding-top:7px;margin-top:8px!important}
.inference-section{border-top:1px solid var(--line);padding-top:2px}
.inference-path{display:grid;grid-template-columns:repeat(4,minmax(0,1fr) 18px) minmax(0,1fr);gap:7px;min-height:144px}
.inference-node{padding:9px 10px;border:1px solid var(--line);border-top:3px solid var(--line);background:var(--surface);min-width:0;transition:border-color 250ms,background 250ms}
.inference-node h3{font-size:16px;line-height:1.15;margin:2px 0 6px;min-height:36px}
.inference-node p{font-size:13px;line-height:1.3;color:var(--muted);margin-top:5px}
.inference-node>small{display:block;font-size:11px;line-height:1.25;color:var(--muted);margin-top:4px}
.inference-node svg{width:100%;height:48px;display:block}
.sample-node{background:#edf2f0}.inverse-node{background:#ecf0f5}.cluster-node{background:#f1edf3}.rank-node{background:#f2f0e6}.candidate-node{background:#edf1ee}
.inverse-symbol{font:italic 37px/48px Saira;height:48px;text-align:center;color:var(--blue)}
.rank-bars{height:48px;display:flex;flex-direction:column;justify-content:center;gap:6px}
.rank-bars i{display:block;background:var(--purple);height:7px}.rank-bars i:nth-child(2){width:73%}.rank-bars i:nth-child(3){width:47%}
.candidate-symbols{height:48px;display:flex;gap:5px;align-items:center;justify-content:center}.candidate-symbols span{padding:5px 7px;border:1px solid var(--muted);font-size:18px}
.flow-academic .active{border-top-color:var(--blue)}.likelihood-objective.active{background:#f2eac9;border-top-color:var(--amber)}.inverse-node.active{background:#e1ecef}
.flow-takeaway{display:flex;align-items:center;gap:20px;border-top:1px solid var(--ink);padding-top:9px;min-height:37px}
.flow-takeaway>b{font:600 19px Saira;white-space:nowrap;color:var(--blue)}
.flow-takeaway>p{font-size:14px;color:var(--muted)}
</style>
