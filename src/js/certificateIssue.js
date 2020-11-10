$( document ).ready(function() {
    var parent = $('#certificate-bg-input-parent');

    var images = [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
    ];

    images.forEach(element => {
        parent.append(
            '<div class="certifiate-bg-input card d-inline-block" tag="' + element + '" style="width: 80px; height: 80px;">'
            + '<img src="images/' + element + '.png" class="rounded img-fluid"  alt="...">'
            + '</div>'
        );
    });

    $('#certificate-title-input').on('change keydown paste input', function(){
        text = this.value;
        console.log(text);
        if (text.length > 19) {
            text = text.slice(0, 18) + "...";
        }
        $('#card-course-name-arc').text(text);
        $('#card-course-name-arc').circleType(
            {position: 'absolute', radius: 45}
        );
    });
    
    
    $('.certifiate-bg-input').click(function() {
        $('.certifiate-bg-input.bg-primary').removeClass("bg-primary");

        var bgSrc = $(this).find('img').attr("src");
        var bgIndex = $(this).attr('tag');

        $('#card-course-img').attr("src", bgSrc);
        $('#certificate-bg-input').val(bgIndex);
        
        $(this).addClass("bg-primary");
    });  
});