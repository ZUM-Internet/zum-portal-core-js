<template>
  <div v-if="!disabled">
    <slot :name="group || defaultGroup" />
</div>
</template>

<script>
export default {
  name: 'ABTest',
  props: {
    disabled: {type: Boolean, default: () => false},
    group: { type: String, required: false, },
    defaultGroup: {type: String, default: () => 'A'}
  },
}
</script>
