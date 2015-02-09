/// <reference path="../utils/Assert.ts" />
module WOZLLA.dnd {

    export class DnDManager {

        private static instance:DnDManager;

        public static getInstance():DnDManager {
            if(!DnDManager.instance) {
                DnDManager.instance = new DnDManager();
            }
            return DnDManager.instance;
        }

        _sourceMap:any = {};
        _targetMap:any = {};


        public registerSource(source:WOZLLA.GameObject, dragHandler:DragHandler):void {
            Assert.isUndefined(this._sourceMap[source.UID]);
            var wrapper = new SourceWrapper(source, dragHandler, this);
            wrapper.init();
            this._sourceMap[source.UID] = wrapper;
        }

        public unregisterSource(source:WOZLLA.GameObject, dragHandler:DragHandler):void {
            var wrapper = this._sourceMap[source.UID];
            Assert.isNotUndefined(wrapper);
            wrapper.destroy();
            delete this._sourceMap[source.UID];
        }

        public registerTarget(target:WOZLLA.GameObject, dropHandler:DropHandler):void {
            Assert.isUndefined(this._targetMap[target.UID]);
            this._targetMap[target.UID] = new TargetWrapper(target, dropHandler);
        }

        public unregisterTarget(target:WOZLLA.GameObject, dropHandler:DropHandler):void {
            var targetWrapper = this._targetMap[target.UID];
            Assert.isNotUndefined(targetWrapper);
            Assert.isTrue(targetWrapper.dropHandler === dropHandler);
            delete this._targetMap[target.UID];
        }

    }

    class SourceWrapper {

        dragEvent:DnDDragEvent;
        draggedObject:WOZLLA.GameObject;
        draggingStart:boolean = false;
        attactedObject = null;
        draggedObjectOriginPoint = {x: 0, y: 0};

        constructor(public source:WOZLLA.GameObject, public dragHandler:DragHandler, public dndManager:DnDManager) {}

        init() {
            this.source.addListenerScope('panstart', this.onPanStart, this);
            this.source.addListenerScope('panmove', this.onPanMove, this);
            this.source.addListenerScope('panend', this.onPanEnd, this);
            this.source.addListenerScope('pancancel', this.onPanCancel, this);
        }

        destroy() {
            this.source.removeListenerScope('panstart', this.onPanStart, this);
            this.source.removeListenerScope('panmove', this.onPanMove, this);
            this.source.removeListenerScope('panend', this.onPanEnd, this);
            this.source.removeListenerScope('pancancel', this.onPanCancel, this);
        }

        updateDraggedObjectPosition(gestureEvent:GestureEvent) {
            var dragStartGesture = this.dragEvent.gestureEvent;
            var startX = dragStartGesture.x;
            var startY = dragStartGesture.y;
            var deltaX = gestureEvent.x - startX;
            var deltaY = gestureEvent.y - startY;
            this.draggedObject.transform.x = this.draggedObjectOriginPoint.x + deltaX;
            this.draggedObject.transform.y = this.draggedObjectOriginPoint.y + deltaY;
        }

        onPanStart(e:GestureEvent) {
            var dragEvent = new DnDDragEvent(e, this.source);
            if(this.dragHandler.canStartDragging(this.dragEvent)) {
               this.dragEvent = dragEvent;
                this.draggedObject = this.dragHandler.createDraggedObject(dragEvent);
                this.draggedObjectOriginPoint.x = this.draggedObject.transform.x;
                this.draggedObjectOriginPoint.y = this.draggedObject.transform.y;
                this.updateDraggedObjectPosition(e);
                this.attactedObject = this.dragHandler.startDragging(dragEvent);
                this.draggingStart = true;
            }
        }

        onPanMove(e:GestureEvent) {
            var targetMap;
            var key;
            var targetWrapper;
            var draggingEvent;
            if(this.draggingStart) {
                this.updateDraggedObjectPosition(e);
                targetMap = this.dndManager._targetMap;
                for(key in targetMap) {
                    targetWrapper = targetMap[key];
                    draggingEvent = new DnDDraggingEvent(e, targetWrapper.target, this.attactedObject);
                    targetWrapper.dragging(draggingEvent);
                }
            }
        }

        onPanEnd(e) {
            var targetMap;
            var key;
            var targetWrapper;
            var dropEvent;
            if(this.draggingStart) {
                targetMap = this.dndManager._targetMap;
                for(key in targetMap) {
                    targetWrapper = targetMap[key];
                    dropEvent = new DnDDropEvent(e, targetWrapper.target, this.attactedObject);
                    targetWrapper.drop(dropEvent);
                    this.dragHandler.dragDropEnd();
                    this.onDragDropEnd();
                }
            }
        }

        onPanCancel(e) {
            this.dragHandler.dragDropEnd();
            this.onDragDropEnd();
        }

        onDragDropEnd() {
            this.dragEvent = null;
            this.draggedObject.destroy();
            this.draggedObject.removeMe();
            this.draggedObject = null;
            this.draggingStart = false;
            this.attactedObject = null;
        }

    }

    class TargetWrapper {

        dropPossible:boolean = false;

        constructor(public target:WOZLLA.GameObject, public dropHandler:DropHandler) {}

        public dragging(event:DnDDraggingEvent) {
            this.dropHandler.dragging(event);
            this.dropPossible = event.isDropPossible();
        }

        public drop(event:DnDDropEvent) {
            if(this.dropPossible) {
                this.dropHandler.drop(event);
            }
        }
    }

}