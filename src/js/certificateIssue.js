$(window).on('onContractReady', function (e) {

    let issueParticipants = [];
    let selectedImageId = 00;

    let searchParams = new URLSearchParams(window.location.search);
    let courseId;

    if (searchParams.has('courseId')) {
        courseId = searchParams.get('courseId');

        App.getCourse(courseId).then(function (course) {
            if (course) {
                course = { id: course[0], title: course[1], issuer : course[2], transaction : '0x923443122' };
                render(course);
            }
        })

        App.getCourseParticipants(courseId).then(function (participants) {
            issueParticipants = participants;
            renderParticipants(participants);
        });
    }

    var images = [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
    ];

    renderImages(images);
    

    function render(course) {
        let cancelUrl = $('#cancel-button').attr('href') + course.id;
        $('#cancel-button').attr('href', cancelUrl);

        $('#certificate-headline').html("Issue Certificates for "+ course.title);

        $('.certificate-card-title').first().text("");
        $('.certificate-card-issuer').first().text("From: " + course.issuer);
    
        $('#course-title-input').attr('placeholder', course.title);
    }

    function renderParticipants(participants) {
        let parent = $('#course-participant-list');

        if (participants) {
            $('.certificate-card-participant').first().text("For: " + participants.length + " participants");

            var c = 0;
            participants.forEach(participant => {
                var participantHtml = 
                '<li class="list-group-item">' +
                    '<input checked class="issue-participant-checkbox" type="checkbox" id="checkbox' + c + '" value="' + participant + '"/> ' +
                    '<label class="checkbox-label" for="checkbox' + c + '"> ' + participant + '</label>' + 
                '</li>';
                parent.append(participantHtml);
                c++;
            });
        }

        $('body').on('change', '.issue-participant-checkbox', function() {
            const isChecked = $(this).is(":checked");
            const participant = $(this).val();
            if (isChecked) {
                issueParticipants.push(participant);
            }
            else {
                // remove participant from list
                const index = issueParticipants.indexOf(participant);
                if (index > -1) {
                    issueParticipants.splice(index, 1);
                }
            }
            $('.certificate-card-participant').first().text("For: " + issueParticipants.length + " participants");
        })
    }

    function renderImages(images) {
        // render images input
        var parent = $('#certificate-image-input-parent');
        images.forEach(imageIndex => {
            parent.append(
                '<div class="certifiate-image-input card d-inline-block m-1" style="width: 80px; height: 80px;">' +
                    '<img src="images/' + imageIndex + '.png" class="rounded img-fluid"  alt="...">' +
                '</div>'
            );
        }); 
    }


    //////// EVENTS: //////// 
    $("#issue-certificates-button").click(async function() {
        const title = $('#certificate-title-input').val();
        await App.issueCertificates(courseId, title, selectedImageId, issueParticipants);
        window.location.href = "./certificateList.html";
    });

    $('#certificate-title-input').on('change keydown paste input', function(){
        var text = $('#certificate-title-input').val();
        $('.certificate-card-title').first().text(text);

        if (text.length > 19) {
            text = text.slice(0, 18) + "...";
        }
        $('.certificate-card > .certificate-card-arc').each(function(){
            $(this).text(text);
            $(this).removeClass('d-none');
            $(this).circleType(
                { position: 'absolute', radius: 45 }
            );
        });
    });
    
    $('.certifiate-image-input').click(function() {
        $('.certifiate-image-input.bg-primary').removeClass("bg-primary");

        var imageSrc = $(this).find('img').attr("src");
        selectedImageId = imageSrc.split('/')[1].split('.')[0];

        $('.certificate-card-image').first().attr("src", imageSrc);
        
        $(this).addClass("bg-primary");
    }); 
});