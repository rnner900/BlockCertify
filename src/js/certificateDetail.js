$( document ).ready(function() {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('certificateId')){
        let certificateId = searchParams.get('certificateId');
        console.log(certificateId);
    }
});