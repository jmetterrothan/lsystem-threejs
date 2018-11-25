import 'reset-css';
import './assets/sass/style.scss';

import data from './data';

import SceneWrapper from './SceneWrapper';
import LSystemState from './States/LSystemState';

const scene = new SceneWrapper();
const lsystemState = new LSystemState(scene);

scene.init();
scene.addState(lsystemState);

scene.start(0);

// ui

const $uiSelector = document.getElementById('uiLsystem');
const $uiParamIt = document.getElementById('uiParamIt');
const $uiParamAngle = document.getElementById('uiParamAngle');

// gather parameters and load the scene
const updateScene = () => {
    const n = parseInt($uiParamIt.value || 0, 10);
    const angle = parseInt($uiParamAngle.value || 0, 10);
    const funcName = $uiSelector.value;

    if (data[funcName]) {
        const object = lsystemState.create(funcName, n, angle);

        lsystemState.wrapper.clean();
        lsystemState.scene.add(object);
    }
};

// trigger ui object selector manually
const selectObject = (i) => {
    $uiSelector.value = $uiSelector[i].value;
    $uiSelector.dispatchEvent(new Event('change'));
}

// listeners
$uiSelector.addEventListener('change', () => {
    const funcName = $uiSelector.value;
    const funcData = data[funcName];

    $uiParamIt.value = funcData.default.n;
    $uiParamAngle.value = funcData.default.angle;

    updateScene();
});
$uiParamIt.addEventListener('input', () => updateScene());
$uiParamAngle.addEventListener('input', () => updateScene());

selectObject(1);