import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import TextTooltip from './index'

describe('TextTooltip', () => {
  it('should render text correctly', () => {
    const wrapper = mount(TextTooltip, {
      props: {
        text: 'Test Text'
      }
    })
    expect(wrapper.text()).toContain('Test Text')
  })
})
