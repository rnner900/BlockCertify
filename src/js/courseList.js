$( document ).ready(function() {
    $(".table").on("click", "tr[role=\"button\"]", function (e) {
        window.location = $(this).data("href");
    });

    var courseList = [
        {id:10, title:'History',issuer:'0x234233', certifiated: 'true'},
        {id:11, title:'Physics I',issuer:'0x234233', certifiated: 'true'},
        {id:12, title:'Analysis II',issuer:'0x234233', certifiated: 'false'},
        {id:13, title:'Media Design',issuer:'0x234233', certifiated: 'true'},
    ];

    render(courseList);

    function render(courseList)  {
        var parent = $('#course-list-parent');
        
        courseList.forEach(course => {
            var certificated = (course.certifiated == 'true') ? '&#10003;' : '&#10005;';
            var courseHtml = 
            '<tr role="button" data-href="courseDetail.html?courseId=' + course.id + '">' +
                '<th scope="row">' + course.id + '</th>' +
                '<td>' + course.title + '</td>' +
                '<td>' + course.issuer + '</td>' +
                '<td>' + certificated + '</td>' +
            '</tr>';
            parent.append(courseHtml);
        });
    }
});