<script setup>
const limits = [
  { title: 'History pairing', finding: 'Weak image–edit pairing sensitivity.', scope: 'The archived diagnostic does not establish fine-grained preference learning.' },
  { title: 'Preference validation', finding: 'Coverage is not user satisfaction.', scope: 'Best-of-K uses the target; alternative edits have not been user-tested.' },
  { title: 'Edit capacity', finding: 'Global colour and tone only.', scope: 'A 3D vector and global LUTs limit regional and structural edits.' },
  { title: 'Evaluation scope', finding: 'Incomplete final-run evidence.', scope: 'Final checkpoints and split manifests are missing; comparison protocols differ.' },
]
</script>
<template>
  <div class="limitations">
    <article v-for="(item, i) in limits" :key="item.title">
      <span class="limit-number">0{{i + 1}}</span>
      <div><h2>{{item.title}}</h2><h3>{{item.finding}}</h3><p>{{item.scope}}</p></div>
    </article>
    <p class="source-caption">Runtime measures model stages with inputs on GPU; end-to-end latency remains untested.</p>
  </div>
</template>
<style scoped>
.limitations{display:grid;grid-template-columns:1fr 1fr;gap:35px 58px;align-content:center}
.limitations article{display:grid;grid-template-columns:42px 1fr;gap:18px;border-top:1px solid var(--ink);padding-top:23px;min-height:190px}
.limit-number{font:500 25px Saira,sans-serif;color:var(--muted)}.limitations h2{font-size:30px;margin:0 0 18px}.limitations h3{font-size:21px;font-weight:500;margin:0 0 12px}.limitations article p{font-size:19px;line-height:1.45;color:var(--muted);max-width:440px}
.limitations>.source-caption{grid-column:1/-1;border-top:1px solid var(--line);padding-top:14px}
</style>
