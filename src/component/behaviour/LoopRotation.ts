/// <reference path="../../utils/Tween.ts"/>
/// <reference path="../../core/Behaviour.ts"/>
module WOZLLA.component {

    export class LoopRotation extends Behaviour {

        public reverse:boolean = false;
        public speed:number = 1.0;

        update():void {
            var reverse = this.reverse ? -1 : 1;
            var speed = this.speed;
            this.transform.rotation += speed/Time.delta * reverse;
        }

    }

    Component.register(LoopRotation, {
        name: "LoopRotation",
        properties: [{
            name: 'reverse',
            type: 'boolean',
            defaultValue: false
        }, {
            name: 'speed',
            type: 'number',
            defaultValue: 1.0
        }]
    });

}