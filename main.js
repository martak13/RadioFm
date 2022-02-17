let count = 1;
let sliding = false;
let timer;

$(".wrapper").on("scroll", function () {
    if (!$(".slider").visible()) {
        clearInterval(timer);
    } else {
        setTimer();
    }
    let y = ($(this).scrollTop() / 100) * 51 + "px";
    $("#Under, #Upper").css("background-position-y", "calc(50% + " + y + ")");
});

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        clearInterval(timer);
    } else {
        setTimer();
    }
});

function setTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        counter(1);
        changeSlider(2000);
        console.log(1);
    }, 5000);
}

function changeSlider(duration) {
    clearInterval(timer);
    sliding = true;
    $(".screen__under").css(
        "background-image",
        "url('./img/" + count + "-min-min.jpg')"
    );
    $(".screen__upper").animate(
        { opacity: "0" },
        {
            duration: duration,
            complete: () => {
                $(".screen__upper").css({
                    "background-image":
                        "url('./img/" + count + "-min-min.jpg')",
                    opacity: "1",
                });
                sliding = false;
                setTimer();
            },
        }
    );
}

function counter(val) {
    count += val;
    if (count < 1) {
        count = 20;
    } else if (count > 20) {
        count = 1;
    }
}

$("#Left").on("click", () => {
    if (sliding) {
        return;
    }
    counter(-1);
    changeSlider(1000);
});

$("#Right").click(() => {
    if (sliding) {
        return;
    }
    counter(1);
    changeSlider(1000);
});


function getData() {
    return fetch(
        "https://c28.radioboss.fm/api/info/346?key=EZMN16CV3BV0"
    );
}

function setSongName(name) {
    let inf = name.split(' - ')
    if (inf.length == 1) {
        $(".info__name").text(inf[0]);    
        $(".info__author").text('YANTARNE FM');    
        return
    }
    let author = inf[0]
    $(".info__name").text(inf[1]);
    console.log(author)
    if (author.length > 20) {
        
        author.slice(0, 20)
        author = author+'...'
    }
    $('.info__author').text(author)
}

function setNext(name) {
    name = name.length > 40?name.slice(0, 40)+'...':name
    $('#Next').text(name)
}

function setRecent(arr) {
    arr = arr.slice(1, 5)
    console.log(arr)
    let arr_recent = $('.recent_song')
    console.log(arr_recent)
    for (let i = 0; i < arr.length; i++) {
        $(arr_recent[i]).text(arr[i].title)
    }
}

function mainloop() {
    getData()
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setSongName(data.nowplaying);
            setNext(data.nexttrack);
            setRecent(data.recent);
            // setBar(data.playback.len, data.playback.pos)
            console.log(data);
            console.log(data.playback.len - data.playback.pos);
            let timer = setTimeout(() => {
                mainloop();
                clearTimeout(timer);
            }, data.playback.len - data.playback.pos);
        })
        .then();
}

(function () {
    mainloop()
    let volume = .5;
    let audio = new Audio("http://c28.radioboss.fm:8346/stream");
    audio.crossOrigin = "anonymous";
    audio.volume = volume;
    function changeVolume() {
        audio.volume = volume
        if (volume == 0) {
            $('.mute').addClass('muted')
        } else{
            $('.mute').removeClass('muted')
        }
            
    }
    $("#Play").click(function () {
        $(this).toggleClass('pause')
        if (audio.paused) {
            audio.volume = volume;
            audio.play()
        } else {
            audio.volume = 0;
            audio.pause()        }
    });
    $("#Volume").on("input", function (e) {
        volume = $("#Volume").val() / 100;
        changeVolume()
    });
    $(".mute").on('click', function () {
        if ($(this).hasClass('muted')) {
            volume = $("#Volume").val() / 100
            changeVolume()
            return 
        }
        volume = 0
        changeVolume()
    })
})();