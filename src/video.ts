import { VideoExtensionsRegexp } from "./constant";
import { DefaultWidth, DefaultHeight } from './constant';
import eventBus from './event-bus';
class Video {
  rawVideo: HTMLVideoElement;
  canvas!: HTMLCanvasElement;

  private urls?: string[];
  private ctx!: CanvasRenderingContext2D;

  private width;
  private height;

  constructor(params: {
    width?: number;
    height?: number;
    initialUrls?: string[];
  }) {
    this.width = params?.width || DefaultWidth;
    this.height = params?.height || DefaultHeight;

    this.rawVideo = document.createElement('video');
    this.rawVideo.className = 'simple-player__raw-video';

    this.urls = params.initialUrls;
    this.createSources();
    
    this.initCanvas();
    this.initEventListener();
  }
  
  play(urls?: string[]) {
    if (urls) this.urls = urls;
    this.createSources();

    if (!this.urls) throw new Error('No videos available to play');

    this.rawVideo.play();
    this.render();
  }

  pause() {
    this.rawVideo.pause();
  }

  private createSources() {
    if (this.urls instanceof Array && this.urls?.length) {
      // Clean up elements left over from the last playback
      this.rawVideo.innerHTML = '';
      this.urls?.forEach((url) => {
        const source = this.createSource(url);
        if (source) this.rawVideo.appendChild(source);
      });
    }
  }

  private initEventListener() {
    eventBus.on('operation_play', () => {
      this.play();
      return true;
    });

    eventBus.on('operation_pause', () => {
      this.pause();
      return false;
    });

    eventBus.on('volume_change', (volume) => {
      this.rawVideo.volume = volume;
      return false;
    });
  }
  private initCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!; 

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private createSource(url: string) {
    const ext = url.match(VideoExtensionsRegexp)?.[0];
    if (!ext) return;
    // Create source element and append it to the video element
    const source = document.createElement('source');
    source.src = url;
    source.type= `video/${ext}`;
    return source;
  }

  private render() {
    if (this.rawVideo.paused || this.rawVideo.ended) {
      return;
    }
    this.ctx.drawImage(this.rawVideo, 0, 0, this.width, this.height);
    window.requestAnimationFrame(() => {
      this.render();
    });
  }

}

export default Video;