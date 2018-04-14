export default class Options {
    render() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Options');
        modal.find('.modal-body').html('<p>To delete all your goals, current and completed, press the button below. ' +
                'This is irreversible.</p>');

        let footer = modal.find('.modal-footer').empty();

        let deleteGoalsButton = $('<button class="btn btn-danger" data-dismiss="modal">Delete Goals</button>');
        footer.append(deleteGoalsButton);

        deleteGoalsButton.on('click', event => {
            localStorage.removeItem('user');
        });

        modal.modal();
    }
}

