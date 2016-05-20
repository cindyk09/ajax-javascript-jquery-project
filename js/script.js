function loadData() {

   var $body = $('body');
   var $wikiElem = $('#wikipedia-links');
   var $nytHeaderElem = $('#nytimes-header');
   var $nytElem = $('#nytimes-articles');
   var $greeting = $('#greeting');


   $wikiElem.text("");
   $nytElem.text("");

   var streetStr = $('#street').val();
   var cityStr = $('#city').val();
   var address = streetStr + ', ' + cityStr;

   $greeting.text('So, you want to live at ' + address + '?');

   var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
   $greeting.append('<img class="bgimg align-center" src="' + streetviewUrl + '">');

   var nyt_url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+cityStr+'&api-key=8b3ce9f97f4f17cba58bd0d3bb8b7a3f:19:75136192';

   $.getJSON(nyt_url,function(data){

     $nytHeaderElem.text('New York Times Articles About ' + cityStr);

     articles = data.response.docs;
     for (var i = 0; i < articles.length; i++) {
       var article = articles[i];
       $nytElem.append('<li class="article">' + '<a href="'+article.web_url+'">' + article.headline.main+'</a>' + '<p>' + article.snippet + '</p>' + '</li>');
     }

   }).error(function(e){
     $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
   });

   var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

   var wikiRequestTimeout = setTimeout(function(){
    $wikiElem.text("failed to get wikipedia resources");
  }, 8000);

   $.ajax({
     url: wikiUrl,
     dataType: "jsonp",
     success: function(response) {
       var articleList = response[1];
       for (var i = 0; i < articleList.length; i++) {
         articleStr = articleList[i];
         var url = 'http://en.wikipedia.org/wiki/' + articleStr;
         $wikiElem.append('<li><a href="' + url +'">' + articleStr + '</a></li>');
       }

       clearTimeout(wikiRequestTimeout);
     }
   });

   return false;
 }



$('#form-container').submit(loadData);
