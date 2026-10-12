<script setup>
defineProps({
  directions: { type: Array, default: () => ['Top-1', 'Top-2', 'Top-3', 'GT'] },
  magnitudes: { type: Array, default: () => [0.5, 0.75, 1.0, 1.25, 1.5] },
  // images: optional 2-D array [direction][magnitude] of image URLs; placeholder tiles render when absent
  images: { type: Array, default: () => [] },
})

const COLORS = ['#e53935', '#fb8c00', '#f4c542', '#111111']
</script>

<template>
  <div class="dm-grid">
    <table class="dm-table">
      <thead>
        <tr>
          <th>direction \ |z|</th>
          <th v-for="m in magnitudes" :key="m">×{{ m.toFixed(2) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, i) in directions" :key="d">
          <th class="dm-rowhead"><i class="dm-swatch" :style="{ background: COLORS[i % COLORS.length] }" />{{ d }}</th>
          <td v-for="(m, j) in magnitudes" :key="m">
            <img v-if="images?.[i]?.[j]" :src="images[i][j]" :alt="`${d} at magnitude ${m}`">
            <div v-else class="dm-tile"><span :style="{ color: COLORS[i % COLORS.length] }">▲</span><small>×{{ m.toFixed(2) }}</small></div>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="dm-note">z direction = retouching style, |z| = edit strength (W13 group report draft §2.3) · tiles become real renders once <code>tools/export_sphere_json.py --renders</code> runs on the GPU machine · same directions as the preference sphere Top-K</p>
  </div>
</template>

<style scoped>
.dm-grid{font-family:inherit;color:#1b1d20}
.dm-table{border-collapse:separate;border-spacing:6px}
.dm-table th,.dm-table td{padding:0}
thead th{font-size:13px;color:#555;font-weight:600;padding:0 0 4px}
.dm-rowhead{font-size:14px;font-weight:600;text-align:right;white-space:nowrap;padding-right:10px}
.dm-swatch{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:7px;vertical-align:-1px}
.dm-table img,.dm-tile{width:150px;height:100px;border-radius:6px;border:1px solid #d8dbe1;object-fit:cover}
.dm-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:repeating-linear-gradient(45deg,#f4f6f9 0 12px,#eceff3 12px 24px);color:#9aa0a8}
.dm-tile span{font-size:20px}
.dm-tile small{font-size:11px}
.dm-note{font-size:12px;color:#8a9099;margin:14px 0 0;max-width:980px}
</style>
