/**
 * Login Screen
 * Beautiful mock login with gradient background and animated elements
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import GradientBackground from '../components/GradientBackground';
import { Colors, Typography, Spacing, BorderRadius, Shadow, FontFamily } from '../theme';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [name, setName] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  // Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(40)).current;
  const noteAnims = useRef(
    Array.from({ length: 5 }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5),
    }))
  ).current;

  useEffect(() => {
    // Entrance animation sequence
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      // Title appears
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Form appears
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Floating music notes
    noteAnims.forEach((note, index) => {
      const startDelay = index * 400 + 1000;
      Animated.loop(
        Animated.sequence([
          Animated.delay(startDelay),
          Animated.parallel([
            Animated.timing(note.opacity, {
              toValue: 0.6,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(note.scale, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(note.translateY, {
              toValue: -100 - Math.random() * 100,
              duration: 2000 + Math.random() * 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(note.translateX, {
              toValue: (Math.random() - 0.5) * 150,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(note.opacity, {
              toValue: 0,
              duration: 2000,
              delay: 500,
              useNativeDriver: true,
            }),
          ]),
          // Reset
          Animated.parallel([
            Animated.timing(note.translateY, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(note.translateX, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(note.scale, {
              toValue: 0.5,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    await login(name.trim() || 'Music Lover');
    setIsLoggingIn(false);
  };

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  const notes = ['♪', '♫', '♬', '🎵', '🎶'];
  const notePositions = [
    { left: width * 0.15, top: height * 0.3 },
    { left: width * 0.75, top: height * 0.25 },
    { left: width * 0.6, top: height * 0.35 },
    { left: width * 0.25, top: height * 0.4 },
    { left: width * 0.8, top: height * 0.45 },
  ];

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Floating notes */}
        {noteAnims.map((note, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.floatingNote,
              {
                left: notePositions[index].left,
                top: notePositions[index].top,
                opacity: note.opacity,
                transform: [
                  { translateY: note.translateY },
                  { translateX: note.translateX },
                  { scale: note.scale },
                ],
              },
            ]}
          >
            {notes[index]}
          </Animated.Text>
        ))}

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: logoScale },
                { rotate: logoRotation },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.accent, Colors.accentLight]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="musical-notes" size={48} color={Colors.textWhite} />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}
        >
          <Text style={styles.title}>MelodiX</Text>
          <Text style={styles.subtitle}>Your Music, Your Vibe</Text>
        </Animated.View>

        {/* Login Form */}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: formOpacity,
              transform: [{ translateY: formTranslateY }],
            },
          ]}
        >
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoggingIn && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoggingIn}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.accent, Colors.accentDark]}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoggingIn ? (
                <Text style={styles.loginButtonText}>Entering the vibe...</Text>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Let's Go</Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.textWhite} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.hint}>
            No account needed — just a name to personalize your experience
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  floatingNote: {
    position: 'absolute',
    fontSize: 24,
  },
  logoContainer: {
    marginBottom: Spacing['2xl'],
  },
  logoGradient: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.accent,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: 44,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing['3xl'],
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundSolid,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadow.md,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: Spacing.base,
  },
  loginButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.accent,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing['2xl'],
  },
  loginButtonText: {
    ...Typography.button,
    color: Colors.textWhite,
    marginRight: Spacing.sm,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.base,
  },
});

export default LoginScreen;
