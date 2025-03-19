import { CaretDownOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { Button, Popover } from 'ant-design-vue'
import { defineComponent, ExtractPropTypes, PropType, ref } from 'vue'
import {
  ColorPickerBody,
  ColorPickerFooter,
  ColorPickerHeader,
  ColorPickerTrigger
} from './style'

export const colorPickerProps = () => ({
  value: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    title: '颜色选择'
  },
  colorOptions: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  disabled: Boolean
})

export type ColorPickerProps = ExtractPropTypes<
  ReturnType<typeof colorPickerProps>
>

export default defineComponent({
  name: 'colorPicker',
  props: colorPickerProps(),
  emits: {
    'update:value': (val: string) => true,
    change: (val: string) => true
  },
  setup(props: ColorPickerProps, { emit }) {
    const popoverVisible = ref<boolean>(false)
    const html5ColorRef = ref<HTMLInputElement>()

    function handleClose() {
      popoverVisible.value = false
    }

    function handleOpenChange(visible: boolean) {
      if (props.disabled) return

      popoverVisible.value = visible
    }

    function handleSelect(color: string) {
      if (props.disabled) return

      emit('update:value', color)

      emit('change', color)

      handleClose()
    }

    function handleInputChange(e: Event) {
      const value = (e.target as HTMLInputElement).value

      emit('update:value', value)
      emit('change', value)
    }

    function handleBtnClick() {
      if (!html5ColorRef.value) return

      html5ColorRef.value.click()
    }

    return () => (
      <Popover
        open={popoverVisible.value}
        trigger="click"
        arrow={false}
        placement="bottomLeft"
        onOpenChange={handleOpenChange}
      >
        {{
          default: () => (
            <ColorPickerTrigger
              class={`color-picker__trigger ${props.disabled ? 'is-disabled' : ''}`}
            >
              <div
                class="color-picker__value"
                style={{ 'background-color': props.value }}
              ></div>
              {!props.disabled ? <CaretDownOutlined /> : undefined}
            </ColorPickerTrigger>
          ),
          title: () => (
            <ColorPickerHeader class="color-picker__header">
              <span class="color-picker__title">{props.title}</span>
              <CloseOutlined
                class="color-picker__close"
                onClick={handleClose}
              />
            </ColorPickerHeader>
          ),
          content: () => [
            <ColorPickerBody class="color-picker__body">
              {props.colorOptions.map((color) => (
                <div class="color-picker__item" key={color}>
                  <div
                    class="color-picker__option"
                    style={{ backgroundColor: color }}
                    onClick={() => handleSelect(color)}
                  ></div>
                </div>
              ))}
            </ColorPickerBody>,
            <ColorPickerFooter class="color-picker__footer">
              <Button class="color-picker__btn" onClick={handleBtnClick}>
                自定义颜色
              </Button>
              <input
                class="color-picker__input"
                type="color"
                ref={html5ColorRef}
                value={props.value}
                onChange={handleInputChange}
              />
            </ColorPickerFooter>
          ]
        }}
      </Popover>
    )
  }
})
