function searchForAddress() {
    var address = $('#search-input-value').val();
    window.location.href = 'search.html?query=' + address;
}

$(window).on('onContractReady', function (e) {
    document.getElementById('search-input-value').onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.code || e.key;
        if (keyCode === 'Enter'){
            searchForAddress();
            return false;
        }
    }
});