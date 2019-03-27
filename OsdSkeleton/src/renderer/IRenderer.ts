import { Button } from "../models/button";

export interface IRenderer {
    render(): any
    /**
     * update the left time
     * @param value: the new left time
     */
    updateLeftTime(value: string): void
    /**
     * update the right time
     * @param value: the new right time
     */
    updateRightTime(value: string): void
    /**
     * hide or display pause button
     * @param value: the button 
     */
    updatePauseButton(value: Button): void
    /**
     * hide or display play button
     * @param value: the button 
     */
    updatePlayButton(value: Button): void
    /**
     * hide or display stop button
     * @param value: the button 
     */
    updateStopButton(value: Button): void
    /**
     * hide or display fastForward button
     * @param value: the button 
     */
    updateFastForwardButton(value: Button): void
    /**
     * hide or display fastBackward button
     * @param value: the button 
     */
    updateFastBackwardButton(value: Button): void
     /**
     * hide or display next button
     * @param value: the button 
     */
    updateNextButton(value: Button): void
     /**
     * hide or display previous button
     * @param value: the button 
     */
    updatePreviousButton(value: Button): void
    /**
     * Removes a view and its $el from the DOM, and calls stopListening to remove any bound events that the view has listenTo.
     */
    removeView(): void
}