
$( document ).ready(function() {
    var newParticipants = [];

    $( "#course-participant-add" ).click(function() {
        alert( "Handler for .click() called." );
    });

    //////// EVENTS: //////// 
    $('#submit').click(async function() {
        var title = $('#course-title-input').val();
        try {
            await App.addCourse(title);

            var courseCount = await App.getCourseCount();

            newParticipants.forEach(async function(participant) {
                await App.addParticipant(courseCount-1, participant);
            });

            window.location.href = './courseDetail.html?issuerAddress=' + String(App.account) + '&courseId=' + String(courseCount-1);
        }
        catch(e) {
            console.warn(e);
        }
    });

    $('#participant-add-button').click(function() {
        
        console.log("submit");
        var participant = $('#participant-add-input').val();
        newParticipants.unshift(participant);

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
});