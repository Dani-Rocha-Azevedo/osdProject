export class ConfigOSD {
    private _indicatorClass: string
    private _playButton: boolean
    private _stopButton: boolean
    private _pauseButton: boolean
    private _backwardButton: boolean
    private _fastforwardButton: boolean
    private _nextButton: boolean;
    private _previousButton: boolean;
    private _errorMessage: Array<string>
    

    constructor(indicatorClass: string, playButton: boolean, stopButton: boolean, pauseButton: boolean,
         backwardButton: boolean, fastfrowardButton: boolean, nextButton: boolean, previousButton: boolean ) {
        this._indicatorClass = indicatorClass
        this._playButton = playButton
        this._pauseButton = pauseButton
        this._stopButton = stopButton
        this._backwardButton = backwardButton
        this._fastforwardButton = fastfrowardButton
        this._errorMessage = []
        this._nextButton = nextButton
        this._previousButton = previousButton
    }
    /**
     * Getters and setters
     */
    public get fastforwardButton(): boolean {
        return this._fastforwardButton
    }
    public set fastforwardButton(value: boolean) {
        this._fastforwardButton = value
    }
    public get backwardButton(): boolean {
        return this._backwardButton
    }
    public set backwardButton(value: boolean) {
        this._backwardButton = value
    }
    public get pauseButton(): boolean {
        return this._pauseButton
    }
    public set pauseButton(value: boolean) {
        this._pauseButton = value
    }
    public get stopButton(): boolean {
        return this._stopButton
    }
    public set stopButton(value: boolean) {
        this._stopButton = value
    }
    public get playButton(): boolean {
        return this._playButton
    }
    public set playButton(value: boolean) {
        this._playButton = value
    }
    public get indicatorClass(): string {
        return this._indicatorClass
    }
    public set indicatorClass(value: string) {
        this._indicatorClass = value
    }
    public get nextButton(): boolean {
        return this._nextButton;
    }
    public set nextButton(value: boolean) {
        this._nextButton = value;
    }
    public get previousButton(): boolean {
        return this._previousButton;
    }
    public set previousButton(value: boolean) {
        this._previousButton = value;
    }

    public get errorMessage(): Array<string> {
        return this._errorMessage;
    }
    public pushError(value: string): void {
        this._errorMessage.push(value)
    }

    /**
     * utilitarian functions
     */
    public getConfig(): { [name: string]: any } {
        var config = {
            indicatorClass : this._indicatorClass,
            playButton : this._playButton,
            stopButton : this._stopButton,
            pauseButton : this._pauseButton,
            backwardButton : this._backwardButton,
            fastforwardButton : this.fastforwardButton,
            nextButton: this._nextButton, 
            previousButton: this._previousButton,
            errorMessage : this._errorMessage
        }
        return config
    }
    public hideAllButtons(): void {
        this._playButton = false
        this._stopButton = false
        this._pauseButton = false
        this._backwardButton = false
        this._fastforwardButton = false
        this._nextButton = false
        this._previousButton = false
    }
    public showAllButtons(): void {
        this._playButton = true
        this._stopButton = true
        this._pauseButton = true
        this._backwardButton = true
        this._fastforwardButton = true
        this._nextButton = true
        this._previousButton = true
    }
}