import { fsm } from 'typescript-state-machine'
import State = fsm.State
import StateMachineImpl = fsm.StateMachineImpl
import Transitions = fsm.Transitions
import checkStateIn = fsm.CheckStateIn
import {states} from '../../app/utils/constants'
/**
* All vaild transitions
*/
const validTransitions: Transitions<State> = {}
validTransitions[states.STOPPED.label] = [states.PLAYING]
validTransitions[states.PAUSED.label] = [states.PLAYING]

export class MockStateMachine extends StateMachineImpl<State> {
    constructor() {
        super(Object.values(states), validTransitions, states.PAUSED)
    }
    /**
     * start the content
     */
    @checkStateIn([states.STOPPED, states.PAUSED], "you can't launch a live in paused, backwarding, forwarding state")
    public play(video: HTMLMediaElement, currentTime: number): void {
        this.setState(states.PLAYING)
    }

    
}
