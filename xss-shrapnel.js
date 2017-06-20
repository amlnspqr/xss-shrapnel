// ==UserScript==
// @name        Submit form
// @namespace   *
// @description Submit form
// @include     *
// @version     1
// @grant       none
// ==/UserScript==

var bForceUrlEncoded = 1
var bFillHiddenForms = 0

var iPayload = 0

var aPayloads = ['aaa"bbb\'ccc<ddd>eee', 'aaa"bbb\'eee', 'aaa"eee', 'aaa\\"bbb\'ccc<ddd>eee</fff>']
var regex = /aaa.*?eee/g

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
			}
			
			if (e.target.form)
			{
				var parentForm = e.target.form
				
				e.keyCode == 83 && submitForm (parentForm)
				e.keyCode == 65 && fillForm (parentForm) && submitForm (parentForm)
			}
		}
	}, 
	false
)

function submitForm (form)
{
	var aPostData = []
	
	for (var i = 0; i < form.length; i++)
	{
		var sPostData = encodeURIComponent (form [i].name) + '=' + encodeURIComponent (form [i].value)
		
		form [i].name && aPostData.indexOf (sPostData) == -1 && aPostData.push (sPostData)
	}
	
	bForceUrlEncoded && (form.enctype = 'application/x-www-form-urlencoded')
	
	var sFormAction = form.action ? form.action : location.pathname
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
