/**
 * WaveformVisualizer Component
 * Animated waveform bars for the player screen
 */

import React, { useEffect, useRef, memo } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../theme';

const BAR_COUNT = 40;
const BAR_WIDTH = 3;
const BAR_GAP = 2;
const MAX_HEIGHT = 40;

const WaveformVisualizer = memo(({ isPlaying, progress = 0, color = Colors.waveformActive }) => {
  // Generate random heights for bars
  const barHeights = useRef(
    Array.from({ length: BAR_COUNT }, () => Math.random() * 0.7 + 0.3)
  ).current;

  const animations = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (isPlaying) {
      const animationGroup = animations.map((anim, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 300 + Math.random() * 400,
              delay: index * 20,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 300 + Math.random() * 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
      });

      Animated.parallel(animationGroup).start();
    } else {
      animations.forEach((anim) => {
        anim.stopAnimation();
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }

    return () => {
      animations.forEach((anim) => anim.stopAnimation());
    };
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {barHeights.map((height, index) => {
        const barProgress = index / BAR_COUNT;
        const isPast = barProgress <= progress;

        const scaleY = isPlaying
          ? animations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [height * 0.4, height],
            })
          : height * 0.5;

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor: isPast ? color : Colors.waveformInactive,
                height: MAX_HEIGHT * height,
                transform: [{ scaleY: isPlaying ? scaleY : 1 }],
              },
            ]}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: MAX_HEIGHT + 10,
    paddingHorizontal: 8,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    marginHorizontal: BAR_GAP / 2,
  },
});

export default WaveformVisualizer;
