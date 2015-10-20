/*
 @licstart  The following is the entire license notice for the
    JavaScript code in this page.

 Copyright (C) 2014 Center for Rights in Action
 Copyright (C) 2014 Jeff Lyon

 The JavaScript code in this page is free software: you can
 redistribute it and/or modify it under the terms of the GNU
 General Public License (GNU GPL) as published by the Free Software
 Foundation, either version 3 of the License, or (at your option)
 any later version. The code is distributed WITHOUT ANY WARRANTY;
 without even the implied warranty of MERCHANTABILITY or FITNESS
 FOR A PARTICULAR PURPOSE. See the GNU GPL for more details.

 As additional permission under GNU GPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 @licend  The above is the entire license notice
    for the JavaScript code in this page.
 */

window.setTimeout(function() {
	document.getElementById('scene1').style.display = 'block';
}, 100);

document.getElementById('letter_link').addEventListener('click', function(e) {
	e.preventDefault();
	document.getElementById('letter').style.display = 'block';
	setTimeout(function() {
		document.getElementById('letter').className = 'visible';
	}, 30);
}, false);
document.getElementById('close_letter').addEventListener('click', function(e) {
	e.preventDefault();
	document.getElementById('letter').className = '';
	setTimeout(function() {
		document.getElementById('letter').style.display = 'none';
	}, 400);
}, false);

window.setTimeout(function() {
	// Hide the flash, explicitly.
	document.getElementById('flash').style.display = 'none';

	var cta = document.getElementById('cta');
	// var str = 'Two years after the NSA revelations, the US Congress is still failing to protect our rights. Now they\'re about to vote on CISA, a bill that could end privacy on the Internet and make us all vulnerable to cyber attacks.';
	var str = 'This week, Congress is voting on CISA, a fake cybersecurity bill that turns websites into government spies, and puts all of our data at greater security risk. Don\'t let Congress break the Internet.';

	var fragment = document.createDocumentFragment();
	for (var i = 0; i < str.length; i++) {
		var span = document.createElement('span');
		span.style.color = 'transparent';
		span.innerHTML = str[i];
		fragment.appendChild(span);
	}
	cta.appendChild(fragment.cloneNode(true));

	var children = cta.childNodes;

	var setDisplayDelay = function(node, delay) {
		setTimeout(function() {
			node.style.color = 'white';
		}, delay);
	}

	var delay = 0;
	for (var i = 0; i < children.length; i++)
	{
		if (i && (children[i-1].innerHTML == '.'))
			delay += 366;
		else
			delay += 25;
		setDisplayDelay(children[i], delay)
	}
	setTimeout(function() {
		document.querySelector('.learn').style.opacity = 1;
	}, delay+500);
	setTimeout(function() {
		document.getElementById('button_glow').className = 'animate';

		setTimeout(function() {
			document.querySelector('form').style.display = 'block';
			setTimeout(function() {
				document.querySelector('form').className = 'visible';

			}, 50);
		}, 1000);


		setTimeout(function() {
			document.getElementById('logo').style.display = 'block';
			setTimeout(function() { 
				document.getElementById('logo').className = 'visible';
			}, 50);
		}, 1000);
	}, 6000);

}, 6500);

// }, 1); // JL HACK

var animations = {
	main: {
		options: {
			debug: false,
		},
		init: function(options) {
			for (var k in options) this.options[k] = options[k];
			return this;
		},
		start: function() {
			this.log('RTN ANIMATION STARTING lol');
			trackLeaderboardStat({
                stat: 'display_widget',
                data: null,
                callback: function() {}
            });
		},
		log: function() {
			if (this.options.debug)
				console.log.apply(console, arguments);
		}
	}
}

/**
 * Generates a GUID string.
 * @returns {String} The generated GUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 */
