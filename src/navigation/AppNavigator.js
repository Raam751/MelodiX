/**
 * App Navigator
 * Manages auth flow and main tab/stack navigation
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import PlayerScreen from '../screens/PlayerScreen';
import ArtistScreen from '../screens/ArtistScreen';
import MiniPlayer from '../components/MiniPlayer';
import LoadingState from '../components/LoadingState';
import GradientBackground from '../components/GradientBackground';
import { Colors, Shadow, FontFamily, MINI_PLAYER_HEIGHT, TAB_BAR_HEIGHT } from '../theme';
import { SCREENS } from '../utils/constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Tab bar with mini player overlay
 */
const TabNavigator = ({ navigation }) => {
  const { currentTrack } = usePlayer();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === SCREENS.HOME) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === SCREENS.FAVORITES) {
              iconName = focused ? 'heart' : 'heart-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: Colors.accent,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: {
            fontFamily: FontFamily.medium,
            fontSize: 11,
            marginBottom: 4,
          },
          tabBarStyle: {
            height: TAB_BAR_HEIGHT + (currentTrack ? MINI_PLAYER_HEIGHT : 0),
            paddingTop: currentTrack ? MINI_PLAYER_HEIGHT : 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderTopWidth: 0,
            ...Shadow.sm,
          },
        })}
      >
        <Tab.Screen name={SCREENS.HOME} component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name={SCREENS.FAVORITES} component={FavoritesScreen} options={{ tabBarLabel: 'Favorites' }} />
      </Tab.Navigator>

      {/* Mini Player above tabs */}
      {currentTrack && (
        <View style={styles.miniPlayerContainer}>
          <MiniPlayer onPress={() => navigation.navigate(SCREENS.PLAYER)} />
        </View>
      )}
    </View>
  );
};

import AsyncStorage from '@react-native-async-storage/async-storage';

const NAVIGATION_STATE_KEY = '@melodix_navigation_state';

/**
 * Main App Navigator
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
        const state = savedStateString ? JSON.parse(savedStateString) : undefined;
        if (state !== undefined) {
          setInitialState(state);
        }
      } catch (e) {
        console.error('Failed to restore navigation state:', e);
      } finally {
        setIsReady(true);
      }
    };

    if (!isLoading) {
      restoreState();
    }
  }, [isLoading]);

  if (isLoading || !isReady) {
    return (
      <GradientBackground>
        <LoadingState message="Loading MelodiX..." />
      </GradientBackground>
    );
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        if (state) {
          AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
        }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen
            name={SCREENS.LOGIN}
            component={LoginScreen}
            options={{ animationEnabled: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name={SCREENS.MAIN_TABS}
              component={TabNavigator}
              options={{ animationEnabled: false }}
            />
            <Stack.Screen
              name={SCREENS.PLAYER}
              component={PlayerScreen}
              options={{
                ...TransitionPresets.ModalSlideFromBottomIOS,
                gestureEnabled: true,
                gestureDirection: 'vertical',
              }}
            />
            <Stack.Screen
              name={SCREENS.ARTIST}
              component={ArtistScreen}
              options={{
                ...TransitionPresets.SlideFromRightIOS,
                gestureEnabled: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    height: MINI_PLAYER_HEIGHT,
  },
});

export default AppNavigator;
