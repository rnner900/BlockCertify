
var newParticipants = [];
var removeParticipants = [];

async function submitParticipantList(courseId) {
    try {
        if (newParticipants.length > 0) {
            console.log(newParticipants);
            await App.addCourseParticipants(courseId, newParticipants);
        }
        if (removeParticipants.length > 0) {
            console.log(removeParticipants);
            await App.removeCourseParticipants(courseId, removeParticipants);
        }
    }
    catch(e) {
        console.log(e);
        return;
    }
}

function renderParticipants(participants, issuer) {
    let parent = $('#course-participant-list');

    if (participants) {
        participants.forEach(participant => {
            var participantHtml = '<li class="list-group-item">' + participant;
            if(issuer.toUpperCase() == App.account.toUpperCase()){
                participantHtml += '<button type="button" class="participant-remove-button close" value="' + 
                participant +'" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' + '</button>';
            }
            participantHtml += '</li>';
            parent.append(participantHtml);
        });
    }
    $('#participant-header-amount').append(' ' + participants.length);
}

$('#participant-add-button').click(function() {
    var participant = $('#participant-add-input').val();

    $('#participant-add-input').val("");

    let parent = $('#course-participant-list');

    const index = removeParticipants.indexOf(participant);
    if (index > -1) {
        // remove participant from remove list
        removeParticipants.splice(index, 1);
    }
    else {
        // add participant to list
        newParticipants.push(participant);
    }

    var participantHtml = 
    '<li class="list-group-item">' + participant +
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
    else {
        removeParticipants.push(participant);
    }

    // remove html item
    $(this).parent().remove();
})
