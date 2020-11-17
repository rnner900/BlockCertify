$( document ).ready(function() {
    let searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has('certificateId')) {
        let certificateId = searchParams.get('certificateId');
        
        let certificate = { 
            id: certificateId,
            image: '05',
            title:'Web Development III', 
            issuer:'0x123424', 
            participant:'0x234233',
            courseTitle:'Web Development',
            transaction:'0x65433'
        }

        render(certificate);
    }
    

    function render(certificate) {
        text = "Web Development II";
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
        
       
        $('#certificate-headline').html("Certificate #" + certificate.id);

        $('.certificate-card-title').first().text(certificate.title);
        $('.certificate-card-issuer').first().text("From: " + certificate.issuer);
        $('.certificate-card-image').first().attr('src', './images/' + certificate.image + '.png');
        $('.certificate-card-participant').first().text("For: " + certificate.participant);

        $('#certificate-title-input').attr("placeholder", certificate.title);
        $('#certificate-participant-input').attr("placeholder", certificate.participant);
        $('#certificate-issuer-input').attr("placeholder", certificate.issuer);
        $('#certificate-course-title-input').attr("placeholder", certificate.courseTitle);
        $('#certificate-transaction-input').attr("placeholder", certificate.transaction);

    }
});