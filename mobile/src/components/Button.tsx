import { Button as NativeBaseButton, Text, IButtonProps } from 'native-base'

interface ButtonProps extends IButtonProps {
  title: string
  type?: 'RED' | 'YELLOW'
}

export function Button ({ title, type = 'YELLOW', ...rest }: ButtonProps) {
  return (
    <NativeBaseButton
      w='full'
      h={14}
      rounded='sm'
      fontSize='md'
      textTransform='uppercase'
      bg={type === 'RED' ? 'red.500' : 'yellow.500'}
      _pressed={{ bg: type === 'RED' ? 'red.600' : 'yellow.600' }}
      {...rest}
    >
      <Text
        fontSize='sm'
        fontFamily='heading'
        color={type === 'RED' ? 'white' : 'black'}
      >{title}</Text>
    </NativeBaseButton>
  )
}
