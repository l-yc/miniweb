let item = `
    <div class="row">
        <input type="text" name="score" value="0" readonly>
        <input type="text" name="name" placeholder="Task (e.g. code a todo list app)">
        <input type="date" name="date" placeholder="Due (Click to select)">
        <input type="text" name="priority" placeholder="Priority">
        <!--<div class="button">X</div>-->
        <input class="remove-item" type="button" value="X">
    </div>
`;

function score(date, priority) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round((date - new Date()) / oneDay);
    return priority - diffDays * Math.abs(diffDays);
}

function recalc(elem) {
    let date = new Date(elem.children('input[name="date"]').val()) || new Date();
    let priority = parseInt(elem.children('input[name="priority"]').val()) || 0;
    console.log(date, priority);
    elem.children('input[name="score"]').val(score(date, priority));
}

$(() => {
    //$('input[name="date"]').datepicker();

    $('.list').on('click', '.remove-item', e => {
        $(e.target).parent().remove();
    });
    $('.list').on('change', 'input[name="date"], input[name="priority"]', e => {
        recalc($(e.target).parent());
    });

    $('.add-item').click(e => {
        $('.list').append(item);
    });

    $('.sort-by-score').click(e => {
        let list = $('.list');
        var listitems = list.children().get();
        listitems.sort(function(a, b) {
            var compA = parseInt($(a).children('input[name="score"]').val());
            var compB = parseInt($(b).children('input[name="score"]').val());
            return (compA < compB) ? 1 : (compA > compB) ? -1 : 0;
        })
        $(list).append(listitems);
    });

});
