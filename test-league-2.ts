import * as cheerio from 'cheerio';
import * as fs from 'fs';

const html = fs.readFileSync('test-html.html', 'utf8');
const $ = cheerio.load(html);

const firstMatch = $('li.match-info').first();
let parent = firstMatch.parent();

console.log("PARENT 1 (ul.list_match)");
console.log(parent.prev().html());

console.log("\nPARENT 2");
let p2 = parent.parent();
console.log(p2.prev().html()?.substring(0, 150));
console.log(p2.attr('class'));

console.log("\nPARENT 3");
let p3 = p2.parent();
console.log(p3.prev().html()?.substring(0, 150));
console.log(p3.children().first().html()?.substring(0, 150));
console.log(p3.attr('class'));

console.log("\nLOOKING FOR .category-title");
console.log($('.category-title').length + " found");
console.log($('.category-title').first().text().replace(/\s+/g, ' ').trim());
