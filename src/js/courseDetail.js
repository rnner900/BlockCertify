$(window).on('onContractReady', async function (e) {
    let searchParams = new URLSearchParams(window.location.search);
    let courseId = 0;

    if (searchParams.has('courseId')) {
        courseId = searchParams.get('courseId');
        const course = await App.getCourse(courseId);

        if (course) {
            render(course);

            const participants = await App.getCourseParticipants(courseId);
            renderParticipants(participants, course.issuer);
        }
    }

    function render(course) {
        console.log(course);
        $('#course-headline').html('Course ' + course.title + ' #' + course.id);
        $('#course-title-input').attr('placeholder', course.title);
        $('#course-issuer-input').attr('placeholder', course.issuer);
        $('#course-transaction-input').attr('placeholder', course.transaction);
        if(course.issuer.toUpperCase() != App.account.toUpperCase()){
            $('#participant-add').hide();
            $('#participant-save-button').hide();
            $('#issueCertificates-button').hide();
        }

        console.log(course.certificated);
        var checkmark = (course.certificated == true) ? '&#10003;' : '&#10005;';
        $('#course-certificated').html(checkmark);
    }

    //////// EVENTS: //////// 
    
    $('#participant-save-button').click(function() {
        submitParticipantList(courseId);
    });

    $('#issueCertificates-button').click(function() {
        window.location.href = './certificateIssue.html?courseId=' + courseId;
    });
});