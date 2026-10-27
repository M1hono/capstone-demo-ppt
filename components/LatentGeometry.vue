<script setup>
const base=import.meta.env.BASE_URL
</script>
<template>
  <div class="stack latent-geometry">
    <div class="latent-principles"><span><b>Continuous</b> Nearby vectors, similar edits</span><span class="latent-formula">z = ‖z‖ · ẑ</span></div>
    <div class="latent-comparison grow">
      <figure class="latent-reference"><h2>Direction → editing type</h2><p>14 directions · fixed magnitude ‖z‖ = 2</p><img :src="base+'assets/reference-deck/direction-grid-transparent.png'" alt="Original image, 14 directions in the 3D latent space at magnitude 2, and all 14 decoded edits"><figcaption>Different directions change colour and tone.</figcaption></figure>
      <figure class="latent-reference"><h2>Magnitude → editing strength</h2><p>3 directions · magnitudes 2, 4, 6, 8</p><img :src="base+'assets/reference-deck/magnitude-grid-transparent.png'" alt="Three fixed directions and all decoded edits at increasing magnitudes 2, 4, 6 and 8"><figcaption>The same direction produces progressively stronger edits.</figcaption></figure>
    </div>
    <p class="latent-takeaway">Editing type and strength vary within one continuous 3D space.</p>
  </div>
</template>
<style scoped>
.latent-geometry{gap:22px}.latent-principles{display:flex;justify-content:space-between;align-items:center;font-size:21px;color:var(--muted)}.latent-principles b{font:600 26px Saira;color:var(--ink);margin-right:12px}.latent-formula{font-size:28px;color:var(--ink)}.latent-comparison{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center}.latent-reference{margin:0;min-width:0;display:flex;flex-direction:column;gap:14px;border-top:2px solid var(--ink);padding-top:20px}.latent-reference h2{font-size:28px;line-height:1.2;margin:0}.latent-reference p{font-size:18px;color:var(--muted)}.latent-reference img{width:100%;height:222px;object-fit:contain;background:transparent}.latent-reference figcaption{font-size:19px;line-height:1.4;color:var(--muted);min-height:54px}.latent-takeaway{font-size:22px;border-top:1px solid var(--line);padding-top:14px}
</style>
