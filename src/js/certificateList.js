$(window).on('onContractReady', async function (e) {

    var issuerCertificates = await App.getIssuerCertificates(App.account);
    var issuerParent = $('#issuer-certificates-parent');
    renderCertificates(issuerCertificates, issuerParent, 'issuer');

    var participantCertificates = await App.getParticipantCertificates(App.account);
    var participantParent = $('#participant-certificates-parent');
    renderCertificates(participantCertificates, participantParent, 'participant');

    function renderCertificates(certificates, parent, queryType) {

        let i = 0;
        certificates.forEach(certificate => {

            var href = 'certificateDetail.html?';
            if (queryType == 'issuer') {
                href += 'issuerAddress=' + certificate.issuer + '&index=' + i;
            }
            else if (queryType == 'participant') {
                href += 'participantAddress=' + certificate.participant + '&index=' + i;
            }

            var certificateItem = newCertificateItem(href, certificate);
            parent.append(certificateItem);
            i++;
        });
        
        applyCircleTypeWithDelay();
    }

});