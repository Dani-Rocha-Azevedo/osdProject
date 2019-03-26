import * as Backbone from 'backbone'
import { Button } from './button';
export class ConfigOSD extends Backbone.Model{

    constructor(indicatorClass: string, playButton: Button, stopButton: Button, pauseButton: Button,
         fastBackwardButton: Button, fastfrowardButton: Button, nextButton: Button, previousButton: Button ) {
             super()
        this.indicatorClass = indicatorClass
        this.playButton = playButton
        this.pauseButton = pauseButton
        this.stopButton = stopButton
        this.fastBackwardButton = fastBackwardButton
        this.fastForwardButton = fastfrowardButton
        this.nextButton = nextButton
        this.previousButton = previousButton
    }
    /**
     * Getters and setters
     */
    public get fastForwardButton(): Button {
        return this.get('fastForwardButton')
    }
    public set fastForwardButton(value: Button) {
        this.set('fastForwardButton', value)
    }
    public get fastBackwardButton(): Button {
        return this.get('fastBackwardButton')
    }
    public set fastBackwardButton(value: Button) {
        this.set('fastBackwardButton', value)
    }
    public get pauseButton(): Button {
        return this.get('pauseButton')
    }
    public set pauseButton(value: Button) {
        this.set('pauseButton', value)
    }
    public get stopButton(): Button {
        return this.get('stopButton')
    }
    public set stopButton(value: Button) {
        this.set('stopButton', value)
    }
    public get playButton(): Button {
        return this.get('playButton')
    }
    public set playButton(value: Button) {
        this.set('playButton', value)
    }
    public get indicatorClass(): string {
        return this.get('indicatorClass')
    }
    public set indicatorClass(value: string) {
        this.set('indicatorClass', value)
    }
    public get nextButton(): Button {
        return this.get('nextButton');
    }
    public set nextButton(value: Button) {
        this.set('nextButton', value)
    }
    public get previousButton(): Button {
        return this.get('previousButton')
    }
    public set previousButton(value: Button) {
        this.set('previousButton', value)
    }

    /**
     * utilitarian functions
     */
    public getConfig(): { [name: string]: any } {
        var config = {
            indicatorClass : this.get('indicatorClass'),
            playButton : this.get('playButton'),
            stopButton : this.get('stopButton'),
            pauseButton : this.get('pauseButton'),
            fastBackwardButton : this.get('fastBackwardButton'),
            fastForwardButton : this.get('fastForwardButton'),
            nextButton: this.get('nextButton'), 
            previousButton: this.get('previousButton'),
        }
        return config
    }
    // public hideAllButtons(): void {
    //     this._playButton = false
    //     this._stopButton = false
    //     this._pauseButton = false
    //     this._fastBackwardButton = false
    //     this._fastForwardButton = false
    //     this._nextButton = false
    //     this._previousButton = false
    // }
    // public showAllButtons(): void {
    //     this._playButton = true
    //     this._stopButton = true
    //     this._pauseButton = true
    //     this._fastBackwardButton = true
    //     this._fastForwardButton = true
    //     this._nextButton = true
    //     this._previousButton = true
    // }
}