import { mount } from '@vue/test-utils'
import strictNumberInput from './index'
import { describe, expect, test, vi } from 'vitest'
import { nextTick, ref } from 'vue'

describe('strictNumberInput', () => {
  test('基础渲染', () => {
    const wrapper = mount(strictNumberInput, {
      props: {
        value: 100
      }
    })
    expect(wrapper.find('.ant-input-number-input').exists()).toBe(true)
  })

  test('blur/focus方法调用', async () => {
    const wrapper = mount(strictNumberInput)
    const vm = wrapper.vm as any

    const focusSpy = vi.spyOn(vm, 'focus')
    const blurSpy = vi.spyOn(vm, 'blur')

    vm.focus()
    vm.blur()

    expect(focusSpy).toHaveBeenCalled()
    expect(blurSpy).toHaveBeenCalled()
  })
})
