
export interface IPlayerState {
    play(): IPlayerState
    stop(): IPlayerState
    pause(): IPlayerState
    fastForward(): IPlayerState
    fastBackward(): IPlayerState
    render(): any
    postRender(): void
    /**
     * Removes a view and its $el from the DOM, and calls stopListening to remove any bound events that the view has listenTo.
     */
    removeView(): void
    /**
     * It's useful when buffer in timeShiftPlayerState is finished
     */
    getPlayerState(): IPlayerState
}