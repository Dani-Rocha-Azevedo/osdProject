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
        super(Object.values(states), validTransitions, states.PAUSED)
    }
    /**
     * start the content
     */
    @checkStateIn([states.STOPPED, states.PAUSED, states.BACKWARDING, states.FASTFORWARDING], "you can't launch content in playing state")
    public play(video: HTMLMediaElement): void {
        try {
            if (this.interval) {
                clearInterval(this.interval)
            }
            video.playbackRate = 1
            video.play().then(() => {
                this.setState(states.PLAYING)
            }).catch((err) => {
                console.log(err)
            })
        }catch(err) {
            throw new Error("video play: "+err)
        }
       
    }

    /**
     * Stop the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't stop content in stopped state")
    public stop(video: HTMLMediaElement): void {
        //TODO handle stop video
        try {
            if (this.interval) {
                clearInterval(this.interval)
            }
            // reload the video
            video.load()
            video.pause()
            this.setState(states.STOPPED)
        }catch(err) {
            throw new Error("video stop: "+err)
        }
    }
    /**
     * pause the content
     */
    @checkStateIn([states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't pause content in stopped/paused state")
    public pause(video: HTMLMediaElement): void {
        try{
            if (this.interval) {
                clearInterval(this.interval)
            }
            video.playbackRate = 1
            video.pause()
            this.setState(states.PAUSED)
        }catch(err) {
            throw new Error("video pause: "+err)
        }
        

    }

    /**
     * Fast forward the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't fast forward content in stopped state")
    public fastForward(video: HTMLMediaElement, speed: number): void {
        try{
            this.setState(states.FASTFORWARDING)
            if (this.interval) {
                clearInterval(this.interval)
            }
            this.interval = setInterval(() => {
                video.currentTime += speed
            }, 10)
        }catch(err) {
            throw new Error("video Forward: "+err)
        }
        
    }

    /**
     * Backward the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't rewind content in stopped state")
    public backward(video: HTMLMediaElement, speed: number): void {
        try {
            this.setState(states.BACKWARDING)
            if (this.interval) {
                clearInterval(this.interval)
            }
            this.interval = setInterval(() => {
                // at the beginning of movie
                if (video.currentTime == 0) {
                    this.pause(video)
                }
                else {
                    video.currentTime += -speed
                    video.play()
                }
            }, 10)
        }catch(err) {
            throw new Error("video Backward")
        }
        
    }
    /**
     * Jump on the content
     */
    @checkStateIn([states.PAUSED, states.PLAYING], "you can't jumpBackward content in stopped/Forwarding/backwarding state")
    public jumpBackwardTime(video: HTMLMediaElement, position: number): void {
        try {
            video.currentTime -= position
        }catch(err) {
            throw new Error("video Jump Backward")
        }
    }
    /**
     * Jump on the content
     */
    @checkStateIn([states.PAUSED, states.PLAYING], "you can't jumpForward content in stopped/Forwarding/backwarding state")
    public jumpForwardTime(video: HTMLMediaElement, position: number): void {
        try {
            video.currentTime += position
        }catch(err) {
            throw new Error("video Jump Backward")
        }
    }



}
