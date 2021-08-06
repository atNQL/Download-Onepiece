const puppeteer = require('puppeteer');
const f = require('fs');
const downloader = require('image-downloader');
// Folder to save result
const resultFolder = 'chapter_';
// Download from page
const insUrls = 'https://truyendep.com/one-piece-dao-hai-tac-chap-';//940.html';
// truyenqq.net have protected their links. So, we can craw from https://truyendep.com/one-piece-dao-hai-tac-chap-1007/
// we can craw direct link
// https://1.truyentranhmanga.com/images/one-piece-dao-hai-tac-r/one-piece-dao-hai-tac-chap-1006/4.jpg
// this depend on the length of each chapter, better way we collect from parent page
// https://truyendep.com/one-piece-dao-hai-tac-chap-1007/

var START_DOWN_CHAPTER = 965;
var END_DOWN_CHAPTER = 970;


async function getImagesFromPage(url, folderName) {
    if (!f.existsSync(resultFolder + folderName)) {
        f.mkdirSync(resultFolder + folderName);
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const imageSrcSets = await page.evaluate(() => {
        //const imgs = Array.from(document.querySelectorAll('.story-see-content > img'));
        const imgs = Array.from(document.querySelectorAll(".vung_doc > img"));
        const srcSetAttribute = imgs.map(i => i.getAttribute('src'));
        return srcSetAttribute;
    })

    // console.log(imageSrcSets);

    // Get Image From Links
    imageSrcSets.forEach((imageSrcSets) => {
        downloader.image({
            url: imageSrcSets,
            dest: resultFolder + folderName
        }).then(({ filename }) => {
            console.log('Saved to', filename)  // saved to /path/to/dest/photo.jpg
        }).catch((err) => console.error(err))
    });

    console.log('Done!!!')

    await browser.close();
}

(async () => {
    try {
        var i;
        for (i = START_DOWN_CHAPTER; i <= END_DOWN_CHAPTER; i++) {
            var tempUrl = insUrls + i + '/';
            console.log(tempUrl);
            getImagesFromPage(tempUrl, i.toString(10));
        }

    } catch (error) {
        process.exit(1);
    }
})();
