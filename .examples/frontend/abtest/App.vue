<template>
  <div id="app">
    <ABTest :selectedVariant="selectedVariant" :variants="variants">
      <div :slot="variants[0]">A 렌더링</div>
      <div :slot="variants[1]">B 렌더링</div>
      <div :slot="variants[2]">C 렌더링</div>
      <div :slot="variants[3]">D 렌더링</div>
    </ABTest>
  </div>
</template>

<script>
import ABTest from "../../../frontend/components/ABTest";
import abtestService from "../services/abtestService";

export default {
  name: 'App',

  components: {ABTest},

  data: () => ({
    selectedVariant: 'A',
    variants: ['A', 'B', 'C', 'D'],
  }),

  mounted () {
    const selectedVariant = abtestService.get('example');
    if (selectedVariant === null) {
      Axios.get('/api/abtest').then(() => {
        this.selectedVariant = abtestService.get('example') || 'A';
      });
    } else {
      this.selectedVariant = selectedVariant;
    }
  }
}
</script>