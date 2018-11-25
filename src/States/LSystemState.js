import * as THREE from 'three';

import State from './State';
import Utility from '../utility';

import data from '../data';

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

    create(n, angle) {
        const sequence = this.generate(n);
        const geometry = new THREE.Geometry();

        let position = new THREE.Vector3();

        const xAxis = new THREE.Vector3(1, 0, 0);
        const yAxis = new THREE.Vector3(0, 1, 0);
        const zAxis = new THREE.Vector3(0, 0, 1);

        const charTest = /[A-Z0-9]/;

        sequence.split('').forEach(s => {
            if (s.match(charTest)) {
                const newpos = position.clone().add(new THREE.Vector3(1, 0, 0));

                geometry.vertices.push(position);
                geometry.vertices.push(newpos);

                position = newpos;
            }
            else {
                const rad = Utility.degToRad(angle);

                switch(s) {
                    case '-':
                        position.applyAxisAngle(zAxis, -rad).add(new THREE.Vector3(1, 0, 0));
                        break;
                    case '+':
                        position.applyAxisAngle(zAxis, rad).add(new THREE.Vector3(1, 0, 0));
                        break;
                    case '<':
                        position.applyAxisAngle(xAxis, -rad);
                        break;
                    case '>':
                        position.applyAxisAngle(xAxis, rad);
                        break;
                    case '^':
                        position.applyAxisAngle(yAxis, -rad);
                        break;
                    case '&':
                        position.applyAxisAngle(yAxis, rad);
                        break;
                }
            }
        });


        const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: 0x000000
        }));
        line.shouldBeDeletedOnCleanUp = true;
        return line;
    }
}

export default class LSystemState extends State
{
    init() {
        //this.wrapper.createAxesHelper(0.5);
        this.wrapper.camera.position.set(0, 0, -15);

        // skybox
        const geometry = new THREE.BoxGeometry(1000, 1000, 1000, 1, 1, 1, null, true);
        const material = new THREE.MeshBasicMaterial( {color: 0x7b9ba6, side: THREE.BackSide} );
        this.scene.add(new THREE.Mesh(geometry, material));

        // lights
        {
            const light = new THREE.HemisphereLight(0x3a6aa0, 0x9eb7f1, 0.65);
            light.position.set(0, 0, 0);
            this.scene.add(light);
        }
        {
            const light = new THREE.DirectionalLight(0xffffff, 0.35);
            light.position.set(0, 10, 5);
            this.scene.add(light);
        }

        this.scene.fog = new THREE.Fog(0xb1d8ff, 0, 500);
    }

    create(name, n, angle) {
        if (typeof data[name] !== 'object') {
            throw new Error('Invalid function name');
        }
    
        const lsys = new LSystem(data[name].variables, data[name].axiom, data[name].rules);
        return lsys.create(n, angle);
    }
}