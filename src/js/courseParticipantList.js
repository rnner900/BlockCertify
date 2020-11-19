
var newParticipants = [];

async function submitParticipantList(courseId) {
    try {
        console.log(newParticipants);

        let requests = newParticipants.map((participant) => {
            return new Promise((resolve) => {
                App.addParticipant(courseId, participant).then(() =>{
                    resolve();
                });
            });
        })
        
        return Promise.all(requests);
    }
    catch(e) {
        console.log(e);
        return;
    }
}

$('#participant-add-button').click(function() {
    var participant = $('#participant-add-input').val();
    newParticipants.unshift(participant);

    $('#participant-add-input').val("");

    let parent = $('#course-participant-list');

    var participantHtml = 
    '<li class="list-group-item">' + 
        '<small class="participant">' + participant + '</small>' +
        '<button type="button" class="participant-remove-button close" value="' + participant +'" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
        '</button>' +
    '</li>';
    
    parent.prepend(participantHtml);
});

$('body').on('click', '.participant-remove-button', function() {
    var participant = $(this).val();

    // remove participant from list
    const index = newParticipants.indexOf(participant);
    if (index > -1) {
        newParticipants.splice(index, 1);
    }

    // remove html item
    $(this).parent().remove();
})