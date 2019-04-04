export interface StateMachine {
    play(video: HTMLMediaElement): void
    stop(video: HTMLMediaElement): void
    pause(video: HTMLMediaElement): void
    fastForward(video: HTMLMediaElement, speed: number): void
    backward(video: HTMLMediaElement, speed: number): void
    jumpForwardTime(video: HTMLMediaElement, position: number): void 
    jumpBackwardTime(video: HTMLMediaElement, position: number): void 

}