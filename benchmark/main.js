var seq = require('../lib/main.js'),
	fs = require('fs');

console.time(1);
var backs = 0;
var test = 1;

for(var i=0; i<10000; i++){

	if(test){
		seq().then(function(){
			backs++;
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
				throw new Error(data);
			}).catch(function(err){
				if(!(--backs)){
					console.timeEnd(1);
				}
				//console.log(backs);
			})
	}else{
		var fuu = function(exist){
				if(exist){
						fs.readFile(this.p, function(err, data){
							try{
							if(err)
								throw err;
							else
								throw new Error(data)
							}catch(e){
								if(!(--backs)){
									console.timeEnd(1);
								}
							}
						});
				}
			},
			p1 = 'c:/test/style.less',
			p2 = 'c:/test/kot.less';

		backs++;
		fs.exists(p1, fuu.bind({p: p1}));
		fs.exists(p2, fuu.bind({p: p2}));
	}
}