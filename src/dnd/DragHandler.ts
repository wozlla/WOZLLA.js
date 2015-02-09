module WOZLLA.dnd {

    export interface DragHandler {

        canStartDragging(event:DnDDragEvent):boolean;
        startDragging(event:DnDDragEvent):any;
        createDraggedObject(event:DnDDragEvent):WOZLLA.GameObject;
        dragDropEnd():void;

    }

}