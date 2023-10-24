declare class Video {
    rawVideo: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    private ctx;
    private width;
    private height;
    constructor(params?: {
        width: number;
        height: number;
    });
    play(urls: string[]): void;
    pause(): void;
    private initCanvas;
    private createSource;
    private render;
}
export default Video;
