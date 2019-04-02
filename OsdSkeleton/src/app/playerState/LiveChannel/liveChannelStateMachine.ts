import { fsm } from 'typescript-state-machine'
import State = fsm.State
import * as $ from 'jquery'
import StateMachineImpl = fsm.StateMachineImpl
import Transitions = fsm.Transitions
import checkStateIn = fsm.CheckStateIn
import {states} from '../../utils/constants'
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
    public play(video: HTMLMediaElement, currentTime: number): void {
        try {
            if (this.interval) {
                clearInterval(this.interval)
            }
            video.playbackRate = 1
            video.currentTime = currentTime
            video.play().then(() => {
                this.setState(states.PLAYING)
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
        //! Not handled
    }
    /**
     * pause the content
     */
    @checkStateIn([states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't pause content in stopped/paused state")
    public pause(video: HTMLMediaElement): void {
        //! Not handled

    }

    /**
     * Fast forward the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't fast forward content in stopped state")
    public fastForward(video: HTMLMediaElement, speed: number): void {
        //! Not handled
    }

    /**
     * Back ward the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't rewind content in stopped state")
    public backward(video: HTMLMediaElement, speed: number): void {
        //! Not handled
        
    }

    
    
}
