<script setup>
const users = ['A', 'B', 'C']
const base = import.meta.env.BASE_URL + 'assets/preference-reference/'
</script>
<template>
  <div class="preference-example">
    <p class="preference-lead">One image. Three users. Three preferences.</p>
    <div class="preference-branches">
      <figure class="query-photo">
        <img :src="base + 'original.jpg'" alt="Original photograph of white and yellow flowers">
        <figcaption>Original image</figcaption>
      </figure>
      <svg class="preference-arrows" viewBox="0 0 390 288" aria-hidden="true">
        <defs><marker id="preference-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="var(--ink)"/></marker></defs>
        <path d="M12 119 C125 119 148 42 374 42" />
        <path d="M12 144 H374" />
        <path d="M12 169 C125 169 148 246 374 246" />
      </svg>
      <div class="user-outputs">
        <div v-for="user in users" :key="user" class="user-output" :data-user-output="user">
          <span class="user-label">User {{user}}</span>
          <img :src="base + `user-${user}.jpg`" :alt="`Illustrative preferred flower edit for User ${user}`">
        </div>
      </div>
    </div>
    <div class="user-histories">
      <article v-for="user in users" :key="user" :data-user-history="user">
        <h3>User {{user}} <span>Historical examples</span></h3>
        <div class="history-images">
          <figure v-for="scene in ['house', 'books']" :key="scene">
            <div><img :src="base + `${scene}-original.jpg`" :alt="`Original ${scene} photograph`"><img :src="base + `${scene}-${user}.jpg`" :alt="`${scene} edited by User ${user} in the supplied illustration`"></div>
            <figcaption><span>Original</span><span>User {{user}} edit</span></figcaption>
          </figure>
        </div>
      </article>
    </div>
    <p class="source-caption">Learn from historical edits. Adapt to unseen users without additional training. Preference illustration.</p>
  </div>
</template>
<style scoped>
.preference-example{display:flex;flex-direction:column;gap:13px}
.preference-lead{font-size:23px;font-weight:500;line-height:1.25!important}
.preference-branches{display:grid;grid-template-columns:360px 1fr 330px;gap:12px;height:288px;align-items:center}
.query-photo{margin:0}.query-photo img{width:360px;height:190px;object-fit:cover;display:block}.query-photo figcaption{padding-top:8px;font-size:16px;font-weight:500}
.preference-arrows{width:100%;height:288px;overflow:visible}.preference-arrows>path{fill:none;stroke:var(--ink);stroke-width:1.5;marker-end:url(#preference-arrow)}
.user-outputs{height:288px;display:flex;flex-direction:column;justify-content:space-between}
.user-output{display:grid;grid-template-columns:100px 1fr;gap:15px;align-items:center}.user-output img{width:215px;height:84px;object-fit:cover;display:block}.user-output .user-label{font-size:17px;font-weight:600;min-height:44px}
.user-histories{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.user-histories article{border-top:2px solid var(--line);padding-top:9px}.user-histories article.selected{border-color:var(--ink)}
.user-histories h3{font-size:17px;margin:0 0 9px}.user-histories h3 span{font-size:14px;color:var(--muted);font-weight:400;margin-left:8px}
.history-images{display:grid;grid-template-columns:1fr 1fr;gap:14px}.history-images figure{margin:0}.history-images figure>div{display:grid;grid-template-columns:1fr 1fr;gap:6px}.history-images img{width:100%;height:76px;object-fit:cover;display:block}.history-images figcaption{display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;margin-top:4px}
.preference-example>.source-caption{margin-top:auto}
</style>
