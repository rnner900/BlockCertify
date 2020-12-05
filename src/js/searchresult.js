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
    renderTables($('#search-results'));

    var issuerCourses = await App.getIssuerCourses(address);
    render($('#issuer-course-list-parent'), issuerCourses);

    var participantCourses = await App.getParticipantCourses(address);
    render($('#participant-course-list-parent'), participantCourses);
}

function renderTables(parent) {
    parent.append('<h3>Issued Courses</h1> <br><table class="table"> <thead> <tr> <th scope="col">#</th> <th scope="col">Course Title</th> <th scope="col">Course Owner</th> <th scope="col">Certificated</th> </tr> </thead> <tbody id="issuer-course-list-parent">');
    parent.append('<h3>Own Courses</h1><table class="table"> <thead> <tr> <th scope="col">#</th> <th scope="col">Course Title</th> <th scope="col">Course Owner</th> <th scope="col">Certificated</th> </tr> </thead> <tbody id="participant-course-list-parent">');
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