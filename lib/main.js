module.exports = function(){
	return new seq();
}

var seq = function(){
	this.queue = [];
	this.params = null;

	this.add(function(){});
	setTimeout((function(){
		this.next();
	}).bind(this), 0);
};

seq.prototype.handleError = function(e){
	e.sequenceName = this.queue[0].name;
	this.queue[this.queue[0].catched+1].catcher = false;
	this.jump(this.queue[0].catched);
	return e;
}

seq.prototype.cast = function(fuu, args, cb){
	fuu.apply(this, [].concat(args, this.promis([].concat(args),cb)));
}

seq.prototype.casts = function(fuu, args, cb){
	args.forEach((function(ele){
		this.cast(fuu, ele, cb)
	}).bind(this));
}

seq.prototype.add = function(name, fuu, catcher){
	if(typeof name != 'string'){
		fuu = name;
		name = null;
	}

	var add = {
		jump: null,
		name: name,
		func: fuu,
		active: true,
		arguments: [],
		promises: 0,
		params: [],
		catched: null,
		catcher : catcher || false
	}

	this.queue.push(add);

	return add;
}

seq.prototype.then = function(name, fuu){
	this.add(name, fuu);
	return this;
}

seq.prototype.jump = function(ile){
	var seq = this.queue[0];

	if(ile==undefined)
		seq.jump = 0;
	else
		seq.jump = ile;

	//stop promises
	seq.active = false;
}

seq.prototype.send = function(ile, data){
	var queue = this.queue;
	if(data==undefined){
		data = ile;
		ile = 0;
	}

	if(typeof ile == 'string'){
		var len = queue.length,
			i=0;

		while(i<len){
			if(queue[i].name===ile){
				queue[i].params.push(data);
				break;
			}
			i++;
		}
	}else{
		if(++ile in queue)
			queue[ile].params.push(data);
	}
}

seq.prototype.promis = function(params, fuu){
	if(!Array.isArray(params)){
		fuu = params;
		params = [];
	}
	this.queue[0].promises++;

	return (function(seq, fuu, params){
		if(seq.active){
			var args = [].slice.call(arguments, 3);
			this.params = params;

			if(fuu){
				try{
					args = [].concat(fuu.apply(this, args));
				}catch(e){
					if(seq.catched)
						args = this.handleError([e]);
					else
						throw e;
				}
			}

			if(args.length && args[0]!==undefined){
				if(args[0] instanceof Error)
					seq.arguments.push(this.handleError(args[0]));
				else
					seq.arguments.push(args);
			}
			seq.promises--;

			this.next();
		}
	}).bind(this, this.queue[0], fuu, params);
}

seq.prototype.next = function(){
	if(this.queue.length<2 || (this.queue[0].promises && this.queue[0].jump==null))
		return;

	var last = this.queue.shift(),
		seq = this.queue[0],
		ile = last.jump || 0,
		i = 0,
		args;

	last.active = false;

	while(seq.catcher || ile){
		if(!seq.catcher && (seq.name===ile || ile===i++))
			break;

		this.queue.shift();
		seq = this.queue[0];
	}

	this.params = seq.params;
	try{
		if(last.arguments.length==0)
			args = seq.func.apply(this);
		else if(last.arguments.length==1)
			args = seq.func.apply(this, last.arguments[0]);
		else
			args = seq.func.apply(this, last.arguments.reduce(function(prev, curr){
				curr.reduce(function(prev, curr, index){
					if(!prev[index])
						prev[index] = [];
					prev[index].push(curr);
					return prev;
				}, prev);
				return prev;
			},[]));
	}catch(e){
		if(seq.catched!=null)
			args = this.handleError(e);
		else
			throw e;
	}

	if(!seq.promises && args!==undefined){
		seq.arguments.push([].concat(args));
	}

	this.next();
}

seq.prototype.catch = function(name, fuu){
	this.add(name, fuu, true);

	var start,
		prev = start = (this.queue.length-1);

	while(prev--){
		if(!this.queue[prev].catched)
			this.queue[prev].catched = start-prev-1;
		else
			break;
	}

	return this;
}