$( document ).ready(function() {

    var certificates = [
        { certificateId = 9012398, certificateImage = 01, certificate }
    ]
    var parent = $('#certificates-parent');

    certificates.forEach(element => {
        parent.append(
            '<div class="certifiate-bg-input card d-inline-block m-1" tag="' + element + '" style="width: 80px; height: 80px;">'
            + '<img src="images/' + element + '.png" class="rounded img-fluid"  alt="...">'
            + '</div>'
        );
    });

    var certificateItem = '<a href="certificateDetail.html?certificateId=0">' +
      '<div class="card m-2" style="width: 180px; height: 180px;">' +
        '<span id="card-course-name-arc" class="position-absolute small font-weight-bold text-secondary" style="top: 40px; right: 0; left: 0px; letter-spacing: -0.2em;"></span>' +
        '<img id="card-course-img" src="./images/00.png" class="rounded img-fluid"  alt="...">' +
      '</div>' +
    '</a>'
});