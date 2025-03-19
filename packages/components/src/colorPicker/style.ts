import { styled } from '@styils/vue'

export const ColorPickerTrigger = styled('div', {
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  height: '32px',
  'box-sizing': 'border-box',
  border: '1px solid #d9d9d9',
  'border-radius': '4px',
  padding: '0 8px',
  cursor: 'pointer',

  '&.is-disabled': {
    border: 0
  },

  '& .color-picker__value': {
    width: '16px',
    height: '16px',
    'border-radius': '2px'
  }
})

export const ColorPickerHeader = styled('div', {
  display: 'flex',
  'justify-content': 'space-between',

  '& .color-picker__close': {
    cursor: 'pointer',

    '&:hover': {
      color: '#297bfa'
    }
  }
})

export const ColorPickerSelector = styled('div', {
  marginLeft: '4px'
})

export const ColorPickerBody = styled('div', {
  display: 'flex',
  'flex-wrap': 'wrap',

  '& .color-picker__item': {
    width: '16.66%',
    'padding-top': '16.66%',
    position: 'relative'
  },

  '& .color-picker__option': {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '88%',
    height: '88%',
    'border-radius': '4px',
    cursor: 'pointer'
  }
})

export const ColorPickerFooter = styled('div', {
  display: 'flex',
  'flex-direction': 'column',
  'padding-top': '12px',

  '& .color-picker__btn': {
    width: '100%'
  },

  '& .color-picker__input': {
    width: 0,
    height: 0,
    opacity: 0,
    padding: 0,
    margin: 0,
    border: 0
  }
})
