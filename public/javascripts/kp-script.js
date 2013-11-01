$(document).ready(function() {

	// set app url manually
	appUrl = 'http://localhost:3000';

	$('#access a, ul.h-nav li a').hover(function() {
		$(this).stop().animate({ 'opacity' : '1'}, 'slow');
	}, function() {
		$(this).stop().animate({ 'opacity' : '0.7'}, 'slow');
	});
	
	$('ul.h-icons li').hover(function() {
		$(this).find('.h-popup').stop().animate({ 'top' : '0'}, 'normal');
		$('#std, #std2, #std3, #std4, #std5, #std6, #std7, #std8').removeClass('init');
		$('#adv, #adv2, #adv3, #adv4, #adv5, #adv6, #adv7, #adv8').addClass('init')
		$(this).find('.pop-content-adv').fadeIn();
	}, function() {
		$(this).find('.h-popup').stop().animate({ 'top' : '210'}, 'normal');
		$(this).find('.pop-content-adv').fadeOut();
	});

	$('#adv, #adv2, #adv3, #adv4, #adv5, #adv6, #adv7, #adv8').hover(function() {
			$('#std, #std2, #std3, #std4, #std5, #std6, #std7, #std8').removeClass('init');
		if($(this).hasClass('init')) {
			//do nothing
		} else {
			$('.pop-content-std').fadeOut('normal', function() {
				$('.pop-content-adv').fadeIn();
			});
			
			$(this).addClass('init')
		}
	}, function() {
		// do nothing
	}
	);

	$('#std, #std2, #std3, #std4, #std5, #std6, #std7, #std8').hover(function() {
			$('#adv, #adv2, #adv3, #adv4, #adv5, #adv6, #adv7, #adv8').removeClass('init');
		if($(this).hasClass('init')) {
			//do nothing
		} else {
			$('.pop-content-adv').fadeOut('normal', function() {
				$('.pop-content-std').fadeIn();	
			});
			
			$(this).addClass('init')
		}
	}, function() {
		// do nothing
	}
	);

	$('#adv, #adv2, #adv3, #adv4, #adv5, #adv6, #adv7, #adv8, #std, #std2, #std3, #std4, #std5, #std6, #std7, #std8').click(function(){
		return false;
	});

	// Registraton form
	$('#reg-submit').click(function() {
		// get the values from input fields
		var f_name = $('#reg-fname').val();
		var l_name = $('#reg-lname').val();
		var u_name = $('#reg-username').val();
		var pass   = $('#reg-password').val();
		var email  = $('#reg-email').val();
		var preg   = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		var u_type = $('#u_type').val();
		var tzone = $('#timezone').val();
		var error  = false;


		// conditions for fields
		if(f_name == "") {
			$('.fn-error').fadeIn(function() {
				$(this).delay(3000).fadeOut('slow');
			});
			error = true;
		} 

		if(l_name == "") {
			$('.ln-error').fadeIn(function() {
				$(this).delay(3200).fadeOut('slow');
			});
			error = true;
		} 

		if(u_name == "") {
			$('.u-error').fadeIn(function() {
				$(this).delay(3400).fadeOut('slow');
			});
			error = true;
		} 

		if(pass == "") {
			$('.pw-error').fadeIn(function() {
				$(this).delay(3600).fadeOut('slow');
			});
			error = true;
		} 

		if(!preg.test( email ) || email == "") {
			$('.e-error').fadeIn(function() {
				$(this).delay(3800).fadeOut('slow');
			});
			error = true;
		}

		

		// start ajax calling
		$('.loading').fadeIn('fast');
		// error check
		if(!error) {
			
			var URL = APPLICATION_URL+"authentication/signup";

			$.ajax(
					{
						url: URL,
						type: 'POST',
						data: "f_name=" + f_name + "&l_name=" + l_name + "&u_name=" + u_name + "&pass=" + pass + "&email=" + email + "&type=" + u_type + "&tzone=" + tzone,
						success: function(result) 
						{
							//console.log(result);
							//alert(result);
							$('.loading').fadeOut('fast',function() {

								if(result == 1) {
									$('.u-error').text("Username not available");
									$('.u-error').fadeIn(function() {
										$(this).delay(3400).fadeOut('slow', function() {
											$(this).text("Please Enter Username");
										});
									});
								} else if(result == 2) {
									$('.e-error').text("Email is already registered");
									$('.e-error').fadeIn(function() {
										$(this).delay(3400).fadeOut('slow', function() {
											$(this).text("Please Enter Email");
										});
									});
								} else {
									window.location.href = APPLICATION_URL+"authentication/price";
								}

							});
							
						}
					}
				);

			return false;

		} else {
			$('.loading').fadeOut('fast');
				return false;
			}

		});
		// live username checking on blur
		$('#reg-username').blur(function() {
			
			$('.u-error').hide();
			$('.loading2').fadeIn('fast');
			var username = $(this).val();

			var data = {};
			data.name = username;

			var URL = appUrl + '/uscheck';

			$.ajax({
				
				type: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json',
                url: URL,						
                success: function(result) {

                    $('.loading2').fadeOut('fast', function() {
						if(result == "2") {
							$('.u-error').text("Username not available");
							$('.u-error').fadeIn(function() {
								$(this).delay(3400).fadeOut('slow', function() {
									$(this).text("Please Enter Username");
								});
							});
						} 
					});
                }

			});
		});
	// live email checking on blur
	$('#reg-email').blur(function() {
		
		$('.e-error').hide();
		$('.loading3').fadeIn('fast');
		var email = base64_encode($(this).val());

		var data = {};
			data.email = email;

		var URL = appUrl + '/emcheck';

		$.ajax({
			
			type: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json',
                url: URL,						
                success: function(result) {

                    $('.loading3').fadeOut('fast', function() {
						if (result == "2") {
							$('.e-error').text("Email is already registered");
							$('.e-error').fadeIn(function() {
								$(this).delay(3400).fadeOut('slow', function() {
									$(this).text("Please Enter Email");
								});
							});
							
						} 
					});
                }	
			
		});

	});

	function base64_encode (data) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Tyler Akins (http://rumkin.com)
	  // +   improved by: Bayron Guevara
	  // +   improved by: Thunder.m
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: Pellentesque Malesuada
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   improved by: Rafał Kukawski (http://kukawski.pl)
	  // *     example 1: base64_encode('Kevin van Zonneveld');
	  // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	  // mozilla has this native
	  // - but breaks in 2.0.0.12!
	  //if (typeof this.window['btoa'] == 'function') {
	  //    return btoa(data);
	  //}
	  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	    ac = 0,
	    enc = "",
	    tmp_arr = [];

	  if (!data) {
	    return data;
	  }

	  do { // pack three octets into four hexets
	    o1 = data.charCodeAt(i++);
	    o2 = data.charCodeAt(i++);
	    o3 = data.charCodeAt(i++);

	    bits = o1 << 16 | o2 << 8 | o3;

	    h1 = bits >> 18 & 0x3f;
	    h2 = bits >> 12 & 0x3f;
	    h3 = bits >> 6 & 0x3f;
	    h4 = bits & 0x3f;

	    // use hexets to index into b64, and append result to encoded string
	    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	  } while (i < data.length);

	  enc = tmp_arr.join('');

	  var r = data.length % 3;

	  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

	}

});