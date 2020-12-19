import { putOnBox, deleteParameter, persistParameter, retrieveParameter } from '../../lib.js';

export class Video {
  constructor({boxColor, videoUrl}) {
    this.video_div = $('<div class="speaker-video">').css('z-index',-1).appendTo($('body'));
    putOnBox([this.video_div], boxColor);
    this.videoUrl = videoUrl;
    this.video = $(`video[src='${videoUrl}']`);
    this.video.removeClass('hidden').appendTo(this.video_div);
    this.video.animate({opacity: 1}, 500);
    let videoElem = this.video[0];
    videoElem.muted = retrieveParameter('speakerMuted');
    $('#speaker-mute-button').on('click.video', () => {
      videoElem.muted = !videoElem.muted;
    });
    if (videoElem.textTracks.length) {
      videoElem.textTracks[0].mode = retrieveParameter('showCaptions') ? 'showing' : 'hidden';
      $('#show-captions-button').show();
      $('#show-captions-button').on('click.video', () => {
        videoElem.textTracks[0].mode = retrieveParameter('showCaptions') ? 'showing' : 'hidden';
      });
    }
    videoElem.currentTime = retrieveParameter(videoUrl) ?? 0;
    this.intervalHandle = setInterval(() => {
      persistParameter(videoUrl, videoElem.currentTime, {clearable: false});
    }, 1000);
    videoElem.play();
  }

  async from_server() {}

  destroy(){
    this.video[0].pause();
    clearInterval(this.intervalHandle);
    deleteParameter(this.videoUrl);
    $('#speaker-mute-button').off('click.video');
    if (this.video[0].textTracks.length) {
      $('#show-captions-button').off('click.video');
      $('#show-captions-button').hide();
    }
    this.video.removeClass('bbs-video').addClass('hidden').appendTo(document.body);
    this.video_div.remove();
  }

}
