import * as Backbone from 'backbone'
export class Button extends Backbone.Model{
    constructor(display: boolean, active: boolean) {
        super()
        this.active = active
        this.display = display
    }
    public get active(): boolean {
        return this.get('active')
    }
    public get display(): boolean {
        return this.get('display')
    }
    public set active(value: boolean)  {
        this.set('active', value)
    }
    public set display(value: boolean)  {
        this.set('display', value)
    }
}