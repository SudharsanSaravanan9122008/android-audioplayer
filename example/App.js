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
      isPlaybackComplete: false,
      speed: 200
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
          onPlaybackComplete={() => {
            this.setState({
              isPlaybackComplete: true,
              state: "pause"
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
                  <Button title="set url" onPress={() => { this.mediaPlayer.current.setTrackUrl(this.state.trackUrl); }} />
                </View>
                <Button title="set speed to 50%" onPress={() => { this.mediaPlayer.current.setSpeed(0.5); }} />
                <Button title="set speed to 100%" onPress={() => { this.mediaPlayer.current.setSpeed(1); }} />
                <Button title="set speed to 200%" onPress={() => { this.mediaPlayer.current.setSpeed(2); }} />
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