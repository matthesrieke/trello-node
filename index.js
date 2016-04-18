var markdown = require('markdown').markdown;
var http = require('http');
var fs = require('fs');
var URL = require('url');

var cardTest = require('./card-exported.json');

var header, footer, style, jquery, exportHtml;
fs.readFile("header.html", "utf8", function(err, data) {
    if (!err) {
        header = data;
    }
});
fs.readFile("footer.html", "utf8", function(err, data) {
    if (!err) {
        footer = data;
    }
});
fs.readFile("css/style.css", "utf8", function(err, data) {
    if (!err) {
        style = data;
    }
});
fs.readFile("js/jquery-1.11.3.min.js", "utf8", function(err, data) {
    if (!err) {
        jquery = data;
    }
});
fs.readFile("export.html", "utf8", function(err, data) {
    if (!err) {
        exportHtml = data;
    }
});

http.createServer(function (req, res) {
    if (req.url === "/css/style.css") {
        res.writeHead(200, {
            'Content-Type': 'text/css; charset=UTF-8'
        });

        res.end(style);
        return;
    }
    if (req.url === "/js/jquery-1.11.3.min.js") {
        res.writeHead(200, {
            'Content-Type': 'application/javascript; charset=UTF-8'
        });

        res.end(jquery);
        return;
    }
    
    var url = URL.parse(req.url, true);
    var target = url.query;
    
    console.log(JSON.stringify(url));
    
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8'
    });
    
    if (url.pathname === "/layout") {
        
    }
    else if (url.pathname === "/export") {
        res.end(createDownloader(target.url));
    }
    else {
        res.end(createMarkup(cardTest));
    }
    
}).listen(9080, "");

function createMarkup(card) {
    var markup = header;
    
    /* NAME and link */
    markup += "<h1>";
    markup += card.name;
    markup += "</h1>";
    
    markup += '<div class="board-link"><a href="';
    markup += card.url;
    markup += '">';
    markup += card.url;
    markup += '</a></div>';
    
    /* DESCRIPTION */
    markup += "<h2>Description</h2>";
    markup += '<div class="description">';
    markup += markdown.toHTML(card.desc);
    markup += "</div>";
    
    /* Checklists */
    markup += '<div class="checklists">';
    card.checklists.forEach(function (cl) {
        markup += createChecklist(cl);
    });
    markup += '</div>';
    
    markup += footer;
    return markup;
}

function createChecklist(cl) {
    var markup = "<h3>";
    markup += cl.name;
    markup += "</h3><ul>";
    
    cl.checkItems.forEach(function (ci) {
        markup += "<li>";
        markup += markdown.toHTML(ci.name);
        markup += "</li>";
    });
    
    markup += "</ul>";
    
    return markup;
}

function createDownloader(cardUrl) {
    var placeholder = "${CARD_URL}";
    return exportHtml.replace(placeholder, cardUrl);
}