# android-audioplayer   
## Introduction

This is a module created using expo-modules api. It is platform-dependent. It only works on Android devices. This works by using native kotlin files and runs using [android.media.MediaPlayer](https://developer.android.com/reference/kotlin/android/media/MediaPlayer) library. 

## Features

- Create and manage multiple media player instances and control them induvidually using unique player ids given when creating it
- Provide the ability to get  ```audioSessionId``` for later use on other native libraries for audio signal processing, etc.
- It allows playback functionality like playing, pausing, seeking, stopping, etc.
- An high level playback managing class called ```AndroidAudioPlayer``` is provided for easy use during development
- And access to low level functions are also available

## Installation
android-audioplayer requires Expo projects to work on.

## Documentation
### AndroidAudioPlayer class
> This is an high level class provided with this library. Using this you don't have to take care of state management, etc. You just need to use the methods provided in the class and that's it.

### Example usage
```tsx
import React, { Component, createRef } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import AndroidAudioPlayer from 'android-audioplayer';
import { convertMillisToFormattedString } from 'android-audioplayer';
import Slider from "@react-native-community/slider";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioSessionId: null,
      trackUrl: "",
      trackDuration: 0,
      trackPosition: 0,
      state: "pause",
      tempTrackPosition: 0,
      tempTrackSliding: false,
      isPlaybackComplete: false
    }
    this.getAudioSessionIDSchedule;
    this.mediaPlayer = createRef();
  }

  render() {
    return (
      <View style={styles.container}>
        <AndroidAudioPlayer
          ref={this.mediaPlayer}
          onInitCallback={(audioSessionId) => this.setState({ audioSessionId: audioSessionId })}
          listenerToTrackProgress={(json) => {
            this.setState({
              ...json
            })
          }}
          onPlaybackComplete={()=>{
            this.setState({
              isPlaybackComplete: true,
              state:"pause"
            })
            console.warn("Playback completed");
          }}
        />
        {
          this.mediaPlayer.current !== null ?
            (
              <View style={styles.playerContainer}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <TextInput placeholder="Enter link for track" onChangeText={text => this.setState({ trackUrl: text })} style={styles.textInput} />
                  <Button title="set url" onPress={() => this.mediaPlayer.current.setTrackUrl(this.state.trackUrl)} />
                </View>
                <View style={{ width: "100%" }}>
                  <Slider step={1} maximumValue={this.state.trackDuration} minimumValue={0} value={this.state.trackPosition} onSlidingStart={() => {
                    this.setState({
                      tempTrackPosition: 0,
                      tempTrackSliding: true
                    })
                  }} onValueChange={value => {
                    this.setState({
                      tempTrackPosition: value
                    })
                  }} onSlidingComplete={() => {
                    this.setState({
                      tempTrackSliding: false
                    });
                    this.mediaPlayer.current.seekTo(this.state.tempTrackPosition)
                  }}
                    style={{
                      width: "100%"
                    }} />
                  <View style={styles.timings}>
                    <Text>{convertMillisToFormattedString(this.state.trackPosition)}</Text>
                    <Text>{convertMillisToFormattedString(this.state.trackDuration)}</Text>
                  </View>
                </View>
                <Button title={this.state.state === "play" ? "pause" : "play"} onPress={() => {
                  this.state.state === "play" ? this.mediaPlayer.current.pauseMusic() : this.mediaPlayer.current.playMusic();
                  this.setState({
                    state: this.state.state === "play" ? "pause" : "play"
                  })
                }} />
              </View>
            ) : null
        }
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  playerContainer: {
    width: "90%",
    aspectRatio: 6 / 5,
    borderRadius: 30,
    backgroundColor: "#dddddd",
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",

  },
  textInput: {
    backgroundColor: "#ddddf0",
    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "70%",
    height: 40,
    marginRight: 5
  },
  timings: {
    width: "90%",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    alignSelf: "center"
  }
});
```

## License

MIT
