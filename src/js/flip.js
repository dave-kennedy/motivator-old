$(document).on('click', '[data-toggle="flip"]', event => {
    $(event.currentTarget).flip();
});

$.fn.flip = function (callback) {
    return this.each(() => {
        $(this).children().toggleClass('flip-down flip-up');

        if (typeof callback == 'function') {
            $(this).one('transitionend', event => {
                callback.call(this, this);
            });
        }
    });
};

