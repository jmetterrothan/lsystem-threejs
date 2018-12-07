import * as THREE from 'three';

class DrawStack 
{
    /**
     * @param {THREE.Vector3} position 
     * @param {number} direction 
     */
    constructor(position = new THREE.Vector3(), direction = 0) {
        this._position = position;
        this._direction = direction;

        this.stack = [];
    }

    /**
     * Save current state
     */
    push() {
        this.stack.push({
            position: this._position.clone(),
            direction: this._direction,
        });
    }

    /**
     * Retrieve last state
     */
    pop() {
        const state = this.stack.pop() || {};

        this._position = state.position;
        this._direction = state.direction;
    }

    size() {
        return this.stack.length;
    }
    /**
     * @return {THREE.Vector3} 
     */
    get position() { return this._position.clone(); }

    /**
     * @param {THREE.Vector3} position
     */   
    set position(position) { this._position = position; }
    
    /**
     * @return {number}
     */ 
    get direction() { return this._direction; }

    /**
     * @param {number} direction
     */ 
    set direction(direction) { this._direction = direction; }
}

export default DrawStack;