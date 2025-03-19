import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import colorPicker from './index'

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('colorPicker', () => {
  const colorOptions = ['#FF0000', '#00FF00', '#0000FF']

  it('renders correctly with default props', async () => {
    const wrapper = mount(colorPicker, {
      props: {
        colorOptions
      }
    })

    const trigger = wrapper.find<HTMLElement>('.color-picker__trigger')

    expect(trigger.exists()).toBe(true)

    await trigger.trigger('click')

    await timeout(200)

    expect(
      document.body.querySelectorAll('.color-picker__option')
    ).toHaveLength(3)
  })

  it('emits update:value when selecting color', async () => {
    const wrapper = mount(colorPicker, {
      props: {
        colorOptions
      }
    })

    const trigger = wrapper.find<HTMLElement>('.color-picker__trigger')

    expect(trigger.exists()).toBe(true)

    await trigger.trigger('click')

    await timeout(200)

    const options = document.body.querySelectorAll(
      '.color-picker__option'
    ) as NodeListOf<HTMLElement>

    options[1].click()

    expect(wrapper.emitted('update:value')).toEqual([[colorOptions[1]]])
  })

  it('opens color picker input when click custom button', async () => {
    const wrapper = mount(colorPicker, {
      props: {
        colorOptions
      }
    })

    const trigger = wrapper.find<HTMLElement>('.color-picker__trigger')

    expect(trigger.exists()).toBe(true)

    await trigger.trigger('click')

    await timeout(200)

    const popupFooter = document.body.querySelector('.color-picker__footer')

    const input = popupFooter!.querySelector('input[type="color"]')

    const clickHandler = vi.fn()

    Object.defineProperty(input, 'click', { value: clickHandler })

    const button =
      popupFooter!.querySelector<HTMLButtonElement>('.color-picker__btn')

    button!.click()

    expect(clickHandler).toHaveBeenCalled()
  })

  it('disables interactions when disabled prop is true', async () => {
    const wrapper = mount(colorPicker, {
      props: {
        colorOptions,
        disabled: true
      }
    })

    expect(wrapper.find('.is-disabled').exists()).toBe(true)

    await wrapper.find('.color-picker__trigger').trigger('click')

    await timeout(200)

    const popupBody = document.body.querySelector('.color-picker__body')

    expect(popupBody).toBeNull()
  })
})
