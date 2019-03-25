import * as Backbone from 'backbone'
export class ConfigOSD extends Backbone.Model{

    constructor(indicatorClass: string, playButton: boolean, stopButton: boolean, pauseButton: boolean,
         fastBackwardButton: boolean, fastfrowardButton: boolean, nextButton: boolean, previousButton: boolean ) {
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
    public get fastForwardButton(): boolean {
        return this.get('fastForwardButton')
    }
    public set fastForwardButton(value: boolean) {
        this.set('fastForwardButton', value)
    }
    public get fastBackwardButton(): boolean {
        return this.get('fastBackwardButton')
    }
    public set fastBackwardButton(value: boolean) {
        this.set('fastBackwardButton', value)
    }
    public get pauseButton(): boolean {
        return this.get('pauseButton')
    }
    public set pauseButton(value: boolean) {
        this.set('pauseButton', value)
    }
    public get stopButton(): boolean {
        return this.get('stopButton')
    }
    public set stopButton(value: boolean) {
        this.set('stopButton', value)
    }
    public get playButton(): boolean {
        return this.get('playButton')
    }
    public set playButton(value: boolean) {
        this.set('playButton', value)
    }
    public get indicatorClass(): string {
        return this.get('indicatorClass')
    }
    public set indicatorClass(value: string) {
        this.set('indicatorClass', value)
    }
    public get nextButton(): boolean {
        return this.get('nextButton');
    }
    public set nextButton(value: boolean) {
        this.set('nextButton', value)
    }
    public get previousButton(): boolean {
        return this.get('previousButton')
    }
    public set previousButton(value: boolean) {
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