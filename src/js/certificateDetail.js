$(window).on('onContractReady', async function (e) {

    let searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has('issuerAddress') && searchParams.has('index')) {
        const issuerAddress = searchParams.get('issuerAddress');
        const index = searchParams.get('index');
        
        const certificate = await App.getIssuerCertificateAt(issuerAddress, index);
        render(certificate);
    }
    else if (searchParams.has('participantAddress') && searchParams.has('index')) {
        const participantAddress = searchParams.get('participantAddress');
        const index = searchParams.get('index');

        const certificate = await App.getParticipantCertificateAt(participantAddress, index);

        render(certificate);
    }
    

    function render(certificate) {

        const certificateItem = newCertificateItem(window.location.href, certificate);
        $("#certificate-item-parent").append(certificateItem);
        applyCircleTypeWithDelay();
        
       
        $('#certificate-headline').html("Certificate " + certificate.title);

        $('.certificate-card-title').first().text(certificate.title);
        $('.certificate-card-issuer').first().text("From: " + certificate.issuer);
        $('.certificate-card-image').first().attr('src', './images/' + certificate.imageId + '.png');
        $('.certificate-card-participant').first().text("For: " + certificate.participant);

        $('#certificate-title-input').attr("placeholder", certificate.title);
        $('#certificate-participant-input').attr("placeholder", certificate.participant);
        $('#certificate-issuer-input').attr("placeholder", certificate.issuer);
        $('#certificate-course-title-input').attr("placeholder", certificate.courseTitle);
        $('#certificate-course-button').attr("href", './courseDetail.html?courseId=' + certificate.courseId);
        $('#certificate-transaction-input').attr("placeholder", certificate.transaction);

    }
});