var guid = function() {
    var _p8 = function(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}


var host = null;
var session = guid();

window.addEventListener('message', function(e) {
	if (!e.data || !e.data.RTN_WIDGET_MSG)
		return;

	delete e.data.RTN_WIDGET_MSG;

	if (e.data.HOST_NAME)
    {
        host = e.data.HOST_NAME;
        delete e.data.HOST_NAME;
    }

	switch (e.data.requestType) {
		case 'putAnimation':
			animations[e.data.modalAnimation].init(e.data).start();
			break;
	}
});

var sendMessage = function(requestType, data)
{
	data || (data = {});
	data.requestType = requestType;
	data.RTN_IFRAME_MSG = true;
	parent.postMessage(data, '*');
}


sendMessage('getAnimation');

// Add close button listener.
document.getElementById('close').addEventListener('click', function(e) {
	e.preventDefault();
	sendMessage('stop');
	trackLeaderboardStat({
        stat: 'close_widget',
        data: null,
        callback: function() {}
    });
});

var FORM_SUBMITTED = false;

document.querySelector('form').addEventListener('submit', function(e) {
	e.preventDefault();

	if (FORM_SUBMITTED)
		return callSubmit();

    var error = false;

    var add_error = function(el) {
        el.className = 'error';
        error = true;
    };

    var first_name = document.querySelector("input[name='name']");
    var email = document.querySelector("input[name='email']");
    var address1 = document.querySelector("input[name='address1']");
    var zip = document.querySelector("input[name='zip']");
    var textarea = document.querySelector("textarea");

    if (!first_name.value)
        add_error(first_name);

    if (!email.value)
        add_error(email);

    if (!address1.value)
        add_error(address1);

    if (!zip.value)
        add_error(zip);

    if (!textarea.value) add_error(textarea);

    if (error) return alert('Please fill out all fields :)');

    var data = {
        email:          email ? email.value : null,
        first_name:     first_name ? first_name.value : null,
        address1:       address1 ? address1.value : null,
        zip:            zip ? zip.value : null,
        subject:        'Please vote NO on CISA',
        action_comment: textarea.value
    };

    var formData = new FormData();
    formData.append('guard', '');
    formData.append('hp_enabled', true);
    formData.append('member[email]', data.email);

    if (data.first_name)
        formData.append('member[first_name]', data.first_name);

    if (data.address1)
        formData.append('member[street_address]', data.address1);

    if (data.zip)
        formData.append('member[postcode]', data.zip);

    if (data.subject)
        formData.append('subject', data.subject);

    if (data.action_comment)
        formData.append('action_comment', data.action_comment);

    formData.append('org', 'fftf');
    formData.append('tag', 'decidethefuture-widget');

    var url = 'https://queue.fightforthefuture.org/action';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('response:', xhr.response);
        }
    }.bind(this);
    xhr.open("post", url, true);
    xhr.send(formData);

    FORM_SUBMITTED = true;

    document.getElementById('action1').className = 'action';
    setTimeout(function() {
    	document.getElementById('action1').className = 'action nodisplay';
    	document.getElementById('action2').className = 'action';
    	setTimeout(function() {
    		document.getElementById('action2').className = 'action visible';
    		document.getElementById('shares').style.opacity = 1;
    	}, 10);
    }, 500);
    document.getElementById('button_glow').className = '';

    trackLeaderboardStat({
        stat: 'email',
        data: null,
        callback: function() {}
    });

    /*
    this.orgController.submit(data);

    this.form.style.display = 'none';

    if (typeof this.onSend == 'function')
        this.onSend(data);
    */
});

var callSubmit = function() {
	var phone = document.querySelector("input[name='phone']");

	var validatePhone = function(num) {
        num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
        num = num.replace("+", "").replace(/\-/g, '');

        if (num.charAt(0) == "1")
            num = num.substr(1);

        if (num.length != 10)
            return false;

        return num;
    };

    if (!validatePhone(phone.value)) {
        phone.className = phone.className + ' error';
        alert('Please enter a valid US phone number!');
        return phone.focus();
    }

    var data = new FormData();
    data.append('campaignId', 'cisa-cloture-fax');

    data.append('zipcode', document.querySelector("input[name='zip']").value);

    data.append('userPhone', validatePhone(phone.value));

    var url = 'https://call-congress.fightforthefuture.org/create';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('sent!', xhr.response);
        }
    }.bind(this);
    xhr.open("post", url, true);
    xhr.send(data);

    var button = document.getElementById('call_button');

    // button.disabled = true;
    button.className = 'gray narrow';
    button.textContent = "calling...";

    setTimeout(function() {
    	document.getElementById('action2').className = 'action';
	    setTimeout(function() {
	    	document.getElementById('action2').className = 'action nodisplay';
	    	document.getElementById('action3').className = 'action';
	    	setTimeout(function() {
	    		document.getElementById('action3').className = 'action visible';
	    	}, 10);
	    }, 500);
    }, 3000);

    trackLeaderboardStat({
        stat: 'call',
        data: null,
        callback: function() {}
    });
}

var trackLeaderboardStat = function(options) {
    options || (options = {});
    options.stat || (options.stat = 'unknown');
    options.data || (options.data = null);
    options.callback || (options.callback = function() {});


    if (!host)
        return;

    var data = {
        campaign: 'decidethefuture-widget',
        stat: options.stat,
        data: options.data,
        host: host,
        session: session
    };

    // Serialize data
    var params = '';
    for (var key in data) {
        if (params.length !== 0) {
            params += '&';
        }

        params += key + '=' + data[key];
    }

    var http = new XMLHttpRequest();
    var url = 'https://fftf-host-counter.herokuapp.com/log';
    http.open('POST', url, true);

    // Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

     // Call a function when the state changes.
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var res = JSON.parse(http.responseText);
            options.callback(res);
        }
    };

    http.send(params);
}
document.querySelector('p.learn a').addEventListener('click', function(e) {
	trackLeaderboardStat({
        stat: 'learn_more',
        data: null,
        callback: function() {}
    });
});