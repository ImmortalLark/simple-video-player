import Video from "./video";

class Player {
  private container: HTMLElement;
  public video!: Video;

  constructor(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Container not exist!');

    this.container = element;
    this.initCore();
  }

  // Create UI and initialize core functions such as play, pause, fast forward, etc.
  private initCore() {
    this.initVideo();
  }

  private initVideo() {
    this.video = new Video();
    this.container.appendChild(this.video.rawVideo);
    this.container.appendChild(this.video.canvas);
  }
}

export default Player;

(window as any).SimplePlayer = Player; 
