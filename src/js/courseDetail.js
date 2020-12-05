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
            App.getCourseParticipants(courseId).then(function (participants) {
                console.log(participants);
                renderParticipants(participants, course.issuer);
            });
        })

        
    }

    function render(course) {
        $('#course-headline').html('Course ' + course.title + ' #' + course.id);
        $('#course-title-input').attr('placeholder', course.title);
        $('#course-issuer-input').attr('placeholder', course.issuer);
        $('#course-transaction-input').attr('placeholder', course.transaction);
        if(course.issuer.toUpperCase() != App.account.toUpperCase()){
            $('#participant-add').hide();
            $('#participant-save-button').hide();
            $('#issueCertificates-button').hide();
        }
    }

    //////// EVENTS: //////// 
    
    $('#participant-save-button').click(function() {
        submitParticipantList(courseId);
    });

    $('#issueCertificates-button').click(function() {
        window.location.href = './certificateIssue.html?courseId=' + courseId;
    });
});