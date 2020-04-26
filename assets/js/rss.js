const rssUrl = ["https://muhfajar.blog/posts/index.xml", "https://muhfajar.blog/id/posts/index.xml"];
let parser = new RSSParser();
let blogList = document.getElementById("blog-list");

rssUrl.forEach((url) => {
    parser.parseURL(url, (err, feed) => {
        if (err) throw err;

        const sortedEnFeed = feed.items.sort(function (a, b) {
            return new Date(b.isoDate) - new Date(a.isoDate);
        });

        sortedEnFeed.forEach((entry) => {
            const listItem = document.createElement("li");
            const itemLink = document.createElement("a");

            itemLink.textContent = entry.title;
            itemLink.setAttribute('href', entry.link);
            listItem.appendChild(itemLink);
            blogList.appendChild(listItem);
        });
    });
});
