export default class Options {
    render() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Options');
        modal.find('.modal-footer').empty();

        let body = modal.find('.modal-body').empty();

        let deleteGoalsButton = $('<button class="btn btn-danger" data-dismiss="modal">Delete Goals</button>');
        body.append('<p>To delete all your goals, current and completed, press the button below. This is irreversible.</p>',
                $('<p></p>').append(deleteGoalsButton));

        deleteGoalsButton.on('click', event => {
            $(document).trigger('options.deleteGoals');
        });

        modal.modal();
    }
}

