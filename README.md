#Earthworm
```
Prosta biblioteka do obsługi zapytań asynchrniczycznych
```
===
#### Instalacja
```
	var worm = require('earthworm');

	worm().then(function(){
		this.casts( fs.exists, ['c:/test/style.less','c:/test/kot.less'], function(exists){
			if(exist){
				this.jump();
				return this.params[0];
			}
		});
	}).then(function(path){
		fs.readFile(path, 'utf-8', this.promis());
	}).then(function(err, data){
		console.log(data);
	})
```


## worm =  require('earthworm') = konstruktor

### .then([name ,] func)
* **name** (string) - nazwa sekwencji, przydatne przy użyciu metod jump oraz send(o tym dalej)
* **func** (function) - przyjmuje argumenty poprzedniej sekwencji .then lub .promis

```
worm().then('step1', function(){
	fs.exists(path, this.promis());
	fs.exists(path, this.promis());
	return true;	//zignorowany ponieważ czakamy na "obietnice" (this.promis)
}).then('step2', function(exists){
	console.log(exists);	// [ false, false ]
	return exists[0] || exists[1];
}).then('step3', function(exists){
  	console.log(exists);	// false
})
```

#### this.promis( [ func ] ) - uchwyt callback
* **func** (function) - funkcja odpalana gdy odpali callback

#### this.jump( [ id ] ) - kończy daną sekwencje i przechodzi do podanej
* **id** (string/number) - identyfikator metody **.then** lub liczba sekwencji do pominięcia, gdy brak podstawia 0 (0 - następna)

#### this.send( [ id ,] data ) - przesyła wartości do podanej sekwencji
* **id** (string/number) - identyfikator metody **.then** lub liczba sekwencji, gdy brak podstawia 0
* **data** - dane

```
.then(function(){
   	this.send('dane')
   })
.then(function(){
	this.params	// tablica parametrów
})
```

### .catch([name ,] func) - gdy nie wystąpi bład jest pomijana
* **name** (string) - nazwa sekwencji, przydatne przy użyciu metod jump oraz send(o tym dalej)
* **func** (function) - przyjmuje obiekty new Error