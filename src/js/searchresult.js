$(window).on('onContractReady', function (e) {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('query')) {
        var searchQuery = searchParams.get('query');
        $('#search-header').append('"' + searchQuery +'"');
        if(/^(0x)?[0-9a-fA-F]{40}$/i.test(searchQuery)){
            if(web3.utils.isAddress(searchQuery)){
                try {
                    let searchAddress = web3.utils.toChecksumAddress(searchQuery)
                    console.log(searchAddress);
                    gatherInformation(searchAddress);
                    
                } catch(e) { 
                    $('#search-results').append('<p>Something went wrong!<br>' + e.message + '</p>');
                }
            }else{
                $('#search-results').append('<p>The address given could not be found.</p>');
            }
        }else{
            $('#search-results').append('<p>The input given is not an address.</p>');
        }
    }else{
        $('#search-results').append('<p>No search input given.</p>');
    }
});

async function gatherInformation(address) {
    var issuerCourses = await App.getIssuerCourses(address);
    $('#headingIssuerCourses').find("button").append(' (' + issuerCourses.length + ')')
    var issuerCoursesParent = $('#issuer-course-list-parent');
    render(issuerCoursesParent, issuerCourses);

    var participantCourses = await App.getParticipantCourses(address);
    $('#headingParticipantCourses').find("button").append(' (' + participantCourses.length + ')')
    var participantCoursesParent = $('#participant-course-list-parent');
    render(participantCoursesParent, participantCourses);
    

    var issuerCertificates = await App.getIssuerCertificates(App.account);
    $('#headingIssuerCertificates').find("button").append(' (' + issuerCertificates.length + ')')
    var issuerParent = $('#issuer-certificates-parent');
    renderCertificates(issuerCertificates, issuerParent, 'issuer');

    var participantCertificates = await App.getParticipantCertificates(App.account);
    $('#headingParticipantCertificates').find("button").append(' (' + participantCertificates.length + ')')
    var participantParent = $('#participant-certificates-parent');
    renderCertificates(participantCertificates, participantParent, 'participant');
}

function render(parent, courses)  {
    
    courses.forEach(async function (course) {
        var isCertificated = course[3];
        var checkmark = (isCertificated == 'true') ? '&#10003;' : '&#10005;';
        var courseHtml = 
        '<tr role="button" data-href="courseDetail.html?courseId=' + course[0] + '">' +
            '<th scope="row">' + course[0] + '</th>' +
            '<td>' + course[1] + '</td>' +
            '<td>' + course[2] + '</td>' +
            '<td>' + checkmark + '</td>' +
        '</tr>';
        parent.append(courseHtml);
    });
    
}

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