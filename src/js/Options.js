export default class Options {
    render() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Options');
        modal.find('.modal-footer').empty();

        let body = modal.find('.modal-body').empty();

        let clearDataButton = $('<button class="btn btn-danger" data-dismiss="modal">Clear data</button>');
        body.append('<p>To delete all your data, press the button below. This is irreversible.</p>',
                $('<p></p>').append(clearDataButton));

        clearDataButton.on('click', () => $(document).trigger('options.clearData'));

        modal.modal();
    }
}

