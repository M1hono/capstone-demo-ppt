<script setup>
import Counter from './Counter.vue'

defineProps({
  original: { type: String, default: '' },
  decoded: { type: String, default: '' },
  psnr: { type: Number, default: 29.3 },
})
</script>

<template>
  <div class="recon-strip">
    <div class="rs-panels">
      <figure>
        <img v-if="original" :src="original" alt="Original FiveK photograph">
        <div v-else class="rs-placeholder">original<br><small>awaiting GPU export</small></div>
        <figcaption>Input x</figcaption>
      </figure>
      <span class="rs-arrow" aria-hidden="true">→</span>
      <figure>
        <img v-if="decoded" :src="decoded" alt="Phase-1 reconstruction of the input">
        <div v-else class="rs-placeholder rs-decoded">reconstruction<small>awaiting GPU export</small></div>
        <figcaption>Phase-1 reconstruction x̂</figcaption>
      </figure>
      <div class="rs-metric">
        <p class="rs-value"><Counter :value="psnr" :decimals="1" suffix=" dB" /></p>
        <p class="rs-label">reconstruction PSNR<br>(FiveK)</p>
      </div>
    </div>
    <p class="rs-note">Phase-1 VAE-style edit encoder must preserve photographic content before any personalization is learned · W13 group report draft §2.3 · images replace placeholders after <code>tools/export_sphere_json.py</code> runs on the GPU machine</p>
  </div>
</template>

<style scoped>
.recon-strip{font-family:inherit;color:#1b1d20}
.rs-panels{display:flex;align-items:center;gap:26px}
figure{margin:0;text-align:center}
.rs-panels img,.rs-placeholder{width:330px;height:220px;object-fit:cover;border-radius:8px;border:1px solid #d8dbe1;display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:15px;color:#9aa0a8;background:repeating-linear-gradient(45deg,#f4f6f9 0 14px,#eceff3 14px 28px)}
.rs-placeholder small{font-size:12px}
figcaption{font-size:13px;color:#555;margin-top:8px}
.rs-arrow{font-size:34px;color:#b9bec6}
.rs-metric{margin-left:8px}
.rs-value{font-size:44px;font-weight:800;color:#2980bd;margin:0}
.rs-label{font-size:13px;color:#555;margin:4px 0 0}
.rs-note{font-size:12px;color:#8a9099;margin:16px 0 0;max-width:900px}
</style>
