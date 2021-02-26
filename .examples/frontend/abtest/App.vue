<template>
  <div>
    <ABTest :selectedVariant="selectedVariant" :variants="variants">
      <div :slot="variants[0]">A 렌더링</div>
      <div :slot="variants[1]">B 렌더링</div>
      <div :slot="variants[2]">C 렌더링</div>
    </ABTest>
  </div>
</template>

<script>
import ABTest from "../../../frontend/components/ABTest";

export default {
  components: {ABTest},

  data: () => ({
    selectedVariant: 'C',
    variants: ['A', 'B', 'C'],
  })
}
</script>