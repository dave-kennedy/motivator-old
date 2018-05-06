export default class Options {
    render() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Options');
        modal.find('.modal-footer').empty();

        let body = modal.find('.modal-body').html('<p>To delete all your data, press the button below. This is irreversible.</p>');
        $('<button class="btn btn-danger" data-dismiss="modal">Clear data</button>').appendTo(body).on('click', () => $(document).trigger('options.clearData'));

        modal.modal();
    }
}

