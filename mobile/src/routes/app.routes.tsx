import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'native-base'
import { Platform } from 'react-native'

import { New } from '../screens/New'
import { Pools } from '../screens/Pools'

import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import { Find } from '../screens/Find'

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes () {
  const { colors } = useTheme()

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.yellow[500],
      tabBarInactiveTintColor: colors.gray[300],
      tabBarStyle: {
        position: 'absolute',
        height: 87,
        borderTopWidth: 0,
        backgroundColor: colors.gray[800]
      },
      tabBarItemStyle: {
        position: 'relative',
        top: Platform.OS === 'android' ? -10 : 0
      },
      tabBarLabelPosition: 'beside-icon'
    }}>
      <Screen name='new' component={New} options={{
        tabBarIcon: ({ color }) => <PlusCircle color={color} />,
        tabBarLabel: 'Create pool'
      }} />
      <Screen name='pools' component={Pools} options={{
        tabBarIcon: ({ color }) => <SoccerBall color={color} />,
        tabBarLabel: 'My pools'
      }}/>

      <Screen name='find' component={Find} options={{ tabBarButton: () => null }}/>
    </Navigator>
  )
}
