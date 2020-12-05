$( document ).ready(function() {

    var certificates = [
        { id : 9012398, image : "09", title : "Web Development I", issuer : "0x012312", participant : "0x34433" },
        { id : 9012399, image : "02", title : "Web Development II", issuer : "0x012313", participant : "0x34434" },
        { id : 9012400, image : "03", title : "Web Development III", issuer : "0x012314", participant : "0x34435" },
        { id : 9012400, image : "00", title : "Web Development III", issuer : "0x012315", participant : "0x34436" },
        { id : 9012400, image : "04", title : "Web Development III", issuer : "0x012316", participant : "0x34437" }
    ]
    var parent = $('#certificates-parent');

    certificates.forEach(certificate => {
        var certificateItem = 
        '<a href="certificateDetail.html?certificateId=' + certificate.id + '">' +
            '<div class="certificate-card card m-2 shadow rounded">' +
                '<span class="certificate-card-arc small text-secondary d-none">' + certificate.title + '</span>' +
                '<img src="./images/' + certificate.image + '.png" class="img-fluid" alt="...">' +
                '<div class="card-body">' +
                    '<span class="certificate-card-title m-0 d-block">' + certificate.title + '</span>' +
                    '<small class="certificate-card-issuer m-0 text-secondary d-block">From: ' + certificate.issuer + '</small>' +
                    '<small class="certificate-card-participant m-0 text-secondary d-block">For: ' + certificate.participant + '</small>' +
                '</div>'+
            '</div>' +
        '</a>'
        console.log(certificate.id);
        parent.append(certificateItem);
    });
    
    setTimeout(function(){ 
        
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
        
    }, 1000);

    
});