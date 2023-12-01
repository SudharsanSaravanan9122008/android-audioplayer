import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to AndroidAudioplayer.web.ts
// and on native platforms to AndroidAudioplayer.ts
import AndroidAudioplayerModule from './AndroidAudioplayerModule';
import AndroidAudioplayerView from './AndroidAudioplayerView';
import { ChangeEventPayload, AndroidAudioplayerViewProps } from './AndroidAudioplayer.types';

// Get the native constant value.
export const PI = AndroidAudioplayerModule.PI;

export function hello(): string {
  return AndroidAudioplayerModule.hello();
}

export async function setValueAsync(value: string) {
  return await AndroidAudioplayerModule.setValueAsync(value);
}

const emitter = new EventEmitter(AndroidAudioplayerModule ?? NativeModulesProxy.AndroidAudioplayer);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { AndroidAudioplayerView, AndroidAudioplayerViewProps, ChangeEventPayload };
