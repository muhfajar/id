const dt = +new Date();
const rssUrl = ["https://cdn.weeknd.dev/sgp1/blog/rss/en.xml?dt=" + dt, "https://cdn.weeknd.dev/sgp1/blog/rss/id.xml?dt=" + dt];

let parser = new RSSParser();
let blogList = document.querySelector("#blog > div > div > ul");
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
            blogListData.forEach((entry) => {
                const listItem = document.createElement("li");
                const itemLink = document.createElement("a");
                itemLink.textContent = entry.title;
                itemLink.setAttribute("href", entry.link);
                itemLink.setAttribute("title", entry.pubDate);
                listItem.setAttribute("class", "blog-list");
                listItem.appendChild(itemLink);
                blogList.appendChild(listItem);
            });

            let checkedBlogList = [];
            let elem = document.querySelectorAll("#blog > div > div > ul > li");

            [].slice.call(elem).sort((a, b) => {
                const dateA = a.getElementsByTagName("a").item(0).getAttribute('title');
                const dateB = b.getElementsByTagName("a").item(0).getAttribute('title');
                return new Date(dateB) - new Date(dateA);
            }).forEach(function (el) {
                el.parentNode.appendChild(el)
            });

            for (let i = 0; i < elem.length; i++) {
                let currentValue = elem[i].innerHTML;
                if (checkedBlogList.indexOf(currentValue) !== -1) {
                    blogList.removeChild(elem[i]);
                } else {
                    checkedBlogList.push(currentValue);
                }
            }
        });
    });
});
