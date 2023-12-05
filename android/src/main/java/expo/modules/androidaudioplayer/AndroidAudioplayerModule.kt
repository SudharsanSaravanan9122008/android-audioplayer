package expo.modules.androidaudioplayer

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.media.MediaPlayer
import android.media.AudioAttributes
import androidx.core.os.bundleOf

class AndroidAudioplayerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AndroidAudioplayer")
    Events("onPrepared")
    Events("onInit")
    var mediaPlayers = arrayOf<MediaPlayer>()

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
    }

    Function("createMediaPlayer"){
      val id = createMediaPlayer()
      initPlayer(id)
      val audioSessionId = mediaPlayers[id].getAudioSessionId()
      this@AndroidAudioplayerModule.sendEvent("onInit", bundleOf("audioSessionId" to audioSessionId))
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
  }
}
