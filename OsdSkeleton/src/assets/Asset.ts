export abstract class Asset {
    private type: string
    private description: string
    private _src: string;
    
    constructor(type: string, description: string, src: string) {
        this.type = type
        this.description = description
        this._src = src
    }

    public getType(): string {
        return this.type
    }

    public getDescription(): string {
        return this.description
    }
    public get src(): string {
        return this._src;
    }
}