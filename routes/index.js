var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var $ = require('jquery');
var ObjectId = mongojs.ObjectId;


var db = mongojs('customersdbs', ['customers']);

router.use('/public', express.static('public'));
// Global Variables

router.use(function(req, res, next){
	res.locals.errors = null;
//	res.locals.myVar = 10;
	next();
});

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	db.customers.find().sort({'datum':1}).toArray(function(err, docs){
		res.render('index', {
			customers: docs
		});
	});
});



/*
router.get('/skapaBokning', ensureAuthenticated, function(req, res){
	res.render('skapaBokning');
});
*/

function onRequest(request, response){
	//if(request.method == 'GET' && request.url == '/'){
		router.get('/', ensureAuthenticated, function(req, res){
		db.customers.find().sort({'datum':1}).toArray(function(err, docs){
			res.render('index', {
			customers: docs
			});
		});
	
	});
//	} else{
//		send404Response(response);
//	}
}





function getDayOfWeek(date) {
  var dayOfWeek = new Date(date).getDay();    
  return isNaN(dayOfWeek) ? null : ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'][dayOfWeek];
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
} 

router.post('/search', ensureAuthenticated, function(req, res){
	var result = {
			ordernummer: req.body.search
	}
	var result2 = {
				namn: req.body.search
			}
	
	var allresults;
	
	
	db.customers.find(result).sort({'datum':1}).toArray(function(err, docs){
		db.customers.find(result2).sort({'datum':1}).toArray(function(err, dacs){
			res.render('searchResult', {
				searchResult: docs,
				searchResultName: dacs
			});
			
		});	
	});
});

router.post('/add', ensureAuthenticated, function(req, res){
	
	req.checkBody('ordernummer', 'Ordernummer behövs').notEmpty();
	req.checkBody('namn', 'Kundnamn behövs').notEmpty();
	req.checkBody('adress', 'Adress behövs').notEmpty();
	req.checkBody('postnummer', 'Postnummer behövs').notEmpty();
	req.checkBody('ort', 'Ort behövs').notEmpty();
	req.checkBody('telefonnummer', 'Telefonnummer behövs').notEmpty();
	req.checkBody('datum', 'Datum behövs').notEmpty();
	req.checkBody('tid', 'Tid behövs').notEmpty();
	
	
	var errors = req.validationErrors();
	
	
	if(errors){
		console.log('Error with form');
		db.customers.find().sort({'datum':1}).toArray(function(err, docs){
			res.render('skapaBokning', {
				customers: docs,
				errors: errors
			});
		});
	} else{
		console.log('New customer added');
		
		var nyProdukt;
		switch(req.body.antalProdukter){
			case "1":
				nyProdukt = req.body.produkt;
				break;
			case "2":
				nyProdukt = [req.body.produkt, req.body.produkt2];
				console.log(req.body.produkt2);
				break;
			case "3":
				nyProdukt = [req.body.produkt, req.body.produkt2, req.body.produkt3];
				break;
			case "4":
				nyProdukt = [req.body.produkt, req.body.produkt2, req.body.produkt3, req.body.produkt4];
				break;
			case "5":
				nyProdukt = [req.body.produkt, req.body.produkt2, req.body.produkt3, req.body.produkt4, req.body.produkt5];
				break;
			case "6":
				nyProdukt = [req.body.produkt, req.body.produkt2, req.body.produkt3, req.body.produkt4, req.body.produkt5, req.body.produkt6];
				break;
			default:
				nyProdukt = "Ingen";
				console.log(req.body.antalProdukter);
				break;
		}
		
		
		var newcustomer = {
			datum: req.body.datum,
			tid: req.body.tid,
			veckodag: getDayOfWeek(req.body.datum),
			ordernummer: req.body.ordernummer,
			namn: req.body.namn,
			adress: req.body.adress,
			postnummer: req.body.postnummer,
			telefonnummer: req.body.telefonnummer,
			produkter: nyProdukt,
			vecka: new Date(req.body.datum).getWeek(),
			epost: req.body.epost,
			ort: req.body.ort,
			extra: req.body.extra,
			ovrinfo: req.body.ovrinfo,
			fasttid: req.body.fasttid,
			antalProdukter: req.body.antalProdukter,
			avklarad: "nej",
			interninfo: req.body.interninfo,
			extrakostnad: req.body.extrakostnad,
			inbokad: "nej"
		}
	
		
		db.customers.insert(newcustomer, function(err, result){
			if(err){
				console.log(err);
			}
			else {
				res.redirect('/skapaBokning');
			}
		});
		
	}

	
});

	router.post('/update', ensureAuthenticated, function(req, res){
		
	req.checkBody('ordernummer', 'Ordernummer behövs').notEmpty();
	req.checkBody('namn', 'Kundnamn behövs').notEmpty();
	req.checkBody('adress', 'Adress behövs').notEmpty();
	req.checkBody('postnummer', 'Postnummer behövs').notEmpty();
	req.checkBody('ort', 'Ort behövs').notEmpty();
	req.checkBody('telefonnummer', 'Telefonnummer behövs').notEmpty();
	req.checkBody('datum', 'Datum behövs').notEmpty();
	req.checkBody('tid', 'Tid behövs').notEmpty();
	
	
	var errors = req.validationErrors();
	
	
	if(errors){
		console.log('Error with form');
		db.customers.find().sort({'datum':1}).toArray(function(err, docs){
			res.render('skapaBokning', {
				customers: docs,
				errors: errors
			});
		});
	} else{
		console.log('Customer updated');
		
		var updatedcustomer = {
			datum: req.body.datum,
			tid: req.body.tid,
			veckodag: getDayOfWeek(req.body.datum),
			ordernummer: req.body.ordernummer,
			namn: req.body.namn,
			adress: req.body.adress,
			postnummer: req.body.postnummer,
			telefonnummer: req.body.telefonnummer,
			produkter: req.body.produkt,
			fasttid: req.body.fasttid,
			vecka: new Date(req.body.datum).getWeek(),
			epost: req.body.epost,
			ort: req.body.ort,
			extra: req.body.extra,
			ovrinfo: req.body.ovrinfo,
			produkt: req.body.produkt,
			fasttid: req.body.fasttid,
			avklarad: req.body.avklarad,
			inbokad: req.body.inbokad
		}
		db.customers.update({_id: ObjectId(req.query.id)}, updatedcustomer, function(err, result){
			if(err){
				console.log(err);
			} else {
				res.redirect('/kommandeKorningar');
			}
		});
	}
	});

	router.delete('/users/delete/:id', ensureAuthenticated, function(req, res){
//		db.customers.remove({_id: ObjectId(req.params.id)}, function(err, result){
		db.customers.update({_id: ObjectId(req.params.id)},{ $set:{avklarad: "ja"}}, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/skapaBokning');
				
		});
	});
	



