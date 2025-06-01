import * as cheerio from 'cheerio';

export async function GET(req) {
  const urlObj = new URL(req.url);
  const url = urlObj.searchParams.get("url");

  try {
    const page = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await page.text();
    const $ = cheerio.load(html);

    // Najdi og:image
    const ogImage = $('meta[property="og:image"]').attr('content');
    // Če ni, najdi <img> v body
    let image = ogImage;
    if (!image) {
      image = $("img").first().attr("src");
    }

    return Response.json({ image });
  } catch (e) {
    return Response.json({ image: null });
  }
}
