import { useEffect, type ReactNode } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { easingHalus } from '@/theme/spasi';

/**
 * Pembungkus kecil: fade + slide saat komponen dipasang.
 * Dipakai untuk pergantian langkah dalam satu layar (kuis, kejutan)
 * dengan kunci `key` yang berubah.
 */
export function Muncul({
  children,
  jedaMs = 0,
}: {
  children: ReactNode;
  jedaMs?: number;
}) {
  const maju = useSharedValue(0);

  useEffect(() => {
    maju.value = withDelay(
      jedaMs,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) }),
    );
  }, [maju, jedaMs]);

  const gaya = useAnimatedStyle(() => ({
    opacity: maju.value,
    transform: [{ translateY: (1 - maju.value) * 18 }],
  }));

  return <Animated.View style={gaya}>{children}</Animated.View>;
}

export { easingHalus };
