'use strict';

var $ = require('jquery')
    , events = 'click touchmove touchend'
    , touchmove = 'touchmove'
    , touchend = 'touchend'
    , click = 'click';

var ClickOrTouch = function(selector, useLock, onEvent, acceptGesturesAsClick){

	if (typeof acceptGesturesAsClick != 'boolean')
		acceptGesturesAsClick = false;

    var self = this

        , handler = function(e){
            e.preventDefault();

            self.$target = $(e.currentTarget);
			
            /* ignore click/touch on scroll event */
            if (e.type == touchmove && !acceptGesturesAsClick){
                self.cancel = true;
                return true;
            } else if (e.type == touchend && self.cancel){
                self.cancel = false;
                return true;
            }

            /* locking prevents subsequent interaction being processed */
            if (useLock){
                if (self.lock)
                    return;
                self.lock = true;
            }

            /* ios tablet/phone will raise back-to-back touch and click events.
                ensure the second event is ignored. */
            var thisLast = self.last;
            self.last = e.type;
            if (thisLast == touchend && e.type == click ||
				thisLast == click && e.type == touchend){
					
				/* clear sequence tracking */
				self.last = null;

				return;
			}
			
			/* evaluate the core handler only on isolated click/touchend */
			onEvent.call(self, e);
        };

    if (useLock)
        self.lock = false;

    self.cancel = false;
    self.last = null;

    self.unbind = function(){
        $(document).off(events, selector, handler);
        return self;
    };

    $(document).on(events, selector, handler);
};

/** default behaviour is to unlock the event, but locking is optional via trueOrFalse */
ClickOrTouch.prototype.unlock = function(trueOrFalse){
    this.lock = (typeof trueOrFalse == 'boolean' ? !trueOrFalse : false);
    return this;
};



module.exports = ClickOrTouch;