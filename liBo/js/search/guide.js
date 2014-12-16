var solr = function(user, server) {
    require(["dojo/dom", "dojo/on", "dojo/request", "dojo/_base/array",  "dojo/domReady!"],
        function(dom, on, request, arrayUtil){
            var createHtml = function(dom, result) {
                        var numFoundDiv = dom.byId("numFound");
                        numFoundDiv.innerHTML = "<span>一共找到" +  result.response.numFound + "条记录</span>";
                        var docs = result.response.docs;
                        var html = '';
                        arrayUtil.forEach(docs, function(doc, i) {
                            html += '<div class="timeline_item">'
                                +"<div class='timeline_content'>"
                                + "<a class='link_box' href=\"" + doc.url + "\">" + doc.title + "</a>"
                                + "</div></div>";

                        });

                        if(docs.length > 0) {
                            html += "<button id='moreBtn' class='moreBtn'>更多</button>";
                        } else {
                            html += "<div class=\"numFound\">没有了</div>"
                        }

                        var resultDiv = dom.byId("search_list");
                        resultDiv.innerHTML = html;

                        if(docs.length > 0) {
                            on(dom.byId("moreBtn"), "click", load);
                        }
            };

            var luceneQuery = function(start, rows) {
               return {
                                q : "+text:" + dom.byId("keyword").value + " +user:" + user,
                                start: start,
                                rows: rows,
                                wt : "json"
                        };
            };

            var collectionUrl = "/chickensoup/select";
            var resultUl = dom.byId("resultUl");
            var startSpan = dom.byId("currentPage");
            var start = 0;

            var load = function(evt) {
                var luceneQueryStr = luceneQuery(start, 20);
                request.get(server + collectionUrl,
                   {
                       query : luceneQueryStr,
                       handleAs: "json"
                   }
                ).then(
                   function(response){
                       start += 20;
                       createHtml(dom, response);
                   },
                   function(error) {
                       var resultDiv = dom.byId("search_list");
                       resultDiv.innerHTML = "<div class=\"numFound\">"+ "没有匹配的结果" +"<div>";
                   }
                );
            };

//            隐藏翻页按钮
            var pagination = document.querySelector(".js-pagination-centered");
            var hidePagination = function() {
                if(pagination.dataset.isHide === "hided") {
                    return;
                }
                pagination.style["display"] = "none";
                pagination.dataset.isHide = "hided";
            }

            var startSearch = function(evt) {
                start = 0;
                hidePagination();
                load(evt);
            };
            on(dom.byId("searchBtn"), "click", startSearch);
        }
    );
}
