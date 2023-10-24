import { VideoExtensionsRegexp } from "./constant";

const DefaultWidth = 320;
const DefaultHeight = 180;

class Video {
  rawVideo: HTMLVideoElement;
  canvas!: HTMLCanvasElement;

  private urls?: string[];
  private ctx!: CanvasRenderingContext2D;

  private width;
  private height;

  constructor(params?: {
    width: number;
    height: number;
  }) {
    this.width = params?.width || DefaultWidth;
    this.height = params?.height || DefaultHeight;

    this.rawVideo = document.createElement('video');
    this.rawVideo.className = 'simple-player__raw-video';

    this.initCanvas();
  }
  
  play(urls: string[]) {
    if (urls instanceof Array && urls?.length) {
      this.urls = urls;
      // Clean up elements left over from the last playback
      this.rawVideo.innerHTML = '';
      urls.forEach((url) => {
        const source = this.createSource(url);
        if (source) this.rawVideo.appendChild(source);
      });
    }

    if (!this.urls) throw new Error('No videos available to play');

    this.rawVideo.play();
    this.render();
  }

  pause() {
    this.rawVideo.pause();
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