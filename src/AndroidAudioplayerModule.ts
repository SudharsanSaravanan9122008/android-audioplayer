import { requireNativeModule, EventEmitter, Subscription } from 'expo-modules-core';
// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
var AndroidAudioplayerModule = requireNativeModule('AndroidAudioplayer');

const emitter = new EventEmitter(AndroidAudioplayerModule);

export type OnPreparedListener = {
  playerId: number;
};


export function createMediaPlayer(): number {
  return AndroidAudioplayerModule.createMediaPlayer();
}

export function getAudioSessionId(playerId: number): number {
  return AndroidAudioplayerModule.getAudioSessionId(playerId);
}

export async function setAudioTrackUrl(playerId: number, url: string): Promise<void> {
  await AndroidAudioplayerModule.setAudioTrackUrl(playerId, url);
}

export function getPlaybackMaxDuration(playerId: number): number {
  return AndroidAudioplayerModule.getPlaybackMaxDuration(playerId);
}

export function seekTo(playerId: number, seekTo_msec: number): void {
  AndroidAudioplayerModule.seekTo(playerId, seekTo_msec);
}

export function playMusic(playerId: number): void {
  AndroidAudioplayerModule.playMusic(playerId);
}

export function pauseMusic(playerId: number): void {
  AndroidAudioplayerModule.pauseMusic(playerId);
}

export function stopMusic(playerId: number): void {
  AndroidAudioplayerModule.stopMusic(playerId);
}

export function releaseResources(playerId: number): void {
  AndroidAudioplayerModule.releaseResources(playerId);
}

export function getPlaybackCurrentPosition(playerId: number): number {
  return AndroidAudioplayerModule.getPlaybackCurrentPosition(playerId);
}

export function addOnPreparedListener(listener: (event: OnPreparedListener) => void): Subscription {
  return emitter.addListener<OnPreparedListener>('onPrepared', listener);
}

export function setSpeed(playerId: number, speed: number): void {
  return AndroidAudioplayerModule.setSpeed(playerId, speed);
}

export function setPitch(playerId: number, pitch: number): void {
  return AndroidAudioplayerModule.setPitch(playerId, pitch);
}

export function setLooping(playerId: number, isLooping: boolean): void{
  return AndroidAudioplayerModule.setLooping(playerId, isLooping);
}