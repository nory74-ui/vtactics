const https = require('https');
https.get('https://vollyze.com/blog/rotation-analysis/', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const p = data.match(/<p>([\s\S]*?)<\/p>/g) || [];
    const ptext = p.map(t => t.replace(/<[^>]*>/g, '').trim()).slice(0, 15).join('\n');
    const titles = data.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/g) || [];
    const text = titles.map(t => t.replace(/<[^>]*>/g, '').trim()).join('\n');
    console.log("TITLES:\n" + text + "\n\nPARAS:\n" + ptext);
  });
}).on('error', (e) => console.error(e));
