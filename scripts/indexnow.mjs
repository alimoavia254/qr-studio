// Pings IndexNow (Bing, Yandex, etc.) with every URL in the live sitemap.
// Run after a production deploy: npm run indexnow
const HOST = "qrvibe.online";
const KEY = "dce51a5d73fe228936afa5f07e5c6814";

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${res.status}`);
