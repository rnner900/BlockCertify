$( document ).ready(function() {
    let searchParams = new URLSearchParams(window.location.search);
    let courseId;

    if (searchParams.has('courseId')) {
        courseId = searchParams.get('courseId');
        console.log(certificateId);

        var course = { 
            id: courseId, 
            title: 'Web Development III', 
            issuer : '0x12399239', 
            recipientCount : 10 
        };

        render(course);
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
        let cancelUrl = $('#cancel-button').attr('href') + courseId;
        $('#cancel-button').attr('href', cancelUrl);

        $('#certificate-headline').html("Issue Certificates for "+ course.title);

        $('.certificate-card-title').first().text("");
        $('.certificate-card-issuer').first().text("From: " + course.issuer);
        $('.certificate-card-recipient').first().text("For: " + course.recipientCount + " different recipients");
    
        $('#course-title-input').attr('placeholder', course.title);
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
    $('#certificate-title-input').on('change keydown paste input', function(){
        text = this.value;
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
        var imageIndex = imageSrc.split('/')[1].split('.')[0];

        $('.certificate-card-image').first().attr("src", imageSrc);
        $('#certificate-image-input').val(imageIndex);
        
        $(this).addClass("bg-primary");
    }); 
});