// ==UserScript==
// @name        Submit form
// @namespace   *
// @description Submit form
// @include     *
// @version     1
// @grant       none
// ==/UserScript==

var payload = 'aaa"bbb\'ccc<ddd>eee'
var regex = /aaa.*?eee/g							//	(new XMLSerializer().serializeToString(document)).match (/aaa.*?eee/g)

window.addEventListener 
(
	'keydown', 
	function (e)
	{
		if ((e.altKey || e.modifiers) && (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') && e.target.form)
		{
			var parentForm = e.target.form
			
			e.keyCode == 83 && submitForm (parentForm)
			e.keyCode == 65 && fillForm (parentForm) && submitForm (parentForm)
		}
	}, 
	false
)

function submitForm (form)
{
	confirm ('Submit?') && HTMLFormElement.prototype.submit.call (form)
}

function fillForm (form)
{
	for (var i = 0; i < form.length; i++)
		form [i].type == 'file' || (form [i].value = payload)
	
	return 1
}