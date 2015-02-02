/// <reference path="Time.ts"/>
module WOZLLA {

    /**
     * @class WOZLLA.Scheduler
     * @singleton
     */
    export class Scheduler {

        private static instance;

        /**
         * @method {WOZLLA.Scheduler} getInstance
         * @static
         * @member WOZLLA.Scheduler
         */
        public static getInstance() {
            if(!Scheduler.instance) {
                Scheduler.instance = new Scheduler();
            }
            return Scheduler.instance;
        }

        private _scheduleCount = 0;
        private _lastSchedules;
        private _schedules:any = {};

        runSchedule() {
            var scheduleId, scheduleItem, schedules;
            var markScheduleCount = this._scheduleCount;
            if(this._lastSchedules) {
                for(scheduleId in this._schedules) {
                    this._lastSchedules[scheduleId] = this._schedules[scheduleId];
                }
            } else {
                this._lastSchedules = this._schedules;
            }
            this._schedules = {};
            schedules = this._lastSchedules;
            for(scheduleId in schedules) {
                scheduleItem = schedules[scheduleId];
                if(scheduleItem.isFrame && !scheduleItem.paused) {
                    scheduleItem.frame --;
                    if(scheduleItem.frame < 0) {
                        delete schedules[scheduleId];
                        scheduleItem.task.apply(scheduleItem, scheduleItem.args);
                    }
                }
                else if(scheduleItem.isTime && !scheduleItem.paused) {
                    scheduleItem.time -= Time.delta;
                    if(scheduleItem.time < 0) {
                        delete schedules[scheduleId];
                        scheduleItem.task.apply(scheduleItem, scheduleItem.args);
                    }
                }
                else if(scheduleItem.isInterval && !scheduleItem.paused) {
                    scheduleItem.time -= Time.delta;
                    if(scheduleItem.time < 0) {
                        scheduleItem.task.apply(scheduleItem, scheduleItem.args);
                        scheduleItem.time += scheduleItem.intervalTime;
                    }
                }
                else if(scheduleItem.isLoop && !scheduleItem.paused) {
                    scheduleItem.task.apply(scheduleItem, scheduleItem.args);
                }
            }
            if(markScheduleCount < this._scheduleCount) {
                this.runSchedule();
            }
        }

        /**
         * remove the specify schedule by id
         * @param id
         */
        removeSchedule(id) {
            delete this._schedules[id];
        }

        /**
         * schedule the task to each frame
         * @param task
         * @param args
         * @returns {string} schedule id
         */
        scheduleLoop(task, args?) {
            var scheduleId = 'Schedule_' + (this._scheduleCount++);
            this._schedules[scheduleId] = {
                task : task,
                args : args,
                isLoop : true
            };
            return scheduleId;
        }

        /**
         * schedule the task to the next speficied frame
         * @param task
         * @param {number} frame
         * @param args
         * @returns {string} schedule id
         */
        scheduleFrame(task, frame=0, args?) {
            var scheduleId = 'Schedule_' + (this._scheduleCount++);
            this._schedules[scheduleId] = {
                task : task,
                frame : frame,
                args : args,
                isFrame : true
            };
            return scheduleId
        }

        /**
         * schedule the task to internal, like setInterval
         * @param task
         * @param time
         * @param args
         * @returns {string} schedule id
         */
        scheduleInterval(task, time=0, args?) {
            var scheduleId = 'Schedule_' + (this._scheduleCount++);
            this._schedules[scheduleId] = {
                task : task,
                intervalTime : time,
                time : time,
                args : args,
                isInterval : true
            };
            return scheduleId
        }

        /**
         * schedule the task to time, like setTimeout
         * @param task
         * @param time
         * @param args
         * @returns {string} schedule id
         */
        scheduleTime(task, time=0, args?) {
            var scheduleId = 'Schedule_' + (this._scheduleCount++);
            time = time || 0;
            this._schedules[scheduleId] = {
                task : task,
                time : time,
                args : args,
                isTime : true
            };
            return scheduleId;
        }

        /**
         * resume the specified schedule
         * @param scheduleId
         */
        resumeSchedule(scheduleId) {
            this._schedules[scheduleId].paused = false;
        }

        /**
         * pause the specified schedule
         * @param scheduleId
         */
        pauseSchedule(scheduleId) {
            this._schedules[scheduleId].paused = true;
        }

    }

}