package expo.modules.androidaudioplayer

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.media.MediaPlayer
import android.media.PlaybackParams
import android.media.AudioAttributes
import androidx.core.os.bundleOf

class AndroidAudioplayerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AndroidAudioplayer")
    Events("onPrepared")
    var mediaPlayers = arrayOf<MediaPlayer>()
    var mediaPlayersSpeed = arrayOf<Float>()
    var mediaPlayersPitch = arrayOf<Float>()

    fun createMediaPlayer(): Int{
      var mediaPlayer = MediaPlayer()

      val playerId = mediaPlayers.size
      mediaPlayers+=mediaPlayer
      return playerId
    }

    fun initPlayer(playerId: Int){
      var mediaPlayer = mediaPlayers[playerId]
      mediaPlayer.apply{
        setAudioAttributes(
                AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .build()
        )
      }
      mediaPlayers[playerId].setOnPreparedListener{
        this@AndroidAudioplayerModule.sendEvent("onPrepared", bundleOf("playerId" to playerId))
      }
      mediaPlayersPitch += 1.0f
      mediaPlayersSpeed += 1.0f
    }

    Function("createMediaPlayer"){
      val id = createMediaPlayer()
      initPlayer(id)
      id
    }

    Function("getAudioSessionId"){
      playerId: Int -> mediaPlayers[playerId].getAudioSessionId()
    }


    Function("releaseResources") { playerId: Int ->
      mediaPlayers[playerId].release()
    }

    AsyncFunction("setAudioTrackUrl"){
      playerId: Int, url:String ->
      mediaPlayers[playerId].stop()
      mediaPlayers[playerId].setDataSource(url)
      mediaPlayers[playerId].prepareAsync()
    }

    Function("getPlaybackCurrentPosition"){
      playerId: Int -> mediaPlayers[playerId].getCurrentPosition()
    }

    Function("getPlaybackMaxDuration"){
      playerId: Int ->
      mediaPlayers[playerId].start()
      mediaPlayers[playerId].pause()
      mediaPlayers[playerId].getDuration()
    }

    Function("seekTo"){
      playerId: Int, seekTo_msec: Int -> mediaPlayers[playerId].seekTo(seekTo_msec)
    }

    Function("playMusic"){
      playerId: Int -> mediaPlayers[playerId].apply{
        start()
    }
    }

    Function("pauseMusic"){
      playerId: Int -> mediaPlayers[playerId].apply{
        pause()
    }
    }
    Function("setSpeed"){
      playerId: Int, speed: Float ->
      var playbackParam = PlaybackParams()
      playbackParam.allowDefaults()
      playbackParam.setSpeed(speed)
      playbackParam.setPitch(mediaPlayersPitch[playerId])
      mediaPlayers[playerId].setPlaybackParams(playbackParam)
      mediaPlayersSpeed[playerId] = speed
    }
    Function("setPitch"){
      playerId: Int, pitch: Float ->
      var playbackParam = PlaybackParams()
      playbackParam.allowDefaults()
      playbackParam.setSpeed(mediaPlayersSpeed[playerId])
      playbackParam.setPitch(pitch)
      mediaPlayers[playerId].setPlaybackParams(playbackParam)
      mediaPlayersPitch[playerId] = pitch
    }

    Function("setLooping"){
      playerId: Int, isLoop: Boolean ->
      mediaPlayers[playerId].setLooping(isLoop)
    }
  }
}
