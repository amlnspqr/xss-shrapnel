// ==UserScript==
// @name        Submit form
// @namespace   *
// @description Submit form
// @include     *
// @version     1
// @grant       none
// ==/UserScript==

var bForceUrlEncoded = 1
var bFillHiddenForms = 1

var iPayload = 0

var aPayloads = ['aaa"bbb\'ccc<ddd>eee', 'aaa"bbb\'eee', 'aaa"eee']
var regex = /aaa.*?eee/g

window.addEventListener
(
	'keydown', 
	function (e)
	{
		if (e.altKey || e.modifiers)
		{
			if (e.keyCode == 72)
				bFillHiddenForms = parseInt (prompt ('Fill hidden forms?', bFillHiddenForms))
			
			if (e.keyCode == 80)
				iPayload = parseInt (prompt ('Choose payload', iPayload)) % 3
			
			if ((e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') && e.target.form)
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
		aPostData.push (encodeURIComponent (form [i].name) + '=' + encodeURIComponent (form [i].value))
	
	bForceUrlEncoded && (form.enctype = 'application/x-www-form-urlencoded')
	
	confirm (form.action ? form.action : location.href + '\r\n\r\n' + aPostData.join ('&')) && HTMLFormElement.prototype.submit.call (form)
}

function fillForm (form)
{
	for (var i = 0; i < form.length; i++)
		form [i].type == 'file' || !bFillHiddenForms && form [i].type == 'hidden' || (form [i].value = aPayloads [iPayload])
	
	return 1
}