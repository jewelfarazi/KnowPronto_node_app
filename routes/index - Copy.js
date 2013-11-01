
/*
 * GET home page.
 */
/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
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
		
		
		switch(req.params.name) {
			case "login":
				res.send("Hello from login page!");
				break;
			case "signup":
				res.render('signup', { title: 'Create an account with KP'});
				break;
			default:

				dbclient.query('SELECT * FROM user_registration WHERE username = "'+ req.params.name +'"', function(err, result1) {
					
					/*
					if(typeof(result1[0].user_id) != "undefined") {
						var u_i = result1[0].user_id;
					} else {
						var u_i = 0;
					}
					*/
					

						console.log(result1[0].user_id);	
					
					
				  dbclient.query('SELECT * FROM price_management WHERE user_id = 1121', function(err, result2) {
				    
				    
				    if(result2.length > 0) {
				    	var site_com = result2[0].price / 10;
				    	var user_hour_rate = result2[0].price + site_com;	
				    } else {
				    	var user_hour_rate = 0;
				    }
				    

				    console.log(result2);

				  	if(result1.length > 0) {
						res.render('profile', { title: 'User profile - ' + req.params.name, loggedIn: true, user_info: result1[0], user_price: user_hour_rate });  	
					} else {
					  	res.redirect('/');
					}

				  });
				});

				/*
				QUERY1 = 'SELECT * FROM user_registration WHERE username = "'+ req.params.name +'"';
				QUERY2 = 'SELECT * FROM price_management WHERE user_id = "'+ req.params.name +'"';
				async.parallel([
				  function(callback) { db.query(QUERY1, callback) },
				  function(callback) { db.query(QUERY2, callback) }
				], function(err, results) {
				  res.render('template', { rows : results[0], rows2 : results[1] });
				});

				dbclient.end();

				console.log(user_info);

				/*
				if(user_info.length > 0) {
					res.render('profile', { title: 'User profile - ' + req.params.name, loggedIn: true, user_info: user_info[0] });  	
				} else {
				  	res.redirect('/');
				}
				*/
				break;	
		}

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
		/*
		QUERY = "SELECT ur.*,( 
		   			SELECT round( avg( `question_3` ) , 2 )FROM `chat_feedback` fr WHERE fr.advisor_id = ur.user_id ) AS valyeformoney,( 
		   			SELECT round( avg( `rating_from_advisors` ) , 2 )FROM `chat_feedback` fr WHERE fr.advisor_id = ur.user_id ) AS avaragerate ,(
		   			SELECT count(fr.advisor_id)  FROM `chat_feedback` fr WHERE fr.advisor_id=ur.user_id) as review, (
		   			select count(sd.user_id) FROM sessiondata sd where sd.user_id=ur.user_id and sd.user_time > "+ TIME_CHECK +") as online,(
		   			SELECT price from price_management pm where pm.user_id =ur.user_id ORDER BY price_id DESC LIMIT 1) as price ,IFNULL((SELECT knowledge_level FROM knowledge_level WHERE user_id = ur.user_id AND topic_id = '"+ TOPIC_ID +"' GROUP BY ur.user_id),10) AS know,IFNULL( ( 
		   			SELECT id FROM topics_video WHERE user_id = ur.user_id AND topics_id = '"+ TOPIC_ID +"' ), 0 ) AS topicvideo , (
					SELECT count( cfr.advisor_id ) FROM chat_feedback cfr WHERE cfr.advisor_id = ur.user_id) AS totalchat From user_registration ur,user_subject us where  ur.user_id=us.user_id and ur.user_id != '"+ MEMBER_ID +"' group by ur.user_id  ORDER BY ur.user_id DESC";
		*/
		query = "SELECT ur.*,(SELECT round( avg( `question_3` ) , 2 )FROM `chat_feedback` fr WHERE fr.advisor_id = ur.user_id ) AS valyeformoney,";
		query += "				(SELECT round( avg( `rating_from_advisors` ) , 2 )FROM `chat_feedback` fr WHERE fr.advisor_id = ur.user_id ) AS avaragerate ,";
		query += "				(SELECT count(fr.advisor_id) FROM `chat_feedback` fr WHERE fr.advisor_id=ur.user_id) as review, ";
		query += "				(select count(sd.user_id) FROM sessiondata sd where sd.user_id=ur.user_id) as online,";
		query += "				(SELECT price from price_management pm where pm.user_id = ur.user_id LIMIT 1) as price ,";
		query += "				IFNULL((SELECT knowledge_level FROM knowledge_level WHERE user_id = ur.user_id AND topic_id = '900' GROUP BY ur.user_id),10) AS know,";
		query += "				IFNULL((SELECT id FROM topics_video WHERE user_id = ur.user_id AND topics_id = '900' ), 0 ) AS topicvideo ,";
		query += "				(SELECT count( cfr.advisor_id ) FROM chat_feedback cfr WHERE cfr.advisor_id = ur.user_id) AS totalchat ";
		query += " FROM user_registration ur,user_subject us WHERE ur.user_id=us.user_id AND ur.user_id != '0' AND ( us.topic_id = '900' ) GROUP BY ur.user_id ORDER BY online ASC";
		/*

		query = "SELECT user_subject.user_id,";
		query += "		user_subject.topic_id AS level2_id,";
		//query += "		topics.parentId AS level1_id,";
		query += "		topics.level";
		query += "	FROM user_subject,topics ";
		query += "	WHERE user_subject.user_id="+ MEMBER_ID +" AND topics.id = user_subject.topic_id ORDER BY topics.level ASC";

		*/

		//query = "SELECT round( avg( `rating_from_advisors` ) , 2 ) as rating,round( avg(question_3),2) as value,count(fr.advisor_id) as review FROM `chat_feedback` fr WHERE fr.advisor_id ="+ MEMBER_ID;

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