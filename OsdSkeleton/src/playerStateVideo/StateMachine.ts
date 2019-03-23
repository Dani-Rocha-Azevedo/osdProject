import { fsm } from 'typescript-state-machine'
import State = fsm.State
import * as $ from 'jquery'
import StateMachineImpl = fsm.StateMachineImpl
import Transitions = fsm.Transitions
import checkStateIn = fsm.CheckStateIn
import { stat, promises } from 'fs';
import { REFUSED } from 'dns';

/**
* The differents States
*/
export const states = {
    STOPPED: new State("STOPPED"),
    PLAYING: new State("PLAYING"),
    PAUSED: new State("PAUSED"),
    BACKWARDING: new State("BACKWARDING"),
    FASTFORWARDING: new State("FASTFORWARDING")
}
/**
* All vaild transitions
*/
const validTransitions: Transitions<State> = {}
validTransitions[states.STOPPED.label] = [states.PLAYING]
validTransitions[states.PLAYING.label] = [states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.STOPPED]
validTransitions[states.PAUSED.label] = [states.PLAYING, states.BACKWARDING, states.FASTFORWARDING, states.STOPPED]
validTransitions[states.BACKWARDING.label] = [states.PLAYING, states.PAUSED, states.FASTFORWARDING, states.STOPPED, states.BACKWARDING]
validTransitions[states.FASTFORWARDING.label] = [states.PLAYING, states.PAUSED, states.BACKWARDING, states.STOPPED, states.FASTFORWARDING]

export class StateMachine extends StateMachineImpl<State> {
    private interval: any
    constructor() {
        super(Object.values(states), validTransitions, states.PLAYING)
    }
    /**
     * start the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING], "you can't launch content in stopped/playing state")
    public play(video: HTMLMediaElement ): Promise<any> {
        return new Promise ((resolve, reject) => {
            try {
                if (this.interval) {
                    clearInterval(this.interval)
                }
                video.playbackRate = 1
                video.play()
                this.setState(states.PLAYING)
                resolve("Play movie")
            }catch(err) {
                reject(err)
            }
            
        })
        
    }

    /**
     * Stop the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't stop content in stopped state")
    public stop(video: HTMLMediaElement): Promise<any> {
        //TODO handle stop video
        return new Promise((resolve, reject) => {
            try {
                if (this.interval) {
                    clearInterval(this.interval)
                }
                this.setState(states.STOPPED)
                resolve("Stop movie")
            }catch(err) {
                reject(err)
            }
           
        })
    }
    /**
     * pause the content
     */
    @checkStateIn([states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't pause content in stopped/paused state")
    public pause(video: HTMLMediaElement): Promise<any> {
        return new Promise( (resolve, reject) => {
            try {
                if (this.interval) {
                    clearInterval(this.interval)
                }
                video.playbackRate = 1
                video.pause()
                this.setState(states.PAUSED)
                resolve("Pause movie")
            }
            catch(err) {
                reject(err)
            }
        })
        
    }

    /**
     * Fast forward the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't fast forward content in stopped state")
    public fastForward(video: HTMLMediaElement): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                if (this.interval) {
                    clearInterval(this.interval)
                }
                video.playbackRate = 1.5
                this.setState(states.FASTFORWARDING)
                resolve("Fasforward movie")
            }catch(err) {
                reject(err)
            }
        })
    }

    /**
     * Back ward the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't rewind content in stopped state")
    public backward(video: HTMLMediaElement): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.setState(states.BACKWARDING)
                if (this.interval) {
                    clearInterval(this.interval)
                }
                this.interval = setInterval(() => {
                    video.playbackRate = 1
                    // at the beginning of movie
                    if(video.currentTime == 0) {
                        this.pause(video)
                    }
                    else {
                        video.currentTime += -.1
                    }
                }, 20)
                resolve("Backward movie")
            }catch(err) {
                reject(err)
            }
        })
       
    }

    
    
}
