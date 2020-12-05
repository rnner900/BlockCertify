function newCertificateItem(href, certificate) {
    var certificateItem = 
            '<a href="' + href + '">' +
                '<div class="certificate-card card m-2 shadow rounded">' +
                    '<span class="certificate-card-arc small text-secondary d-none">' + certificate.title + '</span>' +
                    '<img src="./images/' + certificate.imageId + '.png" class="img-fluid" alt="...">' +
                    '<div class="card-body">' +
                        '<span class="certificate-card-title m-0 d-block">' + certificate.title + '</span>' +
                        '<small class="certificate-card-issuer m-0 text-secondary d-block">From: ' + certificate.issuer + '</small>' +
                        '<small class="certificate-card-participant m-0 text-secondary d-block">For: ' + certificate.participant + '</small>' +
                    '</div>'+
                '</div>' +
            '</a>' 
    return certificateItem;
}

function applyCircleType() {
    $('.certificate-card > .certificate-card-arc').each(function(){
        text = $(this).text();
        if (text.length > 19) {
            text = text.slice(0, 18) + "...";
        }
        $(this).text(text);
        $(this).removeClass('d-none');
        $(this).circleType(
            { position: 'absolute', radius: 45 }
        );
    });
}

function applyCircleTypeWithDelay(delay) {
    if (delay === undefined) {
        delay = 1000;
    }

    // apply circle type after a second for loading
    setTimeout(function(){ 
        applyCircleType();
    }, delay);
}