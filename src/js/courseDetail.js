App.ready(function() {
    let searchParams = new URLSearchParams(window.location.search);
    let courseId = 0;

    if (searchParams.has('courseId')) {
        courseId = searchParams.get('courseId');
        App.getIssuerCourseById(App.account, courseId).then(function (course) {
            console.log(course);
        });
    }
    

    var course = { id: courseId, title: 'Web Development III', issuer : '0x12399239', transaction : '0x923443122' };
    var participants = [
        '0x09324890901230908923423432',
        '0x09324890901230908923423433',
        '0x09324890901230908923423434',
        '0x09324890901230908923423435',
        '0x09324890901230908923423436',
        '0x09324890901230908923423437',
        '0x09324890901230908923423438',
        '0x09324890901230908923423439',
    ];

    var newParticipants = [];

    render(course);
    renderParticipants(participants);

    function render(course) {
        let certifiateIssueUrl = $('#certificate-issue-button').attr('href') + course.id;
        console.log(certifiateIssueUrl);
        $('#certificate-issue-button').attr('href', certifiateIssueUrl);

        $('#course-headline').html('Course ' + course.title + ' #' + course.id);
        $('#course-title-input').attr('placeholder', course.title);
        $('#course-issuer-input').attr('placeholder', course.issuer);
        $('#course-transaction-input').attr('placeholder', course.transaction);
    }

    function renderParticipants(participants) {
        let parent = $('#course-participant-list');

        participants.forEach(participant => {
            var participantHtml = '<li class="list-group-item">' + participant + '</li>';
            parent.append(participantHtml);
        });
    }

    //////// EVENTS: //////// 
    $('#participant-add-button').click(function() {
        console.log("click");
        $('#participant-save-button').removeClass('d-none');
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

        // hide save button if the are no items added
        if (newParticipants.length == 0) {
            $('#participant-save-button').addClass('d-none');
        }
    })
});