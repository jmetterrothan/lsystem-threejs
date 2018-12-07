import * as THREE from 'three';

import DrawStack from './DrawStack';
import Utility from './utility';
class LSystem
{
    /**
     * LSystem
     * @param {string} variables Alphabet 
     * @param {string} constants List of variables that cannot be changed 
     * @param {string} axiom Initiator sequence
     * @param {Array} rules List of rules as strings with input and output separated with ":"
     */
    constructor(variables, axiom, rules) {
        this.variables = variables && variables.trim().toUpperCase().split('');
        this.axiom = axiom.trim().toUpperCase();

        this.rules = {};
        rules.forEach(rule => {
            const [A, B] = rule.trim().toUpperCase().split(':');
            if (A && B) {
                this.rules[A.trim().charAt(0)] = B.trim();
            }
        });
    }

    /**
     * Generate a sequence with the grammar rules
     * @param {number} n Total number of iterations
     * @param {string} input Generated phrase at current step
     * @param {number} it Current iteration
     */
    generate(n, input = this.axiom, it = 0) {
        if (it === n) {
            return input;
        }

        let str = input.split('').map(s => {
            if (!this.rules[s]) {
                return s;
            }
            return this.rules[s];
        }).join('');


        return this.generate(n, str, ++it);
    }

    create(n, angle, color = 0x000000) {
        const stack = new DrawStack();
        const sequence = this.generate(n);
        const geometry = new THREE.Geometry();

        const charTest = /[A-Z0-9]/;

        sequence.split('').forEach(s => {
            // letters/numbers only
            if (s.match(charTest)) {
                const position = stack.position;
                const direction = Utility.degToRad(stack.direction);

                const rotation = new THREE.Vector3(Math.cos(direction), Math.sin(direction), 0);
                const next = position.clone().add(rotation);

                geometry.vertices.push(position, next);
                stack.position = next;
            }
            // draw instructions
            else {
                switch(s) {
                    case '-':
                        stack.direction -= angle;
                        break;
                    case '+':
                        stack.direction += angle;
                        break;
                    case '[':
                        stack.push();
                        break;
                    case ']':
                        stack.pop();
                        break;
                }
            }
        });

        const material = new THREE.LineBasicMaterial({ color: color });
        const line = new THREE.LineSegments(geometry, material);
        line.shouldBeDeletedOnCleanUp = true;

        return line;
    }
}

export default LSystem;