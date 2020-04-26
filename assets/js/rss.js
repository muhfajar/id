const rssUrl = ["https://muhfajar.blog/posts/index.xml", "https://muhfajar.blog/id/posts/index.xml"];
let parser = new RSSParser();
let blogList = document.getElementById("blog-list");
let blogListData = [];
let blogCount = 0;

function blogListCollector(item, cb) {
    setTimeout(() => {
        blogListData.push(item);
        cb();
    }, 100);
}

rssUrl.forEach((url) => {
    parser.parseURL(url, (err, feed) => {
        if (err) throw err;

        let requests = feed.items.map((item) => {
            blogCount++;
            return new Promise((resolve) => {
                blogListCollector(item, resolve);
            });
        });

        Promise.all(requests).then(() => {
            if (blogListData.length === blogCount) {
                blogListData.sort((a, b) => {
                    return new Date(b.isoDate) - new Date(a.isoDate)
                }).forEach((entry) => {
                    const listItem = document.createElement("li");
                    const itemLink = document.createElement("a");

                    itemLink.textContent = entry.title;
                    itemLink.setAttribute("href", entry.link);
                    itemLink.setAttribute("title", entry.pubDate);
                    listItem.appendChild(itemLink);
                    blogList.appendChild(listItem);
                });
            }
        });
    });
});
