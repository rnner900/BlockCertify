$( document ).ready(function() {

    var certificates = [
        { id : 9012398, image : "01", title : "Web Development I" },
        { id : 9012399, image : "02", title : "Web Development II" },
        { id : 9012400, image : "03", title : "Web Development III" },
        { id : 9012400, image : "03", title : "Web Development III" },
        { id : 9012400, image : "03", title : "Web Development III" }
    ]
    var parent = $('#certificates-parent');

    certificates.forEach(certificate => {
        var certificateItem = 
        '<a href="certificateDetail.html?certificateId=' + certificate.id + '">' +
            '<div class="course-card card m-2 shadow rounded" style="display: inline-block;">' +
                '<span class="course-card-arc small text-secondary d-none" style="top: 40px; right: 0; left: 0; letter-spacing: -0.1em;">' + certificate.title + '</span>' +
                '<img src="./images/' + certificate.image + '.png" class="img-fluid" style="width: 180px; height: 180px;" alt="...">' +
                '<div class="card-body">' +
                    '<span class="m-0 d-block">' + certificate.title + '</span>' +
                    '<small class="m-0 text-secondary d-block">From: 0x12432kj123</small>' +
                    '<small class="m-0 text-secondary d-block">For: 0x12432kj123</small>' +
                '</div>'+
            '</div>' +
        '</a>'
        console.log(certificate.id);
        parent.append(certificateItem);
    });
    
    setTimeout(function(){ 
        
        parent.find('.course-card .course-card-arc').each(function(){
            $(this).removeClass("d-none");
            $(this).circleType(
                { position: 'absolute', radius: 45 }
            );
        });
        
    }, 1000);

    
});