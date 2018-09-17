const pathToRegexp = require('path-to-regexp');

var keys = []
var re = pathToRegexp('/foo/:bar', keys)

console.log(re);
console.log(keys);

// var re = pathToRegexp('/:foo/:bar')
// // keys = [{ name: 'foo', prefix: '/', ... }, { name: 'bar', prefix: '/', ... }]

// console.log({}.toString.call(re))
// console.log(typeof re.source)
// console.log(re.source)
// console.log(re.exec('/test/route'))
// console.log(Array.isArray(re.exec('/test/route')))
// console.log(re.exec('/test/route').slice(1));

//=> ['/test/route', 'test', 'route']

// const url = '/api/:name/:id';
// const realUrl = '/api/project/1';
// const realUrl2 = '/a/haha/1';

// var re = pathToRegexp(url);
// console.log(re.test(realUrl));
// console.log(re.test(realUrl2));

// const a = pathToRegexp.compile(url);
// const u1 = a({ a: 1 });
// console.log(u1);
// const compiled = pathToRegexp.compile('/api/project');
// const retUrl1 = compiled({});
// console.log(retUrl1);
