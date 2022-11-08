import { HStack } from 'native-base'
import CountryFlag from 'react-native-country-flag'

import { Input } from './Input'

import { GuessProps } from './Game'

interface Props {
  code: string
  position: 'left' | 'right'
  onChangeText: (value: string) => void
  currentGuess?: GuessProps | undefined
}

export function Team ({ code, position, onChangeText, currentGuess }: Props) {
  return (
    <HStack alignItems="center">
      {position === 'left' && <CountryFlag isoCode={code} size={25} style={{ marginRight: 12 }} />}

      {
        currentGuess
          ? <Input
            w={10}
            h={9}
            textAlign="center"
            fontSize="xl"
            color='yellow.500'
            keyboardType="numeric"
            onChangeText={onChangeText}
            isDisabled={true}
            maxLength={1}
            value={position === 'left' ? String(currentGuess.firstTeamGoalsQuantity) : String(currentGuess.secondTeamGoalsQuantity)}
          />
          : <Input
            w={10}
            h={9}
            textAlign="center"
            fontSize="xs"
            keyboardType="numeric"
            onChangeText={onChangeText}
            maxLength={1}
          />
      }

      {position === 'right' && <CountryFlag isoCode={code} size={25} style={{ marginLeft: 12 }} />}
    </HStack>
  )
}
