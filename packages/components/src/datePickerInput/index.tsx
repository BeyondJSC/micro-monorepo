import { styled } from '@styils/vue'
import {
  DatePicker,
  DatePickerProps,
  FormItemRest,
  Select
} from 'ant-design-vue'
import { Dayjs } from 'dayjs'
import { computed, defineComponent, ExtractPropTypes, PropType, ref } from 'vue'

export const datePickerInputProps = () => ({
  value: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  dateFormat: {
    type: String,
    default: 'YYYY-MM-DD'
  },
  placeholder: {
    type: String,
    default: '请选择日期'
  },
  disabledDate: Function as PropType<DatePickerProps['disabledDate']>
})

export type DatePickerInputProps = ExtractPropTypes<
  ReturnType<typeof datePickerInputProps>
>

const DatePickerInput = styled('div', {
  position: 'relative',
  ['& .picker-input__panel']: {
    position: 'absolute',
    top: '100%',
    left: 0,
    opacity: 0,
    height: 0,
    padding: 0,
    margin: 0,
    overflow: 'hidden'
  }
})

const PickerCellWrap = styled('div', {
  width: '24px',
  height: '24px',
  lineHeight: '24px',
  'margin-left': '6px',
  'border-radius': '4px',
  transition: 'background 0.2s',
  ['&.picker-cell__selected']: {
    color: '#fff',
    'background-color': '#297bfa' // TODO: 主题色
  }
})

export default defineComponent({
  name: 'datePickerInput',
  props: datePickerInputProps(),
  emits: ['update:value'],
  setup(props: DatePickerInputProps, { emit }) {
    const pickerOpen = ref(false)
    const dateOptions = computed(() => {
      return props.value.map((value) => {
        return {
          label: value,
          value
        }
      })
    })

    function handleFocus() {
      pickerOpen.value = true
    }

    function handleBlur() {
      pickerOpen.value = false
    }

    function handleChange(date: string | Dayjs) {
      // 修改format使用处
      const dateStr = (date as Dayjs).format(props.dateFormat)

      if (!props.value.includes(dateStr)) {
        const updatedValue = [...props.value, dateStr]
        console.log('ydad', updatedValue)
        emit('update:value', updatedValue)
      }
    }

    function genPickerCellClass(current: Dayjs) {
      const currentStr: string = current.format(props.dateFormat)

      return {
        'date-picker__cell': true,
        'picker-cell__selected': props.value.includes(currentStr)
      }
    }

    const dateRender = (current: Dayjs) => {
      return (
        <PickerCellWrap class={genPickerCellClass}>
          {current.date()}
        </PickerCellWrap>
      )
    }

    return () => {
      return (
        <DatePickerInput>
          <Select
            value={props.value}
            options={dateOptions.value}
            mode="multiple"
            open={false}
            showArrow
            placeholder={props.placeholder}
            onChange={(val) => emit('update:value', val)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <FormItemRest>
            // 在DatePicker组件添加ARIA属性
            <DatePicker
              class="picker-input__panel"
              open={pickerOpen.value}
              role="dialog"
              aria-label="日期选择面板"
              aria-hidden={!pickerOpen.value}
              showToday={false}
              showNow={false}
              disabledDate={props.disabledDate}
              onChange={handleChange}
            >
              {{
                dateRender
              }}
            </DatePicker>
          </FormItemRest>
        </DatePickerInput>
      )
    }
  }
})
