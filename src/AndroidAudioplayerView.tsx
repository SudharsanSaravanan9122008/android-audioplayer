import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { AndroidAudioplayerViewProps } from './AndroidAudioplayer.types';

const NativeView: React.ComponentType<AndroidAudioplayerViewProps> =
  requireNativeViewManager('AndroidAudioplayer');

export default function AndroidAudioplayerView(props: AndroidAudioplayerViewProps) {
  return <NativeView {...props} />;
}
