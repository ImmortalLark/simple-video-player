import OperationBar from "./operation-bar";
import { appendChildren } from "./utils";
import Video from "./video";
import './styles.less';
import { DefaultHeight, DefaultWidth } from "./constant";
import eventBus from "./event-bus";

type StyleType = {
  width: number;
  height: number;
};

class Player {
  private container!: HTMLElement;
  private style?: StyleType;
  private initialUrls?: string[];

  private operationBar!: OperationBar;
  public video!: Video;

  constructor(params: {
    elementId: string;
    style?: StyleType;
    initialUrls?: string[];
  }) {
    this.style = params.style;
    this.initialUrls = params.initialUrls;
    
    this.initContainer(params.elementId);
    this.initCore();
    this.initEventListeners();
  }

  // Create UI and initialize core functions such as play, pause, fast forward, etc.
  private initCore() {
    this.initVideo();
    this.initOperationBar();
  }

  private initContainer(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Container not exist!');
    
    element.style.width = `${this.style?.width || DefaultWidth}px`;
    element.style.height = `${this.style?.height || DefaultHeight}px`;
    element.className = `${element.className} simple-player`;
    this.container = element;
  }

  private initVideo() {
    this.video = new Video({
      width: this.style?.width,
      height: this.style?.height,
      initialUrls: this.initialUrls,
    });
  
    this.container.appendChild(this.video.rawVideo);
    this.container.appendChild(this.video.canvas);
    appendChildren(this.container, [this.video.rawVideo, this.video.canvas]);
  }

  private initOperationBar() {
    this.operationBar = new OperationBar();
    this.container.appendChild(this.operationBar.container);
  }

  private initEventListeners() {
    eventBus.on('_fullscreen', (status) => {
      if(status) {
        this.container.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }
}

export default Player;

(window as any).SimplePlayer = Player; 
