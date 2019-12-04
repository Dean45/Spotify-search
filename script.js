(() => {
    var reqUrl = "https://elegant-croissant.glitch.me/spotify";

    $("#submit-button").on("click", () => {
        makeRequest();
    });

    $("input[name='user-input']").on("keyup", () => {
        if (event.keyCode == 13) {
            makeRequest();
        }
    });

    function infiniteCheck() {
        var hasReachedBottom =
            $(window).height() + $(document).scrollTop() >=
            $(document).height() - 400;
        if (hasReachedBottom) {
            makeRequest(reqUrl);
        } else {
            console.log("not reached bottom, calling again");
            setTimeout(infiniteCheck, 600);
        }
    }

    function makeRequest() {

        var userInput = $("input[name='user-input']").val();
        var albumOrArtist = $("select").val();

        $.ajax({
            url: reqUrl,
            method: "get",
            data: {
                query: userInput,
                type: albumOrArtist
            },
            success: (response) => {
                response = response.artists || response.albums;
                var html = "";
                for (var i = 0; i < response.items.length; i++) {
                    var imageUrl = "./default.jpg";
                    if (response.items[i].images[0]) {
                        imageUrl = response.items[i].images[0].url;
                    }
                    var linkTo = response.items[i].external_urls.spotify;
                    html +=
                        "<div class='container'><a href='" +
                        linkTo +
                        "' target='_blank'><img class= thumb src='" +
                        imageUrl +
                        "'></a><a class='text' href='" +
                        linkTo +
                        "' target='_blank'>" +
                        response.items[i].name +
                        "</a></div>";
                }

                $("#results").append(html);

                if (response.next != null) {
                    reqUrl =
                      response.next &&
                      response.next.replace(
                          "api.spotify.com/v1/search",
                          "elegant-croissant.glitch.me/spotify"
                      );
                    infiniteCheck();

                }

            }
        });
    }
})();
