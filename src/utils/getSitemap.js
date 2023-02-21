const { create } = require("xmlbuilder2");
const fs = require("fs");
const urls = require("./whitelist.json");

const mainTabUrls = urls.reduce((acc, url) => {
	const mainTabUrl = url.split("_")[0];
	if (!acc.includes(mainTabUrl)) {
		return [...acc, mainTabUrl];
	}
	return acc;
}, []);

const root = create({ version: "1.0" })
	.ele("urlset", {
		xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
	})
	.ele("url")
	.ele("loc")
	.txt("https://NCHSDataDev.cdc.gov/")
	.up()
	.ele("changefreq")
	.txt("daily")
	.up()
	.up();

mainTabUrls.forEach((url) => {
	root.ele("url").ele("loc").txt(`https://#${url}`).up().ele("changefreq").txt("daily").up().up();
});

const xml = root.end({ prettyPrint: true });

fs.writeFileSync("./dist/sitemap.xml", xml);
