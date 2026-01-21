import fs from "node:fs/promises";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import pdf from "pdf-parse";
export async function loadPdf(path) {
    const buf = await fs.readFile(path);
    const data = await pdf(buf);
    return {
        id: `pdf:${path}`,
        title: path.split(/[\\/]/).pop() || path,
        text: data.text || "",
        source: { type: "pdf", uri: path }
    };
}
export async function loadText(path) {
    const text = await fs.readFile(path, "utf8");
    return {
        id: `text:${path}`,
        title: path.split(/[\\/]/).pop() || path,
        text,
        source: { type: "text", uri: path }
    };
}
export async function loadWebpage(url) {
    const resp = await fetch(url);
    if (!resp.ok)
        throw new Error(`Failed to fetch url: ${resp.status} ${url}`);
    const html = await resp.text();
    const $ = cheerio.load(html);
    const title = $("title").text().trim() || url;
    const text = $("body").text().replace(/\s+/g, " ").trim();
    return {
        id: `web:${url}`,
        title,
        text,
        source: { type: "web", uri: url }
    };
}
