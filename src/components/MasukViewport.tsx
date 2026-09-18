import { useEffect, type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { durasi } from '@/theme/spasi';

/**
 * Pembungkus kartu timeline: fade + slide saat kartu masuk viewport.
 * Induk yang mengatur `aktif` (dari onScroll), urutan untuk stagger kecil.
 */
export function MasukViewport({
  aktif,
  urutan = 0,
  style,
  children,
}: {
  aktif: boolean;
  urutan?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const maju = useSharedValue(0);

  useEffect(() => {
    if (aktif) {
      maju.value = withDelay(
        urutan * 90,
        withTiming(1, { duration: durasi.lambat, easing: Easing.out(Easing.cubic) }),
      );
    }
  }, [aktif, maju, urutan]);

  const gaya = useAnimatedStyle(() => ({
    opacity: maju.value,
    transform: [{ translateY: (1 - maju.value) * 24 }],
  }));

  return <Animated.View style={[style, gaya]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({});
