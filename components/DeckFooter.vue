<script setup>
defineProps({page:Number})
</script>
<template>
  <footer class="deck-footer"><span class="page-number">{{String(page).padStart(2,'0')}} / 15</span></footer>
</template>
