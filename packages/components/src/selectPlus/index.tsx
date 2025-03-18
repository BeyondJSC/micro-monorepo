import { SelectProps, selectProps } from 'ant-design-vue/es/select'
import {
  defineComponent,
  ExtractPropTypes,
  ref,
  toRefs,
  VNode,
  watch
} from 'vue'
import { isDef, isUndef } from '../utils/tools'
import { Select } from 'ant-design-vue'
import { styled } from '@styils/vue'

export const selectPlusProps = () => ({
  current: Number,
  pageSize: Number,
  total: Number,
  distance: Number,
  firstLoad: Boolean
})

export type SelectPlusProps = ExtractPropTypes<
  ReturnType<typeof selectPlusProps>
> &
  SelectProps

const SelectPlusHelper = styled('div', {
  height: '32px',
  'line-height': '32px',
  'text-align': 'center'
})

export default defineComponent({
  name: 'selectPlus',
  props: {
    ...selectProps(),
    ...selectPlusProps()
  },
  emits: {
    'update:current': (current: number) => true,
    load: () => true,
    'popup-scroll': (e: Event) => true,
    search: (val: string) => true
  },
  setup(props: SelectPlusProps, { emit, slots, expose }) {
    const { distance, current, pageSize, total, firstLoad } = toRefs(props)

    const isLoading = ref(false)

    watch(
      () => props.options?.length,
      () => {
        isLoading.value = false
      }
    )

    if (firstLoad?.value !== false) {
      emit('load')
    }

    function handlePopupScroll(e: Event) {
      if (e.target) {
        if (!current?.value || !pageSize?.value || isUndef(total?.value)) return

        const { scrollHeight, scrollTop, clientHeight } =
          e.target as HTMLElement

        if (
          scrollHeight - scrollTop - clientHeight <=
          (distance?.value || 10)
        ) {
          if (current.value * pageSize.value < total.value) {
            if (isLoading.value) return

            isLoading.value = true

            emit('update:current', current.value + 1)
            emit('load')
          }
        }
      }
      emit('popup-scroll', e)
    }

    function handleSearch(val: string) {
      emit('update:current', 1)

      emit('search', val)
    }

    function renderLoadingHelper() {
      if (isLoading.value) {
        return <SelectPlusHelper>加载中...</SelectPlusHelper>
      }
    }

    function dropdownRender({
      menuNode,
      props
    }: {
      menuNode: VNode
      props: unknown
    }) {
      if (isDef(slots.dropdownRender)) {
        return slots.dropdownRender(menuNode, props, isLoading.value)
      }

      return (
        <div class="select-plus__options-wrap">
          {menuNode}
          {renderLoadingHelper()}
        </div>
      )
    }

    if (process.env.VITEST) {
      expose({
        handlePopupScroll,
        handleSearch
      })
    }

    return () => (
      <Select
        {...props}
        showSearch
        onPopupScroll={handlePopupScroll}
        onSearch={handleSearch}
      >
        {{
          ...slots,
          dropdownRender
        }}
      </Select>
    )
  }
})
