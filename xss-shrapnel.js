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

var sPayload = aPayloads [iPayload]

window.addEventListener
(
	'keydown', 
	function (e)
	{
		if ((e.altKey || e.modifiers) && (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') && e.target.form)
		{
			var parentForm = e.target.form
			
			bForceUrlEncoded && (parentForm.enctype = 'application/x-www-form-urlencoded')
			
			e.keyCode == 83 && submitForm (parentForm)
			e.keyCode == 65 && fillForm (parentForm) && submitForm (parentForm)
		}
	}, 
	false
)

function submitForm (form)
{
	var aPostData = []
	
	for (var i = 0; i < form.length; i++)
		aPostData.push (encodeURIComponent (form [i].name) + '=' + encodeURIComponent (form [i].value))
		
	confirm (form.action + '\r\n\r\n' + aPostData.join ('&')) && HTMLFormElement.prototype.submit.call (form)
}

function fillForm (form)
{
	for (var i = 0; i < form.length; i++)
		form [i].type == 'file' || (form [i].value = sPayload)
	
	return 1
}