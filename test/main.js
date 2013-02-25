var seq = require('../lib/main.js'),
	fs = require('fs');


seq().then(function(){
	this.casts(fs.exists,['c:/test/style.less','c:/test/kot.less'],function(is){
		if(is){
			this.jump();
			return this.params[0];
		}
		return undefined;
	});
}).then(function(url){
		fs.readFile(url,'utf-8',this.promis());
}).then('kot',function(err, data){
		console.log(data);
		throw new Error();
}).then(function(err, data){
		console.log(arguments);
		return 'pies';
}).catch(function(err){
		console.log(err);
		//console.log('error', err);
		//console.log(this.queue[0]);
		//console.log(err.sequenceName);
}).then('test',function(){
		console.log('finally');
		//console.log(arguments);
	})
