$(window).on('onContractReady', function (e) {
    console.log("read");
    let searchParams = new URLSearchParams(window.location.search);
    let courseId = 0;

    if (searchParams.has('courseId')) {
        courseId = searchParams.get('courseId');
        App.getIssuerCourseById(App.account, courseId).then(function (course) {
            if (course) {
                course = { id: course[0], title: course[1], issuer : course[2], transaction : '0x923443122' };
                render(course);
            }
        })

        App.getCourseParticipants(courseId).then(function (participants) {
            console.log(participants);
            renderParticipants(participants);
        });
    }

    var newParticipants = [];

    
    function render(course) {
        $('#course-headline').html('Course ' + course.title + ' #' + course.id);
        $('#course-title-input').attr('placeholder', course.title);
        $('#course-issuer-input').attr('placeholder', course.issuer);
        $('#course-transaction-input').attr('placeholder', course.transaction);
    }

    function renderParticipants(participants) {
        let parent = $('#course-participant-list');

        if (participants) {
            participants.forEach(participant => {
                var participantHtml = '<li class="list-group-item">' + participant + '</li>';
                parent.append(participantHtml);
            });
        }
    }

    //////// EVENTS: //////// 
    $('#submit').click(async function() {
        try {
            newParticipants.forEach(async function(participant) {
                await App.addParticipant(courseId, participant);
            });
        }
        catch(e) {
            console.log(e);
            return;
        }

        // window.location.href = './certificateIssue.html?courseId=' + courseId;
    });

    $('#participant-add-button').click(function() {
        console.log("click");
        var participant = $('#participant-add-input').val();
        newParticipants.unshift(participant);

        let parent = $('#course-participant-list');

        var participantHtml = 
        '<li class="list-group-item">' + 
            '<span class="participant">' + participant + '</span>' +
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