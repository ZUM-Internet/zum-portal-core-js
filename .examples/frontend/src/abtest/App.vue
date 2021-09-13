<template>
  <div id="app">
    <ABTest>
      <div :slot="'A'">A 렌더링</div>
      <div :slot="'B'">B 렌더링</div>
    </ABTest>
  </div>
</template>

<script>
import { ABTest } from "zum-portal-core-js-frontend";
import abtestService from "../services/abtestService";

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
