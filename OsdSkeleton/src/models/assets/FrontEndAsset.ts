import * as Backbone from 'backbone'
export abstract class FrontEndAsset extends Backbone.Model{
  
    constructor(type: string, description: string, src: string) {
        super()
        this.type = type
        this.description = description
        this.src = src
    }

    public get type(): string {
        return this.get('type')
    }

    public get description(): string {
        return this.get('description')
    }
    public get src(): string {
        return this.get('src');
    }
    public set type(value: string) {
        this.set('type', value)
    }
    public set description(value: string) {
        this.set('description', value)
    }
    public set src(value: string) {
        this.set('src', value)
    }
}