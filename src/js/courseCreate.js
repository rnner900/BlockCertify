$(window).on('onContractReady', function (e) {
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
            
            await submitParticipantList(courseCount-1);

            window.location.href = './courseDetail.html?issuerAddress=' + String(App.account) + '&courseId=' + String(courseCount-1);
        }
        catch(e) {
            console.warn(e);
        }
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