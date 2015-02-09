/// <reference path="../event/Event" />
module WOZLLA.dnd {

    export class DnDEvent extends WOZLLA.event.Event {

        get gestureEvent():GestureEvent {
            return this._gestureEvent;
        }

        get screenX():number {
            return this._gestureEvent.x;
        }

        get screenY():number{
            return this._gestureEvent.y;
        }

        _gestureEvent:GestureEvent;

        constructor(type:string, gestureEvent:GestureEvent) {
            super(type, false)
            this._gestureEvent = gestureEvent;
        }

    }

    export class DnDDragEvent extends DnDEvent {

        public static TYPE = 'drag';

        get source():WOZLLA.GameObject {
            return this._source;
        }

        _source:WOZLLA.GameObject;

        constructor(gestureEvent:GestureEvent, source:WOZLLA.GameObject) {
            super(DnDDragEvent.TYPE, gestureEvent);
        }

    }

    export class DnDDraggingEvent extends DnDEvent {

        public static TYPE = 'dragging';

        get attachedObject():any {
            return this._attachedObject;
        }

        get target():WOZLLA.GameObject {
            return this._target;
        }

        _target:WOZLLA.GameObject;
        _attachedObject:any = null;
        _dropPossible:boolean = false;

        constructor(gestureEvent:GestureEvent, target:WOZLLA.GameObject, attachedObject:any) {
            super(DnDDraggingEvent.TYPE, gestureEvent);
            this._target = target;
            this._attachedObject = attachedObject;
        }

        isDropPossible():boolean {
            return this._dropPossible;
        }

        setDropPossible(possible:boolean):void {
            this._dropPossible = possible;
        }

    }

    export class DnDDropEvent extends  DnDEvent {

        public static TYPE = 'drop';

        get attachedObject():any {
            return this._attachedObject;
        }

        get target():WOZLLA.GameObject {
            return this._target;
        }

        _attachedObject:any;
        _target:WOZLLA.GameObject;

        constructor(gestureEvent:GestureEvent, target:WOZLLA.GameObject, attachedObject:any) {
            super(DnDDraggingEvent.TYPE, gestureEvent);
            this._target = target;
            this._attachedObject = attachedObject;
        }
    }

}