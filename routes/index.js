
/*
 * GET home page.
 */

module.exports = function(app) {
	app.get('/', function(req, res){
		
		query = dbclient.query('SELECT * FROM user_registration WHERE user_type = 1', function(err, results, fields) {
			  if (err) {
			    throw err;
			  }	

			res.render('index', { title: 'KnowPronto - Your 1 to 1 video study portal', advisers: results.length, landingPage: true});
		  }
		);

	});

	// Getting user profile
	app.get('/:name', function(req, res){
		var profile = true;
		
		var resAll = [];
		
		dbclient.query('SELECT * FROM user_registration WHERE username = "'+ req.params.name +'"', function(err, result1) {
					
					
			resAll = result1[0];
		
			
			if(typeof(resAll) !== 'undefined') {
				console.log(resAll.user_id);
				dbclient.query('SELECT * FROM price_management WHERE user_id = ' + resAll.user_id, function(err, result2) {
						    
						    
						    if(result2.length > 0) {
						    	var site_com = result2[0].price / 10;
						    	var user_hour_rate = result2[0].price + site_com;	
						    } else {
						    	var user_hour_rate = 0;
						    }
						    

						    //console.log(result2);

						  	if(result1.length > 0) {
								res.render('profile', { title: 'User profile - ' + req.params.name, loggedIn: true, user_info: result1[0], user_price: user_hour_rate });  	
							} else {
							  	res.redirect('/');
							}

						});
			} else {
				console.log("I'm error");
			}
			

			/*
			console.log(resAll);

			res.render('test', { title: 'Create an account with KP'});
			*/
		});

		/*
		switch(req.params.name) {
			case "login":
				res.send("Hello from login page!");
				break;
			case "signup":
				res.render('signup', { title: 'Create an account with KP'});
				break;
			default:
				
				
					dbclient.query('SELECT * FROM user_registration WHERE username = "'+ req.params.name +'"', function(err, result1) {
					
					
						resAll = result1[0];
					
						//console.log(max);
						
					});

				console.log(resAll);

				dbclient.query('SELECT * FROM price_management WHERE user_id = ' + resAll.user_id, function(err, result2) {
						    
						    
						    if(result2.length > 0) {
						    	var site_com = result2[0].price / 10;
						    	var user_hour_rate = result2[0].price + site_com;	
						    } else {
						    	var user_hour_rate = 0;
						    }
						    

						    //console.log(result2);

						  	if(result1.length > 0) {
								res.render('profile', { title: 'User profile - ' + req.params.name, loggedIn: true, user_info: result1[0], user_price: user_hour_rate });  	
							} else {
							  	res.redirect('/');
							}

						});
				

				
				break;	
		}
		*/
	}); 
	
	// Check username while signing up
	app.post('/uscheck', function(req, res){
		// make a query to check user is available or not
		console.log(req.body.name);
		query = dbclient.query('SELECT username FROM user_registration WHERE username = "' + req.body.name + '"', function(err, results, fields) {
		  if (err) {
		    throw err;
		  }
		  	//res.render('users/index', {title: 'Users', users: results});
		  	if(results.length > 0) {
		  		res.send('2');
		  	} else {
		  		res.send('1');
		  	} 
		  }
		);
	});
	// Check email address while signing up
	app.post('/emcheck', function(req, res){
		// make a query to check user is available or not
		console.log(req.body.email); 

		query = dbclient.query('SELECT email_address FROM user_registration WHERE email_address = "' + req.body.email + '"', function(err, results, fields) {
		  if (err) {
		    throw err;
		  }
		  	//res.render('users/index', {title: 'Users', users: results});
		  	if(results.length > 0) {
		  		res.send('2');
		  	} else {
		  		res.send('1');
		  	} 
		  }
		);
	});

	app.get('/q/queryCheck', function(req, res){

		TIME_CHECK = 1376521772;
		TOPIC_ID = 900;
		MEMBER_ID = 0;
		
		query = "SELECT ur.*,(SELECT round( avg( `question_3` ) , 2 )FROM `chat_feedback` fr WHERE fr.advisor_id = ur.user_id ) AS valyeformoney,";
		query += "				(SELECT round( avg( `rating_from_advisors` ) , 2 )FROM `chat_feedback` fr WHERE fr.advisor_id = ur.user_id ) AS avaragerate ,";
		query += "				(SELECT count(fr.advisor_id) FROM `chat_feedback` fr WHERE fr.advisor_id=ur.user_id) as review, ";
		query += "				(select count(sd.user_id) FROM sessiondata sd where sd.user_id=ur.user_id) as online,";
		query += "				(SELECT price from price_management pm where pm.user_id = ur.user_id LIMIT 1) as price ,";
		query += "				IFNULL((SELECT knowledge_level FROM knowledge_level WHERE user_id = ur.user_id AND topic_id = '900' GROUP BY ur.user_id),10) AS know,";
		query += "				IFNULL((SELECT id FROM topics_video WHERE user_id = ur.user_id AND topics_id = '900' ), 0 ) AS topicvideo ,";
		query += "				(SELECT count( cfr.advisor_id ) FROM chat_feedback cfr WHERE cfr.advisor_id = ur.user_id) AS totalchat ";
		query += " FROM user_registration ur,user_subject us WHERE ur.user_id=us.user_id AND ur.user_id != '0' AND ( us.topic_id = '900' ) GROUP BY ur.user_id ORDER BY online ASC";
		
		dbclient.query(query, function(err, results, fields) {
			  if (err) {
			    throw err;
			  }	
			  console.log(results);
			res.send(results);
		  }
		);

	});

};