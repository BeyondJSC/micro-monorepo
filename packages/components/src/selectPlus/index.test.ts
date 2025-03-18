import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import SelectPlus from './index'

// 假设的props数据
const defaultProps = {
  current: 1,
  pageSize: 10,
  total: 100,
  distance: 10,
  firstLoad: true
}

let wrapper: VueWrapper

beforeEach(() => {
  wrapper = mount(SelectPlus, {
    props: defaultProps
  })
})

describe('SelectPlus Component', () => {
  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should emit load event on first load', () => {
    expect(wrapper.emitted().load).toBeTruthy()
  })

  it('should handle popup scroll correctly', () => {
    const mockEvent = {
      target: {
        scrollHeight: 200,
        scrollTop: 180,
        clientHeight: 20
      }
    }
    ;(wrapper.vm as any).handlePopupScroll(mockEvent)
    expect(wrapper.emitted()['update:current']).toBeTruthy()
    expect(wrapper.emitted().load).toBeTruthy()
  })

  it('should handle search correctly', () => {
    const searchValue = 'test'
    ;(wrapper.vm as any).handleSearch(searchValue)
    expect(wrapper.emitted()['update:current']).toBeTruthy()
    expect(wrapper.emitted().search).toBeTruthy()
  })
})
