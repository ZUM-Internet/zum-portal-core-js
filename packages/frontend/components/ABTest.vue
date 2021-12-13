<template>
  <div v-if="!disabled">
    <slot :name="group || defaultGroup" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ABTest',
  props: {
    disabled: { type: Boolean, default: () => false },
    group: { type: String, required: false, default: null },
    defaultGroup: { type: String, default: () => 'A' },
  },
};
</script>
