

function fillForms ()
{
	for (var i = 0; i < document.forms.length; i++)
	{
		var form = document.forms [i]
		
		form.target = '_blank'
		
		fillForm (form) && submitForm (form)
	}
}
/ ==UserScript==
// @name        XSS Shrapnel
// @namespace   *
// @description aaa"bbb'ccc<ddd>eee
// @include     *
// @version     2.1
// @grant       none
// ==/UserScript==

var bForceUrlEncoded = 1
var bFillHiddenForms = 0

var iPayload = 0

var aPayloads = ['aaa"bbb\'ccc<ddd>eee', 
		 'aaa"bbb\'eee', 
		 'aaa"eee', 
		 'aaa"bbb\'ccc>ddd<eee', 
		 'aaa"bbb\'ccc<<ddd>ddd<ddd>>eee', 
		 'aaa\\"bbb\'ccc<ddd>fff</eee>']

var regex = /aaa.*?eee/gi
var regex = /.{0,100}aaa.{0,50}?eee.{0,100}/gi

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
				
				sPrompt == null || (bFillHiddenForms = parseInt (sPrompt))
			}
			
			if (e.keyCode == 80)
			{
				var sPrompt = prompt ('Choose payload', iPayload)
				
				sPrompt == null || (iPayload = parseInt (sPrompt) % aPayloads.length)
				
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
	
	//	str.split (/([\s\S]{50})/).filter (function (x) {return x})
	
	matches instanceof Array && alert (matches.join ('\r\n\r\n'))
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
	
	var sFormAction = form.action ? form.action : location.protocol + '//' + location.host + location.pathname
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
