import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePickerInput from './index'
import { DatePicker, Select } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'

describe('DatePickerInput', () => {
  it('should render component correctly', () => {
    const wrapper = mount(DatePickerInput)
    expect(wrapper.exists()).toBe(true)
  })

  it('should accept value prop', () => {
    const value = ['2024-01-01']
    const wrapper = mount(DatePickerInput, { props: { value } })
    expect(wrapper.props('value')).toEqual(value)
  })

  it('should emit update:value event on change', async () => {
    const wrapper = mount(DatePickerInput)
    const date = dayjs('2024-01-01')
    // 触发组件内相关事件来测试 handleChange 函数
    const datePicker = wrapper.findComponent(DatePicker)
    await datePicker.vm.$emit('change', date)
    const emitted = wrapper.emitted('update:value')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([[date.format('YYYY-MM-DD')]])
  })

  it('should handle disabled dates correctly', () => {
    const disabledDate = (current: Dayjs) => current.isBefore(dayjs())
    const wrapper = mount(DatePickerInput, { props: { disabledDate } })
    const datePicker = wrapper.findComponent(DatePicker)
    // 检查特定日期是否被禁用
    const pastDate = dayjs().subtract(1, 'day')
    const futureDate = dayjs().add(1, 'day')

    expect(datePicker.exists()).toBe(true)
    expect(datePicker.vm.disabledDate(pastDate)).toBe(true)
    expect(datePicker.vm.disabledDate(futureDate)).toBe(false)
  })

  it('should handle placeholder prop', () => {
    const placeholder = 'Custom Placeholder'
    const wrapper = mount(DatePickerInput, { props: { placeholder } })
    const select = wrapper.findComponent(Select)
    expect(select.vm.placeholder).toBe(placeholder)
  })

  it('should handle empty value prop', () => {
    const wrapper = mount(DatePickerInput, { props: { value: [] } })
    expect(wrapper.props('value')).toEqual([])
  })
})
