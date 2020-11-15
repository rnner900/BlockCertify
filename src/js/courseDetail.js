$( document ).ready(function() {
    let searchParams = new URLSearchParams(window.location.search);
    let courseId = 0;

    if (searchParams.has('courseId')) {
        courseId = searchParams.get('courseId');
    }

    var course = { courseId: courseId, title: 'Web Development III', issuer : '0x12399239', transaction : '0x923443122' };
    var recipients = [
        '0x09324890901230908923423432',
        '0x09324890901230908923423433',
        '0x09324890901230908923423434',
        '0x09324890901230908923423435',
        '0x09324890901230908923423436',
        '0x09324890901230908923423437',
        '0x09324890901230908923423438',
        '0x09324890901230908923423439',
    ];

    var newRecipients = [];

    render(course);
    renderRecipients(recipients);

    function render(course) {
        let certifiateIssueUrl = $('#certificate-issue-button').attr('href') + courseId;
        console.log(certifiateIssueUrl);
        $('#certificate-issue-button').attr('href', certifiateIssueUrl);

        $('#course-headline').html('Course ' + course.title);
        $('#course-title-input').attr('placeholder', course.title);
        $('#course-issuer-input').attr('placeholder', course.issuer);
        $('#course-transaction-input').attr('placeholder', course.transaction);
    }

    function renderRecipients(recipients) {
        let parent = $('#course-recipient-list');

        recipients.forEach(recipient => {
            var recipientHtml = '<li class="list-group-item">' + recipient + '</li>';
            parent.append(recipientHtml);
        });
    }

    //////// EVENTS: //////// 
    $('#recipient-add-button').click(function() {
        console.log("click");
        $('#recipient-save-button').removeClass('d-none');
        var recipient = $('#recipient-add-input').val();
        newRecipients.unshift(recipient);

        let parent = $('#course-recipient-list');

        var recipientHtml = 
        '<li class="list-group-item">' + 
            '<span class="recipient">' + recipient + '</span>' +
            '<button type="button" class="recipient-remove-button close" value="' + recipient +'" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
            '</button>' +
        '</li>';
        
        parent.prepend(recipientHtml);
    });

    $('body').on('click', '.recipient-remove-button', function() {
        var recipient = $(this).val();

        // remove recipient from list
        const index = newRecipients.indexOf(recipient);
        if (index > -1) {
            newRecipients.splice(index, 1);
        }

        // remove html item
        $(this).parent().remove();

        // hide save button if the are no items added
        if (newRecipients.length == 0) {
            $('#recipient-save-button').addClass('d-none');
        }
    })
});