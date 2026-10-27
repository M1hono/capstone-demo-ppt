<script setup>
const base=import.meta.env.BASE_URL
</script>
<template>
<div class="stack encoder">
  <div class="encoder-layout grow">
    <div class="encoder-inputs"><figure v-for="(file,i) in ['original.png','expert-C.png','pair-difference.png']" :key="file"><img :src="base+'assets/fivek/'+file" :alt="['Original image','Expert-retouched image','Pixel-wise difference'][i]"><figcaption>{{['Original O','Target T','Difference T − O'][i]}}</figcaption></figure><p>9 input channels</p></div>
    <span class="model-arrow">→</span>
    <div class="encoder-stage"><h2>Encoder</h2><div class="conv-blocks"><i v-for="i in 4" :key="i" :style="{height:(115-i*20)+'px'}"/></div><p>Convolution<br>+ downsampling</p><p class="fc-projection">Flatten → FC</p><div class="latent-output"><b>z</b><span>3D edit vector</span></div></div>
    <span class="model-arrow">→</span>
    <div class="decoder-stage"><h2>Decoder</h2><p>z → FC → w₁, …, w₈</p><div class="lut-grid"><figure v-for="i in 8" :key="i"><img :src="base+'assets/reference-deck/lut-basis.png'" alt="Learnable LUT basis symbol"><figcaption>LUT {{i}}</figcaption></figure></div><p class="weighted-sum">Σ wᵢ · LUTᵢ</p><span class="learned-bases">8 learnable basis LUTs</span></div>
    <span class="model-arrow">→</span>
    <div class="render-stage"><h2>Reconstruct</h2><div class="render-formula"><span>Apply final LUT to O</span><img :src="base+'assets/fivek/original.png'" alt="Original image for LUT application"><b>↓</b><strong>T̂</strong></div></div>
  </div>
  <div class="reconstruction-loop" data-training-loop><div><b>Reconstruction loss</b><span>L<sub>rec</sub>(T̂, T) · prediction vs expert target</span></div><span class="model-arrow">→</span><div><b>Backpropagation ↶</b><span>Jointly update encoder, decoder and basis LUTs.</span></div></div>
</div>
</template>
<style scoped>
.encoder{gap:20px}.encoder-layout{display:grid;grid-template-columns:180px 28px 225px 28px 285px 28px 1fr;gap:14px;align-items:center}.encoder-inputs{display:grid;gap:10px}.encoder-inputs figure{margin:0;display:flex;align-items:center;gap:10px}.encoder-inputs img{width:92px;height:67px;object-fit:cover}.encoder-inputs figcaption{font-size:16px;line-height:1.3}.encoder-inputs>p{font-size:17px;text-align:center;border-top:1px solid var(--line);padding-top:12px}.model-arrow{font-size:28px;color:var(--muted);text-align:center}.encoder-stage,.decoder-stage,.render-stage{display:flex;flex-direction:column;gap:18px;align-items:center;transition:opacity 400ms;min-width:0}.encoder-layout h2{font-size:26px;margin:0;white-space:nowrap}.encoder-stage{background:var(--surface);padding:24px 15px}.encoder-stage p{font-size:19px;text-align:center;color:var(--muted)}.conv-blocks{display:flex;gap:12px;align-items:center;height:100px}.conv-blocks i{display:block;width:25px;background:var(--purple);border:1px solid var(--muted);transform:skewY(-12deg)}.latent-output{display:flex;align-items:center;gap:16px}.latent-output b{font:500 35px Saira;padding:6px 17px;background:var(--signal)}.latent-output span{font-size:18px}.decoder-stage{border:1px solid var(--line);padding:23px 18px}.decoder-stage p{font-size:19px}.lut-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px 10px}.lut-grid figure{margin:0;text-align:center}.lut-grid img{width:47px;height:48px;object-fit:contain}.lut-grid figcaption{font-size:12px;margin-top:5px}.decoder-stage .weighted-sum{font:22px Menlo;border-top:1px solid var(--line);padding-top:15px}.render-formula{display:flex;flex-direction:column;align-items:center;gap:10px;font-size:19px}.render-formula img{width:119px;height:83px;object-fit:cover}.render-formula b{font-size:22px;font-weight:400;color:var(--muted)}.render-formula strong{font:500 45px Saira}.dim{opacity:.12}.encoder .readout{font-size:21px;min-height:30px}
</style>
<style scoped>
.encoder-stage{gap:12px;padding:20px 15px}.encoder-stage .fc-projection{border:1px solid var(--line);padding:8px 13px;color:var(--ink);background:var(--paper);font-size:18px}.learned-bases{font-size:16px;color:var(--muted)}.reconstruction-loop{display:grid;grid-template-columns:1fr 35px 1.2fr;gap:18px;align-items:center;border-top:2px solid var(--ink);padding-top:18px}.reconstruction-loop>div{display:grid;gap:8px}.reconstruction-loop b{font-size:22px;font-weight:500}.reconstruction-loop span:not(.model-arrow){font-size:18px;color:var(--muted)}
</style>
