import InputNumber, {
  InputNumberProps,
  inputNumberProps
} from 'ant-design-vue/es/input-number'
import { defineComponent, nextTick, shallowRef } from 'vue'

export type StrictNumberInput = InputNumberProps

export default defineComponent({
  name: 'strictNumberInput',
  props: inputNumberProps(),
  emits: {
    input: (value: string) => true
  },
  expose: ['focus', 'blur'],
  setup(props: StrictNumberInput, { emit, expose }) {
    const inputNumberRef = shallowRef<any>()

    const focus = () => {
      inputNumberRef.value?.focus()
    }
    const blur = () => {
      inputNumberRef.value?.blur()
    }

    expose({
      focus,
      blur
    })

    function handleInput(value: string) {
      // 支持小数/负数的场景
      if (!props.precision || !/^-?\d+\.$/.test(value)) {
        // 手动触发blur，强行在输入过程中保证输入值合法
        blur()

        nextTick(() => {
          focus()
        })
      }

      emit('input', value)
    }

    return () => (
      <InputNumber ref={inputNumberRef} {...props} onInput={handleInput} />
    )
  }
})
