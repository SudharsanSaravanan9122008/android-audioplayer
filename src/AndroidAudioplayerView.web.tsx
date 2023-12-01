import * as React from 'react';

import { AndroidAudioplayerViewProps } from './AndroidAudioplayer.types';

export default function AndroidAudioplayerView(props: AndroidAudioplayerViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