router.get('/', ensureAuthenticated, function(req, res){
	db.customers.find().sort({'datum':1}).toArray(function(err, docs){
		res.render('index', {
			customers: docs
		});
	});
});

router.get('/index', ensureAuthenticated, function(req, res){
	db.customers.find().sort({'datum':1}).toArray(function(err, docs){
		res.render('index', {
			customers: docs
		});
	});
});

router.get('/skapaBokning', ensureAuthenticated, function(req, res){
var mysort = {datum: 1};
	db.customers.find().sort(mysort).toArray(function(err, result) {
		if (err) throw err;
//		console.log(result);
	});
	db.customers.find().sort({'datum':1}).toArray(function(err, docs){
		res.render('skapaBokning', {
			
			customers: docs
		});
	});
});



router.get('/kommandeKorningar', ensureAuthenticated, function(req, res){
	if (req.query.week){
		var thisWeek = req.query.week;
	} else{
		var thisWeek = new Date().getWeek();
	}
	
	if (req.query.year){
		var thisYear = req.query.year;
	} else{
		var thisYear = new Date().getFullYear();
	}
	
	db.customers.find().sort({'datum':1}).toArray(function(err, docs){
		res.render('kommandeKorningar', {
			customers: docs,
			week: thisWeek,
			year: thisYear
		});
	});
});

router.post('/newWeekDecr', ensureAuthenticated, function(req, res){
		var tempDate = new Date(req.body.ar-1, 11, 27);
		var checkWeek = tempDate.getWeek();
		if(req.body.vecka>0){
			res.redirect('/kommandeKorningar'+"?year="+req.body.ar+"&week="+req.body.vecka);
		}
		else if(checkWeek==53){
			
			var lastYear = req.body.ar - 1;
			res.redirect('/kommandeKorningar'+"?year="+lastYear+"&week="+53);
		}
		else{
			var lastYear = req.body.ar - 1;
			res.redirect('/kommandeKorningar'+"?year="+lastYear+"&week="+52);
		}
});

router.post('/deleteEntry', ensureAuthenticated, function(req, res){
		db.customers.remove({_id: ObjectId(req.query.id)}, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/kommandeKorningar');
				
		});
	});
	
	router.post('/markComplete', ensureAuthenticated, function(req, res){
		db.customers.update({_id: ObjectId(req.query.id)},{ $set:{avklarad: "ja"}}, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/kommandeKorningar');
				
		});
	});
	
	router.post('/markBooked', ensureAuthenticated, function(req, res){
		db.customers.update({_id: ObjectId(req.query.id)},{ $set:{inbokad: "ja"}}, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/kommandeKorningar');
				
		});
	});
	
	router.post('/showBooking', ensureAuthenticated, function(req, res){
			res.redirect('/bokning'+'?id='+req.query.id);
	});
	
	router.get('/bokning', ensureAuthenticated, function(req, res){
		db.customers.findOne({_id: ObjectId(req.query.id)}, function(err, docs){
			res.render('bokning', {
				customer: docs
			});
		});
	});

router.post('/newWeekIncr', ensureAuthenticated, function(req, res){
		var tempDate = new Date(req.body.ar, 11, 27);
		var checkWeek = tempDate.getWeek() - -1;
		if(req.body.vecka<checkWeek){
			res.redirect('/kommandeKorningar'+"?year="+req.body.ar+"&week="+req.body.vecka);
		}
		else{
			var nextYear = req.body.ar - -1;
			res.redirect('/kommandeKorningar'+"?year="+nextYear+"&week="+1);
		}
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;