export const ABTest = {
  name: 'ABTest',

  template: `
    <div v-if="!disabled">
      <slot :name="group || defaultGroup" />
    </div>
  `,

  props: {
    disabled: {type: Boolean, default: () => false},
    group: { type: String, required: false, },
    defaultGroup: {type: String, default: () => 'A'}
  },
}
