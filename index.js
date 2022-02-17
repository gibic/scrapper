const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

const url = 'https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3'

async function scrapeData() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // based on target's element
    const listItems = $(".plainlist ul li");

    const items = [];
    
    listItems.each((idx, el)=> {
      //structure the data as needed
      const item = { name: "", iso3: "" }
      
      item.name = $(el).children('a').text()
      item.iso3 = $(el).children('span').text()
      
      items.push(item);
    });

    console.dir(items);

    // Write array of items in items.json file
    fs.writeFile('items.json', JSON.stringify(items, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Data written to file');
    });
  } catch (err) {
    console.error(err);
  }
}

scrapeData();