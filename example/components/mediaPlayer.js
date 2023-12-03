import React, { Component, ReactPropTypes } from "react";
import { Button, StyleSheet, TextInput, Text, View } from "react-native";
import * as AAP from 'android-audioplayer';
import Slider from "@react-native-community/slider";

export default class MediaPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trackDuration: 0,
            trackPosition: 0,
            seekTo: false,
            playerId: null,
            trackUrl: "",
            setUrl: false,
            state: "pause",
            isPrepared: false
        }
    }

    componentDidMount() {
        let id = AAP.createMediaPlayer();
        this.setState({
            playerId: id
        });
        AAP.addOnPreparedListener(({ "playerId": playerId }) => {
            if (playerId === id) {
                this.setState({
                    isPrepared: true,
                    trackDuration: AAP.getPlaybackMaxDuration(this.state.playerId)
                })
            }
        });
        setInterval(()=>{if(this.state.isPrepared && this.state.state==="play") this.setState({trackPosition: AAP.getPlaybackCurrentPosition(this.state.playerId)})}, 1000)
    }

    componentDidUpdate() {
        if (this.state.setUrl) {
            this.setState({
                setUrl: false
            });
            AAP.setAudioTrackUrl(this.state.playerId, this.state.trackUrl);
        }
        if (this.state.isPrepared) {
            if(this.state.seekTo){
                AAP.seekTo(this.state.playerId, this.state.trackPosition);
                this.setState({
                    seekTo: false
                })
            } else{
                if (this.state.state === "play") {
                    console.log(AAP.playMusic(this.state.playerId));
                    console.log("Started");
                } else if (this.state.state === "pause") {
                    AAP.pauseMusic(this.state.playerId);
                    console.log("Paused");
                }
            }
        }
    }

    convertMillisToFormatedString(millis) {
        millis /= 1000;
        let min = (millis - (millis % 60)) / 60;
        let sec = (millis % 60)
        return min.toString() + ":" + ((Math.ceil(sec) < 10) ? ("0" + Math.ceil(sec).toString()) : Math.ceil(sec).toString());
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <TextInput placeholder="Enter link for track" onChangeText={text => this.setState({ trackUrl: text })} style={styles.textInput} />
                    <Button title="set url" onPress={() => this.setState({
                        setUrl: true
                    })} />
                </View>
                <View style={{ width: "100%" }}>
                    <Slider step={1} maximumValue={this.state.trackDuration} minimumValue={0} value={this.state.trackPosition} onValueChange={value => this.setState({ trackPosition: value, seekTo: true })} style={{
                        width: "100%"
                    }} />
                    <View style={styles.timings}>
                        <Text>{this.convertMillisToFormatedString(this.state.trackPosition)}</Text>
                        <Text>{this.convertMillisToFormatedString(this.state.trackDuration)}</Text>
                    </View>
                </View>
                <Button title={this.state.state === "play" ? "pause" : "play"} onPress={() => {
                    this.setState({
                        state: this.state.state === "play" ? "pause" : "play"
                    });
                }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
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
})