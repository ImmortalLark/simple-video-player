import Video from "./video";
declare class Player {
    private container;
    video: Video;
    constructor(elementId: string);
    private initCore;
    private initVideo;
}
export default Player;
