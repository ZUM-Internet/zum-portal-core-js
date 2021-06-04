<template>
  <div>
    <slot :name="group || defaultGroup" />
  </div>
</template>

<script>
export default {
  name: 'ABTest',

  props: {
    group: { type: String, required: false, },
    defaultGroup: {type: String, default: () => 'A'}
  },

}
</script>
