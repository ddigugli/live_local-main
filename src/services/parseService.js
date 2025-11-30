// initalize parse for back4app
import Parse from 'parse';

// Back4App credentials
const APP_ID = 'OzeGZnVRk2XBdXanHmKdT5ZGrQVcBBDFbcp1b5es'; // process.env.REACT_APP_PARSE_APP_ID
const JS_KEY = 'WmAlAUboHcTJo3pNg72zZ5I3dQvofRQNRGvR2BDK'; // process.env.REACT_APP_PARSE_JS_KEY;
const PARSE_URL = 'https://parseapi.back4app.com/'; // process.env.REACT_APP_PARSE_SERVER_URL || 'https://parseapi.back4app.com/';
Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = PARSE_URL;
// Warn in dev if env vars are not set (helps debugging deployments)
if (!APP_ID || !JS_KEY) {
	// eslint-disable-next-line no-console
	console.warn('Parse credentials are not set. Make sure REACT_APP_PARSE_APP_ID and REACT_APP_PARSE_JS_KEY are provided.');
}

// Export a small helper indicating whether Parse credentials are configured
export const isParseConfigured = !!APP_ID && !!JS_KEY;

// In development, print a masked preview so you can verify the app picked up env vars
if (process.env.NODE_ENV !== 'production') {
	try {
		const preview = {
			configured: isParseConfigured,
			appIdPreview: APP_ID ? `${String(APP_ID).slice(0, 6)}...` : null,
			jsKeyPreview: JS_KEY ? `${String(JS_KEY).slice(0, 6)}...` : null,
			serverURL: PARSE_URL
		};
		// eslint-disable-next-line no-console
		console.info('Parse initialization preview:', preview);
	} catch (e) {
		// ignore logging errors
	}
}

// DEV: instrument the Parse REST controller to log outgoing request headers (masked)
if (process.env.NODE_ENV !== 'production') {
	try {
		const core = Parse.CoreManager;
		if (core && typeof core.getRESTController === 'function') {
			const rest = core.getRESTController();
			if (rest && typeof rest.ajax === 'function') {
				const originalAjax = rest.ajax.bind(rest);
				rest.ajax = function(method, url, data, headers) {
					try {
						const mask = (v) => (typeof v === 'string' && v.length > 6 ? `${v.slice(0,6)}...` : v);
						const previewHeaders = {};
						if (headers && typeof headers === 'object') {
							Object.keys(headers).forEach((k) => {
								if (k.toLowerCase().includes('parse')) {
									previewHeaders[k] = mask(headers[k]);
								} else {
									previewHeaders[k] = headers[k];
								}
							});
						}
						// eslint-disable-next-line no-console
						console.debug('Parse REST request', { method, url, headers: previewHeaders });
					} catch (e) {
						// ignore
					}
					return originalAjax(method, url, data, headers);
				};
			}
		}
	} catch (e) {
		// ignore instrumentation errors
	}
}

export default Parse;
