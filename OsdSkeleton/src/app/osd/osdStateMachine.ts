import { fsm } from 'typescript-state-machine'
import State = fsm.State
import StateMachineImpl = fsm.StateMachineImpl
import Transitions = fsm.Transitions
import {states} from '../utils/constants'
/**
* All vaild transitions
*/
const validTransitions: Transitions<State> = {}
validTransitions[states.STOPPED.label] = [states.PLAYING, states.PAUSED, states.FASTFORWARDING, states.STOPPED, states.BACKWARDING]
validTransitions[states.PLAYING.label] = [states.PLAYING, states.PAUSED, states.FASTFORWARDING, states.STOPPED, states.BACKWARDING]
validTransitions[states.PAUSED.label] = [states.PLAYING, states.PAUSED, states.FASTFORWARDING, states.STOPPED, states.BACKWARDING]
validTransitions[states.BACKWARDING.label] = [states.PLAYING, states.PAUSED, states.FASTFORWARDING, states.STOPPED, states.BACKWARDING]
validTransitions[states.FASTFORWARDING.label] = [states.PLAYING, states.PAUSED, states.FASTFORWARDING, states.STOPPED, states.BACKWARDING]

export class StateMachine extends StateMachineImpl<State> {
    private interval: any
    constructor(state: State) {
        super(Object.values(states), validTransitions, state)
    } 
}
