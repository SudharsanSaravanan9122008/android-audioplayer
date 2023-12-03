import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MediaPlayer from './components/mediaPlayer';
import { getAudioSessionId } from 'android-audioplayer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1AudioSessionId: null,
    }
    this.getAudioSessionIDSchedule
  }

  componentDidUpdate() {
    console.log(this.state.player1AudioSessionId)
  }

  componentDidMount() {
    this.getAudioSessionIDSchedule = setInterval(() => {
      if (this.state.player1AudioSessionId === null) this.setState({ player1AudioSessionId: getAudioSessionId(0) })
    }, 1000);
  }

  componentWillUnmount(){
    clearInterval(this.getAudioSessionIDSchedule)
  }

  render() {
    return (
      <View style={styles.container}>
        <MediaPlayer id={0} />
        <MediaPlayer id={1} />
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
  }
});