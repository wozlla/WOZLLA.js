module WOZLLA.layout {

    export class LayoutBase extends Behaviour {

        private _layoutRequired:boolean = true;

        init():void {
            super.init();
            this.gameObject.addListenerScope('childadd', this.onChildAdd, this);
            this.gameObject.addListenerScope('childremove', this.onChildRemove, this);
            this.requestLayout();
        }

        destroy():void {
            this.gameObject.removeListenerScope('childadd', this.onChildAdd, this);
            this.gameObject.removeListenerScope('childremove', this.onChildRemove, this);
            super.destroy();
        }

        doLayout():void {
        }

        requestLayout() {
            this._layoutRequired = true;
        }

        update() {
            if(this._layoutRequired) {
                this._layoutRequired = false;
                this.doLayout();
            }
        }

        protected onChildAdd(e) {
            this.requestLayout();
        }

        protected onChildRemove(e) {
            alert('remove');
            this.requestLayout();
        }

    }

}