import { GoogleFontsIcons, volumeBarWidth } from "./constant";
import eventBus from "./event-bus";
import { appendChildren, createElementAndSetClassName, createGoogleIcon } from "./utils";

class OperationBar {

  public container: HTMLElement;

  constructor() {
    // Insert Google Fonts Icons into document
    this.insertLink();
    // Functions include play\pause button, playback speed adjustment, volume adjustment, progress bar, full screen, picture in picture
    // Create the DOM of operation bar
    const leftGroup = createElementAndSetClassName('div', 'flex-container--row');
    appendChildren(leftGroup, [
      this.createPlaybackButton(),
      this.createVolumeAdjustmentButton(),
    ]);

    const rightGroup = createElementAndSetClassName('div', 'flex-container--row');
    appendChildren(rightGroup, [
      this.createSpeedAdjustmentMenu(),
      this.createPicInPicButton(),
      this.createFullScreenButton(),
    ]);

    this.container = this.createContainer();
    appendChildren(this.container, [
      leftGroup,
      this.createProgressBar(),
      rightGroup,
    ]);
  }


  private insertLink() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GoogleFontsIcons;
    document.head.appendChild(link);
  }

  private createContainer() {
    const container = createElementAndSetClassName('div', 'simple-player__operation-bar');
    return container;
  }

  private createPlaybackButton() {
    const playBtn = createGoogleIcon('play_arrow', 'simple-player__operation-bar__play');
    let status = false; // true - playing, false - paused
    playBtn.onclick = () => {
      status = eventBus.emit(status ? 'operation_pause' : 'operation_play')[0];
      playBtn.innerText =  status ? 'pause' : 'play_arrow';
    };
    return playBtn; 
  }

  private createVolumeAdjustmentButton() {
    const volumeAdjustmentContainer = createElementAndSetClassName('div', 'operation-bar__volume')
    const volumeBtn = createGoogleIcon('volume_up', 'simple-player__operation-bar__volume');
    // volumeBtn.onclick = () => {

    // };

    const volumeBar = createElementAndSetClassName('div', 'operation-bar__volume__bar');
    volumeBar.addEventListener('click', (e) => {
      const offsetX = e.offsetX;
      const volume = offsetX / volumeBarWidth;
      volumeBar.style.background = `linear-gradient(to right, #f0b1b1 ${volume * 100}%, #fff 0)`
      eventBus.emit('volume_change', volume);
    });
    appendChildren(volumeAdjustmentContainer, [volumeBtn, volumeBar]);
    return volumeAdjustmentContainer;
  }

  private createProgressBar() {
    return createElementAndSetClassName('div', 'simple-player__operation-bar__progress');
  }

  private createSpeedAdjustmentMenu() {
    const speedContainer = createElementAndSetClassName('div', 'simple-player__operation-bar__speed');
    speedContainer.innerHTML = `
      <span class="material-symbols-outlined icon-close">
        close
      </span>1
    `;

    const menu = createElementAndSetClassName('div', 'operation-bar__speed__menu');
    const menuItems = [ '2', '1.5', '1', '0.5'];
    appendChildren(menu, menuItems.map((text) => {
      const item = createElementAndSetClassName('div', 'speed__menu__item');
      item.innerHTML = `
        <span class="material-symbols-outlined icon-close">
          close
        </span>${text}
      `;
      return item;
    }));
    speedContainer.appendChild(menu);

    
    return speedContainer;
  }

  private createFullScreenButton() {
    return createGoogleIcon('fullscreen', 'simple-player__operation-bar__fullscreen');
  }

  private createPicInPicButton() {
    return createGoogleIcon('picture_in_picture_alt', 'simple-player__operation-bar__pic-in-pic')
  }
}

export default OperationBar;