import * as THREE from 'three';

import State from './State';
import LSystem from '../LSystem';

import data from '../data';

export default class LSystemState extends State
{
    init() {
        //this.wrapper.createAxesHelper(0.5);
        this.wrapper.camera.position.set(0, 0, -15);

        // skybox
        const geometry = new THREE.BoxGeometry(1000, 1000, 1000, 1, 1, 1);
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