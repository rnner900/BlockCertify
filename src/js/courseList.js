$(window).on('onContractReady', async function (e) {
    $(".table").on("click", "tr[role=\"button\"]", function (e) {
        window.location = $(this).data("href");
    });

    try {
        let searchParams = new URLSearchParams(window.location.search);
        var address = App.account;
        if (searchParams.has('address')) {
            address = searchParams.get('address');
        }
        var issuerCourses = await App.getIssuerCourses(address);
        var issuerParent = $('#issuer-course-list-parent');
        render(issuerParent, issuerCourses);

        var participantCourses = await App.getParticipantCourses(address);
        var participantParent = $('#participant-course-list-parent');
        render(participantParent, participantCourses);
    }
    catch (e) {
        console.warn(e);
    }

    function render(parent, courses)  {
        courses.forEach(async function (course) {
            var isCertificated = course.certificated;
            var checkmark = (isCertificated == true) ? '&#10003;' : '&#10005;';
            var courseHtml = 
            '<tr role="button" data-href="courseDetail.html?courseId=' + course.id + '">' +
                '<th scope="row">' + course.id + '</th>' +
                '<td>' + course.title + '</td>' +
                '<td>' + course.issuer + '</td>' +
                '<td>' + checkmark + '</td>' +
            '</tr>';
            parent.append(courseHtml);
        });
    }
});