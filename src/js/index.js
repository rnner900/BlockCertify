$(window).on('onContractReady', function (e) {

    var loader = $('#loader');
    var content = $('#content');

    // Load contract data
    App.getIssuerCertificates(App.account)
        .then(function (certificates) {
            var certificatesResults = $('#certificatesResults');
            certificatesResults.empty();

            certificates.forEach(cert => {
                var certificateTemplate = '<tr><td>' + cert[0] + '</td><td>' + cert[1] + '</td><td>' + cert[2] + '</td><td>' + cert[3] + '</td><td>' + cert[4] + '</td></tr>';
                    certificatesResults.append(certificateTemplate);
            });
            
            loader.hide();
            content.show();
            return App.certificationInstance.getIssuerCourses(App.account);
        })
        .catch(function (error) {
            console.warn(error);
        });

    App.getIssuerCourses(App.account)
        .then(function (courses) {
            // show courses of constructors address, TODO: show users courses
            var courseOverview = $('#courseOverview');
            courseOverview.empty();
            courses.forEach(course => {
                var courseTemplate = '<tr><th>' + course[0] + '</th><td>' + course[1] + '</td><td>';
                courseTemplate += '</td></tr>';
                courseOverview.append(courseTemplate);
            });
        })
        .catch(function (error) {
            console.warn(error);
        });
});