import { fsm } from 'typescript-state-machine'
import State = fsm.State
import StateMachineImpl = fsm.StateMachineImpl
import Transitions = fsm.Transitions
import checkStateIn = fsm.CheckStateIn


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

export class MockStateMachine extends StateMachineImpl<State> {
    constructor() {
        super(Object.values(states), validTransitions, states.PAUSED)
    }
    /**
     * start the content
     */
    @checkStateIn([states.STOPPED, states.PAUSED, states.BACKWARDING, states.FASTFORWARDING], "you can't launch content in playing state")
    public play(video: HTMLMediaElement): void {
        this.setState(states.PLAYING)
    }

    /**
     * Stop the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't stop content in stopped state")
    public stop(video: HTMLMediaElement): void {   
        this.setState(states.STOPPED)
       
    }
    /**
     * pause the content
     */
    @checkStateIn([states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't pause content in stopped/paused state")
    public pause(video: HTMLMediaElement): void {
        this.setState(states.PAUSED)
    }

    /**
     * Fast forward the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't fast forward content in stopped state")
    public fastForward(video: HTMLMediaElement, speed: number): void {
        this.setState(states.FASTFORWARDING)   
    }

    /**
     * Backward the content
     */
    @checkStateIn([states.PAUSED, states.BACKWARDING, states.FASTFORWARDING, states.PLAYING], "you can't rewind content in stopped state")
    public backward(video: HTMLMediaElement, speed: number): void {
        this.setState(states.BACKWARDING)   
    }
    /**
     * Jump on the content
     */
    @checkStateIn([states.PAUSED, states.PLAYING], "you can't jumpBackward content in stopped/Forwarding/backwarding state")
    public jumpBackwardTime(video: HTMLMediaElement, position: number): void {
      
    }
    /**
     * Jump on the content
     */
    @checkStateIn([states.PAUSED, states.PLAYING], "you can't jumpForward content in stopped/Forwarding/backwarding state")
    public jumpForwardTime(video: HTMLMediaElement, position: number): void {
        
    }



}
