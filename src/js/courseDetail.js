$( document ).ready(function() {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('courceId')){
        let certificateId = searchParams.get('courseId');
        console.log(certificateId);
    }
});