import { Component } from "react";
import * as AAP from './AndroidAudioplayerModule';
import { playMusic, OnPreparedListener, createMediaPlayer, getAudioSessionId, setAudioTrackUrl, getPlaybackCurrentPosition, getPlaybackMaxDuration, seekTo, pauseMusic, stopMusic, releaseResources, addOnPreparedListener, addOnInitListener } from './AndroidAudioplayerModule';


interface AndroidAudioPlayerProps {
    onInitCallback: ((audioSessionId: number) => void) | null;
 }

interface AndroidAudioPlayerState {
    trackDuration: number;
    trackPosition: number;
    seekTo: boolean;
    playerId: number | null;
    trackUrl: string;
    setUrl: boolean;
    state: "play" | "pause";
    audioSessionId: number
    isPrepared: boolean;
}

export default class AndroidAudioPlayer extends Component<
    AndroidAudioPlayerProps,
    AndroidAudioPlayerState
> {
    private listenerToTrackProgress: ((progress: { trackPosition: number; trackDuration: number }) => void) | null = null;

    constructor(props: AndroidAudioPlayerProps) {
        super(props);
        this.state = {
            trackDuration: 0,
            trackPosition: 0,
            seekTo: false,
            playerId: null,
            trackUrl: "",
            setUrl: false,
            state: "pause",
            isPrepared: false,
            audioSessionId: 0
        };
        this.setTrackUrl = this.setTrackUrl.bind(this);
        this.playMusic = this.playMusic.bind(this);
        this.pauseMusic = this.pauseMusic.bind(this);
        this.getAudioSessionId = this.getAudioSessionId.bind(this);
    }

    componentDidMount() {
        const id = AAP.createMediaPlayer();
        this.setState({
            playerId: id,
        });
        AAP.addOnPreparedListener(({ playerId: preparedPlayerId }) => {
            if (preparedPlayerId === id) {
                this.setState({
                    isPrepared: true,
                    trackDuration: AAP.getPlaybackMaxDuration(this.state.playerId!),
                });
            }
        });
        AAP.addOnInitListener(({ audioSessionId: audioSessionId }) => {
            this.setState({
                audioSessionId: audioSessionId
            })
            if(this.props.onInitCallback !== null) this.props.onInitCallback(audioSessionId);
        })
        setInterval(() => {
            if (this.state.isPrepared && this.state.state === "play") {
                this.setState({
                    trackPosition: AAP.getPlaybackCurrentPosition(this.state.playerId!),
                });
            }
            if (this.state.isPrepared && this.listenerToTrackProgress !== null) {
                this.listenerToTrackProgress({
                    trackPosition: this.state.trackPosition,
                    trackDuration: this.state.trackDuration,
                });
            }
        }, 1000);
    }

    componentDidUpdate() {
        if (this.state.setUrl) {
            this.setState({
                setUrl: false,
            });
            AAP.setAudioTrackUrl(this.state.playerId!, this.state.trackUrl);
        }
        if (this.state.isPrepared) {
            if (this.state.seekTo) {
                AAP.seekTo(this.state.playerId!, this.state.trackPosition);
                this.setState({
                    seekTo: false,
                });
            } else {
                if (this.state.state === "play") {
                    AAP.playMusic(this.state.playerId!);
                } else if (this.state.state === "pause") {
                    AAP.pauseMusic(this.state.playerId!);
                }
            }
        }
    }

    setTrackUrl(url: string) {
        this.setState({
            trackUrl: url,
            setUrl: true,
        });
    }

    seekTo(msec: number) {
        this.setState({
            trackPosition: msec,
            seekTo: true,
        });
    }

    getState() {
        const response = {
            isPlaying: this.state.state === "play",
            isAudioPrepared: this.state.isPrepared,
            trackDuration: this.state.trackDuration,
            playbackPosition: this.state.trackPosition,
        };
        return response;
    }

    listenToTrackProgress(callback: (progress: { trackPosition: number; trackDuration: number }) => void) {
        this.listenerToTrackProgress = callback;
    }

    getAudioSessionId() {
        return this.state.audioSessionId
    }

    playMusic() {
        this.setState({
            state: "play",
        });
    }

    pauseMusic() {
        this.setState({
            state: "pause",
        });
    }

    render() {
        return null;
    }
}

function convertMillisToFormattedString(millis: number) {
    millis /= 1000;
    const min = Math.floor(millis / 60);
    const sec = Math.floor(millis % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

export { convertMillisToFormattedString, playMusic, OnPreparedListener, addOnInitListener, createMediaPlayer, getAudioSessionId, setAudioTrackUrl, getPlaybackCurrentPosition, getPlaybackMaxDuration, seekTo, pauseMusic, stopMusic, releaseResources, addOnPreparedListener };