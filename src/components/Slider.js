/**
 * Custom Slider Component
 * Touch-friendly progress slider for the player
 */

import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { Colors, BorderRadius } from '../theme';

const TRACK_HEIGHT = 4;
const THUMB_SIZE = 16;

const Slider = ({ value = 0, onValueChange, trackColor, fillColor, thumbColor }) => {
  const containerRef = useRef(null);
  const containerWidth = useRef(0);

  const calculateValue = useCallback((pageX) => {
    containerRef.current?.measure((_x, _y, width, _height, px) => {
      containerWidth.current = width;
      const newValue = Math.max(0, Math.min(1, (pageX - px) / width));
      onValueChange && onValueChange(newValue);
    });
  }, [onValueChange]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        calculateValue(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        calculateValue(evt.nativeEvent.pageX);
      },
    })
  ).current;

  const fillWidth = `${Math.max(0, Math.min(100, value * 100))}%`;

  return (
    <View
      ref={containerRef}
      style={styles.container}
      {...panResponder.panHandlers}
    >
      {/* Track */}
      <View style={[styles.track, { backgroundColor: trackColor || Colors.progressTrack }]}>
        {/* Fill */}
        <View
          style={[
            styles.fill,
            {
              width: fillWidth,
              backgroundColor: fillColor || Colors.progressFill,
            },
          ]}
        />
      </View>

      {/* Thumb */}
      <View
        style={[
          styles.thumb,
          {
            left: fillWidth,
            backgroundColor: thumbColor || Colors.accent,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: THUMB_SIZE + 16,
    justifyContent: 'center',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    marginLeft: -THUMB_SIZE / 2 + THUMB_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default Slider;
