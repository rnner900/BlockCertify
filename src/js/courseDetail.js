$(window).on('onContractReady', function (e) {
    let searchParams = new URLSearchParams(window.location.search);
    let courseId = 0;

    if (searchParams.has('courseId')) {
        courseId = searchParams.get('courseId');
        App.getCourse(courseId).then(function (course) {
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
                var participantHtml = '<li class="list-group-item"><small>' + participant + '</small></li>';
                parent.append(participantHtml);
            });
        }
    }

    //////// EVENTS: //////// 
    
    $('#issueCertificates-button').click(function() {
        window.location.href = './certificateIssue.html?courseId=' + courseId;
    });

    $('#submit').click(function() {
        try {
            console.log(newParticipants);

            let requests = newParticipants.map((participant) => {
                return new Promise((resolve) => {
                    App.addParticipant(courseId, participant).then(() =>{
                        resolve();
                    });
                });
            })
            
            Promise.all(requests);

        }
        catch(e) {
            console.log(e);
            return;
        }

    });

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
});