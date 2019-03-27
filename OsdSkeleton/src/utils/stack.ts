export class Stack {
    private array: Array<any>
    private currentPosition: number
    constructor(assets: any){
        this.array = new Array<any>()
        for(let asset in assets) {
            this.addLast(assets[asset])
        }
        this.currentPosition = -1
    }
    /**
     * Add the asset on the end off array
     *@param asset: the new asset added on the end of array 
     */
    public addLast(asset: any) {
        this.array.push(asset)
    }
    /**
     * Return the next asset
     * if we're in the end of the array, return the first asset
     */
    public getNext(): any {
        if(this.currentPosition == this.array.length -1) {
            this.currentPosition = -1
        }
        this.currentPosition ++
        return this.array [this.currentPosition]
    }
    /**
     * Return the previous asset
     * if we're in the start of the array, return the last asset
     */
    public getPrevious(): any {
        if(this.currentPosition == 0) {
            this.currentPosition = this.array.length
        }
        this.currentPosition --
        return this.array [this.currentPosition]
    }
}