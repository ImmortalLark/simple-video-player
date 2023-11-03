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
      status = eventBus.emit(status ? '_operation_pause' : '_operation_play')[0];
      playBtn.innerText =  status ? 'pause' : 'play_arrow';
    };

    eventBus.on('_video_ended', () => {
      status = false;
      playBtn.innerText = 'play_arrow';
    });

    return playBtn; 
  }

  private createVolumeAdjustmentButton() {
    const volumeAdjustmentContainer = createElementAndSetClassName('div', 'operation-bar__volume')
    const volumeBtn = createGoogleIcon('volume_up', 'simple-player__operation-bar__volume');
    const volumeBar = createElementAndSetClassName('div', 'operation-bar__volume__bar');

    const setVolume = (v: number) => {
      volumeBar.style.background = `linear-gradient(to right, #f0b1b1 ${v * 100}%, #fff 0)`
      eventBus.emit('_volume_change', v);
    };
  
    let volume = 1;
    volumeBar.addEventListener('click', (e) => {
      const offsetX = e.offsetX;
      volume = offsetX / volumeBarWidth;
      setVolume(volume);
      // Set the icon of volume button
      volumeBtn.innerText = volume ? 'volume_up' : 'volume_off';
    });

    let volumeOff = false;
    volumeBtn.onclick = () => {
      volumeBtn.innerText = volumeOff ? 'volume_up' : 'volume_off';
      setVolume(volumeOff ? volume : 0);
      volumeOff = !volumeOff;
    };

    appendChildren(volumeAdjustmentContainer, [volumeBtn, volumeBar]);
    return volumeAdjustmentContainer;
  }

  private createProgressBar() {
    const progressBar = createElementAndSetClassName('div', 'simple-player__operation-bar__progress');

    let duration = 0;
    eventBus.on('_duration_change', (payload) => duration = payload);
    eventBus.on('_time_update', (currentTime) => {
      // Update video playing progress
      progressBar.style.background = `linear-gradient(to right, #f0b1b1 ${currentTime / duration * 100}%, #fff 0)`
    });
    // Monitor video progress adjustment
    progressBar.onclick = (e) => {
      const offsetX = e.offsetX;
      const radio = offsetX / (e!.target as unknown as { offsetWidth: number }).offsetWidth
      eventBus.emit('_seek', radio);
    }
    return progressBar;
  }

  private createSpeedAdjustmentMenu() {
    const speedContainer = createElementAndSetClassName('div', 'simple-player__operation-bar__speed');
    const speed = createElementAndSetClassName('span', 'operation-bar__speed__value');
    speedContainer.innerHTML = `
      <span class="material-symbols-outlined icon-close">
        close
      </span>
    `;
    speed.innerText = '1';
    speedContainer.append(speed);

    const menu = createElementAndSetClassName('div', 'operation-bar__speed__menu');
    const menuItems = [ '2', '1.5', '1', '0.5'];
    appendChildren(menu, menuItems.map((text) => {
      const item = createElementAndSetClassName('div', 'speed__menu__item');
      item.innerHTML = `
        <span class="material-symbols-outlined icon-close">
          close
        </span>${text}
      `;
      item.onclick = () => {
        speed.innerText = text;
        eventBus.emit('_speed_adjust', +text);
      };
      return item;
    }));
    speedContainer.appendChild(menu);

    
    return speedContainer;
  }

  private createFullScreenButton() {
    const icon = createGoogleIcon('fullscreen', 'simple-player__operation-bar__fullscreen');
    let isFullscreen = false;
    icon.onclick = () => {
      isFullscreen = !isFullscreen;
      eventBus.emit('_fullscreen', isFullscreen);
    };

    return icon;
  }

  private createPicInPicButton() {
    const icon = createGoogleIcon('picture_in_picture_alt', 'simple-player__operation-bar__pic-in-pic');
    let isPicInPic = false;

    icon.onclick = () => {
      isPicInPic = !isPicInPic;
      eventBus.emit('_pic-in-pic', isPicInPic);
    };
    
    return icon;
  }
}

export default OperationBar;