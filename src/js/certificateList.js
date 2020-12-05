$(window).on('onContractReady', async function (e) {

    var issuerCertificates = await App.getIssuerCertificates(App.account);
    var issuerParent = $('#certificates-issuer-parent');

    renderCertificates(issuerCertificates, issuerParent);

    var participantCertificates = await App.getParticipantCertificates(App.account);
    var participantParent = $('#certificates-participant-parent');

    renderCertificates(participantCertificates, participantParent);

    function renderCertificates(certificates, parent) {
        certificates.forEach(certificate => {
            var certificateItem = 
            '<a href="certificateDetail.html?certificateId=' + certificate.id + '">' +
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
    }

});