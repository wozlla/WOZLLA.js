module WOZLLA.dnd {

    export interface DropHandler {

        dragging(event:DnDDraggingEvent);

        drop(event:DnDDropEvent);

    }

}