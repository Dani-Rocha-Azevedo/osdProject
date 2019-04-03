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
validTransitions[states.PAUSED.label] = [states.PLAYING]

export class StateMachine extends StateMachineImpl<State> {
    private interval: any
    constructor() {
        super(Object.values(states), validTransitions, states.PAUSED)
    }
    /**
     * start the content
     */
    @checkStateIn([states.STOPPED, states.PAUSED], "you can't launch a live in paused, backwarding, forwarding state")
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

}
