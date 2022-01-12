<template>
  <div id="app">
    <ABTest>
      <div :slot="'A'">A 렌더링</div>
      <div :slot="'B'">B 렌더링</div>
    </ABTest>
  </div>
</template>

<script>
import { ABTest } from "@zum-front-core/frontend/components";

export default {
  name: 'App',

  components: {ABTest},

  data: () => ({
    // selectedVariant: 'A',
    // variants: ['A', 'B', 'C', 'D'],
  }),

  mounted () {
  }
}
</script>
