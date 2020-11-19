$(window).on('onContractReady', async function (e) {
    $(".table").on("click", "tr[role=\"button\"]", function (e) {
        window.location = $(this).data("href");
    });

    try {
        let searchParams = new URLSearchParams(window.location.search);
        var issuerAddress = App.account;
        if (searchParams.has('issuerAddress')) {
            issuerAddress = searchParams.get('issuerAddress');
        }
        var courses = await App.getIssuerCourses(issuerAddress);
        render(courses);
    }
    catch (e) {
        console.warn(e);
    }

    function render(courses)  {
        var parent = $('#course-list-parent');
        
        courses.forEach(async function (course) {
            var isCertificated = await App.isCourseCertificated(course.id);
            var checkmark = (course.isCertificated == 'true') ? '&#10003;' : '&#10005;';
            var courseHtml = 
            '<tr role="button" data-href="courseDetail.html?issuerAddress=' + course[2] +'&courseId=' + course[0] + '">' +
                '<th scope="row">' + course[0] + '</th>' +
                '<td>' + course[1] + '</td>' +
                '<td>' + course[2] + '</td>' +
                '<td>' + checkmark + '</td>' +
            '</tr>';
            parent.append(courseHtml);
        });
    }
});