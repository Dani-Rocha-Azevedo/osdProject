import { render } from "ejs";

export interface IPlayerState {
    play(): IPlayerState
    stop(): IPlayerState
    pause(): IPlayerState
    fastForward(): IPlayerState
    fastBackward(): IPlayerState
    render(): any
    /**
     * Removes a view and its $el from the DOM, and calls stopListening to remove any bound events that the view has listenTo.
     */
    removeView(): void
}