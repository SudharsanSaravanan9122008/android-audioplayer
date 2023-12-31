import { Component } from "react";
import * as AAP from './AndroidAudioplayerModule';
import { playMusic, OnPreparedListener, createMediaPlayer, getAudioSessionId, setAudioTrackUrl, getPlaybackCurrentPosition, getPlaybackMaxDuration, seekTo, pauseMusic, stopMusic, releaseResources, addOnPreparedListener } from './AndroidAudioplayerModule';


interface AndroidAudioPlayerProps {
    onInitCallback: ((audioSessionId: number) => void) | null;
    listenerToTrackProgress: ((progress: { trackPosition: number, trackDuration: number }) => void) | null;
    onPlaybackComplete: () => void;
}

interface AndroidAudioPlayerState {
    trackDuration: number;
    trackPosition: number;
    tempTrackStartTime: number;
    tempTrackStartPos: number;
    seekTo: boolean;
    playerId: number;
    trackUrl: string;
    setUrl: boolean;
    state: "play" | "pause";
    audioSessionId: number
    isPrepared: boolean;
    speed: number;
    pitch: number;
    isLoop: boolean;
}

export default class AndroidAudioPlayer extends Component<
    AndroidAudioPlayerProps,
    AndroidAudioPlayerState
> {
    private intervalId: number;
    constructor(props: AndroidAudioPlayerProps) {
        super(props);
        this.state = {
            trackDuration: 0,
            trackPosition: 0,
            tempTrackStartTime: 0,
            tempTrackStartPos: 0,
            seekTo: false,
            playerId: -1,
            trackUrl: "",
            setUrl: false,
            state: "pause",
            isPrepared: false,
            audioSessionId: 0,
            speed: 1,
            pitch: 1,
            isLoop: false
        };
        this.setTrackUrl = this.setTrackUrl.bind(this);
        this.playMusic = this.playMusic.bind(this);
        this.pauseMusic = this.pauseMusic.bind(this);
        this.setSpeed = this.setSpeed.bind(this);
        this.getAudioSessionId = this.getAudioSessionId.bind(this);
        this.intervalId = setInterval(this.updateVariable, 1000 / this.state.speed);
        this.setLooping = this.setLooping.bind(this);
    }

    componentDidMount() {
        var id = AAP.createMediaPlayer();
        this.setState({
            playerId: id,
            audioSessionId: AAP.getAudioSessionId(id)
        });
        AAP.addOnPreparedListener(({ playerId: preparedPlayerId }) => {
            if (preparedPlayerId === id) {
                this.setState({
                    isPrepared: true,
                    trackDuration: AAP.getPlaybackMaxDuration(this.state.playerId!),
                });
            }
        });
        if (this.props.onInitCallback !== null) {
            this.props.onInitCallback(AAP.getAudioSessionId(id));
        };
        setInterval(() => {
            if (this.state.isPrepared && this.props.listenerToTrackProgress !== null) {
                this.props.listenerToTrackProgress({
                    trackPosition: this.state.trackPosition,
                    trackDuration: this.state.trackDuration,
                });
            }
            if (this.state.state === "play" && (this.state.trackPosition >= this.state.trackDuration) && this.state.isPrepared) {
                if (!this.state.isLoop) {
                    this.setState({
                        trackPosition: 0,
                        state: "pause",
                    })
                    AAP.pauseMusic(this.state.playerId!);
                    AAP.seekTo(this.state.playerId!, 0);
                    this.props.onPlaybackComplete();
                } else{
                    this.setState({
                        trackPosition: 0
                    })
                }

            }
        }, 500)
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
        AAP.setLooping(this.state.playerId, this.state.isLoop)
    }

    componentWillUnmount(): void {
        clearInterval(this.intervalId);
    }

    private updateVariable = () => {
        if (this.state.state === "play") {
            this.setState({ trackPosition: this.state.trackPosition + 500 });
        }
    };

    private changeSpeed = (value: number) => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.updateVariable, 500 / value);
    };

    setTrackUrl(url: string) {
        this.setState({
            trackUrl: url,
            setUrl: true,
        });
    }

    seekTo(msec: number) {
        this.setState({
            trackPosition: msec,
            tempTrackStartPos: msec,
            tempTrackStartTime: Date.now(),
            seekTo: true,
        });
    }

    setSpeed(speedFactor: number) {
        this.setState({
            speed: speedFactor
        });
        this.changeSpeed(speedFactor);
        if (this.state.playerId !== -1) {
            AAP.setSpeed(this.state.playerId, speedFactor);
        }
    }

    setPitch(pitchFactor: number) {
        this.setState({
            pitch: pitchFactor
        });
        AAP.setPitch(this.state.playerId, pitchFactor);
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

    getAudioSessionId() {
        return this.state.audioSessionId
    }

    playMusic() {
        this.setState({
            state: "play",
            tempTrackStartTime: Date.now(),
            tempTrackStartPos: this.state.trackPosition
        });
        this.changeSpeed(this.state.speed);
    }

    setLooping(isLoop: boolean) {
        this.setState({
            isLoop: isLoop
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

export {
    convertMillisToFormattedString,
    playMusic,
    OnPreparedListener,
    createMediaPlayer,
    getAudioSessionId,
    setAudioTrackUrl,
    getPlaybackCurrentPosition,
    getPlaybackMaxDuration,
    seekTo,
    pauseMusic,
    stopMusic,
    releaseResources,
    addOnPreparedListener
};