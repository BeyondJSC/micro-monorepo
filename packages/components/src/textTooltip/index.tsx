import { styled } from '@styils/vue'
import { Tooltip } from 'ant-design-vue'
import {
  defineComponent,
  ExtractPropTypes,
  nextTick,
  ref,
  watch
} from 'vue'

export const textTooltipProps = () => ({
  text: {
    type: String,
    default: ''
  }
})

export type TextTooltipProps = ExtractPropTypes<
  ReturnType<typeof textTooltipProps>
>

const TextTooltipWrap = styled('div', {
  display: 'inline-block'
})

const TextTooltip = styled('span', {
  width: '100%',
  'text-overflow': 'ellipsis',
  overflow: 'hidden',
  'white-space': 'nowrap',
  'line-height': 1,
  'vertical-align': 'middle'
})

export default defineComponent({
  name: 'textTooltip',
  props: textTooltipProps(),
  setup(props: TextTooltipProps) {
    const isTooltip = ref(false)
    const textEllipsisRef = ref<HTMLElement | null>(null)

    watch(
      () => props.text,
      () => {
        nextTick(() => {
          updateIsTooltip()
        })
      },
      {
        immediate: true
      }
    )

    function updateIsTooltip() {
      if (!textEllipsisRef.value) return
      const { scrollWidth, clientWidth } = textEllipsisRef.value

      if (clientWidth < scrollWidth) {
        isTooltip.value = true
      } else {
        isTooltip.value = false
      }
    }

    return () => (
      <TextTooltipWrap>
        {isTooltip.value ? (
          <Tooltip title={props.text}>
            <TextTooltip ref={textEllipsisRef}>{props.text}</TextTooltip>
          </Tooltip>
        ) : (
          <TextTooltip ref={textEllipsisRef}>{props.text}</TextTooltip>
        )}
      </TextTooltipWrap>
    )
  }
})
