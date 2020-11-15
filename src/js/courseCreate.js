
$( document ).ready(function() {
    var newRecipients = [];

    $( "#course-participant-add" ).click(function() {
        alert( "Handler for .click() called." );
    });

    //////// EVENTS: //////// 
    $('#recipient-add-button').click(function() {
        
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
    })
});