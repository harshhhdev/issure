import { styled, CSS, keyframes } from '@stitches/react'

const wave = keyframes({
  from: {
    transform: 'translateY(-100%)',
  },
  to: {
    transform: 'translateY(100%)',
  },
})

const Ball: CSS = {
  width: '1.1em',
  height: '1.1em',
  borderRadius: '50%',
  backgroundColor: '#275efe',
  transform: 'translateY(-100%)',
  animation: `${wave} 0.8s ease-in-out alternate infinite`,
}

export const Balls = styled('div', {
  width: '4.2em',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1.5em',
})

export const FirstBall = styled('div', {
  ...Ball,
  animationDelay: '-0.4s',
})

export const SecondBall = styled('div', {
  ...Ball,
  animationDelay: '-0.2s',
})

export const ThirdBall = styled('div', Ball)
