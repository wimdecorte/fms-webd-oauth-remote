function getProviderInfo(fmsDNS, callback) {
	var xhr = new XMLHttpRequest();
	var server = 'https://' + fmsDNS;
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			var providerInfo = null;
			if (xhr.status == 200 && xhr.responseText != null && xhr.responseText != '') {
				providerInfo = xhr.responseText;
			}
			if (callback) {
				callback(providerInfo);
			}
		}
	};
	xhr.open('GET', server + '/fmi/webd/oauthapi/oauthproviderinfo', true);
	xhr.send();
}

/* NOW RUNS ON THE FMS BOX
function getOAuthURL(trackingId, fmsDNS, provider, callback) {
	var xhr, queryStr;
	var fmsUrl = 'https://' + fmsDNS;
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			if (callback) {
				var requestID = xhr.getResponseHeader('X-FMS-Request-ID');
				var responseText = xhr.responseText;
				// send back both the actual URL and the requestId (first of the two pieces needed for actual login)
				callback(responseText, requestID);
			}
		}
	};
	queryStr = 'trackingID=' + trackingId + '&provider=' + provider + '&address=' + fmsDNS + '&X-FMS-OAuth-AuthType=2';
	xhr.open('GET', fmsUrl + '/fmi/webd/oauthapi/getoauthurl?' + queryStr, true);
	xhr.setRequestHeader('X-FMS-Application-Type', '8');
	// xhr.setRequestHeader('X-FMS-Application-Version', '17');
	// xhr.setRequestHeader('X-FMS-Return-URL', window.location.origin + '/fmi/webd/oauth-landing.html');
	xhr.setRequestHeader('X-FMS-Return-URL', fmsUrl + '/fmi/webd/oauth-landing.html');

	// this is where FMS will redirect to once it is done, the identifier will be in the URL at this point
	//xhr.setRequestHeader('X-FMS-Return-URL', 'https://neede.ets.fm/blank.html');
	xhr.send();
}
*/

function doOAuthLogin(dbName, requestId, identifier, homeurl, autherr, fmsDNS) {
	var form, node, queryStr;
	var server = 'https://' + fmsDNS;

	form = document.createElement('form');
	form.style.display = 'none';
	form.action = server + '/fmi/webd/' + encodeURIComponent(dbName);
	form.method = 'POST';
	form.target = '_self';

	node = document.createElement('input');
	node.type = 'text';
	node.name = 'user';
	node.value = requestId;
	form.appendChild(node.cloneNode());

	node = document.createElement('input');
	node.type = 'text';
	node.name = 'pwd';
	node.value = identifier;
	form.appendChild(node.cloneNode());

	queryStr = 'lgcnt=1&oauth=1';
	if (homeurl != '') {
		queryStr += ('&homeurl=' + homeurl);
	}
	if (autherr != '') {
		queryStr += ('&autherr=' + autherr);
	}

	if (queryStr != '') {
		form.action += ('?' + queryStr);
	}

	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
