<template>
  <div>
    <slot :name="selectedVariant" />
  </div>
</template>

<script>
export default {
  name: 'ABTest',

  props: {
    selectedVariant: { type: String, required: true, },
    variants: { type: Array, required: true, },
  }

}
</script>
