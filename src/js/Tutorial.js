export default class Tutorial {
    render1() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Step 1: Add a goal');
        modal.find('.modal-body').html('<p>To add a goal, press the plus sign in the bottom right corner.</p>');

        let footer = modal.find('.modal-footer').empty();
        $('<button class="btn btn-primary">Next</button>').appendTo(footer).on('click', () => this.render2());

        modal.modal();
    }

    render2() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Step 2: Complete a goal');
        modal.find('.modal-body').html('<p>To complete a goal, press the circle icon to the left of its name.</p>');

        let footer = modal.find('.modal-footer').empty();
        $('<button class="btn btn-primary mr-auto">Previous</button>').appendTo(footer).on('click', () => this.render1());
        $('<button class="btn btn-primary">Next</button>').appendTo(footer).on('click', () => this.render3());

        modal.modal();
    }

    render3() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Step 3: Reward yourself');
        modal.find('.modal-body').html('<p>To see the rewards you\'ve earned, open the menu in the top left corner, ' +
                'then press the history icon.</p>');

        let footer = modal.find('.modal-footer').empty();
        $('<button class="btn btn-primary mr-auto">Previous</button>').appendTo(footer).on('click', () => this.render2());

        modal.modal();
    }
}

