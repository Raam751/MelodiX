/**
 * GradientBackground Component
 * Wraps screens with the signature sky-blue-to-white gradient
 */

import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '../theme';

const GradientBackground = ({ children, style, colors }) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={colors || Gradients.background}
        style={[styles.container, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {children}
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
