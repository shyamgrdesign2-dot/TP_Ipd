import * as e from "react";
import { createContext as t, forwardRef as n, isValidElement as r, useContext as i, useEffect as a, useId as o, useImperativeHandle as s, useLayoutEffect as c, useMemo as l, useRef as u, useState as d, useSyncExternalStore as f } from "react";
import { createPortal as p } from "react-dom";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
var _ = {
	button: "_button_w3xuh_8",
	content: "_content_w3xuh_897",
	loaderOverlay: "_loaderOverlay_w3xuh_908",
	icon: "_icon_w3xuh_918",
	splitGroup: "_splitGroup_w3xuh_956",
	menu: "_menu_w3xuh_1022",
	menuItem: "_menuItem_w3xuh_1032",
	menuItemLabel: "_menuItemLabel_w3xuh_1066",
	menuItemShortcut: "_menuItemShortcut_w3xuh_1070",
	menuItemChevron: "_menuItemChevron_w3xuh_1076"
}, v = {
	xs: 16,
	sm: 20,
	md: 24,
	lg: 32
};
function y(e) {
	return typeof e == "number" ? e : v[e] ?? v.md;
}
var b = {
	slow: 1.6,
	normal: 1,
	fast: .5
};
function x(e) {
	if (e == null || e === "normal") return null;
	if (typeof e == "number") return { "--tp-loader-duration": `${e}s` };
	let t = b[e];
	return t == null ? null : { "--tp-loader-speed": t };
}
var S = (e, t, n, r) => {
	let i = r * Math.PI / 180;
	return [e + n * Math.cos(i), t + n * Math.sin(i)];
};
function C({ dim: e }) {
	return /* @__PURE__ */ g("svg", {
		className: "tp-loader__glyph",
		"data-type": "line-simple",
		width: e,
		height: e,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": !0,
		children: [/* @__PURE__ */ h("circle", {
			cx: "12",
			cy: "12",
			r: "9",
			stroke: "currentColor",
			strokeOpacity: "0.2",
			strokeWidth: "2.5"
		}), /* @__PURE__ */ h("path", {
			d: "M12 3a9 9 0 0 1 9 9",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinecap: "round"
		})]
	});
}
function w({ dim: e }) {
	return /* @__PURE__ */ h("svg", {
		className: "tp-loader__glyph",
		"data-type": "line-spinner",
		width: e,
		height: e,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": !0,
		children: Array.from({ length: 12 }, (e, t) => {
			let n = t * 30 - 90, [r, i] = S(12, 12, 5, n), [a, o] = S(12, 12, 9.5, n);
			return {
				x1: r,
				y1: i,
				x2: a,
				y2: o,
				opacity: .15 + t / 11 * .85
			};
		}).map((e, t) => /* @__PURE__ */ h("line", {
			x1: e.x1.toFixed(2),
			y1: e.y1.toFixed(2),
			x2: e.x2.toFixed(2),
			y2: e.y2.toFixed(2),
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			opacity: e.opacity.toFixed(2)
		}, t))
	});
}
function T({ dim: e }) {
	return /* @__PURE__ */ h("svg", {
		className: "tp-loader__glyph",
		"data-type": "dot-circle",
		width: e,
		height: e,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": !0,
		children: Array.from({ length: 8 }, (e, t) => {
			let [n, r] = S(12, 12, 8, t * 45 - 90);
			return {
				cx: n,
				cy: r,
				opacity: .15 + t / 7 * .85
			};
		}).map((e, t) => /* @__PURE__ */ h("circle", {
			cx: e.cx.toFixed(2),
			cy: e.cy.toFixed(2),
			r: "2",
			fill: "currentColor",
			opacity: e.opacity.toFixed(2)
		}, t))
	});
}
var E = {
	"line-simple": C,
	"line-spinner": w,
	"dot-circle": T
}, D = n(function({ type: e = "line-simple", size: t = "md", label: n, speed: r = "normal", color: i = "inherit", labelPosition: a = "end", className: o = "", style: s, ...c }, l) {
	let u = y(t), d = E[e] ?? C, f = {
		color: i,
		...x(r),
		...s
	};
	return /* @__PURE__ */ g("div", {
		ref: l,
		...c,
		className: ["tp-loader", o].filter(Boolean).join(" "),
		role: "status",
		"data-label-position": a,
		style: f,
		children: [/* @__PURE__ */ h(d, { dim: u }), n ? /* @__PURE__ */ h("span", {
			className: "tp-loader__label",
			children: n
		}) : /* @__PURE__ */ h("span", {
			className: "tp-loader__sr",
			children: "Loading"
		})]
	});
}), O = "https://pmdoctorportal.tatvacare.in/tp-icons", k = O, A = () => k, j = (e) => {
	k = e == null || e === "" ? O : String(e).replace(/\/+$/, "");
}, M = {
	"!": "alphabet-numbers",
	0: "alphabet-numbers",
	"0-second-back": "video",
	1: "alphabet-numbers",
	"1-way-data": "programming",
	"1-way-data-2": "programming",
	"1-way-data-3": "programming",
	"10-second-back": "video",
	"1chef-hat": "food",
	"1video": "essential",
	2: "alphabet-numbers",
	"2-way-lock": "security",
	"24-hour": "shop",
	"24-support": "support-like-question",
	"2d": "video",
	"2k": "video",
	3: "alphabet-numbers",
	"3-dots-circle": "essential",
	"3-dots-more": "settings",
	"3-dots-square": "essential",
	"360-view": "vr",
	"365-arrow": "arrow",
	"3d": "ui-design",
	"3d-2": "video",
	"3d-cube-scan": "delivery",
	"3d-rotate": "delivery",
	"3d-square": "delivery",
	"3d-video": "vr",
	"3d-video2": "vr",
	"3dcube": "essential",
	"3k": "video",
	"3square": "grid",
	4: "alphabet-numbers",
	"4d": "video",
	"4g-internet": "telephone",
	"4k": "video",
	5: "alphabet-numbers",
	"5-second-back": "video",
	"5g-internet": "telephone",
	6: "alphabet-numbers",
	7: "alphabet-numbers",
	8: "alphabet-numbers",
	"904026076031": "alphabet-numbers",
	"96ac0ff1b35e": "alphabet-numbers",
	a: "alphabet-numbers",
	"aave-aave": "crypto",
	activity: "business",
	ad: "essential",
	add: "web",
	"add-alarm": "essential",
	"add-basket": "shop",
	"add-card": "casino",
	"add-circle": "essential",
	"add-cloud": "network",
	"add-cloud-2": "network",
	"add-code": "programming",
	"add-code-2": "programming",
	"add-component": "programming2",
	"add-contact": "user",
	"add-data": "programming",
	"add-effect": "video",
	"add-exposure": "video",
	"add-file": "files",
	"add-frame": "ui-design",
	"add-home": "home",
	"add-home-2": "home",
	"add-item": "design-tools",
	"add-protection": "essential",
	"add-prototype": "ui-design",
	"add-protoype": "ui-design",
	"add-receipt": "health",
	"add-server": "network",
	"add-shop": "shop",
	"add-sign": "shop",
	"add-square": "essential",
	"add-text": "essential",
	"add-trash": "essential",
	addalarm: "essential",
	addmusic: "essential",
	"adult-content": "vr",
	"ai-3d": "ai",
	"ai-3d-box": "ai",
	"ai-3d-square": "ai",
	"ai-4k": "ai",
	"ai-ac": "ai",
	"ai-add": "ai",
	"ai-antenna": "ai",
	"ai-archive": "ai",
	"ai-assist": "ai",
	"ai-audio": "ai",
	"ai-bag": "ai",
	"ai-barcode": "ai",
	"ai-book": "ai",
	"ai-bookmark": "ai",
	"ai-box": "ai",
	"ai-brush": "ai",
	"ai-business-chart": "ai",
	"ai-calendar": "ai",
	"ai-call": "ai",
	"ai-camera": "ai",
	"ai-card": "ai",
	"ai-cash": "ai",
	"ai-cashworld": "ai",
	"ai-cctv": "ai",
	"ai-cellphone": "ai",
	"ai-chart": "ai",
	"ai-chat": "ai",
	"ai-chatbot": "ai",
	"ai-chatbox": "ai",
	"ai-chatting": "ai",
	"ai-clipboard": "ai",
	"ai-clock": "ai",
	"ai-cloud": "ai",
	"ai-cloud-bookmark": "ai",
	"ai-cloud-connected": "ai",
	"ai-cloud-server": "ai",
	"ai-cloud-services": "ai",
	"ai-code": "ai",
	"ai-code-chat": "ai",
	"ai-code-file": "ai",
	"ai-coding": "ai",
	"ai-columns": "ai",
	"ai-commentary": "ai",
	"ai-conversation": "ai",
	"ai-copy": "ai",
	"ai-cpu": "ai",
	"ai-create": "ai",
	"ai-create-document": "ai",
	"ai-create-file": "ai",
	"ai-creativity": "ai",
	"ai-creativity2": "ai",
	"ai-credit-card": "ai",
	"ai-crop": "ai",
	"ai-cube": "ai",
	"ai-cut-scissors": "ai",
	"ai-data-server": "ai",
	"ai-database": "ai",
	"ai-delivery": "ai",
	"ai-desktop": "ai",
	"ai-development": "ai",
	"ai-dialogue": "ai",
	"ai-direct-inbox": "ai",
	"ai-directbox-receive": "ai",
	"ai-discount": "ai",
	"ai-discover": "ai",
	"ai-document": "ai",
	"ai-document-2": "ai",
	"ai-document2": "ai",
	"ai-drink": "ai",
	"ai-driving": "ai",
	"ai-email": "ai",
	"ai-energy": "ai",
	"ai-engine": "ai",
	"ai-enhance": "ai",
	"ai-export": "ai",
	"ai-eye": "ai",
	"ai-file": "ai",
	"ai-file-ai": "ai",
	"ai-filter": "ai",
	"ai-fire": "ai",
	"ai-flame": "ai",
	"ai-flask": "ai",
	"ai-folder": "ai",
	"ai-folders": "ai",
	"ai-frame-select": "ai",
	"ai-ftp": "ai",
	"ai-fuel-tank": "ai",
	"ai-gaming": "ai",
	"ai-gift": "ai",
	"ai-global": "ai",
	"ai-graphic": "ai",
	"ai-grid": "ai",
	"ai-hd": "ai",
	"ai-headphone": "ai",
	"ai-headset": "ai",
	"ai-heart": "ai",
	"ai-heart-square": "ai",
	"ai-hexagon": "ai",
	"ai-home": "ai",
	"ai-homepage": "ai",
	"ai-hospital": "ai",
	"ai-hourglass": "ai",
	"ai-house": "ai",
	"ai-housing": "ai",
	"ai-idea": "ai",
	"ai-image": "ai",
	"ai-image-generation": "ai",
	"ai-inbox": "ai",
	"ai-insight": "ai",
	"ai-instance": "ai",
	"ai-javascript": "ai",
	"ai-key": "ai",
	"ai-lamp": "ai",
	"ai-landscape": "ai",
	"ai-laptop": "ai",
	"ai-layout": "ai",
	"ai-learning": "ai",
	"ai-library": "ai",
	"ai-like": "ai",
	"ai-list": "ai",
	"ai-location": "ai",
	"ai-lock": "ai",
	"ai-loveletter": "ai",
	"ai-magic-hat": "ai",
	"ai-mail": "ai",
	"ai-map": "ai",
	"ai-message": "ai",
	"ai-message-add": "ai",
	"ai-metrics": "ai",
	"ai-microphone": "ai",
	"ai-mobile": "ai",
	"ai-mobile-cloud": "ai",
	"ai-monitor": "ai",
	"ai-mouse-circle": "ai",
	"ai-mouse-square": "ai",
	"ai-music": "ai",
	"ai-music-file": "ai",
	"ai-network": "ai",
	"ai-network-dollar": "ai",
	"ai-note": "ai",
	"ai-note-generator": "ai",
	"ai-notepad": "ai",
	"ai-open-book": "ai",
	"ai-open-book2": "ai",
	"ai-organize": "ai",
	"ai-paint-brush": "ai",
	"ai-paintroller": "ai",
	"ai-path": "ai",
	"ai-path-vector": "ai",
	"ai-payment": "ai",
	"ai-pen-edit": "ai",
	"ai-pie-chart": "ai",
	"ai-pin-location": "ai",
	"ai-play-video": "ai",
	"ai-pointer": "ai",
	"ai-powered-support": "ai",
	"ai-reading": "ai",
	"ai-receipt": "ai",
	"ai-record": "ai",
	"ai-record-video": "ai",
	"ai-return": "ai",
	"ai-ruler-pencil": "ai",
	"ai-sand-timer": "ai",
	"ai-science": "ai",
	"ai-screen": "ai",
	"ai-search": "ai",
	"ai-security": "ai",
	"ai-send": "ai",
	"ai-send-message": "ai",
	"ai-server-users": "ai",
	"ai-servers": "ai",
	"ai-setting": "ai",
	"ai-settings": "ai",
	"ai-shape-triangle": "ai",
	"ai-sheet": "ai",
	"ai-shield": "ai",
	"ai-shop": "ai",
	"ai-shop-bag": "ai",
	"ai-shopping-cart": "ai",
	"ai-simcard": "ai",
	"ai-smart-cpu": "ai",
	"ai-smart-file": "ai",
	"ai-smart-house": "ai",
	"ai-smart-lock": "ai",
	"ai-smart-notepad": "ai",
	"ai-smart-pay": "ai",
	"ai-smart-search": "ai",
	"ai-smart-watch": "ai",
	"ai-sparkle": "ai",
	"ai-speaker": "ai",
	"ai-storage": "ai",
	"ai-strongbox": "ai",
	"ai-support": "ai",
	"ai-syringe": "ai",
	"ai-tag-price": "ai",
	"ai-terminal": "ai",
	"ai-text": "ai",
	"ai-text-generation": "ai",
	"ai-text-generation2": "ai",
	"ai-text-paragraph": "ai",
	"ai-thinking": "ai",
	"ai-time": "ai",
	"ai-timer": "ai",
	"ai-tools": "ai",
	"ai-trash": "ai",
	"ai-tv": "ai",
	"ai-ui": "ai",
	"ai-upload": "ai",
	"ai-user": "ai",
	"ai-users": "ai",
	"ai-ux": "ai",
	"ai-video": "ai",
	"ai-video-create": "ai",
	"ai-video-hexagon": "ai",
	"ai-videocamera": "ai",
	"ai-voice-memo": "ai",
	"ai-voice-note": "ai",
	"ai-vr": "ai",
	"ai-wallet": "ai",
	"ai-wallet-2": "ai",
	"ai-wallet2": "ai",
	"ai-water-cycle": "ai",
	"ai-website": "ai",
	"ai-weight": "ai",
	"ai-world": "ai",
	"ai-writing": "ai",
	"air-conditioner": "furniture",
	"air-plane": "booking",
	"air-play": "security",
	airbnb: "social",
	"airbnb-2": "social",
	airdrop: "computers-devices-electronics",
	airplane: "car",
	"airplane-2": "travel",
	"airplane-mode": "booking",
	"airplane-square": "car",
	airplane2: "space2",
	airplane3: "space2",
	airpod: "computers-devices-electronics",
	airpods: "game",
	"airpods-case": "game",
	"airpods-case-2": "game",
	"airpods-pro": "game",
	"airpods-pro-2": "game",
	airstrike: "military",
	alarm: "security",
	"alarm-2": "essential",
	alien: "space",
	alien2: "space2",
	alien3: "space2",
	"align-bottom": "grid",
	"align-horizontally": "grid",
	"align-left": "grid",
	"align-left-2": "grid",
	"align-right": "grid",
	"align-top": "grid",
	"align-top-2": "grid",
	"align-vertically": "grid",
	"alrook-chess": "casino",
	ambulance: "medical",
	americansoccerball: "sports",
	ammo: "video-games",
	ammo2: "military",
	ampoule: "health",
	"ampoule-program": "health",
	"anal-beads": "sex",
	"anal-beads2": "sex",
	"anchor-point": "video",
	"anchor-point-2": "security",
	and: "alphabet-numbers",
	android: "crypto",
	angel: "christmas",
	angel2: "christmas",
	"angle-connected": "design",
	"angle-grinder": "tools",
	"angled-double-diagonal": "arrow2",
	"angled-double-diagonal2": "arrow2",
	"ankr-ankr": "crypto",
	antenna: "device",
	antenna2: "telephone",
	"anti-copyright": "copyright",
	"anti-copyright-2": "copyright",
	anxiety: "medical",
	apartment: "building",
	"apartment-2": "building",
	apartments: "building",
	aperture: "video",
	"aperture-2": "video",
	apeture: "video",
	"api-key": "programming2",
	"app-store": "social",
	apple: "social",
	"approved-code": "programming",
	"approved-code-2": "programming",
	"apps-shapes": "essential",
	apron: "coffe",
	aquarius: "astrology",
	"ar-view-see-through-device": "vr",
	"ar-view-see-through-device2": "vr",
	"ar-view-see-through-eye": "vr",
	"ar-view-see-through-eye2": "vr",
	arcade: "casino",
	archery: "sports2",
	archive: "archive",
	"archive-add": "archive",
	"archive-book": "content-edit",
	"archive-minus": "archive",
	"archive-slash": "archive",
	"archive-tick": "archive",
	aries: "astrology2",
	arm: "sports",
	"arm-muscle": "sports",
	armor: "weapons",
	armored: "military",
	arrow: "location",
	"arrow-back": "arrow",
	"arrow-circle-down": "arrow",
	"arrow-circle-left": "arrow",
	"arrow-circle-right": "arrow",
	"arrow-circle-up": "arrow",
	"arrow-diagonal": "arrow",
	"arrow-diagonal2": "arrow",
	"arrow-diagonal3": "arrow",
	"arrow-diagonal4": "arrow",
	"arrow-down": "arrow",
	"arrow-down-in-box": "arrow2",
	"arrow-down2": "arrow",
	"arrow-down3": "arrow",
	"arrow-down4": "arrow",
	"arrow-down42": "arrow",
	"arrow-forward": "arrow",
	"arrow-horizontal": "video",
	"arrow-left": "arrow",
	"arrow-left-and-right": "arrow2",
	"arrow-left-in-box": "arrow2",
	"arrow-left2": "arrow",
	"arrow-left3": "arrow",
	"arrow-left4": "arrow",
	"arrow-left42": "arrow",
	"arrow-right": "arrow",
	"arrow-right-in-box": "arrow2",
	"arrow-right2": "arrow",
	"arrow-right22": "arrow",
	"arrow-right3": "arrow",
	"arrow-right4": "arrow",
	"arrow-short-down": "arrow2",
	"arrow-short-left": "arrow2",
	"arrow-short-right": "arrow2",
	"arrow-short-up": "arrow2",
	"arrow-square": "location",
	"arrow-square-down": "arrow",
	"arrow-square-left": "arrow",
	"arrow-square-right": "arrow",
	"arrow-square-up": "arrow",
	"arrow-swap": "arrow",
	"arrow-swap2": "arrow",
	"arrow-swap3": "arrow",
	"arrow-to-line-down": "arrow2",
	"arrow-to-line-up": "arrow2",
	"arrow-transfer": "arrow",
	"arrow-transfer2": "arrow",
	"arrow-up": "arrow",
	"arrow-up-and-down": "arrow2",
	"arrow-up-down": "arrow2",
	"arrow-up-to-box": "arrow2",
	"arrow-up2": "arrow",
	"arrow-up22": "arrow",
	"arrow-up3": "arrow",
	"arrow-up4": "arrow",
	"arrow-vertical": "video",
	"arrowed-heart": "love",
	arrows: "video-games",
	art: "ui-design",
	"ascending-arrow": "arrow",
	"ascending-arrow2": "arrow",
	ass: "sex",
	asset: "essential",
	asterisk: "alphabet-numbers",
	astronaut: "space2",
	atom: "ecology",
	"atom-2": "blockchain",
	"atom-bomb": "military",
	atsign: "email",
	"attach-circle": "type-paragraph-character",
	"attach-file": "essential",
	"attach-square": "type-paragraph-character",
	"attached-basket": "shop",
	"attached-cloud": "web",
	"attached-contact": "user",
	"attached-file": "files",
	"attached-mail": "email",
	"attached-mails": "email",
	"audio-square": "video-audio-image",
	"augur-rep": "crypto",
	"auto-flash": "video",
	autobrightness: "essential",
	"autonio-niox": "crypto",
	"avalanche-avax": "crypto",
	avatar: "video-games",
	avatar2: "video-games",
	avatar3: "video-games",
	award: "school-learning",
	"award-badge": "sports2",
	"award-badge2": "sports2",
	"award-badge3": "sports2",
	"award-badge4": "sports2",
	"award-badge5": "sports2",
	"award-badge6": "sports2",
	"award-medal": "sports2",
	"award-medal2": "sports2",
	axe: "weapons",
	axe2: "weapons",
	b: "alphabet-numbers",
	"b-circle": "essential",
	baby: "baby",
	"baby-boy": "baby",
	"baby-check": "sex",
	"baby-girl": "baby",
	"baby-girl2": "baby",
	baby2: "baby",
	baby3: "baby",
	back: "web",
	backpack: "military",
	backward: "video-audio-image",
	"backward-10-seconds": "video-audio-image",
	"backward-10-seconds-rewind-video-time-control-seek-backskip": "video-audio-image",
	"backward-15-seconds": "video-audio-image",
	"backward-5-seconds": "video-audio-image",
	"backward-card": "money",
	"backward-contact": "user",
	"backward-dollar": "money",
	"backward-item": "design-tools",
	bag: "clothes",
	"bag-2": "shop",
	"bag-cross": "shop",
	"bag-cross-2": "shop",
	"bag-happy": "shop",
	"bag-tick": "shop",
	"bag-tick-2": "shop",
	"bag-timer": "shop",
	"bag-wheel": "booking",
	ball: "fitness",
	"ball-toy": "baby",
	ball10: "fitness",
	ball11: "christmas",
	ball112: "christmas",
	ball12: "christmas",
	ball13: "christmas",
	ball14: "christmas",
	ball15: "christmas",
	ball16: "christmas",
	ball17: "christmas",
	ball172: "christmas",
	ball18: "christmas",
	ball182: "christmas",
	ball19: "christmas",
	ball2: "christmas",
	"ball2.svg": "fitness",
	ball20: "christmas",
	ball202: "christmas",
	ball21: "christmas",
	ball212: "christmas",
	ball22: "christmas",
	ball222: "christmas",
	ball23: "christmas",
	ball232: "christmas",
	ball24: "christmas",
	ball242: "christmas",
	ball25: "christmas",
	ball252: "christmas",
	ball26: "christmas",
	ball262: "christmas",
	ball27: "christmas",
	ball272: "christmas",
	ball28: "christmas",
	ball3: "christmas",
	ball4: "christmas",
	ball5: "fitness",
	ball6: "fitness",
	ball7: "fitness",
	ball8: "fitness",
	ball9: "christmas",
	ball92: "fitness",
	balll: "christmas",
	balloon: "sports",
	"balloon-decoration-party-celebration-festival-air-filled-joy": "sports2",
	"balloon-decoration-party-event-festivity-celebration-air-filled": "sports2",
	"balloon-festival-party-celebration-colorful-decorative-inflatable": "sports2",
	"balloon-festive-party-celebration-decoration-inflate-colorful": "sports2",
	"balloon-festive-party-celebration-event-colorful-decoration": "sports2",
	baloons: "christmas",
	"ban-nature": "ecology",
	"band-aids": "health",
	bandage: "medical",
	"bandage-02": "medical",
	bank: "money",
	"bank-2": "money",
	"bank-3": "money",
	"bank-type": "money",
	"bank-verify": "money",
	bar: "coffe",
	barcode: "shop",
	base: "building",
	"base-2": "building",
	baseball: "fitness",
	"baseball-ball": "sports",
	"baseball-bat": "fitness",
	baseballball: "sports",
	baseballbat: "sports",
	basket: "fitness",
	basketball: "sports2",
	"basketball-ball": "sports",
	basketballball: "sports",
	bat: "halloween",
	bat2: "halloween",
	bat3: "halloween",
	bath: "travel",
	bathtub: "furniture",
	batoids: "animals",
	"battery-2bars": "essential",
	"battery-charging": "essential",
	"battery-disable": "essential",
	"battery-empty": "essential",
	"battery-empty-2": "essential",
	"battery-full": "essential",
	"bayby-check": "sex",
	be: "crypto",
	beach: "booking",
	"beach-bed": "booking",
	"beach-umbrella": "travel",
	bear: "animals",
	bearish: "business",
	beat: "medical",
	"beat-2": "medical",
	beaver: "animals",
	bed: "furniture",
	"bed-2": "furniture",
	beetle: "animals",
	behance: "crypto",
	bell: "essential",
	bell2: "christmas",
	bells: "wedding",
	belt: "clothes",
	bezier: "design-tools",
	bib: "baby",
	bicycle: "sports2",
	"bid-home": "real-state",
	"big-brush": "design",
	bike: "fitness",
	bill: "content-edit",
	"binance-coin-bnb": "crypto",
	"binance-usd-busd": "crypto",
	binary: "programming",
	"binary-computer": "blockchain",
	"binary-computer-2": "blockchain",
	binoculars: "military",
	bio: "user",
	bird: "pet",
	bird2: "pet",
	birds: "christmas",
	"bitcoin-btc": "crypto",
	"bitcoin-card": "cryptocurrency",
	"bitcoin-convert": "cryptocurrency",
	"bitcoin-refresh": "cryptocurrency",
	blend: "ui-design",
	"blend-2": "design-tools",
	blending: "essential",
	"block-chain-ai": "blockchain",
	"block-contact": "user",
	blockchain: "blockchain",
	"blockchain-glossary": "blockchain",
	"blockchain-network": "blockchain",
	"blocked-data": "programming",
	"blocked-mail": "email",
	blogger: "crypto",
	blood: "medical",
	"blood-3": "medical",
	bluetooth: "computers-devices-electronics",
	"bluetooth-2": "computers-devices-electronics",
	"bluetooth-circle": "computers-devices-electronics",
	"bluetooth-rectangle": "computers-devices-electronics",
	blur: "design-tools",
	board: "device",
	board2: "fitness",
	boat: "travel",
	"boat-fishing": "fitness",
	boat2: "fitness",
	boat3: "fitness",
	boatriding: "sports",
	"body-bag": "clothes2",
	bolt: "tools",
	"bolt-nuts": "tools",
	bomb: "military",
	bomb2: "military",
	bomb3: "military",
	bomb4: "military",
	bone: "medical",
	book: "school-learning",
	"book-open": "school-learning",
	"book-saved": "archive",
	"book-square": "archive",
	booked: "mobile",
	"booked-basket": "shop",
	"booked-card": "money",
	"booked-contact": "user",
	"booked-file": "files",
	"booked-home": "home",
	"booked-home-2": "real-state",
	"booked-shop": "shop",
	"booked-signal": "chart",
	"booking-snow": "christmas",
	bookmark: "school-learning",
	"bookmark-2": "school-learning",
	"bookmark-ai": "ai",
	"bookmarked-cloud": "network",
	books: "essential",
	boot: "clothes2",
	bootstrap: "crypto",
	bottle: "food",
	"bottle-and-glass": "food",
	bouquet: "wedding",
	bow: "military",
	"bow-tie": "baby",
	bowling: "casino",
	"bowling-2": "casino",
	"bowling-ball": "casino",
	"bowling-pin": "casino",
	bowling2: "fitness",
	bowlingball: "sports",
	bowtie: "clothes",
	box: "essential",
	"box-2": "essential",
	"box-add": "delivery",
	"box-remove": "delivery",
	"box-search": "delivery",
	"box-tick": "delivery",
	"box-time": "delivery",
	"boxing-claw": "weapons",
	"boxing-gloves": "sports2",
	"boxing-gloves2": "sports2",
	"boxing-gloves3": "sports2",
	bradypus: "animals",
	brain: "medical",
	bread: "food",
	break: "car-service",
	"break-bone": "medical",
	"brewed-coffe": "coffe",
	bride: "wedding",
	briefcase: "clothes",
	"brifecase-cross": "school-learning",
	"brifecase-tick": "school-learning",
	"brifecase-timer": "school-learning",
	brightness: "arrow2",
	brightness2: "arrow2",
	brightness3: "arrow2",
	"broadcast-mail": "email",
	"brodcast-mail": "email",
	"broken-bone": "medical",
	"broken-condom": "sex",
	"broken-heart": "wedding",
	broom: "essential",
	brush: "ui-design",
	"brush-2": "ui-design",
	"brush-3": "ui-design",
	"brush-makeup": "beauty",
	"brush-square": "design-tools",
	bubble: "essential",
	bucket: "design-tools",
	"bucket-circle": "design-tools",
	"bucket-square": "design-tools",
	bug: "programming2",
	bug2: "programming2",
	building: "building",
	"building-2": "building",
	"building-3": "building",
	"building-4": "building",
	buildings: "building",
	"buildings-2": "building",
	"buildings-3": "building",
	bulb: "essential",
	bulldozer: "travel",
	bullish: "business",
	bus: "car",
	"bus-2": "travel",
	buscircle: "travel",
	"butt-plug": "sex",
	"butt-plug2": "sex",
	butterfly: "animals",
	button: "clothes",
	"button-bomb": "military",
	"buy-crypto": "cryptocurrency",
	"buy-house": "real-state",
	c: "alphabet-numbers",
	"c+": "programming",
	"c++": "programming",
	"c+-2": "programming",
	cabbage: "food2",
	cable: "ecology",
	cactus: "nature",
	"cactus-2": "nature",
	cake: "essential",
	cake2: "christmas",
	calculator: "money",
	calendar: "health",
	"calendar-2": "time",
	"calendar-add": "time",
	"calendar-christmas": "christmas",
	"calendar-circle": "time",
	"calendar-date": "time",
	"calendar-edit": "time",
	"calendar-love": "love",
	"calendar-remove": "time",
	"calendar-search": "time",
	"calendar-tick": "time",
	"calendar-tree": "christmas",
	calendar2: "wedding",
	calendar3: "christmas",
	calendar4: "christmas",
	calibration: "vr",
	call: "call",
	"call-add": "call",
	"call-calling": "call",
	"call-hospital": "medical",
	"call-incoming": "call",
	"call-minus": "call",
	"call-outgoing": "call",
	"call-received": "call",
	"call-remove": "call",
	"call-slash": "call",
	"callenderremove-date-calendar": "essential",
	cambodia: "landmarks",
	camera: "video",
	"camera-2": "devices",
	"camera-3": "video",
	"camera-from-top": "devices",
	"camera-preview": "devices",
	"camera-refresh": "video",
	"camera-slash": "video-audio-image",
	"camera-switch": "video",
	"camera-switch-front": "video",
	canceled: "web",
	"canceled-signal": "chart",
	cancer: "astrology2",
	candle: "settings",
	"candle-2": "settings",
	candom: "sex",
	candom2: "sex",
	candom3: "sex",
	candom4: "sex",
	candom5: "sex",
	candy: "halloween",
	"candy-cane": "christmas",
	"candy-cane2": "christmas",
	"candy-cane3": "christmas",
	"candy-cane32": "christmas",
	"candy-cane4": "christmas",
	"candy-cane42": "christmas",
	candy2: "halloween",
	candy3: "christmas",
	candy4: "christmas",
	cannon: "military",
	"cant-receive-mail": "email",
	cap: "clothes",
	"cap-2": "clothes",
	capa: "ai",
	capsule: "health",
	"capsule-3": "medical",
	captions: "copyright",
	"captions-2": "copyright",
	"captions-unavailable": "copyright",
	"captions-unavailable-2": "copyright",
	"captions-unavailable-3": "copyright",
	car: "car",
	"car-ac": "car-service",
	"car-battery": "car-service",
	"car-door": "car-service",
	"car-door-square": "car-service",
	"car-lever": "car-service",
	"car-light": "car-service",
	"car-light-square": "car-service",
	"car-low-light": "car-service",
	"car-low-light-square": "car-service",
	card: "money",
	"card-add": "money",
	"card-code": "security",
	"card-coin": "cryptocurrency",
	"card-coins": "money",
	"card-detail": "security",
	"card-edit": "money",
	"card-pos": "money",
	"card-reader": "money",
	"card-receive": "money",
	"card-refresh": "money",
	"card-remove": "money",
	"card-remove-2": "money",
	"card-send": "money",
	"card-slash": "money",
	"card-star": "money",
	"card-star-2": "money",
	"card-symbols": "casino",
	"card-tick": "money",
	"card-tick-2": "money",
	"card-time": "money",
	"card-to-left": "casino",
	"card-to-right": "casino",
	"cardano-ada": "crypto",
	cardio: "fitness",
	cardio2: "fitness",
	cardiogram: "medical",
	cards: "casino",
	"cards-2": "money",
	"cards-clubs": "casino",
	"cards-diamond": "casino",
	"cards-heart": "casino",
	"cards-spade": "casino",
	care: "baby",
	carrot: "food2",
	"cart-change": "money",
	cash: "money",
	"cash-desk": "money",
	"cash-left": "money",
	"cash-right": "money",
	"cash-safe": "money",
	"cash-world": "money",
	"cast-to-devices-phone": "vr",
	"cast-to-devices-tv": "vr",
	castle: "sports2",
	cat: "pet",
	cat2: "pet",
	cat3: "pet",
	cat4: "pet",
	"categories-shape": "essential",
	category: "settings",
	"category-2": "settings",
	cc: "video",
	cctv: "security",
	cd: "essential",
	cdwriter: "device",
	celebration: "sports2",
	celebration2: "sports2",
	celebration3: "sports2",
	celestial: "space2",
	"cellular-data": "essential",
	"celo-celo": "crypto",
	"celsius-cel": "crypto",
	"celsius-cel-": "crypto",
	cencor: "essential",
	centipede: "animals",
	centralized: "blockchain",
	cesarean: "sex",
	chain: "essential",
	"chainlink-link": "crypto",
	chair: "furniture",
	"chair-10": "furniture",
	"chair-11": "furniture",
	"chair-12": "furniture",
	"chair-13": "furniture",
	"chair-2": "furniture",
	"chair-3": "furniture",
	"chair-4": "furniture",
	"chair-5": "furniture",
	"chair-6": "furniture",
	"chair-7": "furniture",
	"chair-8": "furniture",
	"chair-9": "furniture",
	"chair-lampshade": "furniture",
	"chair-table": "furniture",
	"change-card": "money",
	"change-currency": "money",
	"change-flash": "video",
	"change-heart": "health",
	charging: "mobile",
	chart: "health",
	"chart-2": "chart",
	"chart-3": "business",
	"chart-4": "business",
	"chart-circle": "money",
	"chart-fail": "business",
	"chart-square": "business",
	"chart-square-2": "money",
	"chart-success": "business",
	"chartcircle-chart": "chart",
	chassis: "car-service",
	chat: "ai2",
	chatbot: "essential",
	chatbox: "emails-messages",
	check: "security",
	"check-mark---tick": "arrow2",
	"check-mark-in-box": "arrow2",
	checked: "essential",
	"checked-basket": "shop",
	"checked-circle": "arrow",
	"checked-figure": "essential",
	"checked-file": "files",
	"checked-home": "home",
	"checked-home-2": "home",
	"checked-list": "health",
	"checked-mail": "email",
	"checked-receipt": "health",
	"checked-square": "arrow",
	"checked-task": "essential",
	"checked-task-2": "essential",
	checklist: "wedding",
	cheers: "love",
	"cheers-love": "love",
	cheese: "food2",
	cheese2: "food2",
	"chef-hat": "food",
	cheque: "money",
	"cheque-2": "money",
	chess: "casino",
	"chess-ai": "ai",
	"chess-bishop": "casino",
	"chess-king": "casino",
	"chess-knight": "casino",
	"chess-pawn": "casino",
	"chess-queen": "casino",
	"chess-rook": "casino",
	china: "landmarks",
	"china-2": "landmarks",
	china10: "landmarks",
	china102: "landmarks",
	china11: "landmarks",
	china112: "landmarks",
	china12: "landmarks",
	china122: "landmarks",
	china13: "landmarks",
	china2: "landmarks",
	china3: "landmarks",
	china4: "landmarks",
	china5: "landmarks",
	china6: "landmarks",
	china7: "landmarks",
	china8: "landmarks",
	china9: "landmarks",
	chocolate: "food2",
	"christmas-ball": "christmas",
	"christmas-bell": "christmas",
	"christmas-bow": "christmas",
	"christmas-card": "christmas",
	"christmas-house": "christmas",
	"christmas-shoes": "christmas",
	"christmas-sweater": "christmas",
	"christmas-tree": "christmas",
	"christmas-wreath": "christmas",
	chrome: "essential",
	church: "building",
	church2: "wedding",
	"circle-brush": "design",
	"circle-chart": "chart",
	"circle-chart-2": "chart",
	"circle-chart-3": "chart",
	"circle-cursor": "essential",
	"circle-downloads": "essential",
	"circle-element": "design",
	"circle-gallery": "video",
	"circle-gallery-2": "video",
	"circle-graphic": "business",
	"circle-home": "home",
	"circle-home-2": "home",
	"circle-home-3": "home",
	"circle-home-4": "home",
	"circle-home0": "home",
	"circle-hotspot": "essential",
	"circle-language": "essential",
	"circle-library": "furniture",
	"circle-marker": "design",
	"circle-navigation": "essential",
	"circle-pen": "design",
	"circle-pin": "essential",
	"circle-product": "essential",
	"circle-share": "essential",
	"circle-star": "essential",
	"circle-stats": "essential",
	"circle-up-and-down-control": "arrow2",
	"circle-uploads": "essential",
	"circle-voice-record": "essential",
	"circle-wifi": "essential",
	"circle-wireless": "essential",
	circlefinger: "hand",
	circus: "casino",
	city: "building",
	"city-2": "building",
	"city-hall": "building",
	"civic-cvc": "crypto",
	clean: "ai2",
	"clean-code": "programming2",
	cleaver: "food",
	"click-home": "real-state",
	"clip-board": "programming",
	clipboard: "school-learning",
	"clipboard-activity": "medical",
	"clipboard-check": "arrow",
	"clipboard-close": "content-edit",
	"clipboard-export": "content-edit",
	"clipboard-import": "content-edit",
	"clipboard-text": "content-edit",
	"clipboard-tick": "content-edit",
	cloche: "kitchen",
	clock: "time",
	clock2: "christmas",
	close: "arrow2",
	"close-circle": "essential",
	"close-shop": "shop",
	"close-sign": "shop",
	"close-square": "essential",
	"closed-home": "real-state",
	closet: "furniture",
	"closet-drawer": "furniture",
	cloud: "network",
	"cloud 2": "nature",
	"cloud-add": "web",
	"cloud-ai": "ai",
	"cloud-change": "computers-devices-electronics",
	"cloud-code": "security",
	"cloud-connected": "network",
	"cloud-connected-2": "network",
	"cloud-connection": "computers-devices-electronics",
	"cloud-created": "network",
	"cloud-cross": "weather",
	"cloud-drive": "network",
	"cloud-drive-2": "network",
	"cloud-drizzle": "weather",
	"cloud-error": "network",
	"cloud-fog": "weather",
	"cloud-lightning": "weather",
	"cloud-minus": "weather",
	"cloud-notif": "weather",
	"cloud-plus": "weather",
	"cloud-remove": "computers-devices-electronics",
	"cloud-snow": "weather",
	"cloud-sunny": "weather",
	"cloud-timeout": "network",
	"cloud-timeout-2": "network",
	"cloud-to-server": "network",
	"cloud-warning": "web",
	cloudy: "nature",
	cloudywithmoon: "nature",
	clown: "sports2",
	clubs: "casino",
	"clubs-2": "casino",
	"clubs-coin": "casino",
	cluster: "programming2",
	cmd: "programming",
	co2: "ecology",
	coat: "clothes2",
	code: "essential",
	"code-2": "programming",
	"code-brackets": "arrow2",
	"code-chip": "programming2",
	"code-circle": "programming",
	"code-comment": "programming2",
	"code-comment2": "programming2",
	"code-feedback": "programming",
	"code-import": "programming2",
	"code-line": "programming",
	"code-line-2": "programming",
	"code-online": "programming",
	"code-online-2": "programming",
	"code-review": "programming2",
	"code-sandbox": "social",
	"code-search": "programming2",
	"code-snippet": "programming2",
	"code-to-visual": "programming",
	"code-translate": "programming",
	coding: "programming",
	"coding-2": "programming",
	"coding-3": "programming",
	"coding-4": "programming",
	"coffe-shop": "coffe",
	coffee: "furniture",
	"coffee-bag": "coffe",
	"coffee-bag2": "coffe",
	"coffee-beans": "coffe",
	"coffee-cup": "coffe",
	"coffee-grinder": "coffe",
	"coffee-maker": "food",
	coffin: "halloween",
	coin: "casino",
	"coin-2": "money",
	"coin-add": "money",
	"coin-change": "money",
	"coin-diamond": "money",
	"coin-income": "money",
	"coin-left": "money",
	"coin-like": "money",
	"coin-outcome": "money",
	"coin-remove": "money",
	"coin-right": "money",
	"coin-search": "money",
	"coin-up": "money",
	coins: "casino",
	"coins-circle": "money",
	"coins-square": "money",
	"cold-drink": "food",
	"cold-drink2": "coffe",
	collar: "pet",
	color: "ui-design",
	"color-2": "ui-design",
	"color-palette": "ui-design",
	"color-palette-2": "ui-design",
	"color-palette-ai": "ai",
	"color-pellete": "ui-design",
	"color-pocket": "ui-design",
	"color-swatch": "design-tools",
	"color-switch": "design-tools",
	colorfilter: "design-tools",
	"colors-square": "design-tools",
	"comedy-mask": "casino",
	"comedy-mask-coin": "casino",
	comet: "space2",
	comet2: "space2",
	command: "programming",
	"command-2": "programming",
	"command-line": "programming",
	"command-prompt": "essential",
	"command-square": "programming",
	comment: "essential",
	"compare-formats": "design",
	compass: "tools",
	"compass-2": "tools",
	"complete-file": "files",
	"complete-receipt": "shop",
	completed: "web",
	"completed-bag": "shop",
	"completed-file": "files",
	"completed-receipt": "shop",
	component: "design-tools",
	"composion-file": "files",
	"computer-cloud": "network",
	"computer-cloud-2": "network",
	"computer-station": "programming",
	"computer-station-2": "programming",
	"computer-station-3": "programming",
	computing: "essential",
	cone: "tools",
	connect: "ui-design",
	"connect-links": "blockchain",
	"connect-wallet": "blockchain",
	"connectdev-mode": "essential",
	connected: "design",
	"connected-circle": "business",
	"connected-file": "files",
	"connected-square": "business",
	connection: "essential",
	"connection-error": "essential",
	"connection-info": "essential",
	"connection-lost": "essential",
	"connection-square": "essential",
	console: "game",
	"console-connection": "network",
	constellation: "space2",
	contact: "blockchain",
	contacts: "user",
	"content-book": "ai2",
	"content-book2": "ai2",
	contraceptives: "sex",
	contraceptives2: "sex",
	controller: "game",
	"controller-console": "game",
	"conversation-box": "emails-messages",
	convert: "shop",
	"convert-3d-cube": "delivery",
	"convert-arrow": "arrow",
	"convert-card": "money",
	"convert-contact": "user",
	"convert-home": "home",
	"convert-home-2": "real-state",
	"convert-home-3": "real-state",
	"convert-sign": "shop",
	convertshape: "grid",
	"convertshape-2": "grid",
	cookie: "food2",
	"cooking-hat": "food",
	"cooking-hat-2": "food",
	"cooking-pot": "coffe",
	copy: "design-tools",
	"copy-success": "design-tools",
	copypaste: "essential",
	copyright: "content-edit",
	"copyright-2": "copyright",
	"copyright-3": "copyright",
	"copyright-4": "copyright",
	"copyright-5": "copyright",
	corkscrew: "kitchen",
	corner: "arrow2",
	corner2: "arrow2",
	"cot-mobile-toy": "baby",
	court: "building",
	courthouse: "building",
	cpu: "computers-devices-electronics",
	"cpu-charge": "computers-devices-electronics",
	"cpu-setting": "computers-devices-electronics",
	crab: "animals",
	crash: "programming2",
	"cream-cup": "coffe",
	"creative-commons": "content-edit",
	"credit-card": "money",
	crib: "baby",
	"cricket-bat": "fitness",
	croissant: "food2",
	crop: "design",
	"crop-rotate": "design",
	"cross-health": "medical",
	crossbow: "weapons",
	crossbow2: "weapons",
	crossbow3: "weapons",
	"crossed-flags": "sports2",
	crosshairs: "military",
	crosshairs2: "military",
	crown: "essential",
	"crown-2": "essential",
	crown2: "video-games",
	cruise: "travel",
	crutches: "medical",
	cryptosecurity: "essential",
	"crystal-ball": "beauty",
	css: "programming",
	cup: "casino",
	cupcake: "food2",
	"cupids-bow": "love",
	curling: "sports2",
	"curling-stone": "fitness",
	curling2: "fitness",
	curling3: "fitness",
	cursor: "essential",
	"cursor-frame": "ui-design",
	"cursor-vector": "ui-design",
	curtain: "furniture",
	"curtain-2": "furniture",
	curtains: "furniture",
	"curtains-2": "furniture",
	"curve-connected": "design",
	"cutting-board": "food",
	cvv: "money",
	cycle: "energy",
	cycle2: "arrow2",
	cycling: "fitness",
	cycling2: "fitness",
	d: "alphabet-numbers",
	da8c4fb958b3: "alphabet-numbers",
	"dai-dai": "crypto",
	danger: "essential",
	"dark-mode": "video",
	"dark-time": "essential",
	dart: "sports",
	"dart-2": "sports",
	"dash-dash": "crypto",
	"dash-dash-navigation-control-speed-transportation-route": "crypto",
	"dashboard-gauge": "essential",
	data: "programming",
	"data-2": "programming",
	"data-3": "programming",
	"data-base": "network",
	"data-base-2": "network",
	"data-base-connected": "network",
	"data-base-connection": "network",
	"data-base-error": "network",
	"data-base-route": "network",
	"data-transfer": "essential",
	"data-transform": "programming",
	"data-translate": "blockchain",
	database: "programming2",
	database2: "programming2",
	database3: "programming2",
	decentralized: "blockchain",
	"decentralized-crypto": "blockchain",
	"decentralized-money": "blockchain",
	decor: "christmas",
	decrease: "essential",
	"decrease-cloud": "web",
	"decrease-exposure": "video",
	"decrease-home": "home",
	"decrease-home-2": "home",
	"decred-dcr": "crypto",
	deer: "christmas",
	delete: "mobile",
	"delete-basket": "shop",
	"delete-card": "money",
	"delete-file": "files",
	"delete-home": "home",
	"delete-home-2": "home",
	"delete-shop": "shop",
	"deleted-file": "files",
	"dent-dent": "crypto",
	"dent-dental-care-oral-health-toothbrush-teeth-cleaning": "crypto",
	"dent-dental-care-teeth-hygiene-oral-health-appointment": "crypto",
	"dent-dental-care-tooth-health-hygiene-checkup": "crypto",
	"dent-dental-care-tooth-hygiene-oral-health-cleaning": "crypto",
	"dent-dental-care-tooth-oral-health-hygiene-cleaning": "crypto",
	"dent-dental-care-toothbrush-oral-hygiene-checkup-smile": "crypto",
	"dent-dental-care-toothbrush-oral-hygiene-cleaning-appointment": "crypto",
	deploy: "programming2",
	"deposit-card": "money",
	"deposit-dollar": "money",
	"descending-arrow": "arrow",
	"descending-arrow2": "arrow",
	"design-vector": "ui-design",
	designtools: "design-tools",
	"desk-lamp": "sports2",
	destructive: "travel",
	"dev-config": "programming2",
	"dev-mode": "essential",
	"dev-support": "programming2",
	"dev-tools": "programming2",
	developer: "programming2",
	devianart: "social",
	"device-calibration": "vr",
	"device-message": "emails-messages",
	"device-setting": "vr",
	"device-setting2": "vr",
	devices: "computers-devices-electronics",
	diagnosis: "medical",
	"diagonal-arrows": "arrow2",
	"diagonal-arrows2": "arrow2",
	"diagonal-down-left": "arrow2",
	"diagonal-down-right": "arrow2",
	"diagonal-up-left": "arrow2",
	"diagonal-up-right": "arrow2",
	diagram: "business",
	"diamond-coin": "casino",
	diamonds: "casino",
	"diamonds-2": "casino",
	"diamonds-3": "casino",
	diaper: "baby",
	diaper2: "baby",
	dice: "casino",
	"dice-five": "casino",
	"dice-four": "casino",
	"dice-one": "casino",
	"dice-six": "casino",
	"dice-three": "casino",
	"dice-two": "casino",
	dice2: "sports2",
	"digita-timer": "fitness",
	"digital-timer": "sports2",
	dildo: "sex",
	dildo2: "sex",
	dildo3: "sex",
	dildo4: "sex",
	direct: "emails-messages",
	"direct-connect": "essential",
	"direct-down": "location",
	"direct-inbox": "emails-messages",
	"direct-left": "location",
	"direct-normal": "emails-messages",
	"direct-notification": "emails-messages",
	"direct-right": "location",
	"direct-send": "emails-messages",
	"direct-up": "location",
	"directbox-default": "emails-messages",
	"directbox-notif": "emails-messages",
	"directbox-receive": "emails-messages",
	"directbox-send": "emails-messages",
	"disconnected-wifi": "essential",
	discord: "social",
	discount: "shop",
	"discount-": "shop",
	"discount-2": "shop",
	"discount-3": "shop",
	"discount-4": "shop",
	"discount-5": "shop",
	"discount-circle": "money",
	"discount-home": "real-state",
	"discount-shape": "money",
	"discount-sign": "shop",
	"discount-square": "money",
	discover: "essential",
	disinfectants: "health",
	dislike: "support-like-question",
	"distributed-network": "blockchain",
	divide: "alphabet-numbers",
	"divided-circle": "essential",
	diving: "fitness",
	"diving-mask": "fitness",
	diving2: "fitness",
	dna: "medical",
	document: "money",
	"document-cloud": "content-edit",
	"document-code": "programming",
	"document-code-2": "programming",
	"document-copy": "content-edit",
	"document-download": "content-edit",
	"document-favorite": "content-edit",
	"document-favorite-2": "content-edit",
	"document-filter": "content-edit",
	"document-forward": "content-edit",
	"document-like": "content-edit",
	"document-normal": "content-edit",
	"document-previous": "content-edit",
	"document-sketch": "content-edit",
	"document-sketch-2": "content-edit",
	"document-text": "content-edit",
	"document-text-2": "content-edit",
	"document-upload": "content-edit",
	dog: "pet",
	dog2: "pet",
	dog3: "pet",
	dog4: "pet",
	dog5: "pet",
	dog6: "pet",
	dog7: "pet",
	dogtags: "military",
	doll: "sex",
	dollar: "alphabet-numbers",
	"dollar-change": "money",
	"dollar-circle": "money",
	"dollar-down": "money",
	"dollar-refresh-left": "money",
	"dollar-refresh-right": "money",
	"dollar-square": "money",
	"dollar-up": "money",
	"dollar-verify": "money",
	dolphin: "animals",
	dolphin2: "animals",
	dominoes: "casino",
	"don't-disturb-mode": "email",
	done: "essential",
	donut: "coffe",
	door: "furniture",
	"dotted-center": "arrow2",
	"dotted-center2": "arrow2",
	"double-arrow-down": "arrow2",
	"double-arrow-left": "arrow2",
	"double-arrow-right": "arrow2",
	"double-arrow-up": "arrow2",
	"double-bed": "furniture",
	"double-diagonal-arrows": "arrow2",
	"double-dildo": "sex",
	"double-up-and-down": "arrow2",
	down: "chart",
	"down-left-and-up-right": "arrow2",
	"downgrade-file": "files",
	download: "essential",
	"download-2": "essential",
	"download-arrow": "arrow",
	"download-cloud": "network",
	"download-horizontal-arrow": "arrow",
	"download-in-drive": "network",
	"download-list": "essential",
	"download-packet": "network",
	"download-square": "essential",
	downloadfromcloud: "nature",
	drawer: "furniture",
	"drawer-2": "furniture",
	"drawer-3": "furniture",
	"drawer-closet": "furniture",
	"drawer-closet-2": "furniture",
	"drawer-mirror": "furniture",
	drawing: "ui-design",
	dress: "clothes2",
	dresser: "furniture",
	"dresser-2": "furniture",
	"dresser-3": "furniture",
	dribbble: "social",
	drill: "tools",
	"drill-2": "tools",
	"drill-3": "tools",
	"drill-4": "tools",
	"drill-5": "tools",
	drink: "wedding",
	"dripping-heart": "wedding",
	driver: "computers-devices-electronics",
	"driver-2": "computers-devices-electronics",
	"driver-refresh": "computers-devices-electronics",
	driving: "car",
	drop: "weather",
	dropbox: "social",
	dropper: "pet",
	drops: "nature",
	drumstick: "video-games",
	drumstick2: "video-games",
	duck: "animals",
	dumbbell: "sports",
	dumbbell2: "fitness",
	dumbbell3: "fitness",
	dumbbell4: "fitness",
	dumbbell6: "fitness",
	duplicate: "ui-design",
	"duplicate-2": "ui-design",
	"duplicate-3": "copyright",
	"duplicate-home": "home",
	"duplicate-money": "money",
	"duplicate-restricted": "copyright",
	"duplicate-restricted-2": "copyright",
	e: "alphabet-numbers",
	"e-pen": "essential",
	earrings: "clothes",
	earth: "space",
	earth2: "space2",
	earth3: "space2",
	earth4: "space2",
	earthandmoon: "space",
	earthandsun: "space",
	ecg: "health",
	eco: "ecology",
	"eco-invoice": "ecology",
	"ectrocardiogram-monitor-02": "medical",
	edit: "content-edit",
	"edit-2": "content-edit",
	"edit-basket": "shop",
	"edit-card": "money",
	"edit-cloud": "web",
	"edit-contact": "user",
	"edit-file": "files",
	"edit-file-2": "files",
	"edit-file-3": "files",
	"edit-format": "design",
	"edit-home": "real-state",
	"edit-receipt": "shop",
	"edit-square": "essential",
	"edit-text": "essential",
	edit2: "ai2",
	edit3: "ai2",
	"educare-ekt": "crypto",
	effect: "ui-design",
	"effect-2": "video",
	egg: "food2",
	"egg-cup": "coffe",
	eggs: "food2",
	electric: "ecology",
	"electric-bill": "ecology",
	"electric-mixer": "kitchen",
	"electric-search": "ecology",
	electriccable: "energy",
	electricity: "computers-devices-electronics",
	"electricity-bill": "ecology",
	"electrocardiogram-monitor-01": "medical",
	"element-ornament": "vr",
	"element-presentation": "vr",
	elevator: "travel",
	email: "email",
	"email-2": "email",
	"email-box": "email",
	"email-snow": "christmas",
	embassy: "building",
	"emercoin-emc": "crypto",
	emergency: "medical",
	"emergency-icon": "medical",
	"emoji-happy": "essential",
	"emoji-normal": "essential",
	"emoji-sad": "essential",
	empathy: "medical",
	"empty-wallet": "money",
	"empty-wallet-add": "money",
	"empty-wallet-change": "money",
	"empty-wallet-remove": "money",
	"empty-wallet-tick": "money",
	"empty-wallet-time": "money",
	"end-to-end-chat": "security",
	"end-to-end-download": "security",
	"enema-bulb": "sex",
	energy: "essential",
	"energy-cycle": "energy",
	energyrecovery: "energy",
	engine: "car-service",
	enhance: "ui-design",
	"enhance-2": "ui-design",
	"enhance-3": "ui-design",
	"enhance-mood": "ai",
	"enhance-prize": "ai",
	"enhance-user-ai": "ai",
	"enhanced-file": "security",
	"enjin-coin-enj": "crypto",
	enter: "essential",
	"enter-arrow": "arrow",
	"enter-arrow2": "arrow",
	"enter-arrow3": "arrow",
	"enter-home": "real-state",
	envelope: "email",
	"eos-eos": "crypto",
	epee: "fitness",
	equal: "copyright",
	"equal-2": "copyright",
	equalizer: "essential",
	erase: "ai2",
	eraser: "ui-design",
	error: "programming2",
	"error-basket": "shop",
	"error-code": "programming",
	"error-code-2": "programming",
	"error-data": "programming",
	"error-data-2": "programming",
	"error-data-3": "programming",
	"error-mail": "email",
	"error-message": "programming",
	"error-shop": "shop",
	"error-sign": "shop",
	esports: "sports2",
	eth: "cryptocurrency",
	ethereum: "crypto",
	"ethereum-classic-cryptocurrency-blockchain-decentralized-ledger-smart-contracts": "crypto",
	"ethereum-classic-etc": "crypto",
	"ethereum-eth": "crypto",
	euro: "alphabet-numbers",
	"euro-circle": "money",
	"euro-square": "money",
	exclamation: "security",
	"exit-arrow": "arrow",
	"exit-arrow2": "arrow",
	"exit-arrow3": "arrow",
	"expand-from-center": "arrow2",
	"expand-full": "arrow2",
	"expand-max": "arrow2",
	explosive: "weapons",
	explosive2: "weapons",
	explosive3: "weapons",
	export: "arrow",
	"export-arrow": "arrow",
	"export-arrow2": "arrow",
	"export-circle": "arrow",
	"export-circle2": "arrow",
	"export-square": "arrow",
	exposure: "video",
	"exposure-2": "video",
	"exposure-closed": "video",
	expresstrain: "travel",
	extension: "programming2",
	"external-drive": "computers-devices-electronics",
	eye: "security",
	"eye-slash": "security",
	eyedropereyedropper: "ui-design",
	eyedropper: "ui-design",
	"eyedropper-2": "ui-design",
	"eyedropper-3": "ui-design",
	"eyedropper-4": "ui-design",
	"eyedropper-circle": "ui-design",
	"eyedropper-square": "ui-design",
	f: "alphabet-numbers",
	"face-id": "ai2",
	facebook: "crypto",
	factory: "ecology",
	"factory-2": "ecology",
	"fair-use": "copyright",
	famle: "sex",
	fan: "furniture",
	"fan-blade": "furniture",
	"favorite-bag": "shop",
	"favorite-card": "money",
	"favorite-chart": "business",
	"favorite-circle": "essential",
	"favorite-home": "real-state",
	"favorite-hone": "real-state",
	"favorite-mails": "email",
	"favorite-page": "programming2",
	"favorite-search": "search",
	"favorite-square": "essential",
	feather: "ui-design",
	"feather-2": "ui-design",
	feedback: "real-state",
	"feedback-2": "programming",
	"feedback-shield": "security",
	"feeding-bottle": "baby",
	fencing: "fitness",
	"ferris-wheel": "sports2",
	"ferris-wheel2": "sports2",
	"fidget-spinner": "casino",
	fighter: "weapons",
	figma: "social",
	"figma-2": "crypto",
	"figma-circle": "crypto",
	"figma-square": "social",
	file: "ai2",
	"file-check": "arrow",
	"file-drawer": "stationery",
	"filming-camera": "device",
	"filming-camera-2": "device",
	filmingcamera: "device",
	filter: "essential",
	"filter-2": "essential",
	"filter-add": "essential",
	"filter-edit": "essential",
	"filter-remove": "essential",
	"filter-search": "essential",
	"filter-square": "essential",
	"filter-tick": "essential",
	finger: "security",
	"finger-circle": "security",
	"finger-cross": "hand",
	"finger-scan": "security",
	"finger-shield": "hand",
	"finger-toshield": "hand",
	fingerfinger: "security",
	fingerprint: "security",
	"fingerprint-2": "security",
	"fingerprint-3": "security",
	"fingerprint-4": "security",
	fire: "nature",
	"fire-heart": "wedding",
	fire2: "christmas",
	fire3: "christmas",
	fireextinguisher: "stationery",
	firefire: "food",
	fireworks: "christmas",
	fireworks2: "christmas",
	fireworks3: "christmas",
	fireworks4: "christmas",
	"first-aid": "medical",
	"first-aid-box": "health",
	"first-aid-box-2": "health",
	"first-aid-kit": "military",
	firstline: "type-paragraph-character",
	fish: "pet",
	"fish-skeleton": "animals",
	fish2: "pet",
	fish3: "pet",
	fish4: "pet",
	fish5: "pet",
	"fishing-hook": "fitness",
	"fit-to-size": "design",
	"fitness-ab-wheel": "sports2",
	"fitness-dumbbell": "sports2",
	flag: "essential",
	"flag-2": "essential",
	"flag-3": "essential",
	"flag-on-moon": "space",
	flail: "weapons",
	flail2: "weapons",
	flame: "food",
	flash: "essential",
	"flash-circle": "essential",
	"flash-disabled": "video",
	"flash-slash": "essential",
	flashlight: "device",
	flask: "health",
	"flip-flops": "clothes2",
	"float-ring": "fitness",
	flogger: "sex",
	"floral-candelabra": "wedding",
	flour: "coffe",
	flow: "ui-design",
	flower: "nature",
	"focus-ai": "ai",
	folder: "files",
	"folder-2": "files",
	"folder-add": "files",
	"folder-cloud": "files",
	"folder-connected": "network",
	"folder-connection": "computers-devices-electronics",
	"folder-cross": "files",
	"folder-favorite": "files",
	"folder-minus": "files",
	"folder-open": "files",
	"folder-route": "network",
	"folder-timeout": "network",
	food: "food2",
	"food-scale": "kitchen",
	football: "fitness",
	"football-helmet": "sports2",
	footballball: "sports",
	footballstadium: "sports",
	forbidden: "video",
	"forbidden-2": "essential",
	"forbidden-basket": "shop",
	"forbidden-brand": "copyright",
	"forbidden-camera": "video",
	"forbidden-card": "money",
	"forbidden-cloud": "web",
	"forbidden-contact": "user",
	"forbidden-copyright": "copyright",
	"forbidden-copyright-2": "copyright",
	"forbidden-file": "files",
	"forbidden-file-2": "files",
	"forbidden-home": "real-state",
	"forbidden-mobile": "mobile",
	"forbidden-money": "copyright",
	"forbidden-receipt": "shop",
	"forbidden-sign": "shop",
	"forbidden-signal": "chart",
	fork: "food",
	"fork-knife": "kitchen",
	"fork-knife-2": "kitchen",
	"fork-knife-crossed": "kitchen",
	form: "essential",
	"form-2": "essential",
	format: "design",
	"format-circle": "grid",
	"format-square": "grid",
	forward: "video-audio-image",
	"forward-10-seconds": "video-audio-image",
	"forward-15-seconds": "video-audio-image",
	"forward-2": "email",
	"forward-5-seconds": "video-audio-image",
	"forward-backward-basket": "shop",
	"forward-backward-card": "money",
	"forward-backward-card-2": "money",
	"forward-backward-contact": "user",
	"forward-backward-dollar": "money",
	"forward-basket": "shop",
	"forward-basket-2": "shop",
	"forward-card": "money",
	"forward-contact": "user",
	"forward-dollar": "money",
	"forward-item": "design-tools",
	"forward-mail": "email",
	"fountain-pen": "design",
	fox: "animals",
	frame: "ui-design",
	"frame 15000": "grid",
	"frame-2": "ui-design",
	"frame-muscle": "sports",
	"frame-select": "ui-design",
	"framefinger-cross": "hand",
	framer: "social",
	"framer-2": "social",
	"framer-square": "social",
	frameramen: "food",
	france: "landmarks",
	freezer: "furniture",
	"french-press": "coffe",
	fried: "food2",
	frisbee: "fitness",
	frisbee2: "fitness",
	frog: "animals",
	frog2: "animals",
	"frying-pan": "kitchen",
	"ftp-error": "network",
	"ftp-server": "network",
	"ftp-timeout": "network",
	"ftx-token-ftt": "crypto",
	"fuel-tank": "car-service",
	"fuel-tank-2": "car-service",
	furnace: "coffe",
	g: "alphabet-numbers",
	gag: "sex",
	gallery: "video",
	"gallery-2": "video",
	"gallery-add": "video-audio-image",
	"gallery-edit": "video-audio-image",
	"gallery-export": "video-audio-image",
	"gallery-favorite": "video-audio-image",
	"gallery-import": "video-audio-image",
	"gallery-remove": "video-audio-image",
	"gallery-slash": "video-audio-image",
	"gallery-tick": "video-audio-image",
	gamble: "casino",
	game: "computers-devices-electronics",
	"game-immersive": "vr",
	"game-streamline": "vr",
	"game-symbols": "game",
	gameboy: "computers-devices-electronics",
	gamepad: "game",
	"gaming-chair": "video-games",
	"gaming-mouse": "game",
	garage: "building",
	garlic: "food2",
	gas: "military",
	"gas-station": "car",
	gear: "car-service",
	gem: "video-games",
	gem2: "video-games",
	gem3: "video-games",
	gemini: "astrology",
	"gemini-2": "astrology",
	"gender-symbol": "essential",
	generate: "ai2",
	germany: "landmarks",
	"get-key": "real-state",
	ghost: "essential",
	ghost2: "halloween",
	ghost3: "halloween",
	gift: "love",
	"gift-bag": "christmas",
	"gift-cupcake": "christmas",
	gift10: "christmas",
	gift102: "christmas",
	gift11: "christmas",
	gift12: "christmas",
	gift122: "christmas",
	gift13: "christmas",
	gift14: "christmas",
	gift142: "christmas",
	gift15: "christmas",
	gift152: "christmas",
	gift16: "christmas",
	gift162: "christmas",
	gift17: "christmas",
	gift172: "christmas",
	gift2: "christmas",
	gift3: "christmas",
	gift4: "christmas",
	gift5: "christmas",
	gift6: "christmas",
	gift7: "christmas",
	gift8: "christmas",
	gift9: "christmas",
	gift92: "christmas",
	ginger: "food2",
	git: "programming2",
	git2: "programming2",
	git3: "programming2",
	git32: "programming2",
	github: "social",
	"github-2": "social",
	"github-3": "social",
	gitlab: "social",
	"gitlab-2": "social",
	"give-blood": "medical",
	"give-pill": "medical",
	glass: "essential",
	"glass-2": "essential",
	glasses: "clothes2",
	glob: "ai2",
	global: "location",
	"global-cloud": "network",
	"global-edit": "location",
	"global-mail": "email",
	"global-nature": "ecology",
	"global-network": "blockchain",
	"global-refresh": "location",
	"global-search": "location",
	"global-water": "ecology",
	globalenergy: "energy",
	globe: "booking",
	gmail: "social",
	goal: "sports",
	golf: "sports2",
	"golf-club": "fitness",
	golf2: "fitness",
	golfhole: "sports",
	google: "social",
	"google-drive": "social",
	"google-play": "social",
	"google-play-2": "social",
	gopro: "devices",
	"gopro-2": "devices",
	gps: "location",
	"gps-slash": "location",
	graph: "business",
	grater: "food",
	greece: "landmarks",
	greece2: "landmarks",
	greece3: "landmarks",
	"green-house": "ecology",
	"green-tea": "coffe",
	grenade: "military",
	grenade2: "military",
	grid: "essential",
	"grid-2": "grid",
	"grid-3": "grid",
	"grid-4": "grid",
	"grid-5": "grid",
	"grid-6": "grid",
	"grid-7": "grid",
	"grid-8": "grid",
	"grid-9": "grid",
	"grid-add": "grid",
	"grid-edit": "grid",
	"grid-equal": "grid",
	"grid-eraser": "grid",
	"grid-file": "files",
	"grid-lock": "ui-design",
	grids: "grid",
	grill: "kitchen",
	grinning: "emoji",
	groom: "wedding",
	group: "mobile",
	guard: "mobile",
	"guid-left": "arrow2",
	"guid-left-down": "arrow2",
	"guid-right": "arrow2",
	"guid-right-down": "arrow2",
	"guide-book": "real-state",
	"guide-sign": "booking",
	gun: "weapons",
	gun10: "weapons",
	gun11: "weapons",
	gun12: "weapons",
	gun13: "weapons",
	gun14: "weapons",
	gun15: "weapons",
	gun16: "weapons",
	gun17: "weapons",
	gun2: "weapons",
	gun3: "weapons",
	gun4: "weapons",
	gun5: "weapons",
	gun6: "weapons",
	gun7: "weapons",
	gun8: "weapons",
	gun9: "weapons",
	gunya: "tools",
	"gym-bag": "fitness",
	"gym-equipment": "fitness",
	"gym-equipment10": "fitness",
	"gym-equipment12": "fitness",
	"gym-equipment13": "fitness",
	"gym-equipment2": "fitness",
	"gym-equipment3": "fitness",
	"gym-equipment4": "fitness",
	"gym-equipment5": "fitness",
	"gym-equipment6": "fitness",
	"gym-equipment7": "fitness",
	"gym-equipment72": "fitness",
	"gym-equipment8": "fitness",
	"gym-equipment9": "fitness",
	gym2: "fitness",
	gymnastics: "fitness",
	gymnastics2: "fitness",
	gymnastics3: "fitness",
	gymweights: "sports",
	gynec: "medical",
	h: "alphabet-numbers",
	"hair-clip": "clothes2",
	hairdryer: "travel",
	hammer: "tools",
	"hammer-2": "tools",
	"hammer-legal": "money",
	hammer2: "sports2",
	hamster: "pet",
	hamster2: "pet",
	"hand-bag-home": "home",
	"hand-card": "money",
	"hand-gesture-control": "vr",
	"hand-gesture-control-expand": "vr",
	"hand-gesture-control2": "vr",
	"hand-soap": "medical",
	handball: "fitness",
	handballball: "sports",
	handcircle: "hand",
	handcuffs: "sex",
	handcuffs2: "sex",
	handtohand: "hand",
	hanger: "clothes",
	"hanger-2": "clothes",
	"hanging-ornament": "christmas",
	happy: "emoji",
	happyemoji: "essential",
	"haptic-sensor-vibration-controller": "vr",
	"haptic-sensor-vibration-controller2": "vr",
	"hapticp-laystation-vr": "vr",
	"hard-drive": "network",
	"hard-drive-2": "network",
	"harmony-one": "crypto",
	hashtag: "business",
	"hashtag-down": "programming",
	"hashtag-file": "files",
	"hashtag-up": "programming",
	hat: "clothes",
	hat2: "christmas",
	hat3: "christmas",
	hd: "video",
	"hd-2": "video",
	hdr: "video",
	"hdr-mode": "video",
	headphone: "computers-devices-electronics",
	headphones: "computers-devices-electronics",
	headset: "game",
	"headset-2": "game",
	"headset-3": "game",
	heal: "video-games",
	heal2: "video-games",
	heal3: "video-games",
	health: "business",
	"health-care": "medical",
	"health-chat": "medical",
	"health-circle": "health",
	"health-condition": "medical",
	"health-condition-2": "medical",
	"health-file-02": "medical",
	"health-file-03": "medical",
	"health-folder": "medical",
	"health-home": "real-state",
	"health-sign": "health",
	"health-sign-2": "health",
	"health-sync": "medical",
	"health-talk": "medical",
	"health-watch": "medical",
	healthcare: "fitness",
	healthyhouse: "ecology",
	heart: "love",
	"heart-2": "love",
	"heart-add": "support-like-question",
	"heart-angel": "wedding",
	"heart-balloon": "wedding",
	"heart-beat": "essential",
	"heart-check": "medical",
	"heart-circle": "support-like-question",
	"heart-edit": "support-like-question",
	"heart-envelope": "email",
	"heart-infinite": "wedding",
	"heart-infinitie": "wedding",
	"heart-necklace": "love",
	"heart-protect": "medical",
	"heart-puzzle": "wedding",
	"heart-rate": "medical",
	"heart-rate-monitor": "device",
	"heart-remove": "support-like-question",
	"heart-search": "support-like-question",
	"heart-slash": "support-like-question",
	"heart-square": "health",
	"heart-status": "health",
	"heart-tap": "health",
	"heart-tick": "support-like-question",
	heart2: "wedding",
	hearted: "emoji",
	"hearted-eyes": "emoji",
	hearts: "casino",
	"hearts-coin": "casino",
	"heat-level": "essential",
	"hedera-hashgraph-hbar": "crypto",
	helicopter: "travel",
	helmet: "military",
	helmets: "car-service",
	"heterogeneous-network": "blockchain",
	"hex-bolt": "essential",
	"hex-hex": "crypto",
	"hex-nut": "essential",
	"hex-setting": "essential",
	hidden: "security",
	"hidden-lock": "security",
	hide: "essential",
	"hide-2": "essential",
	"hide-3": "essential",
	"hide-text": "essential",
	"hierarchical-structure": "blockchain",
	hierarchy: "programming",
	"hierarchy-2": "programming",
	"hierarchy-3": "programming",
	"hierarchy-4": "programming",
	"hierarchy-5": "programming",
	"hierarchy-6": "programming",
	"hierarchy-7": "programming",
	"hierarchy-8": "programming",
	"hierarchy-9": "programming",
	"hierarchy-square": "programming",
	"hierarchy-square-2": "programming",
	"hierarchy-square-3": "programming",
	"high-tower": "building",
	hippo: "animals",
	hippopotamus: "animals",
	hiv: "medical",
	"ho-ho-ho": "christmas",
	hockey: "sports2",
	"hockey-skates": "sports2",
	"hockey-stick": "fitness",
	hockey2: "sports2",
	"hold-file": "files",
	"holiday-icons": "christmas",
	home: "home",
	"home-2": "home",
	"home-3": "home",
	"home-4": "home",
	"home-5": "home",
	"home-6": "home",
	"home-7": "home",
	"home-book": "real-state",
	"home-calander": "real-state",
	"home-calendar": "real-state",
	"home-click": "real-state",
	"home-enhance": "ai",
	"home-hashtag": "business",
	"home-hover": "real-state",
	"home-id": "real-state",
	"home-id-2": "real-state",
	"home-id-3": "real-state",
	"home-info": "real-state",
	"home-key": "real-state",
	"home-key-2": "real-state",
	"home-location": "real-state",
	"home-location-2": "real-state",
	"home-owner": "real-state",
	"home-pic": "real-state",
	"home-place": "real-state",
	"home-price": "real-state",
	"home-price-list": "real-state",
	"home-review": "real-state",
	"home-route": "real-state",
	"home-search": "real-state",
	"home-security": "essential",
	"home-settings": "real-state",
	"home-settings-2": "real-state",
	"home-split": "real-state",
	"home-tour": "real-state",
	"home-trend-down": "business",
	"home-trend-up": "business",
	"home-up-chart": "real-state",
	"home-wifi": "essential",
	homes: "real-state",
	"honey-spoon": "coffe",
	honeymoon: "wedding",
	honeymoon2: "wedding",
	honeymoon3: "wedding",
	hoodie: "clothes",
	"hoodie-2": "clothes",
	"horizontal-box": "design",
	"horizontal-move": "design",
	"horizontal-resize": "arrow2",
	"horizontal-resize2": "arrow2",
	horseshoe: "christmas",
	hospital: "health",
	"hospital-3": "medical",
	"hospital-bed": "medical",
	"hospital-building-3": "medical",
	"hospital-building-4": "medical",
	"hospital-land": "travel",
	"hospital-location": "travel",
	"hospital-symbol": "medical",
	"hot-drink": "coffe",
	"hot-drink2": "coffe",
	"hot-drink3": "coffe",
	"hot-drink4": "coffe",
	"hot-drink5": "coffe",
	"hotair-balloon": "travel",
	hotspot: "essential",
	hourglass: "time",
	house: "building",
	"house-2": "building",
	"house-code": "security",
	"house-not-available": "real-state",
	housepower: "ecology",
	"hover-home": "real-state",
	"hover-mouse": "essential",
	html: "crypto",
	"html-2": "crypto",
	"hula-hoop": "fitness",
	human: "security",
	"human-circle": "security",
	"human-scan": "security",
	"huobi-token-ht": "crypto",
	"hybrid-topology": "blockchain",
	i: "alphabet-numbers",
	"ice-cream": "baby",
	"ice-skates": "fitness",
	ico: "essential",
	"icon-icx": "crypto",
	id: "security",
	"id-card": "user",
	"id-card-2": "user",
	"id-circle": "security",
	"id-scan": "security",
	"id-square": "security",
	idea: "programming2",
	illustrator: "crypto",
	image: "video-audio-image",
	"image-clarity-sharpness": "vr",
	"image-generate": "ai2",
	import: "arrow",
	"import-arrow": "arrow",
	"import-arrow2": "arrow",
	"import-circle": "arrow",
	"import-circle2": "arrow",
	"import-square": "arrow",
	"important-mail": "email",
	inbox: "email",
	"inbox-2": "email",
	incognito: "programming2",
	"incognito-check": "security",
	"incognito-circle": "security",
	"incognito-selected": "security",
	"incognito-shield": "security",
	"incognito-square": "security",
	increase: "essential",
	"increase-speed": "essential",
	"increase-speed-2": "essential",
	indesign: "social",
	india: "landmarks",
	india2: "landmarks",
	india3: "landmarks",
	india4: "landmarks",
	india5: "landmarks",
	india6: "landmarks",
	indonesia: "landmarks",
	indonesia2: "landmarks",
	indonesia3: "landmarks",
	indonesia4: "landmarks",
	"inequality-symbol": "copyright",
	"infinite-canvas": "vr",
	"infinite-canvas--streamline": "vr",
	"info-circle": "arrow",
	"info-home": "home",
	"info-square": "arrow",
	information: "essential",
	injection: "medical",
	instagram: "essential",
	install: "programming2",
	instrument: "sports2",
	instrument2: "sports2",
	instrument3: "sports2",
	internet: "network",
	"internet-drive": "network",
	"iost-iost": "crypto",
	ip: "security",
	"ip-2": "security",
	"ip-3": "security",
	"ip-4": "security",
	"ip-5": "security",
	"ip-circle": "security",
	"ip-hexagon": "security",
	"ip-location": "security",
	"ip-octagonal": "security",
	"ip-square": "security",
	"iris-control-function": "vr",
	iso: "video",
	"iso-2": "video",
	item: "video-games",
	item2: "video-games",
	item3: "video-games",
	item4: "video-games",
	itunes: "essential",
	iv: "pet",
	"iv-bag": "pet",
	j: "alphabet-numbers",
	jacket: "clothes",
	jacket2: "clothes2",
	jackpot: "casino",
	japan: "landmarks",
	"japan-2": "landmarks",
	"japan-3": "landmarks",
	japan2: "landmarks",
	japan3: "landmarks",
	japan4: "landmarks",
	japan5: "landmarks",
	japan6: "landmarks",
	jar: "food2",
	java: "programming2",
	"java-script": "crypto",
	javascript: "crypto",
	jeans: "clothes",
	jellyfish: "animals",
	jet: "military",
	joker: "casino",
	"joker-coin": "casino",
	joy: "emoji",
	"joy-2": "emoji",
	joy9: "emoji",
	joycon: "game",
	joystick: "game",
	js: "social",
	"js-file": "programming",
	judge: "essential",
	"juice-bar": "fitness",
	"juice-jug": "kitchen",
	"jump-rope": "sports2",
	"jump-rope2": "fitness",
	"jump-rope21": "fitness",
	"jump-rope3": "fitness",
	"jump-rope4": "fitness",
	"jump-rope5": "fitness",
	"jump-rope6": "fitness",
	jupiter: "astrology2",
	k: "alphabet-numbers",
	kayak: "sports2",
	kettle: "coffe",
	kettlebell: "fitness",
	kettlebell2: "fitness",
	key: "security",
	"key-2": "security",
	"key-3": "security",
	"key-circle": "security",
	"key-frame": "video",
	"key-square": "security",
	keyboard: "programming",
	"keyboard-open": "computers-devices-electronics",
	"king-chess": "casino",
	kissing: "emoji",
	"kissing-2": "emoji",
	kitchen: "furniture",
	knife: "food",
	"kyber-network-knc": "crypto",
	l: "alphabet-numbers",
	lab: "medical",
	ladle: "kitchen",
	"ladle-holder": "kitchen",
	"ladle-holder-2": "kitchen",
	lama: "animals",
	lamp: "essential",
	"lamp-charge": "notifications",
	"lamp-christmas": "christmas",
	"lamp-on": "notifications",
	"lamp-slash": "notifications",
	lan: "video-games",
	landing: "travel",
	language: "essential",
	"language-circle": "type-paragraph-character",
	"language-square": "type-paragraph-character",
	"lantern-star": "christmas",
	laptop: "device",
	"laptop-encrypted": "security",
	"laptop-home": "real-state",
	"laptop-protected": "security",
	latte: "coffe",
	launcher: "weapons",
	layer: "design-tools",
	"layer 81": "security",
	layers: "video",
	"layers-2": "video",
	layout: "essential",
	"layout-adjust": "grid",
	"layout-blocks": "programming2",
	"lazy-moving-animation": "vr",
	leaf: "nature",
	"leaf-2": "nature",
	"leaf-3": "nature",
	"leaf-circle": "energy",
	"leaf-square": "energy",
	leafcircle: "ecology",
	leafs: "nature",
	leafsquare: "ecology",
	left: "mobile",
	"left-and-right": "files",
	"left-and-right-control": "arrow2",
	"left-bar-grid": "grid",
	"left-chart": "chart",
	"left-circle-chart": "chart",
	"left-cloud": "web",
	"left-money": "money",
	"left-right": "mobile",
	"left-right-cloud": "web",
	"left-sidebar-grid": "grid",
	"left-signal": "chart",
	legal: "money",
	lens: "video",
	"lens-distance": "vr",
	leo: "astrology2",
	letter: "wedding",
	letter2: "wedding",
	level: "essential",
	libra: "astrology2",
	libra2: "astrology2",
	library: "furniture",
	"library-drawer": "furniture",
	"library-drawer-2": "furniture",
	"life-like-interface-volume": "vr",
	lifebuoy: "design-tools",
	"lifting-weights": "fitness",
	"lifting-weights2": "fitness",
	"lifting-weights3": "fitness",
	"light-mode": "video",
	"light-mode-2": "video",
	lightning: "nature",
	"lightning-airpods": "game",
	lights: "wedding",
	like: "shop",
	"like-2": "support-like-question",
	"like-dislike": "support-like-question",
	"like-home": "home",
	"like-money": "money",
	"like-shapes": "support-like-question",
	"like-tag": "support-like-question",
	"liked-file": "files",
	"liked-list": "health",
	"liked-shop": "shop",
	line: "programming",
	"line-2": "programming",
	"line-space": "essential",
	"linear-chart": "chart",
	link: "type-paragraph-character",
	"link-2": "type-paragraph-character",
	"link-3": "type-paragraph-character",
	"link-4": "type-paragraph-character",
	"link-circle": "type-paragraph-character",
	"link-square": "type-paragraph-character",
	linkedin: "social",
	lips: "beauty",
	"lips-circle": "beauty",
	lipstick: "beauty",
	"lipstick-2": "beauty",
	liquid: "energy",
	"liquid-2": "energy",
	list: "health",
	listening: "sports2",
	litecoin: "crypto",
	litecoinltc: "crypto",
	"little-grater": "food",
	"live-beat": "medical",
	loading: "essential",
	location: "home",
	"location-add": "location",
	"location-cross": "location",
	"location-hospital": "medical",
	"location-mail": "email",
	"location-mark": "essential",
	"location-minus": "location",
	"location-slash": "location",
	"location-tick": "location",
	lock: "security",
	"lock-2": "security",
	"lock-3": "security",
	"lock-4": "security",
	"lock-5": "security",
	"lock-case": "security",
	"lock-circle": "security",
	"lock-heart": "wedding",
	"lock-heart2": "wedding",
	"lock-slash": "security",
	"locked-desktop": "security",
	"locked-home": "real-state",
	"locked-home-2": "real-state",
	"locked-homes": "real-state",
	"locked-search": "security",
	locker: "security",
	"locker-2": "security",
	"locker-key": "travel",
	locker2: "fitness",
	lockingneedle: "clothes",
	log: "nature",
	login: "arrow",
	login2: "arrow",
	logout: "arrow",
	logout2: "arrow",
	lollipop: "christmas",
	loop: "security",
	"loop-data": "programming",
	love: "wedding",
	"love-cake": "love",
	"love-click": "love",
	"love-mail": "love",
	"love-shine": "love",
	love2: "wedding",
	love3: "wedding",
	love4: "wedding",
	love5: "wedding",
	lovely: "support-like-question",
	"low-light": "video",
	"lte-sim": "telephone",
	lubricant: "sex",
	luggage: "travel",
	luncher: "military",
	lung: "medical",
	lungs: "medical",
	m: "real-state",
	"mac-os": "essential",
	macapat: "coffe",
	"machine-gun": "military",
	macro: "video",
	magic: "sports2",
	"magic-hat": "casino",
	"magic-star": "support-like-question",
	"magic-wand": "christmas",
	magicpen: "design-tools",
	maiil: "ai2",
	mail: "email",
	"mail-schedule": "email",
	mailbox: "email",
	mailpost: "device",
	mails: "email",
	"main-component": "design-tools",
	"maker-mkr": "crypto",
	man: "astrology",
	manorwoman: "essential",
	"manual-focus": "video",
	map: "location",
	"map-2": "location",
	"map-football": "video-games",
	"map-tag": "video-games",
	mark: "essential",
	marker: "ui-design",
	marking: "security",
	"martial-arts": "fitness",
	mask: "health",
	"mask-2": "design-tools",
	"mask-3": "design-tools",
	mask2: "sports2",
	massager: "sex",
	mastercard: "social",
	"masturbation-sleeve": "sex",
	mat: "fitness",
	mat2: "fitness",
	mat3: "fitness",
	math: "money",
	maulstick: "food",
	maximize: "video",
	"maximize-2": "grid",
	"maximize-3": "grid",
	"maximize-4": "grid",
	"maximize-circle": "video-audio-image",
	"maximize-format": "design",
	"maximize-frame": "video",
	maximizefinger: "hand",
	meal: "wedding",
	"measure-hammer": "tools",
	"measure-pen": "tools",
	"measure-tools": "tools",
	"measuring-cup": "coffe",
	"meat-grinder": "kitchen",
	medal: "sports",
	"medal-2": "sports",
	"medal-file": "files",
	"medal-star": "support-like-question",
	medal2: "military",
	medals: "casino",
	"medals-2": "casino",
	"medic-cross": "medical",
	"medical-book": "medical",
	"medical-document": "medical",
	"medical-file": "medical",
	"medical-information": "medical",
	"medical-program": "health",
	"medical-record": "medical",
	"medical-report": "medical",
	"medical-service": "medical",
	medication: "medical",
	meditation: "fitness",
	meditation2: "fitness",
	meditation3: "fitness",
	medium: "social",
	melee: "weapons",
	melee2: "weapons",
	melee3: "weapons",
	melee4: "weapons",
	melee5: "weapons",
	melee6: "weapons",
	"mental-health": "medical",
	menu: "settings",
	"menu-board": "content-edit",
	"menu-burger": "essential",
	"mesh-topology": "blockchain",
	"message-add": "emails-messages",
	"message-add-2": "emails-messages",
	"message-bubble": "emails-messages",
	"message-circle": "emails-messages",
	"message-edit": "emails-messages",
	"message-favorite": "emails-messages",
	"message-minus": "emails-messages",
	"message-notif": "emails-messages",
	"message-programming": "programming",
	"message-question": "support-like-question",
	"message-remove": "emails-messages",
	"message-search": "emails-messages",
	"message-square": "emails-messages",
	"message-text": "emails-messages",
	"message-text-2": "emails-messages",
	"message-tick": "emails-messages",
	"message-time": "emails-messages",
	messages: "emails-messages",
	"messages-2": "emails-messages",
	"messages-bubbles": "emails-messages",
	messenger: "social",
	"messenger-2": "social",
	"messenger-square": "social",
	"meta-quest": "vr",
	"meta-quest-pro": "vr",
	"meta-quest-pro2": "vr",
	"meta-quest2": "vr",
	meteor: "space2",
	meteor2: "space2",
	meteor3: "space2",
	meteor4: "space2",
	meteor5: "space2",
	meter: "ui-design",
	mexico: "landmarks",
	mexico2: "landmarks",
	microphone: "essential",
	"microphone-2": "video-audio-image",
	"microphone-slash": "video-audio-image",
	"microphone-slash-2": "video-audio-image",
	microphone2: "device",
	microscope: "medical",
	microwave: "furniture",
	"middle-finger": "hand",
	"military-base": "military",
	"military-base2": "military",
	"military-hat": "military",
	milk: "essential",
	"milk-bottle": "baby",
	"milk-jug": "coffe",
	milkshake: "coffe",
	mine: "military",
	mine2: "military",
	"mini-camera": "devices",
	"mini-music-square": "video-audio-image",
	"mini-tank": "military",
	"minimize-format": "design",
	minus: "essential",
	"minus-2": "essential",
	"minus-circle": "essential",
	"minus-format": "design",
	"minus-receipt": "health",
	"minus-signal": "chart",
	"minus-square": "essential",
	mirror: "clothes",
	"mirror-2": "furniture",
	"mirror-makeup": "beauty",
	"mirroring-screen": "computers-devices-electronics",
	missile: "military",
	mistletoe: "christmas",
	mitten: "christmas",
	mobile: "mobile",
	"mobile-2": "mobile",
	"mobile-cloud": "network",
	"mobile-programming": "programming",
	"mobile-toy": "baby",
	mocha: "coffe",
	modem: "game",
	"moden-city": "building",
	"modern-city": "building",
	module: "programming2",
	"module-blocks": "programming2",
	molotov: "military",
	"monero-xmr": "crypto",
	"monetization-unavailable": "copyright",
	monetize: "copyright",
	"monetize-2": "copyright",
	money: "money",
	"money-2": "money",
	"money-3": "money",
	"money-4": "money",
	"money-5": "money",
	"money-6": "money",
	"money-7": "money",
	"money-8": "money",
	"money-add": "money",
	"money-archive": "money",
	"money-change": "money",
	"money-comment": "money",
	"money-down": "money",
	"money-forbidden": "money",
	"money-income": "money",
	"money-receipt": "money",
	"money-receive": "money",
	"money-recive": "money",
	"money-remove": "money",
	"money-secure": "money",
	"money-send": "money",
	"money-tick": "money",
	"money-time": "money",
	"money-up": "money",
	"money-wallet": "money",
	money1: "money",
	moneys: "money",
	monitor: "device",
	"monitor-mobile": "computers-devices-electronics",
	"monitor-recorder": "computers-devices-electronics",
	monkey: "animals",
	moon: "weather",
	"moon-landing": "space2",
	more: "settings",
	"more-circle": "essential",
	"more-options": "essential",
	"more-square": "essential",
	motorsport: "sports2",
	mountaineering: "fitness",
	mountains: "nature",
	mouse: "game",
	"mouse-circle": "essential",
	"mouse-cursor": "ui-design",
	"mouse-square": "essential",
	moustache: "beauty",
	"moustache-circle": "beauty",
	moustache6: "beauty",
	"mouth-gag": "sex",
	"movies-immersive": "vr",
	"moving-cursor": "essential",
	"moving-toward-user-object": "vr",
	mpplayer: "device",
	muffin: "food2",
	mug: "essential",
	"mug-2": "essential",
	"multi-user-server": "blockchain",
	"multiple-mails": "email",
	muscle: "fitness",
	muscle2: "fitness",
	muscle21: "fitness",
	muscle3: "fitness",
	muscle4: "fitness",
	muscle5: "fitness",
	muscle52: "fitness",
	muscle6: "fitness",
	mushroom: "nature",
	"mushroom-cloud": "military",
	music: "video-audio-image",
	"music-circle": "video-audio-image",
	"music-copyright": "copyright",
	"music-copyright-2": "copyright",
	"music-dashboard": "video-audio-image",
	"music-filter": "video-audio-image",
	"music-library": "video-audio-image",
	"music-play": "computers-devices-electronics",
	"music-playlist": "video-audio-image",
	"music-square": "video-audio-image",
	"music-square-add": "video-audio-image",
	"music-square-remove": "video-audio-image",
	"music-square-search": "video-audio-image",
	music2: "ai2",
	"musical-note-ai": "ai",
	musicnote: "video-audio-image",
	myanmar: "landmarks",
	n: "alphabet-numbers",
	"nail-polish": "beauty",
	nails: "beauty",
	"natural-feedback": "ecology",
	nature: "ecology",
	"nature-2": "ecology",
	"nature-cycle": "ecology",
	nav: "military",
	navigate: "essential",
	navy: "military",
	"nebulas-nas": "crypto",
	necklace: "wedding",
	necklace2: "wedding",
	"nem-xem": "crypto",
	nepal: "landmarks",
	neptune: "astrology2",
	network: "blockchain",
	"new-file": "files",
	"new-folder": "network",
	"nexo-nexo": "crypto",
	next: "web",
	nfc: "money",
	"nfc-card": "money",
	"night-mode": "video",
	nintendo: "social",
	"nipple-clamps": "sex",
	"no-antenna": "telephone",
	"no-bed-sex": "sex",
	"no-internet": "telephone",
	"no-simcard": "telephone",
	"no-smoke": "medical",
	"no-smoke-2": "medical",
	"nocturne-mode": "video",
	"nocturne-mode-2": "video",
	"node-communication": "blockchain",
	note: "content-edit",
	"note-2": "content-edit",
	"note-add": "content-edit",
	"note-favorite": "content-edit",
	"note-remove": "content-edit",
	"note-square": "video-audio-image",
	"note-text": "content-edit",
	notification: "notifications",
	"notification-2": "notifications",
	"notification-bing": "notifications",
	"notification-circle": "notifications",
	"notification-favorite": "notifications",
	"notification-square": "notifications",
	"notification-status": "notifications",
	notion: "social",
	nuclear: "energy",
	nuclearenergy: "energy",
	nurse: "baby",
	nut: "tools",
	o: "alphabet-numbers",
	o2: "ecology",
	oak: "nature",
	observatory: "space2",
	obstetric: "medical",
	oc: "weapons",
	"ocean-protocol-ocean": "crypto",
	officer: "military",
	officer2: "military",
	"oil-platform": "ecology",
	"oil-tank": "car-service",
	"oil-tank-2": "car-service",
	"ok-app": "crypto",
	"okb-okb": "crypto",
	"omega-circle": "design-tools",
	"omega-square": "design-tools",
	"on-going-data": "programming",
	"on-going-data-2": "programming",
	"one-bed": "furniture",
	"one-sofa": "furniture",
	onion: "food2",
	"online-home": "real-state",
	"ontology-knowledge-structure-concept-map-relationship-data-model": "crypto",
	"ontology-knowledge-structure-concept-map-relationships-data": "crypto",
	"ontology-knowledge-structure-concept-map-semantics-information": "crypto",
	"ontology-knowledge-structure-concept-mapping-semantic-relation-data-model": "crypto",
	"ontology-knowledge-structure-concept-network-relationships-entity": "crypto",
	"ontology-knowledge-structure-concept-relation-model-data": "crypto",
	"ontology-ont": "crypto",
	"ontology-ontology-knowledge-structure-concept-map-data-relationships": "crypto",
	"open-mail": "email",
	"opened-loveletter": "love",
	openmarker: "stationery",
	"operating-scissors-01": "medical",
	orbit: "space2",
	orbit2: "space2",
	orbit3: "space2",
	orbit4: "space2",
	orbit5: "space2",
	orbit6: "space2",
	os: "essential",
	"outdoor-cafe": "coffe",
	oven: "furniture",
	"oven-mitt": "kitchen",
	overalls: "clothes2",
	owl: "halloween",
	owl2: "halloween",
	p: "alphabet-numbers",
	pacifier: "baby",
	pacifier2: "baby",
	package: "programming",
	"package-2": "programming",
	"package-file": "files",
	"packaged-terminal": "programming",
	packet: "network",
	"packet-2": "network",
	"packet-error": "network",
	"packet-sent": "network",
	pacman: "sports2",
	paddle: "sex",
	padlock: "security",
	pager: "devices",
	"paint-brush": "design-tools",
	"paint-brush-2": "design-tools",
	"paint-roller": "design-tools",
	paintbucket: "design-tools",
	palto: "clothes2",
	panda: "animals",
	pant: "clothes",
	pants: "clothes2",
	pants2: "clothes2",
	"panty-vibrator": "sex",
	"panty-vibrator2": "sex",
	paper: "christmas",
	"paper-glass": "food",
	paper2: "christmas",
	paperclip: "type-paragraph-character",
	"paperclip-2": "type-paragraph-character",
	parachute: "military",
	parachute2: "military",
	paragraphspacing: "type-paragraph-character",
	parents: "baby",
	parking: "car-service",
	"parking-2": "car-service",
	"parking-sign": "travel",
	"parking-ticket": "car-service",
	parrot: "animals",
	"part-of-circle": "chart",
	partlycloudy: "nature",
	"party-hat": "christmas",
	"party-popper": "christmas",
	passport: "booking",
	"password-check": "security",
	path: "design-tools",
	"path-2": "design-tools",
	"path-square": "design-tools",
	"patient-notebook": "health",
	"patient-status": "health",
	pause: "video-audio-image",
	"pause-circle": "video-audio-image",
	paw: "pet",
	paw2: "animals",
	"pawn-chess": "casino",
	paypal: "social",
	peace: "military",
	pedal: "car-service",
	pen: "ui-design",
	"pen-2": "ui-design",
	"pen-add": "design-tools",
	"pen-brush": "ui-design",
	"pen-close": "design-tools",
	"pen-icon": "ui-design",
	"pen-meter": "ui-design",
	"pen-metter": "ui-design",
	"pen-remove": "design-tools",
	"pen-tool": "ui-design",
	"pen-tool-2": "design-tools",
	pencil: "ui-design",
	"pencil-edit": "stationery",
	pencilholder: "stationery",
	"pending-code": "programming",
	"pending-mail": "email",
	penguin: "animals",
	penguin2: "animals",
	penguin3: "animals",
	penis: "sex",
	people: "users",
	percent: "alphabet-numbers",
	"percentage-circle": "money",
	"percentage-square": "money",
	perfume: "beauty",
	"perfume-2": "beauty",
	person: "copyright",
	"person-2": "copyright",
	"person-3": "copyright",
	personal: "home",
	personalcard: "business",
	pet: "essential",
	pet10: "pet",
	pet11: "pet",
	pet12: "pet",
	pet13: "pet",
	pet14: "pet",
	pet15: "pet",
	pet16: "pet",
	pet17: "pet",
	pet18: "pet",
	pet19: "pet",
	pet2: "pet",
	pet20: "pet",
	pet3: "pet",
	pet4: "pet",
	pet5: "pet",
	pet6: "pet",
	pet7: "pet",
	pet8: "pet",
	pet9: "pet",
	pharagraphspacing: "type-paragraph-character",
	phone: "device",
	photographer: "wedding",
	photoshop: "crypto",
	"pick-axe": "tools",
	picor: "tools",
	"picture-frame": "location",
	pie: "food2",
	piercing: "clothes2",
	pig: "animals",
	pill: "essential",
	"pill-box": "health",
	"pill-tablet": "medical",
	"pillar-stats": "essential",
	pills: "medical",
	"pills-3": "medical",
	pin: "essential",
	"pin-2": "essential",
	"pin-3": "essential",
	"pine-tree": "nature",
	"pine-tree-2": "nature",
	"pine-tree-3": "nature",
	pinlocation: "essential",
	pinterest: "social",
	"pinterest-square": "social",
	pintrestpinterest: "social",
	"pipe-wrench": "tools",
	piping: "food2",
	piranha: "animals",
	pisces: "astrology2",
	pistol: "military",
	pitcher: "coffe",
	"place-mark": "essential",
	planet: "space2",
	planet2: "space2",
	planet3: "space2",
	planet4: "space2",
	plant: "coffe",
	plaster: "medical",
	"plastic-dish": "travel",
	"plastic-fork": "travel",
	play: "video-audio-image",
	"play-add": "video-audio-image",
	"play-blocks-toy": "baby",
	"play-circle": "video-audio-image",
	"play-circle-2": "video-audio-image",
	"play-remove": "video-audio-image",
	player: "device",
	playfinger: "hand",
	"playing-cards": "sports2",
	"playing-cards2": "sports2",
	"playing-cards3": "sports2",
	"playing-cards4": "sports2",
	"playing-cards42": "sports2",
	"playing-cards5": "sports2",
	playlist: "essential",
	"playstation-vr": "vr",
	"playstation-vr2": "vr",
	plesk: "blockchain",
	plug: "energy",
	plus: "alphabet-numbers",
	"plus-format": "design",
	"plus-signal": "chart",
	point: "hand",
	pointfinger: "hand",
	poker: "casino",
	"poker-chip": "casino",
	"poker-chip-2": "casino",
	"poker-chip-3": "casino",
	"poker-chips": "casino",
	"polkadot-dot": "crypto",
	"polo-shirt": "clothes2",
	"polygon-matic": "crypto",
	"polyswarm-nct": "crypto",
	pool: "travel",
	pool2: "fitness",
	poop: "pet",
	poop2: "pet",
	popsicle: "food2",
	"portable-speaker": "devices",
	"positive-home": "real-state",
	"postive-home": "real-state",
	pot: "food",
	"pound-circle": "money",
	"pound-square": "money",
	powerhouse: "energy",
	"powerhouse-ai": "ai",
	powerplug: "device",
	"presentation-chart": "business",
	pretzel: "food2",
	"preview-mail": "email",
	previous: "video-audio-image",
	"price-badge": "essential",
	"price-list-home": "real-state",
	"price-tag": "essential",
	"price-tag-2": "essential",
	"print-mail": "email",
	printer: "computers-devices-electronics",
	"printer-slash": "computers-devices-electronics",
	private: "user",
	"private-file": "files",
	"processing-data": "programming",
	processor: "blockchain",
	"proctected-home": "real-state",
	profile: "user",
	"profile-2": "user",
	"profile-2user": "users",
	"profile-add": "users",
	"profile-circle": "users",
	"profile-delete": "users",
	"profile-remove": "users",
	"profile-tick": "users",
	"programming-arrow": "programming",
	"programming-arrows": "programming",
	projector: "device",
	propose: "love",
	protect: "security",
	"protect-nature": "ecology",
	"protect-virus": "medical",
	protected: "security",
	"protected-cloud": "network",
	"protected-data": "real-state",
	"protected-drive": "network",
	"protected-file": "security",
	"protected-file-2": "security",
	"protected-home": "real-state",
	"protected-home-2": "real-state",
	"protected-information": "security",
	"protected-network": "security",
	"protected-network-2": "security",
	"protected-network-3": "security",
	"protected-tasks": "security",
	"protected-text": "security",
	"protected-user": "security",
	"protected-voice": "security",
	"protected-zone": "security",
	protectfinger: "hand",
	"protocol-change": "money",
	"protocol-change-2": "money",
	prototype: "ui-design",
	"prototype-2": "ui-design",
	"prototype-3": "ui-design",
	"prototype-design": "ui-design",
	"prototype-pick": "ui-design",
	"prototype-select": "ui-design",
	"prototype-select-2": "ui-design",
	protoype: "ui-design",
	"protoype-2": "ui-design",
	"protoype-design": "ui-design",
	"protoype-pick": "ui-design",
	"protoype-select": "ui-design",
	prueba: "ai",
	"public-domain": "copyright",
	"public-domain-2": "copyright",
	pudding: "food2",
	"puffer-jacket": "clothes2",
	pump: "sex",
	pump2: "sex",
	pump3: "sex",
	pumpkin: "halloween",
	pumpkin2: "halloween",
	pumpkin3: "halloween",
	pumpkin4: "halloween",
	pumpkin5: "halloween",
	pumpkin6: "halloween",
	"punching-bag": "fitness",
	"punching-bag2": "fitness",
	"punching-bag3": "fitness",
	"punching-bag4": "fitness",
	"punching-bag5": "fitness",
	"push-up": "fitness",
	pushbutton: "hand",
	pushfinger: "hand",
	put: "ui-design",
	"puzzle-toy": "baby",
	python: "social",
	python2: "programming2",
	q: "alphabet-numbers",
	"quant-qnt": "crypto",
	"quant-qnt-2": "crypto",
	"queen-chess": "casino",
	"quest-oculus": "devices",
	question: "alphabet-numbers",
	"question-bubble": "arrow",
	"question-circle": "arrow",
	"question-mark": "essential",
	"question-mark-2": "essential",
	"question-mark-circle": "essential",
	"question-mark-square": "essential",
	"question-mark-square-2": "essential",
	"question-square": "arrow",
	"quick-access": "essential",
	"quick-mail": "email",
	"quick-search": "search",
	"quick-sent": "email",
	"quote-circle": "essential",
	"quote-down": "type-paragraph-character",
	"quote-down-circle": "type-paragraph-character",
	"quote-down-square": "type-paragraph-character",
	"quote-up": "type-paragraph-character",
	"quote-up-circle": "type-paragraph-character",
	"quote-up-square": "type-paragraph-character",
	r: "alphabet-numbers",
	racket: "fitness",
	"racket-sports": "fitness",
	"racket-sports2": "fitness",
	racket2: "fitness",
	racket3: "fitness",
	radar: "security",
	"radar-2": "location",
	radar2: "military",
	radar3: "military",
	radio: "video-audio-image",
	"radio-active": "ecology",
	"radio-active-2": "ecology",
	"radio-button": "essential",
	radiobutton: "essential",
	"radiobutton-2": "essential",
	"radiobutton-off": "essential",
	"radiobutton-on": "essential",
	"rain-heart": "wedding",
	rainy: "nature",
	"raise-exposure": "video",
	"raise-price": "real-state",
	ram: "computers-devices-electronics",
	"ram-2": "computers-devices-electronics",
	ramen: "food",
	random: "arrow2",
	rank: "military",
	rank2: "military",
	ranking: "essential",
	"ranking-2": "support-like-question",
	"rattle-toy": "baby",
	"rattle-toy2": "baby",
	"rattle-toy22": "baby",
	razor: "beauty",
	"reality-streamline": "vr",
	"reality-vr-streamline": "vr",
	receipt: "health",
	"receipt-2": "money",
	"receipt-3": "money",
	"receipt-4": "money",
	"receipt-add": "money",
	"receipt-discount": "money",
	"receipt-discount-2": "money",
	"receipt-disscount": "money",
	"receipt-edit": "money",
	"receipt-home": "home",
	"receipt-item": "money",
	"receipt-minus": "money",
	"receipt-search": "money",
	"receipt-square": "archive",
	"receipt-text": "money",
	receive: "mobile",
	"receive-and-send-signal": "chart",
	"receive-cloud": "web",
	"receive-clubs": "casino",
	"receive-coin": "casino",
	"receive-contact": "user",
	"receive-contact-2": "user",
	"receive-diamonds": "casino",
	"receive-hearts": "casino",
	"receive-money": "casino",
	"receive-spades": "casino",
	"receive-square": "arrow",
	"receive-square2": "arrow",
	received: "arrow",
	"received-signal": "chart",
	recharge: "telephone",
	record: "video-audio-image",
	"record-circle": "video-audio-image",
	"record-music": "essential",
	"recovery-convert": "design-tools",
	recycle: "energy",
	reddit: "social",
	"redo-arrow": "arrow",
	"redo-receipt": "shop",
	refresh: "ui-design",
	"refresh-arrow": "arrow",
	"refresh-arrow2": "arrow",
	"refresh-circle": "arrow",
	"refresh-cloud": "web",
	"refresh-file": "files",
	"refresh-left": "arrow",
	"refresh-mail": "email",
	"refresh-money": "money",
	"refresh-product": "essential",
	"refresh-receipt": "shop",
	"refresh-right": "arrow",
	"refresh-shop": "shop",
	"refresh-signal": "chart",
	"refresh-square": "arrow",
	"registered-product": "copyright",
	"registered-product-2": "copyright",
	"registered-trademark": "copyright",
	"registered-trademark-2": "copyright",
	"registered-trademark-3": "copyright",
	"registered-trademark-4": "copyright",
	reindeer: "animals",
	"reindeer-antlers": "christmas",
	"reindeer-arch": "christmas",
	"reindeer-face": "christmas",
	relaxed: "emoji",
	remote: "device",
	remove: "mobile",
	"remove-basket": "shop",
	"remove-card": "money",
	"remove-contact": "user",
	"remove-date-calendar": "essential",
	"remove-effect": "video",
	"remove-receipt": "shop",
	"remove-sign": "shop",
	"remove-sticky": "essential",
	"remove-text": "essential",
	"rename-file": "files",
	repeat: "arrow",
	"repeat-arrow": "arrow",
	"repeat-arrows": "arrow",
	"repeat-circle": "arrow",
	"repeat-music": "video-audio-image",
	"repeate-music": "video-audio-image",
	"repeate-one": "video-audio-image",
	"repeated-shield": "security",
	reply: "email",
	"reply-2": "email",
	"reply-mail": "email",
	reporter: "sports",
	reserve: "essential",
	resolution: "video",
	respect: "wedding",
	"restricted-payments": "copyright",
	"reverse-down": "arrow2",
	"reverse-left": "arrow2",
	"reverse-right": "arrow2",
	"reverse-time-arrow": "arrow",
	"reverse-up": "arrow2",
	review: "travel",
	"rgb-mode": "video",
	ridingbike: "sports",
	right: "mobile",
	"right-and-left-signal": "chart",
	"right-chart": "chart",
	"right-circle-chart": "chart",
	"right-cloud": "web",
	"right-left": "mobile",
	"right-left-money": "money",
	"right-money": "money",
	"right-signal": "chart",
	ring: "love",
	"ring-box": "wedding",
	rings: "love",
	rings2: "fitness",
	rings3: "fitness",
	"rock-climber": "fitness",
	rocket: "space",
	"rocket-2": "space",
	"rocket-fire": "military",
	rocket2: "military",
	"roller-whisk": "kitchen",
	rollerskate: "sports2",
	"rolling-pin": "coffe",
	"romantic-cheers": "love",
	"rook-chess": "casino",
	rope: "sports",
	"rope-training": "fitness",
	"rope-training2": "fitness",
	"rope-training3": "fitness",
	rotate: "ui-design",
	"rotate-left": "arrow",
	"rotate-right": "arrow",
	roulette: "coffe",
	"route-square": "location",
	router: "furniture",
	routing: "location",
	"routing-2": "location",
	rover: "space2",
	"row-horizontal": "grid",
	"row-vertical": "grid",
	rpg: "weapons",
	ruble: "money",
	"ruble-square": "money",
	ruler: "ui-design",
	"ruler-pen": "design-tools",
	"ruler-protractor": "tools",
	"rulerprotractor-pencil": "tools",
	running: "sports",
	russia: "landmarks",
	s: "alphabet-numbers",
	sack: "food2",
	sad: "emoji",
	"sad-face": "emoji",
	sad3: "emoji",
	"safe-box": "money",
	"safe-card": "money",
	"safe-home": "essential",
	safebox: "furniture",
	"safebox-2": "money",
	"safebox-money": "money",
	"safebox-money-2": "money",
	sagittarius: "astrology",
	salad: "food2",
	salad2: "food2",
	"salt-sprinkler": "kitchen",
	sandwich: "coffe",
	santa: "christmas",
	"santa-face": "christmas",
	"santa-hat": "christmas",
	"santa-mouth": "christmas",
	santa2: "christmas",
	satellite: "space",
	"satellite-2": "space",
	"satellite-dish": "space2",
	"satellite-dish2": "space2",
	satellite2: "space2",
	satisfied: "emoji",
	saturn: "space",
	saturn2: "space2",
	saturn3: "space2",
	saturn32: "space2",
	saturn4: "space2",
	saturn5: "space2",
	sausage: "food",
	save: "archive",
	"save-add": "archive",
	"save-frame": "video",
	"save-minus": "archive",
	"save-remove": "archive",
	scale: "medical",
	"scale-calibration": "essential",
	scales: "coffe",
	scales2: "coffe",
	scan: "security",
	"scan-barcode": "security",
	"scan-home": "real-state",
	"scan-human": "security",
	"scan-incognito": "security",
	scanner: "security",
	scanning: "security",
	"schedule-product": "essential",
	scheduled: "web",
	"scheduled-2": "web",
	"scheduled-camera": "video",
	"scheduled-cloud": "network",
	"scheduled-file": "files",
	"scheduled-mail": "email",
	"scheduled-mail-2": "email",
	"scheduled-mail-3": "email",
	"schulded-cloud": "network",
	scientist: "space",
	scissor: "video-audio-image",
	scissors: "beauty",
	scoop: "coffe",
	scooter: "fitness",
	scootering: "fitness",
	scoreboard: "sports2",
	scorpio: "astrology2",
	scorpion: "animals",
	"screen-size-resolution": "vr",
	screenmirroring: "video-audio-image",
	screwdriver: "tools",
	"screwdriver-2": "tools",
	"screwdriver-3": "tools",
	"screwdriver-hammer": "tools",
	"screwdriver-measure": "tools",
	"screwdriver-pen": "tools",
	scroll: "arrow",
	"scroll-text": "programming",
	scroll2: "arrow",
	scrollfinger: "hand",
	"scuba-diving": "sports2",
	seal: "animals",
	search: "security",
	"search-2": "security",
	"search-ai": "ai",
	"search-basket": "shop",
	"search-cloud": "web",
	"search-code": "programming",
	"search-contact": "user",
	"search-favorite": "search",
	"search-favorite-2": "search",
	"search-file": "files",
	"search-home": "real-state",
	"search-home-2": "real-state",
	"search-home-3": "real-state",
	"search-home-4": "real-state",
	"search-mail": "email",
	"search-mail-2": "email",
	"search-money": "money",
	"search-normal": "search",
	"search-property": "real-state",
	"search-receipt": "shop",
	"search-result": "essential",
	"search-results": "essential",
	"search-status": "search",
	"search-status-2": "search",
	"search-word": "essential",
	"search-zoom-in": "search",
	"search-zoom-in-2": "search",
	"search-zoom-out": "search",
	"search-zoom-out-2": "search",
	"search-zoom-out-3": "search",
	"searching-square": "essential",
	secure: "programming2",
	security: "security",
	"security-card": "money",
	"security-safe": "security",
	"security-shield": "ai2",
	"security-time": "time",
	"security-user": "security",
	seedlings: "nature",
	"seedlings-2": "nature",
	"seedlings-3": "nature",
	"seen-file": "files",
	"selected-file": "files",
	"selected-frame": "essential",
	"selected-search": "essential",
	selection: "ai2",
	"self-playing-area": "vr",
	"self-playing-area2": "vr",
	send: "arrow",
	"send-2": "essential",
	"send-basket": "shop",
	"send-basket-2": "shop",
	"send-cloud": "web",
	"send-mail": "email",
	"send-message": "essential",
	"send-money": "money",
	"send-receive": "video",
	"send-receive-2": "video",
	"send-receive-basket": "shop",
	"send-receive-cloud": "web",
	"send-receive-contact": "user",
	"send-signal": "chart",
	"send-square": "arrow",
	"send-square2": "arrow",
	"sense-of-stability": "vr",
	"sent-mails": "email",
	separated: "business",
	serum: "health",
	server: "programming",
	"server-connected": "network",
	"server-created": "network",
	"server-error": "network",
	"server-maintenance": "network",
	"server-users": "network",
	servers: "network",
	"service-mark": "copyright",
	"service-mark-2": "copyright",
	"serving-dome": "christmas",
	setting: "settings",
	"setting-2": "settings",
	"setting-3": "settings",
	"setting-4": "settings",
	"setting-5": "settings",
	"setting-gear": "essential",
	"setting-gear-2": "essential",
	settings: "settings",
	"settings-2": "security",
	"settings-3": "security",
	"settings-circle": "essential",
	"sewing-needle": "clothes",
	sewingmachine: "clothes",
	sex: "sex",
	"sexual-store": "sex",
	shake: "mobile",
	shaker: "fitness",
	shakers: "kitchen",
	shape: "ui-design",
	"shape-2": "ui-design",
	"shape-selected": "ui-design",
	shapes: "essential",
	"shapes-2": "design-tools",
	"shapes-forms": "essential",
	share: "essential",
	"share-2": "essential",
	"share-health": "medical",
	"share-lock": "security",
	"share-protection": "security",
	"share-user": "network",
	sharefile: "device",
	shark: "animals",
	sheep: "animals",
	shield: "security",
	"shield-2": "security",
	"shield-3": "security",
	"shield-cross": "security",
	"shield-download": "security",
	"shield-envelope": "email",
	"shield-exclamation": "essential",
	"shield-search": "security",
	"shield-security": "security",
	"shield-slash": "security",
	"shield-tick": "security",
	shield2: "video-games",
	shielddone: "essential",
	shieldfail: "essential",
	shieldprotect: "essential",
	"shining-heart": "love",
	ship: "car",
	shirt: "clothes",
	"shirt-2": "clothes",
	"shirt-3": "clothes",
	"shirt-4": "clothes",
	"shirt-5": "clothes",
	shoe: "sports",
	"shoefootwear-sneaker-boot-sandal-sport-collection": "sports",
	"shoefootwear-sole-style-fashion-sneaker-boot": "clothes",
	shoes: "wedding",
	"shoes.svg": "fitness",
	"shoot-ball": "sports",
	shooting: "fitness",
	shop: "shop",
	"shop-2": "shop",
	"shop-3": "shop",
	"shop-4": "shop",
	"shop-add": "shop",
	"shop-gift": "christmas",
	"shop-remove": "shop",
	"shop-snow": "christmas",
	"shopping-bag": "shop",
	"shopping-cart": "shop",
	short: "clothes",
	shorts: "fitness",
	shorts2: "clothes2",
	shovel: "tools",
	shower: "furniture",
	"shower-2": "furniture",
	shrimp: "animals",
	"shrink-full": "arrow2",
	"shrink-full2": "arrow2",
	"shrink-to-center": "arrow2",
	shuffle: "video-audio-image",
	shuriken: "military",
	shutter: "video",
	shutterstock: "crypto",
	"siacoin-sc": "crypto",
	sickle: "military",
	"sidebar-bottom": "programming",
	"sidebar-left": "programming",
	"sidebar-right": "programming",
	"sidebar-top": "programming",
	sign: "ui-design",
	"sign-out": "arrow2",
	signal: "business",
	"signed-cloud": "web",
	signpost: "essential",
	simcard: "computers-devices-electronics",
	"simcard-2": "computers-devices-electronics",
	"simcard-3": "computers-devices-electronics",
	"simcard-slot": "telephone",
	"simcard-switch": "telephone",
	"simcard-switch2": "telephone",
	"simcard-switch3": "telephone",
	simcard2: "telephone",
	simcard3: "telephone",
	"single-bed": "furniture",
	"sit-ups": "fitness",
	size: "design-tools",
	skate: "sports",
	skateboard: "sports2",
	skateboarding: "fitness",
	skates: "fitness",
	skating: "sports",
	sketch: "social",
	"sketch-square": "social",
	"skew-frame": "ui-design",
	ski: "christmas",
	"ski-boots": "fitness",
	skiing: "fitness",
	skiing2: "fitness",
	skiing3: "fitness",
	skiing4: "fitness",
	skiing5: "fitness",
	skimmer: "food",
	"skimmer-2": "food",
	skirt: "clothes",
	skull: "halloween",
	skull2: "halloween",
	skull3: "halloween",
	skull4: "halloween",
	skull5: "halloween",
	skull6: "halloween",
	skype: "social",
	slack: "social",
	"slack-2": "social",
	slash: "essential",
	"sleep-zzz": "essential",
	sleigh: "christmas",
	sleigh2: "christmas",
	slider: "essential",
	"slider-horizontal": "grid",
	"slider-horizontal-2": "grid",
	"slider-vertical": "grid",
	"slider-vertical-2": "grid",
	slippers: "travel",
	"slot-machine": "sports2",
	"small-panda": "animals",
	smallcaps: "type-paragraph-character",
	"smart-bag": "ai",
	"smart-car": "car",
	"smart-cursor": "ai",
	"smart-glasses": "ai",
	"smart-home": "essential",
	"smart-home-ai": "ai",
	"smart-lock-ai": "ai",
	"smart-paint": "ai",
	"smart-prices": "ai",
	"smart-thinking": "ai",
	"smart-vacuum": "devices",
	smile: "emoji",
	"smile-heart": "wedding",
	smileys: "support-like-question",
	"smiling-with-heart": "emoji",
	sms: "emails-messages",
	"sms-edit": "emails-messages",
	"sms-notification": "emails-messages",
	"sms-search": "emails-messages",
	"sms-star": "emails-messages",
	"sms-tracking": "emails-messages",
	snake: "animals",
	snapchat: "social",
	sneakers: "clothes",
	snooze: "essential",
	snow: "car-service",
	snow10: "christmas",
	snow102: "christmas",
	snow11: "christmas",
	snow112: "christmas",
	snow12: "christmas",
	snow13: "christmas",
	snow132: "christmas",
	snow14: "christmas",
	snow2: "christmas",
	snow22: "christmas",
	snow3: "christmas",
	snow4: "christmas",
	snow42: "christmas",
	snow5: "christmas",
	snow6: "christmas",
	snow7: "christmas",
	snow8: "christmas",
	snow9: "christmas",
	snowflake: "weather",
	snowman: "christmas",
	snowman2: "christmas",
	snowman3: "christmas",
	snowman4: "christmas",
	snowman5: "christmas",
	snowman6: "christmas",
	snowman7: "christmas",
	soccer: "sports2",
	sock: "clothes",
	socks: "clothes",
	"socks-2": "clothes",
	socks2: "christmas",
	socksshorts: "clothes",
	sofa: "furniture",
	"sofa-2": "furniture",
	software: "programming2",
	"solana-scaling-blockchain-crypto-network-token": "crypto",
	"solana-sol": "crypto",
	"solar-energy": "ecology",
	"solar-energy-house": "ecology",
	"sold-home": "real-state",
	"song-file": "files",
	"song-file-2": "files",
	sort: "essential",
	"sort-add": "arrow",
	"sort-add2": "arrow",
	"sort-ascending": "arrow",
	"sort-ascending2": "arrow",
	"sort-check": "arrow",
	"sort-descending": "arrow",
	"sort-descending2": "arrow",
	sound: "video",
	"sound-file": "files",
	"sound-recording-copyright": "copyright",
	"sound-recording-copyright-2": "copyright",
	soundcloud: "social",
	"source-folder": "programming2",
	spade: "casino",
	spades: "casino",
	"spades-coin": "casino",
	"spam-mail": "email",
	"spam-mail-2": "email",
	"spam-mail-3": "email",
	sparkler: "christmas",
	"spatial-audio": "vr",
	"spatial-audio-device": "vr",
	"spatial-audio-headphone": "vr",
	"spatial-audio-headphone2": "vr",
	"spatial-audio-user-surround": "vr",
	"spatial-audio2": "vr",
	speaker: "game",
	"speaker-2": "devices",
	"speaker-3": "devices",
	"speaker-off": "essential",
	"speaker-on": "essential",
	speakers: "devices",
	"special-money": "money",
	speed: "essential",
	"speed-2": "essential",
	"speed-meter": "car-service",
	speedmeter: "essential",
	"speedmeter-2": "essential",
	speedometer: "essential",
	"speedometer-2": "essential",
	spell: "halloween",
	spell2: "halloween",
	spell3: "halloween",
	sperm: "sex",
	spicy: "food2",
	spider: "halloween",
	"spider-web": "halloween",
	"spiritual-father": "wedding",
	spoon: "food",
	"spoon-and-fork": "food",
	"spoon-fork": "kitchen",
	sporttshirt: "sports",
	spotify: "social",
	"spotify-square": "social",
	spray: "ui-design",
	square: "arrow2",
	"square-add-search": "essential",
	"square-arrow": "arrow2",
	"square-arrow2": "arrow2",
	"square-backward": "essential",
	"square-backward-search": "essential",
	"square-basket": "shop",
	"square-booked-search": "essential",
	"square-brush": "design",
	"square-cancel-search": "essential",
	"square-capital-words": "essential",
	"square-chart": "chart",
	"square-chart-2": "chart",
	"square-chart-3": "chart",
	"square-chart0": "chart",
	"square-code": "essential",
	"square-coin": "business",
	"square-command": "essential",
	"square-completed-search": "essential",
	"square-copyright": "copyright",
	"square-creative-commons": "copyright",
	"square-crop": "design",
	"square-cursor": "essential",
	"square-decrease-volume": "video",
	"square-diamond": "essential",
	"square-downloads": "essential",
	"square-edit-search": "essential",
	"square-element": "design",
	"square-flag": "essential",
	"square-flash": "essential",
	"square-flash-off": "essential",
	"square-forbidden-money": "copyright",
	"square-forbidden-product": "copyright",
	"square-forbidden-product-2": "copyright",
	"square-forbidden-product-3": "copyright",
	"square-forbidden-search": "essential",
	"square-forward": "essential",
	"square-forward-backward-search": "essential",
	"square-forward-search": "essential",
	"square-fountain-pen": "design",
	"square-headset": "video",
	"square-home": "home",
	"square-home-2": "home",
	"square-home-3": "home",
	"square-home-4": "home",
	"square-hot": "essential",
	"square-hotspot": "essential",
	"square-language": "essential",
	"square-left-chart": "chart",
	"square-lens": "video",
	"square-lens-2": "video",
	"square-liquid": "essential",
	"square-location": "essential",
	"square-lowercase-words": "essential",
	"square-mainimize": "essential",
	"square-marker": "design",
	"square-maximize": "video",
	"square-medal": "essential",
	"square-minimize": "video",
	"square-mute-volume": "video",
	"square-mute-volume-2": "video",
	"square-navigation": "essential",
	"square-notification": "video",
	"square-pen": "design",
	"square-pin": "essential",
	"square-receive-search": "essential",
	"square-refresh-search": "essential",
	"square-registered-product": "copyright",
	"square-registered-product-2": "copyright",
	"square-right-chart": "chart",
	"square-search": "essential",
	"square-seen": "essential",
	"square-send-receive-search": "essential",
	"square-send-search": "essential",
	"square-share": "essential",
	"square-sleep": "essential",
	"square-sound": "video",
	"square-speaker": "video",
	"square-speaker-2": "video",
	"square-speaker-3": "video",
	"square-star": "essential",
	"square-thermometer": "energy",
	"square-thermometer-2": "energy",
	"square-ui": "essential",
	"square-unregistered-product": "copyright",
	"square-unregistred-product": "copyright",
	"square-unseen": "essential",
	"square-uploads": "essential",
	"square-ux": "essential",
	"square-vip-search": "essential",
	"square-voice-record": "essential",
	"square-volume-equalizer": "video",
	"square-wifi": "essential",
	"square-wireless": "essential",
	"square-word": "essential",
	square2: "arrow2",
	squarefinger: "hand",
	ssh: "programming",
	ssl: "security",
	"stacking-toy": "baby",
	"stacks-stx": "crypto",
	stage: "sports2",
	stairs: "real-state",
	"stairs-up": "real-state",
	stand: "wedding",
	star: "support-like-question",
	"star-circle": "essential",
	"star-garland": "christmas",
	"star-review": "travel",
	"star-slash": "support-like-question",
	"star-square": "essential",
	"star-topology": "blockchain",
	star2: "christmas",
	star3: "christmas",
	star4: "christmas",
	star5: "christmas",
	stars: "nature",
	starship: "space2",
	starship2: "space2",
	starship3: "space2",
	stats: "medical",
	"stats-ios": "medical",
	"stats-ios-2": "medical",
	"stats-square": "essential",
	status: "health",
	"status-file": "health",
	"status-notif": "health",
	"status-up": "business",
	steering: "video-games",
	"stellar-xlm": "crypto",
	"step-ups": "fitness",
	"step-ups2": "fitness",
	stethoscope: "health",
	"stethoscope-program": "health",
	stick: "christmas",
	"stick-shift": "car-service",
	"stick-shift-circle": "car-service",
	stick2: "christmas",
	stick3: "christmas",
	sticker: "essential",
	"sticky-note": "essential",
	stickynote: "content-edit",
	stingray: "animals",
	"stomach-care": "medical",
	stop: "video-audio-image",
	"stop-circle": "video-audio-image",
	"storage-refresh": "network",
	store: "building",
	storexfbold: "essential",
	story: "essential",
	"story-circle": "essential",
	"story-download": "essential",
	stove: "furniture",
	"stove-2": "furniture",
	strawberry: "food2",
	stroller: "baby",
	strongbox: "money",
	"strongbox-2": "money",
	"strongbox-3": "money",
	structure: "essential",
	"stylus-pen": "stationery",
	"stylus-pen-edit": "stationery",
	subject: "video",
	submarine: "travel",
	"submarine-2": "travel",
	submarine2: "military",
	submarine3: "military",
	subtitle: "video-audio-image",
	suit: "wedding",
	suitcase: "travel",
	"suitcase-heart": "love",
	sun: "video",
	"sun-cycle": "energy",
	"sun-fog": "weather",
	sunrise: "nature",
	sunset: "booking",
	"sunset-2": "booking",
	supplements: "fitness",
	supplements2: "fitness",
	supplements3: "fitness",
	supply: "military",
	support: "essential",
	surfing: "fitness",
	surfing2: "fitness",
	surfing3: "fitness",
	"surgical-scissors-02": "medical",
	sushi: "food2",
	suv: "travel",
	"swap-horizontal": "arrow",
	"swap-horizontal2": "arrow",
	"swap-horizontal3": "arrow",
	"sweat-smile": "emoji",
	swim: "sports",
	"swim-cap": "fitness",
	swimming: "fitness",
	"swimming-pool": "fitness",
	"swimming-pool2": "fitness",
	swimming2: "fitness",
	swimming21: "fitness",
	swimming3: "fitness",
	swimmingglasses: "sports",
	swimsuit: "clothes2",
	sword: "sports2",
	sword2: "weapons",
	symmetry: "ui-design",
	"sync-modules": "programming2",
	syphon: "coffe",
	syringe: "medical",
	syrup: "coffe",
	t: "essential",
	"t-arrow": "arrow2",
	"t-shirt": "clothes",
	"t-shirt-2": "clothes",
	"t-shirt-3": "clothes",
	"t-shirt2": "clothes2",
	table: "stationery",
	"table-2": "furniture",
	tablets: "medical",
	tactic: "sports",
	tag: "shop",
	"tag-2": "shop",
	"tag-3": "shop",
	"tag-4": "shop",
	"tag-add": "essential",
	"tag-check": "essential",
	"tag-circle": "money",
	"tag-cross": "essential",
	"tag-right": "essential",
	"tag-square": "money",
	"tag-user": "users",
	takeoff: "travel",
	tamper: "coffe",
	tank: "travel",
	"tank-top": "clothes2",
	tape: "device",
	"tape-2": "device",
	"tape-measure": "fitness",
	"tape-measure2": "fitness",
	tape1: "device",
	target: "security",
	"target-mail": "email",
	taser: "weapons",
	task: "content-edit",
	"task-square": "content-edit",
	taurus: "astrology2",
	teacher: "school-learning",
	teapot: "coffe",
	"teapot-and-cup": "coffe",
	"teddy-bear": "baby",
	teeth: "medical",
	telecabin: "travel",
	telescope: "space",
	"temp-lock": "security",
	"temp-shield": "security",
	tennis: "sports2",
	tennisrocket: "sports",
	"tenx-pay": "crypto",
	terminal: "programming",
	"terminal-2": "programming",
	"terminal-3": "programming",
	"terminal-4": "programming",
	"terminal-connect": "programming",
	"terminal-connect-2": "programming",
	"terminal-error": "programming2",
	"terminal-folder": "programming2",
	"terminal-result": "programming",
	"terminal-route": "network",
	tesla: "ecology",
	"test-tube": "medical",
	"test-tube-02": "medical",
	"tether-usdt": "crypto",
	text: "type-paragraph-character",
	"text-align-right": "essential",
	"text-block": "type-paragraph-character",
	"text-bold": "type-paragraph-character",
	"text-encrypt": "blockchain",
	"text-file": "programming",
	"text-file2": "ai2",
	"text-formating": "ai2",
	"text-generate": "ai2",
	"text-italic": "type-paragraph-character",
	"text-organize": "essential",
	"text-organize-heart": "essential",
	"text-underline": "type-paragraph-character",
	"textalign-center": "type-paragraph-character",
	"textalign-justifycenter": "type-paragraph-character",
	"textalign-justifyleft": "type-paragraph-character",
	"textalign-justifyright": "type-paragraph-character",
	"textalign-left": "type-paragraph-character",
	"textalign-right": "type-paragraph-character",
	thailand: "landmarks",
	"the-bag": "shop",
	"the-graph-grt": "crypto",
	"the-pawn-coin": "casino",
	"the-pole": "ecology",
	theater: "sports2",
	thermometer: "energy",
	"thermometer-2": "energy",
	"thermometer-file": "files",
	theta: "crypto",
	"theta-theta": "crypto",
	thombstone: "halloween",
	thombstone2: "halloween",
	"thorchain-rune": "crypto",
	throwing: "weapons",
	"throwing-knife": "weapons",
	"throwing-knife2": "weapons",
	"throwing-knife3": "weapons",
	"throwing-knife4": "weapons",
	"throwing-knife5": "weapons",
	"throwing-knife6": "weapons",
	thumbsdown: "business",
	"thumbsdown-arrowup": "business",
	thumbsup: "business",
	"thumbsup-arrowdown": "business",
	"tick-circle": "essential",
	"tick-square": "essential",
	ticket: "money",
	"ticket-2": "money",
	"ticket-discount": "money",
	"ticket-expired": "money",
	"ticket-star": "money",
	tickets: "travel",
	tie: "clothes",
	"tie-2": "clothes",
	"tiktok-square": "social",
	"tilde-symbol": "essential",
	time: "sex",
	"time-bomb": "military",
	"time-tracking": "essential",
	timer: "time",
	"timer-pause": "time",
	"timer-start": "time",
	tips: "essential",
	tissue: "beauty",
	"to-down-envelope": "email",
	"to-home": "real-state",
	"to-left": "essential",
	"to-left-arrow": "arrow",
	"to-left-envelope": "email",
	"to-right": "essential",
	"to-right-arrow": "arrow",
	"to-right-envelope": "email",
	"to-up-envelope": "email",
	toast: "food2",
	toaster: "coffe",
	"toggle-off": "settings",
	"toggle-off-circle": "settings",
	"toggle-on": "settings",
	"toggle-on-circle": "settings",
	toilet: "furniture",
	"toilet-sink": "furniture",
	"toilet-sink-2": "furniture",
	token: "sports2",
	toleft: "hand",
	toll: "car-service",
	tone: "video",
	"tongue-closed-eyes": "emoji",
	"tools-ar-kit": "vr",
	"tools-reality-accessibility": "vr",
	"tools-unity": "vr",
	tooth: "medical",
	"top-bottom-grid": "grid",
	torch: "video-games",
	"torch-bearer": "sports2",
	toright: "hand",
	torpedo: "military",
	"touch-finger": "hand",
	"touch-id-finger": "hand",
	towel: "travel",
	tower: "building",
	"tower-2": "building",
	town: "building",
	"town-hall": "building",
	toy: "christmas",
	"toy-cart": "baby",
	toy2: "christmas",
	toy3: "christmas",
	toy4: "christmas",
	toy5: "christmas",
	toy6: "christmas",
	trade: "cryptocurrency",
	trademark: "copyright",
	train: "travel",
	"train-2": "travel",
	"train-3": "travel",
	training: "fitness",
	"transaction-arrows": "arrow",
	"transaction-minus": "money",
	transfer: "essential",
	"transfer-card": "money",
	"transfer-money": "money",
	transfusion: "medical",
	translate: "booking",
	trash: "essential",
	"trash-bin": "essential",
	"trash-square": "essential",
	travel: "booking",
	"travel-2": "booking",
	"travel-guide": "travel",
	"travel-ticket": "travel",
	"travel-tickets": "travel",
	tree: "nature",
	"tree-2": "nature",
	"tree-3": "nature",
	"tree-4": "nature",
	tree2: "christmas",
	tree3: "christmas",
	trees: "nature",
	trello: "crypto",
	"trend-down": "business",
	"trend-up": "business",
	triangle: "ui-design",
	"triangle-2": "essential",
	"triangle-in-circle": "essential",
	"triangle-in-square": "essential",
	"triangle-ruler": "ui-design",
	"trontron-trx": "crypto",
	trophy: "video-games",
	trophy2: "video-games",
	trophy3: "video-games",
	trophy4: "video-games",
	trophy5: "video-games",
	trophy6: "video-games",
	trophy7: "video-games",
	trophy8: "video-games",
	trowel: "tools",
	"trowel-2": "tools",
	truck: "delivery",
	"truck-fast": "delivery",
	"truck-remove": "delivery",
	"truck-tick": "delivery",
	"truck-time": "delivery",
	trunode: "astrology2",
	tshirt: "clothes",
	tub: "furniture",
	tulip: "nature",
	turbine: "ecology",
	"turbine-2": "ecology",
	"turn-to-left": "mobile",
	"turn-to-right": "mobile",
	turtle: "animals",
	tv: "furniture",
	"tv-table": "furniture",
	twitch: "social",
	"two-bed": "furniture",
	"two-hearts": "love",
	"two-sofa": "furniture",
	"type-square": "money",
	"type-text": "essential",
	"type-text-square": "essential",
	typing: "essential",
	u: "alphabet-numbers",
	uae: "landmarks",
	uav: "device",
	ufo: "space",
	ufo2: "space2",
	ufo3: "space2",
	ui8: "crypto",
	uk: "landmarks",
	uk2: "landmarks",
	uk3: "landmarks",
	"ultrasound-monitor-01": "medical",
	"ultrasound-monitor-02": "medical",
	"un-shield": "programming",
	"under-shirt": "clothes",
	underwear: "clothes",
	"underwear-2": "clothes",
	underwear2: "sex",
	undo: "essential",
	"undo-arrow": "arrow",
	"undo-receipt": "shop",
	unfit: "design",
	unlimited: "support-like-question",
	"unlimited-file": "files",
	unlock: "security",
	"unread-mail": "email",
	"unregistered-trademark": "copyright",
	"unregistered-trademark-2": "copyright",
	"unregistred-product": "copyright",
	up: "chart",
	"up-and-down-control": "arrow2",
	"upgrade-file": "files",
	upload: "essential",
	"upload-2": "essential",
	"upload-arrow": "arrow",
	"upload-horizontal-arrow": "arrow",
	uploadtocloud: "nature",
	"upside-down-face": "emoji",
	uranus: "astrology2",
	"us-coin": "casino",
	usa: "landmarks",
	"usb-flash": "device",
	usbflash: "device",
	"usd-coin-usdc": "crypto",
	user: "network",
	"user-add": "users",
	"user-circle-add": "users",
	"user-connected": "network",
	"user-connected-2": "network",
	"user-connections": "network",
	"user-cycle": "programming2",
	"user-demo": "programming2",
	"user-denied": "programming2",
	"user-disconnected": "network",
	"user-edit": "users",
	"user-hexagon": "users",
	"user-log": "network",
	"user-minus": "users",
	"user-profile": "ai2",
	"user-profile2": "ai2",
	"user-remove": "users",
	"user-search": "users",
	"user-square": "users",
	"user-tag": "users",
	"user-terminal": "programming",
	"user-tick": "users",
	users: "user",
	v: "alphabet-numbers",
	"v.i.p": "mobile",
	"v.i.p-cloud": "web",
	"v.i.p-file": "files",
	"valentine-day": "love",
	"valentine-shop": "love",
	"variance-icon": "blockchain",
	variant: "ui-design",
	vase: "nature",
	vatican: "landmarks",
	vector: "ui-design",
	"vector-2": "ui-design",
	"vector-3": "ui-design",
	"vector-4": "ui-design",
	"vector-5": "ui-design",
	"vector-6": "ui-design",
	"velas-vlx": "crypto",
	venus: "astrology2",
	venus2: "astrology2",
	"verified-home": "real-state",
	"verified-home-2": "real-state",
	"verified-home-3": "real-state",
	"verified-home-4": "real-state",
	"verified-home-5": "real-state",
	"verified-money": "money",
	"verified-shop": "shop",
	verify: "essential",
	"vertical-box": "design",
	"vertical-move": "design",
	"vertical-resize": "arrow2",
	vest: "tools",
	"vest-puffer": "clothes2",
	"vibe-vibe": "crypto",
	vibrate: "mobile",
	vibrator: "sex",
	vibrator2: "sex",
	vibrator3: "sex",
	video: "real-state",
	"video-add": "video-audio-image",
	"video-audience": "sports2",
	"video-camera": "devices",
	"video-camera-2": "devices",
	"video-chat": "video",
	"video-circle": "video-audio-image",
	"video-file": "video",
	"video-folder": "video",
	"video-generate": "ai2",
	"video-generate2": "ai2",
	"video-generate3": "ai2",
	"video-generate4": "ai2",
	"video-horizontal": "video-audio-image",
	"video-octagon": "video-audio-image",
	"video-play": "essential",
	"video-remove": "video-audio-image",
	"video-slash": "video-audio-image",
	"video-square": "video",
	"video-tick": "video-audio-image",
	"video-time": "video-audio-image",
	"video-vertical": "video-audio-image",
	videocamera: "game",
	videotape: "device",
	vietnam: "landmarks",
	vietnam2: "landmarks",
	viking: "weapons",
	villa: "building",
	"vip-basket": "shop",
	"vip-card": "money",
	"vip-contact": "user",
	"vip-shop": "shop",
	"vip-signal": "chart",
	virgo: "astrology2",
	virgo2: "astrology2",
	"virtual-display-desktop": "vr",
	"virtual-display-laptop": "vr",
	"virtual-display-tablet": "vr",
	"virtual-environment": "vr",
	"virtual-environment2": "vr",
	"virtual-environment3": "vr",
	"virtual-event": "vr",
	virus: "health",
	"virus-lab-research": "medical",
	"vision-comfort-eye-strain": "vr",
	"vision-comfort-focus": "vr",
	"vision-comfort-focus2": "vr",
	"visual-resting-point": "vr",
	voice: "essential",
	"voice-circle": "video-audio-image",
	"voice-control": "vr",
	"voice-control2": "vr",
	"voice-home": "real-state",
	"voice-memo": "essential",
	"voice-protected": "security",
	"voice-square": "video-audio-image",
	voice2: "ai2",
	volleyball: "sports2",
	vollyball: "fitness",
	volume: "video-audio-image",
	"volume-cross": "video-audio-image",
	"volume-high": "video-audio-image",
	"volume-low": "video-audio-image",
	"volume-low-2": "video-audio-image",
	"volume-mute": "video-audio-image",
	"volume-slash": "video-audio-image",
	"volume-up": "video-audio-image",
	vpn: "telephone",
	vr: "sports",
	"vr-chat": "vr",
	"vr-controller": "vr",
	"vr-controller-area": "vr",
	"vr-controller2": "vr",
	"vr-headset": "game",
	vuesax: "crypto",
	w: "alphabet-numbers",
	waffle: "food2",
	wagon: "travel",
	walkie: "military",
	walkie2: "military",
	walking: "sports",
	wall: "tools",
	"wall-roller": "beauty",
	wallet: "money",
	"wallet-2": "money",
	"wallet-3": "money",
	"wallet-4": "money",
	"wallet-5": "money",
	"wallet-6": "money",
	"wallet-7": "money",
	"wallet-add": "money",
	"wallet-add-2": "money",
	"wallet-add-3": "money",
	"wallet-change": "money",
	"wallet-check": "money",
	"wallet-diamond": "money",
	"wallet-down": "money",
	"wallet-favorite": "money",
	"wallet-left": "money",
	"wallet-minus": "money",
	"wallet-money": "money",
	"wallet-redius": "money",
	"wallet-remove": "money",
	"wallet-right": "money",
	"wallet-search": "money",
	"wallet-search-2": "money",
	"wallet-up": "money",
	"wallet-verify": "money",
	walrus: "animals",
	"wanchain-wan": "crypto",
	"wanchain-wan-2": "crypto",
	"warm-up": "fitness",
	"warm-up10": "fitness",
	"warm-up11": "fitness",
	"warm-up12": "fitness",
	"warm-up13": "fitness",
	"warm-up14": "fitness",
	"warm-up15": "fitness",
	"warm-up16": "fitness",
	"warm-up17": "fitness",
	"warm-up18": "fitness",
	"warm-up19": "fitness",
	"warm-up2": "fitness",
	"warm-up20": "fitness",
	"warm-up21": "fitness",
	"warm-up22": "fitness",
	"warm-up23": "fitness",
	"warm-up24": "fitness",
	"warm-up25": "fitness",
	"warm-up26": "fitness",
	"warm-up27": "fitness",
	"warm-up28": "fitness",
	"warm-up29": "fitness",
	"warm-up3": "fitness",
	"warm-up30": "fitness",
	"warm-up31": "fitness",
	"warm-up32": "fitness",
	"warm-up4": "fitness",
	"warm-up5": "fitness",
	"warm-up6": "fitness",
	"warm-up7": "fitness",
	"warm-up8": "fitness",
	"warm-up9": "fitness",
	warning: "web",
	"washing-machine": "furniture",
	watch: "clothes",
	"watch-status": "computers-devices-electronics",
	watchcircle: "device",
	watchsquare: "device",
	water: "ecology",
	"water-cycle": "ecology",
	"water-house": "ecology",
	"water-liquid": "food",
	"water-polo": "fitness",
	"water-power-generator": "ecology",
	"wave-chart": "chart",
	weary: "emoji",
	"web-cam": "devices",
	"web-development": "programming2",
	"web-page": "web",
	"web-page-2": "web",
	"web-page-3": "web",
	"web-page-4": "web",
	"web-page-5": "web",
	webcam: "game",
	"webcam-2": "device",
	"webcam-3": "device",
	wedding: "wedding",
	"wedding-altar": "wedding",
	"wedding-cake": "wedding",
	wedding2: "wedding",
	wedding3: "wedding",
	wedding4: "wedding",
	"weighing-scale": "fitness",
	"weighing-scale2": "fitness",
	"weighing-scale3": "fitness",
	weight: "essential",
	"welding-mask": "tools",
	whale: "animals",
	whale2: "animals",
	whale3: "animals",
	whatsapp: "crypto",
	wheat: "food2",
	wheel: "car-service",
	"wheel-chair": "medical",
	"wheel-chair-3": "medical",
	wheelbarrow: "tools",
	wheelchair: "medical",
	whisk: "food",
	whistle: "sports2",
	"whistle-rocket": "sports2",
	"whistle-rocket2": "sports2",
	"whistle-rocket3": "sports2",
	"whistle-rocket4": "sports2",
	wifi: "security",
	"wifi-home": "home",
	"wifi-page": "web",
	"wifi-square": "essential",
	wig: "sex",
	wind: "weather",
	"wind-2": "weather",
	window: "furniture",
	"window-2": "furniture",
	"window-3": "furniture",
	"window-4": "furniture",
	"window-workspace": "vr",
	"window-workspace2": "vr",
	windows: "ui-design",
	"windows-square": "social",
	wine: "love",
	wing: "video-games",
	"wing-wing": "crypto",
	"wing-wing-flight-aerodynamic-airplane-freedom-speed": "crypto",
	"wing-wing-flight-aerodynamic-freedom-soar-speed": "crypto",
	"wing-wing-flight-aerodynamics-transportation-freedom-aviation": "crypto",
	"wing-wing-flight-aviation-aircraft-freedom-soar": "crypto",
	"wing-wing-fly-flight-aerodynamics-aircraft-aviation": "crypto",
	"wing-wing-fly-flight-aircraft-aerodynamics-wingspan": "crypto",
	"winter-boots": "christmas",
	"winter-mitten": "christmas",
	"winter-pattern": "christmas",
	"wire-frame": "ui-design",
	"wire-frame-2": "ui-design",
	"wireless-charge": "game",
	"witch-hat": "halloween",
	"withdraw-card": "money",
	"withdraw-dollar": "money",
	wizard: "video-games",
	wolf: "animals",
	woman: "astrology",
	womb: "sex",
	"word-file": "files",
	"work-flow": "blockchain",
	"workflow-shapes": "essential",
	"workout-plan": "fitness",
	"workout-plan2": "fitness",
	wrench: "tools",
	"wrench-2": "tools",
	"wrench-measure": "tools",
	"write-receipt": "business",
	"write-text": "essential",
	"write-text-2": "essential",
	"write-text-ai": "essential",
	writing: "stationery",
	"wrong-file": "files",
	"wrong-file-2": "files",
	x: "essential",
	"x-connected": "design",
	"x-mark-down": "arrow2",
	"x-mark-left": "arrow2",
	"x-mark-right": "arrow2",
	"x-mark-up": "arrow2",
	"x-users": "essential",
	xconnected: "business",
	"xconnected-circle": "business",
	xd: "crypto",
	xiaomi: "social",
	"xrp-xrp": "crypto",
	"xrp-xrp-cryptocurrency-digital-asset-blockchain-payment-transactions": "crypto",
	"xyz-movement": "ui-design",
	y: "alphabet-numbers",
	yacht: "travel",
	yahoo: "social",
	yen: "alphabet-numbers",
	yen2: "alphabet-numbers",
	youtube: "social",
	z: "alphabet-numbers",
	"zel-zel": "crypto",
	zeppelin: "travel",
	zip: "essential",
	zipline: "christmas",
	zipped: "essential",
	zombie: "halloween",
	zombie2: "halloween",
	zombie3: "halloween",
	zombie4: "halloween",
	zombie42: "halloween",
	zombie5: "halloween",
	zoom: "crypto",
	"zoom-in": "arrow",
	"zoom-out": "arrow"
}, N = [
	"linear",
	"bold",
	"bulk",
	"broken",
	"twotone",
	"outline"
], P = ["rounded", "straight"], F = {
	line: "linear",
	solid: "bold",
	"dual-tone": "bulk",
	dualtone: "bulk",
	"two-tone": "twotone",
	default: "linear"
}, I = {
	"arrow-down-02": "arrow-down",
	"arrow-right-02": "arrow-right",
	"calendar-1": "calendar",
	"chevron-down": "arrow-down4",
	"chevron-up": "arrow-up4",
	"chevron-left": "arrow-left3",
	"chevron-right": "arrow-right4",
	"more-horizontal": "more",
	message: "messages",
	success: "tick-circle"
}, L = (e) => I[e] || e, ee = (e) => {
	let t = F[e] || e;
	return N.includes(t) ? t : "linear";
}, te = (e) => P.includes(e) ? e : "rounded";
function ne(e) {
	if (!e) return {
		name: e,
		family: null
	};
	let t = e.indexOf(":");
	return t > 0 ? {
		name: e.slice(t + 1),
		family: e.slice(0, t)
	} : {
		name: e,
		family: null
	};
}
function R({ name: e, style: t = "linear", corner: n = "rounded", family: r } = {}) {
	if (!e) return null;
	let { name: i, family: a } = ne(e), o = L(i), s = r || a || M[o];
	return s ? `${te(n)}/${ee(t)}/${s}/${encodeURIComponent(o)}.svg` : null;
}
//#endregion
//#region src/components/atoms/icons/tp/TPLibraryIcon.jsx
function z({ name: e, variant: t = "linear", corner: n = "rounded", family: r, size: i = 20, color: a, title: o, className: s, style: c, ...l }) {
	if (!e) return null;
	let u = t, d = e, f = e.indexOf("/");
	f > 0 && (u = e.slice(0, f), d = e.slice(f + 1));
	let p = R({
		name: d,
		style: u,
		corner: n,
		family: r
	});
	if (!p) return null;
	let m = `url("${`${A()}/${p}`}") no-repeat center / contain`;
	return /* @__PURE__ */ h("span", {
		role: o ? "img" : void 0,
		"aria-label": o || void 0,
		"aria-hidden": o ? void 0 : !0,
		"data-tp-icon": `${d}/${ee(u)}`,
		className: s,
		style: {
			display: "inline-block",
			width: i,
			height: i,
			flexShrink: 0,
			backgroundColor: a || "currentColor",
			WebkitMask: m,
			mask: m,
			...c
		},
		...l
	});
}
z.displayName = "TPLibraryIcon";
//#endregion
//#region src/hooks/ui/Slot.jsx
function B(...e) {
	return (t) => {
		e.forEach((e) => {
			e && (typeof e == "function" ? e(t) : e.current = t);
		});
	};
}
function re(e, t) {
	return e ? t ? (n) => {
		t(n), n?.defaultPrevented || e(n);
	} : e : t;
}
var V = e.forwardRef(function({ children: t, ...n }, r) {
	if (!e.isValidElement(t)) return process.env.NODE_ENV !== "production" && console.warn("Slot expects a single React element child."), null;
	let i = t.props || {}, a = { ...i }, o = n.ref;
	for (let e of Object.keys(n)) {
		if (e === "ref") continue;
		let t = n[e], r = i[e];
		e === "style" ? a.style = {
			...t,
			...r
		} : e === "className" ? a.className = [t, r].filter(Boolean).join(" ") : /^on[A-Z]/.test(e) ? a[e] = re(t, r) : t !== void 0 && (a[e] = t);
	}
	return (r || o || t.ref) && (a.ref = B(r, o, t.ref)), e.cloneElement(t, a);
});
V.displayName = "Slot";
//#endregion
//#region src/hooks/use-is-client.js
var ie = () => () => {};
function ae() {
	return f(ie, () => !0, () => !1);
}
//#endregion
//#region src/analytics/context.js
var oe = t({
	track: () => {},
	enabled: !1
});
function H() {
	return i(oe);
}
function se(e) {
	return e ? typeof e == "string" ? { id: e } : typeof e == "object" ? e : null : null;
}
//#endregion
//#region src/hooks/utils.js
var ce = [
	/^p-/,
	/^px-/,
	/^py-/,
	/^pt-/,
	/^pr-/,
	/^pb-/,
	/^pl-/,
	/^ps-/,
	/^pe-/,
	/^m-/,
	/^mx-/,
	/^my-/,
	/^mt-/,
	/^mr-/,
	/^mb-/,
	/^ml-/,
	/^ms-/,
	/^me-/,
	/^w-/,
	/^min-w-/,
	/^max-w-/,
	/^h-/,
	/^min-h-/,
	/^max-h-/,
	/^gap-/,
	/^gap-x-/,
	/^gap-y-/,
	/^space-x-/,
	/^space-y-/,
	/^top-/,
	/^right-/,
	/^bottom-/,
	/^left-/,
	/^inset-/,
	/^inset-x-/,
	/^inset-y-/,
	/^z-/,
	/^opacity-/,
	/^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden|contents)$/,
	/^(static|fixed|absolute|relative|sticky)$/
];
function le(e) {
	for (let t of ce) if (t.test(e)) return t.source;
	return null;
}
function ue(e, t) {
	if (!(e == null || e === !1 || e === !0)) {
		if (typeof e == "string" || typeof e == "number") {
			t.push(String(e));
			return;
		}
		if (Array.isArray(e)) {
			for (let n of e) ue(n, t);
			return;
		}
		if (typeof e == "object") for (let n in e) e[n] && t.push(n);
	}
}
function U(...e) {
	let t = [];
	ue(e, t);
	let n = t.flatMap((e) => e.split(/\s+/)).filter(Boolean), r = /* @__PURE__ */ new Map(), i = [];
	for (let e of n) {
		let t = le(e);
		t ? r.set(t, e) : i.push(e);
	}
	return [...i, ...r.values()].join(" ");
}
function W(e) {
	if (e != null) return e === "pill" ? "9999px" : e === "sharp" ? "0" : typeof e == "number" ? `${e}px` : String(e);
}
//#endregion
//#region src/components/atoms/Button/Button.jsx
var de = {
	sm: 18,
	md: 20,
	lg: 22
}, fe = {
	sm: 16,
	md: 18,
	lg: 20
};
function pe({ size: e, children: t }) {
	return /* @__PURE__ */ h("span", {
		className: _.icon,
		"data-size": e,
		"aria-hidden": !0,
		children: t
	});
}
var G = n(function({ variant: e = "solid", theme: t = "primary", size: n = "md", surface: r = "light", radius: i, as: s, asChild: c = !1, href: l, fullWidth: f = !1, loading: v = !1, disabled: y = !1, leftIcon: b, rightIcon: x, icon: S, menu: C, open: w, onOpenChange: T, className: E = "", children: O, style: k, onClick: A, track: j, ...M }, N) {
	let P = Array.isArray(C) && C.length > 0, F = !!S && O == null && !P, I = y || v, { track: L } = H(), ee = (e) => {
		let t = se(j);
		t && L({
			component: "Button",
			action: "click",
			label: typeof O == "string" ? O : M["aria-label"] || void 0,
			...t
		}), A?.(e);
	}, te = e === "ghost" || e === "link" ? "outline" : e, [ne, R] = d(!1), B = ae(), [re, ie] = d({
		top: 0,
		left: 0,
		minWidth: 0
	}), oe = u(null), ce = u(null), le = o(), ue = w !== void 0, U = ue ? w : ne, G = (e) => {
		ue || R(e), T?.(e);
	};
	a(() => {
		if (!P) return;
		function e(e) {
			oe.current?.contains(e.target) || ce.current?.contains(e.target) || G(!1);
		}
		function t(e) {
			e.key === "Escape" && G(!1);
		}
		return document.addEventListener("mousedown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("mousedown", e), document.removeEventListener("keydown", t);
		};
	}, [P]), a(() => {
		if (!U) return;
		let e = () => {
			let e = oe.current?.getBoundingClientRect();
			e && ie({
				top: e.bottom + 6,
				left: e.left,
				minWidth: e.width
			});
		};
		return e(), window.addEventListener("resize", e), window.addEventListener("scroll", e, !0), () => {
			window.removeEventListener("resize", e), window.removeEventListener("scroll", e, !0);
		};
	}, [U]);
	let me = () => /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ g("span", {
		className: _.content,
		"data-hidden": v || void 0,
		children: [
			b && /* @__PURE__ */ h(pe, {
				size: n,
				children: b
			}),
			S && !b && /* @__PURE__ */ h(pe, {
				size: n,
				children: S
			}),
			O != null && /* @__PURE__ */ h("span", {
				style: F ? void 0 : {
					overflow: "hidden",
					textOverflow: "ellipsis"
				},
				children: O
			}),
			x && /* @__PURE__ */ h(pe, {
				size: n,
				children: x
			})
		]
	}), v && /* @__PURE__ */ h("span", {
		className: _.loaderOverlay,
		children: /* @__PURE__ */ h(D, {
			type: "line-simple",
			size: fe[n]
		})
	})] }), he = {
		"data-variant": e,
		"data-theme": t,
		"data-size": n,
		"data-surface": r,
		"data-loading": v || void 0,
		"data-full": f || void 0,
		"aria-busy": v || void 0
	}, ge = W(i), K = ge == null ? k : {
		"--tesseract-btn-radius": ge,
		...k
	};
	if (P) {
		let e = {
			...he,
			"data-variant": te
		};
		return /* @__PURE__ */ g("div", {
			ref: (e) => {
				oe.current = e, typeof N == "function" ? N(e) : N && (N.current = e);
			},
			className: [_.splitGroup, E].filter(Boolean).join(" "),
			"data-variant": te,
			"data-full": f || void 0,
			style: K,
			children: [
				/* @__PURE__ */ h("button", {
					type: "button",
					disabled: I,
					onClick: ee,
					className: _.button,
					"data-split-part": "primary",
					...e,
					...M,
					children: me()
				}),
				/* @__PURE__ */ h("button", {
					type: "button",
					disabled: I,
					onClick: () => G(!U),
					"aria-haspopup": "menu",
					"aria-expanded": U,
					"aria-controls": U ? le : void 0,
					"aria-label": "More actions",
					className: _.button,
					"data-split-part": "trigger",
					...e,
					children: /* @__PURE__ */ h(z, {
						name: "chevron-down",
						size: de[n],
						style: {
							transition: "transform 200ms ease",
							transform: U ? "rotate(180deg)" : "rotate(0deg)"
						}
					})
				}),
				U && B && p(/* @__PURE__ */ h("div", {
					ref: ce,
					id: le,
					role: "menu",
					className: _.menu,
					style: {
						position: "fixed",
						top: re.top,
						left: re.left,
						minWidth: re.minWidth,
						zIndex: 2100
					},
					children: C.map((e) => /* @__PURE__ */ g("button", {
						type: "button",
						role: "menuitem",
						disabled: e.disabled,
						"data-danger": e.danger || void 0,
						className: _.menuItem,
						onClick: () => {
							let t = se(e.track);
							t && L({
								component: "Button",
								action: "menu_select",
								label: e.label,
								...t
							}), e.onClick?.(), G(!1);
						},
						children: [
							e.icon && /* @__PURE__ */ h(pe, {
								size: "sm",
								children: e.icon
							}),
							/* @__PURE__ */ h("span", {
								className: _.menuItemLabel,
								children: e.label
							}),
							e.shortcut ? /* @__PURE__ */ h("span", {
								className: _.menuItemShortcut,
								children: e.shortcut
							}) : /* @__PURE__ */ h(z, {
								name: "chevron-right",
								size: 16,
								className: _.menuItemChevron
							})
						]
					}, e.id))
				}), document.body)
			]
		});
	}
	if (c) return /* @__PURE__ */ h(V, {
		ref: N,
		className: [_.button, E].filter(Boolean).join(" "),
		style: K,
		"data-icon-only": F || void 0,
		onClick: ee,
		"aria-disabled": I || void 0,
		...he,
		...M,
		children: O
	});
	let _e = s || (l == null ? "button" : "a"), ve = _e === "button" ? {
		type: "button",
		disabled: I
	} : {
		href: _e === "a" ? l : void 0,
		role: _e === "a" ? void 0 : "button",
		"aria-disabled": I || void 0
	};
	return /* @__PURE__ */ h(_e, {
		ref: N,
		className: [_.button, E].filter(Boolean).join(" "),
		style: K,
		"data-icon-only": F || void 0,
		onClick: ee,
		...ve,
		...he,
		...M,
		children: me()
	});
});
G.displayName = "Button";
//#endregion
//#region src/components/atoms/MedicalIcon/registry.js
var me = /* @__PURE__ */ "ambulance.anxiety.bandage.bandage-02.blood.blood-3.brain.call-hospital.capsule-3.cardiogram.clipboard-activity.diagnosis.dna.ectrocardiogram-monitor-02.electrocardiogram-monitor-01.emergency.empathy.eye.first-aid.give-blood.give-pill.gynec.hand-soap.health-care.health-file-02.health-file-03.health-folder.heart-rate.heart-rate-monitor.hiv.hospital.hospital-3.hospital-bed.hospital-building-3.hospital-building-4.injection.lab.lifebuoy.location-hospital.lungs.mask.medical-book.medical-document.medical-file.medical-information.medical-record.medical-report.medical-service.mental-health.microscope.obstetric.operating-scissors-01.pill.pill-tablet.pills-3.plaster.stethoscope.stomach-care.surgical-scissors-02.syrup.tablets.test-tube.test-tube-02.thermometer.tooth.transfusion.ultrasound-monitor-01.ultrasound-monitor-02.virus.virus-lab-research.wheel-chair-3.wheelchair".split("."), he = new Set(me);
function ge(e) {
	if (typeof e != "string") return null;
	let t = e.trim().toLowerCase().replace(/\s+/g, "-");
	return he.has(t) ? t : he.has(e) ? e : null;
}
//#endregion
//#region src/components/atoms/MedicalIcon/MedicalIcon.jsx
var K = {
	line: "linear",
	linear: "linear",
	bulk: "bulk",
	solid: "bold",
	bold: "bold"
}, _e = n(function({ name: e, variant: t = "linear", size: n = 24, color: r, alt: i, className: a, style: o, family: s = "medical", ...c }, l) {
	return /* @__PURE__ */ h(z, {
		ref: l,
		name: typeof e == "string" ? ge(e) ?? e : e,
		variant: K[t] || "linear",
		family: s,
		size: n,
		color: r,
		title: i,
		className: a,
		style: o,
		...c
	});
});
_e.displayName = "MedicalIcon";
//#endregion
//#region src/components/atoms/Logo/assets/tatvapractice-symbol.svg?raw
var ve = "<svg width=\"78\" height=\"112\" viewBox=\"0 0 78 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M46.7582 42.962C47.5934 42.9622 47.6469 43.2522 47.6777 47.7391C47.6954 50.3683 47.88 58.8162 48.0912 66.5157C48.5093 81.6768 48.9526 85.3353 51.0239 88.7147C52.5522 91.2112 53.1857 91.8779 55.8228 93.7149C60.3282 96.854 65.084 98.6595 71.003 99.1613H78V111.431H72.4285C69.6436 111.431 67.7233 111.483 65.9266 111.382L62.9014 111.208C53.6645 110.167 45.5812 106.038 39.5435 98.3724C35.0469 92.6625 33.5565 88.3344 33.2484 80.0473C32.9623 72.3462 33.5397 67.7151 35.5989 61.1075C38.3714 52.2057 44.0561 42.962 46.7582 42.962Z\" fill=\"#5746D9\"/>\n<path d=\"M43.1889 0.000421048C45.6903 0.00426749 47.0708 0.961014 47.4655 3.44453C47.7915 5.49994 47.7238 7.625 47.792 9.71792C47.8323 10.9567 47.8029 12.2508 47.8029 13.7442C48.3249 13.4578 48.7031 13.2186 49.0488 13.0042C52.8662 10.7816 56.82 9.15654 61.1712 8.52091C64.7728 7.99484 66.9519 9.91092 66.9712 13.5483C66.98 15.1974 66.9724 16.8486 66.9712 18.6465C66.9672 20.093 66.9631 21.3911 66.9549 22.6891C66.9543 22.7847 66.9657 23.0463 66.9658 23.157C66.9658 23.1996 66.7514 23.1585 66.672 23.157C60.9448 23.0508 56.073 25.4183 51.5789 28.6197C43.7048 34.2291 36.9976 40.9288 32.8838 49.8556C31.9486 51.8855 31.2756 54.0364 30.5497 55.9549C23.3394 45.2849 13.008 40.7598 0.0641625 41.1338C0.0641625 38.0668 -0.111544 34.8666 0.118572 31.6993C0.289579 29.3552 3.41557 26.6808 6.06006 26.4705C13.4307 25.8879 20.3842 27.2808 26.5397 31.5524C28.4293 32.9122 30.2728 34.3421 32.4866 35.9214C32.4866 23.791 32.5465 11.959 32.5465 0.00586198C34.5799 0.00586198 36.4093 0.00656161 38.2377 0.00586198C39.887 0.00522574 41.5397 -0.00176241 43.1889 0.000421048Z\" fill=\"#5746D9\"/>\n</svg>\n", ye = "<svg width=\"600\" height=\"105\" viewBox=\"0 0 600 105\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M63.0757 17.559C63.0719 18.9228 63.0695 20.1466 63.0618 21.3703C63.0613 21.4609 63.0708 21.7081 63.0708 21.8112C63.0708 21.8513 62.87 21.8126 62.7952 21.8112C57.4005 21.7108 52.814 23.9373 48.5809 26.9528C41.1639 32.2363 34.8477 38.5451 30.9727 46.9535C30.0914 48.8661 29.4587 50.8933 28.7748 52.701C21.9835 42.6497 12.2512 38.3853 0.0587351 38.7379C0.0587351 35.8492 -0.10415 32.8385 0.112583 29.8554C0.273036 27.647 3.21753 25.125 5.70891 24.928C12.6516 24.3793 19.2003 25.6921 24.9983 29.7161C26.7784 30.9971 28.5134 32.343 30.5991 33.8308C30.5991 22.4057 30.654 11.262 30.654 0.00383103C32.5696 0.00383103 34.2922 0.00433984 36.0147 0.00368015C37.568 0.00308092 39.1214 -0.00153193 40.6747 0.000524542C43.0326 0.0036498 44.3348 0.903705 44.7062 3.24518C45.0133 5.18105 44.9483 7.17825 45.0126 9.14945C45.0506 10.3174 45.0224 11.5375 45.0224 12.9458C45.5151 12.6755 45.87 12.4467 46.1961 12.2445C49.7915 10.1511 53.5152 8.62491 57.6133 8.02625C61.0055 7.53072 63.0589 9.3331 63.0772 12.759C63.0855 14.3122 63.0768 15.8656 63.0757 17.559Z\" fill=\"#000\"/>\n<path d=\"M37.2429 92.6555C42.9297 99.8759 50.5424 103.765 59.2425 104.745L62.0911 104.906C63.7837 105.002 65.4814 104.945 67.1638 104.736L69.3596 104.464V93.3991H66.8707C61.2959 92.9265 56.8186 91.223 52.575 88.2663C50.0913 86.5361 49.4923 85.9111 48.0528 83.5599C46.1016 80.3767 45.6861 76.9297 45.2923 62.648C45.0933 55.3941 44.9193 47.437 44.9027 44.9633C44.8737 40.7357 44.8239 40.4636 44.0364 40.4636C41.4914 40.4636 36.1362 49.1699 33.5249 57.5539C31.5851 63.7781 31.0463 68.1397 31.3157 75.3935C31.6058 83.1999 33.0068 87.2768 37.2429 92.6555Z\" fill=\"#000\"/>\n<path d=\"M78.5101 71.9666C85.9636 71.9666 90.4961 67.5347 90.4961 59.9805V55.0451C87.3737 56.3545 83.7477 57.4624 79.8195 58.2682C74.4812 59.2755 71.7617 61.7935 71.7617 65.7217C72.0638 69.9521 74.2798 71.9666 78.5101 71.9666ZM81.6325 38.728C76.8985 38.728 74.2798 39.9367 73.5747 42.4547H60.1785C61.7901 32.5839 68.74 27.7492 81.0282 27.7492C95.7337 27.7492 103.187 32.5839 103.489 42.4547V60.5849C103.489 75.2904 94.6258 81.8374 80.2224 82.8446C67.4306 83.8519 58.567 77.9092 58.567 66.1246C58.8691 53.3328 68.1357 49.9082 81.6325 48.5988C87.3737 47.8938 90.2947 46.1815 90.2947 43.2605C89.9925 40.2388 87.1723 38.728 81.6325 38.728Z\" fill=\"#000\"/>\n<path d=\"M133.969 31.4759C133.969 35.3034 131.048 38.1236 127.321 38.1236H125.911V67.6355C125.911 69.8514 127.221 71.06 129.839 71.06H133.969V81.2331C129.638 81.636 124.904 81.636 119.868 81.1323C114.832 80.6287 112.414 77.5063 112.515 71.5637V13.3458H119.465C122.99 13.3458 125.911 16.5689 125.911 20.0942V28.555H133.969V31.4759Z\" fill=\"#000\"/>\n<path d=\"M180.562 28.555H190.936L172.101 81.8374H157.899L139.165 28.555H153.971L164.749 65.9232L174.015 33.2889C175.022 30.1665 177.238 28.555 180.562 28.555Z\" fill=\"#000\"/>\n<path d=\"M213.318 71.9666C220.772 71.9666 225.304 67.5347 225.304 59.9805V55.0451C222.182 56.3545 218.556 57.4624 214.628 58.2682C209.289 59.2755 206.57 61.7935 206.57 65.7217C206.872 69.9521 209.088 71.9666 213.318 71.9666ZM216.441 38.728C211.707 38.728 209.088 39.9367 208.383 42.4547H194.987C196.598 32.5839 203.548 27.7492 215.836 27.7492C230.542 27.7492 237.995 32.5839 238.297 42.4547V60.5849C238.297 75.2904 229.434 81.8374 215.03 82.8446C202.239 83.8519 193.375 77.9092 193.375 66.1246C193.677 53.3328 202.944 49.9082 216.441 48.5988C222.182 47.8938 225.103 46.1815 225.103 43.2605C224.801 40.2388 221.98 38.728 216.441 38.728Z\" fill=\"#000\"/>\n<path d=\"M297.732 35.4041C297.732 48.901 290.379 57.4624 276.681 57.4624H259.356V81.8374H245.356V20.6986C245.356 16.7704 248.478 13.3458 252.406 13.3458H275.673C290.178 13.3458 297.732 21.1015 297.732 35.4041ZM259.558 45.0735H273.155C280.206 45.1742 283.731 41.8504 283.731 35.2027C283.731 28.555 280.407 25.2311 273.86 25.2311H259.558V45.0735Z\" fill=\"#000\"/>\n<path d=\"M304.587 81.8374V54.34C304.99 37.1164 314.156 28.555 331.984 28.555H333.898V42.4547H329.365C321.912 42.4547 318.185 46.3829 318.185 54.1386V81.8374H304.587Z\" fill=\"#000\"/>\n<path d=\"M359.438 71.9666C366.891 71.9666 371.424 67.5347 371.424 59.9805V55.0451C368.301 56.3545 364.675 57.4624 360.747 58.2682C355.409 59.2755 352.689 61.7935 352.689 65.7217C352.992 69.9521 355.207 71.9666 359.438 71.9666ZM362.56 38.728C357.826 38.728 355.207 39.9367 354.502 42.4547H341.106C342.718 32.5839 349.668 27.7492 361.956 27.7492C376.661 27.7492 384.115 32.5839 384.417 42.4547V60.5849C384.417 75.2904 375.553 81.8374 361.15 82.8446C348.358 83.8519 339.495 77.9092 339.495 66.1246C339.797 53.3328 349.063 49.9082 362.56 48.5988C368.301 47.8938 371.222 46.1815 371.222 43.2605C370.92 40.2388 368.1 38.728 362.56 38.728Z\" fill=\"#000\"/>\n<path d=\"M438.513 65.5203C436.096 76.3984 428.239 83.3482 415.85 83.0461C399.735 83.0461 391.476 73.7796 391.073 55.448C391.073 37.2171 399.231 28.0513 415.649 27.7492C428.542 27.7492 436.197 33.4904 438.513 45.0735H423.908C422.297 41.4475 419.477 39.5338 415.246 39.5338C408.196 39.5338 404.67 44.8721 404.67 55.448C404.67 66.0239 408.397 71.3622 415.85 71.2615C418.973 71.2615 421.692 69.9521 423.908 67.434C425.218 66.1246 426.729 65.5203 428.441 65.5203H438.513Z\" fill=\"#000\"/>\n<path d=\"M467.636 31.4759C467.636 35.3034 464.715 38.1236 460.988 38.1236H459.578V67.6355C459.578 69.8514 460.888 71.06 463.507 71.06H467.636V81.2331C463.305 81.636 458.571 81.636 453.535 81.1323C448.499 80.6287 446.081 77.5063 446.182 71.5637V13.3458H453.132C456.657 13.3458 459.578 16.5689 459.578 20.0942V28.555H467.636V31.4759Z\" fill=\"#000\"/>\n<path d=\"M475.806 13.3458H482.756C487.188 13.3458 489.303 15.5617 489.203 19.8928V23.821H475.806V13.3458ZM475.806 28.555H482.756C487.087 28.555 489.203 30.6701 489.203 35.0012V81.8374H475.806V28.555Z\" fill=\"#000\"/>\n<path d=\"M544.403 65.5203C541.985 76.3984 534.129 83.3482 521.74 83.0461C505.624 83.0461 497.365 73.7796 496.962 55.448C496.962 37.2171 505.121 28.0513 521.539 27.7492C534.431 27.7492 542.086 33.4904 544.403 45.0735H529.798C528.186 41.4475 525.366 39.5338 521.136 39.5338C514.085 39.5338 510.56 44.8721 510.56 55.448C510.56 66.0239 514.287 71.3622 521.74 71.2615C524.862 71.2615 527.582 69.9521 529.798 67.434C531.107 66.1246 532.618 65.5203 534.33 65.5203H544.403Z\" fill=\"#000\"/>\n<path d=\"M599.109 65.5203C596.188 76.8013 588.936 83.0461 575.842 83.0461C559.727 82.5425 551.669 73.1752 551.669 55.0451C551.669 36.915 559.827 27.8499 576.044 27.7492C592.965 27.7492 600.922 38.1236 599.915 58.9733H565.468C565.971 67.1318 569.497 71.2615 576.044 71.2615C579.166 71.2615 582.087 69.9521 584.706 67.434C585.915 66.1246 587.425 65.5203 589.238 65.5203H599.109ZM575.842 38.728C570.101 38.728 566.677 42.354 565.669 49.4046H585.713C584.907 42.354 581.584 38.728 575.842 38.728Z\" fill=\"#000\"/>\n\n</svg>\n", be = "<svg width=\"600\" height=\"146\" viewBox=\"0 0 600 146\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M87.3013 24.3029C87.2959 26.1905 87.2927 27.8843 87.2821 29.578C87.2813 29.7035 87.2945 30.0456 87.2945 30.1882C87.2945 30.2438 87.0165 30.1901 86.913 30.1882C79.4464 30.0492 73.0983 33.131 67.2394 37.3045C56.9737 44.6173 48.2316 53.3491 42.8685 64.987C41.6486 67.6342 40.773 70.44 39.8263 72.9419C30.4267 59.0302 16.9565 53.128 0.0812936 53.616C0.0812936 49.6178 -0.14415 45.4508 0.155823 41.322C0.377902 38.2654 4.45328 34.7748 7.90154 34.5022C17.5106 33.7426 26.5746 35.5597 34.5994 41.1292C37.0632 42.9022 39.4645 44.7649 42.3513 46.8242C42.3513 31.011 42.4273 15.5874 42.4273 0.00530242C45.0787 0.00530242 47.4628 0.00600665 49.8469 0.00509359C51.9968 0.00426421 54.1468 -0.00212031 56.2967 0.000726003C59.5602 0.00505158 61.3625 1.25079 61.8766 4.49156C62.3016 7.17094 62.2117 9.93521 62.3006 12.6635C62.3533 14.28 62.3142 15.9687 62.3142 17.9178C62.9961 17.5438 63.4873 17.2271 63.9387 16.9473C68.915 14.0499 74.0688 11.9375 79.7409 11.1089C84.436 10.4231 87.278 12.9177 87.3033 17.6594C87.3148 19.8091 87.3028 21.9591 87.3013 24.3029Z\" fill=\"#000\"/>\n<path d=\"M51.5468 128.242C59.4177 138.235 69.9542 143.618 81.9959 144.974L85.9385 145.197C88.2811 145.33 90.6309 145.251 92.9595 144.962L95.9986 144.585V129.271H92.5537C84.8378 128.617 78.6409 126.259 72.7676 122.167C69.33 119.772 68.5008 118.907 66.5085 115.653C63.8079 111.247 63.2327 106.476 62.6877 86.7093C62.4124 76.6694 62.1714 65.6562 62.1485 62.2324C62.1083 56.3811 62.0395 56.0045 60.9495 56.0045C57.4271 56.0045 50.0151 68.0547 46.4009 79.6587C43.716 88.2735 42.9702 94.3101 43.3431 104.35C43.7447 115.155 45.6838 120.797 51.5468 128.242Z\" fill=\"#000\"/>\n<path d=\"M106.76 102.511C117.076 102.511 123.349 96.3772 123.349 85.9216V79.0907C119.028 80.9029 114.009 82.4364 108.572 83.5517C101.184 84.9458 97.4196 88.431 97.4196 93.8679C97.8379 99.723 100.905 102.511 106.76 102.511ZM111.082 56.5066C104.529 56.5066 100.905 58.1795 99.929 61.6647H81.3877C83.6183 48.0027 93.2374 41.3112 110.245 41.3112C130.599 41.3112 140.915 48.0027 141.333 61.6647V86.7581C141.333 107.112 129.065 116.173 109.13 117.567C91.4251 118.961 79.1572 110.736 79.1572 94.4255C79.5754 76.7207 92.401 71.9809 111.082 70.1686C119.028 69.1927 123.071 66.8228 123.071 62.7799C122.652 58.5977 118.749 56.5066 111.082 56.5066Z\" fill=\"#000\"/>\n<path d=\"M183.519 46.4692C183.519 51.7667 179.476 55.6701 174.318 55.6701H172.366V96.5166C172.366 99.5836 174.179 101.256 177.803 101.256H183.519V115.337C177.525 115.894 170.972 115.894 164.002 115.197C157.032 114.5 153.686 110.179 153.825 101.954V21.3759H163.444C168.324 21.3759 172.366 25.8369 172.366 30.7162V42.4264H183.519V46.4692Z\" fill=\"#000\"/>\n<path d=\"M248.007 42.4264H262.366L236.297 116.173H216.64L190.71 42.4264H211.203L226.12 94.1467L238.946 48.9786C240.34 44.6569 243.407 42.4264 248.007 42.4264Z\" fill=\"#000\"/>\n<path d=\"M293.344 102.511C303.66 102.511 309.933 96.3772 309.933 85.9216V79.0907C305.612 80.9029 300.593 82.4364 295.156 83.5517C287.768 84.9458 284.003 88.431 284.003 93.8679C284.422 99.723 287.489 102.511 293.344 102.511ZM297.665 56.5066C291.113 56.5066 287.489 58.1795 286.513 61.6647H267.972C270.202 48.0027 279.821 41.3112 296.829 41.3112C317.183 41.3112 327.499 48.0027 327.917 61.6647V86.7581C327.917 107.112 315.649 116.173 295.714 117.567C278.009 118.961 265.741 110.736 265.741 94.4255C266.159 76.7207 278.985 71.9809 297.665 70.1686C305.612 69.1927 309.655 66.8228 309.655 62.7799C309.236 58.5977 305.333 56.5066 297.665 56.5066Z\" fill=\"#000\"/>\n<path d=\"M402.79 93.5891C399.444 108.645 388.57 118.264 371.423 117.846C349.118 117.846 337.686 105.02 337.129 79.6483C337.129 54.4155 348.421 41.7294 371.144 41.3112C388.988 41.3112 399.583 49.2574 402.79 65.2893H382.576C380.345 60.2706 376.442 57.6219 370.587 57.6219C360.828 57.6219 355.949 65.0105 355.949 79.6483C355.949 94.2861 361.107 101.675 371.423 101.535C375.745 101.535 379.509 99.723 382.576 96.2378C384.388 94.4255 386.479 93.5891 388.849 93.5891H402.79Z\" fill=\"#000\"/>\n<path d=\"M439.334 102.511C449.65 102.511 455.924 96.3772 455.924 85.9216V79.0907C451.602 80.9029 446.583 82.4364 441.146 83.5517C433.758 84.9458 429.994 88.431 429.994 93.8679C430.412 99.723 433.479 102.511 439.334 102.511ZM443.656 56.5066C437.103 56.5066 433.479 58.1795 432.503 61.6647H413.962C416.192 48.0027 425.811 41.3112 442.819 41.3112C463.173 41.3112 473.489 48.0027 473.907 61.6647V86.7581C473.907 107.112 461.639 116.173 441.704 117.567C423.999 118.961 411.731 110.736 411.731 94.4255C412.15 76.7207 424.975 71.9809 443.656 70.1686C451.602 69.1927 455.645 66.8228 455.645 62.7799C455.226 58.5977 451.323 56.5066 443.656 56.5066Z\" fill=\"#000\"/>\n<path d=\"M483.676 116.173V78.1148C484.234 54.2761 496.92 42.4264 521.595 42.4264H524.244V61.6647H517.971C507.655 61.6647 502.497 67.1016 502.497 77.836V116.173H483.676Z\" fill=\"#000\"/>\n<path d=\"M598.767 93.5891C594.724 109.203 584.687 117.846 566.564 117.846C544.259 117.149 533.106 104.184 533.106 79.0907C533.106 53.9973 544.398 41.4506 566.843 41.3112C590.263 41.3112 601.277 55.6702 599.882 84.5276H552.205C552.902 95.8196 557.781 101.535 566.843 101.535C571.165 101.535 575.207 99.723 578.832 96.2378C580.505 94.4255 582.596 93.5891 585.105 93.5891H598.767ZM566.564 56.5066C558.618 56.5066 553.878 61.5253 552.484 71.2838H580.226C579.111 61.5253 574.51 56.5066 566.564 56.5066Z\" fill=\"#000\"/>\n\n</svg>\n", xe = (e) => `data:image/svg+xml,${encodeURIComponent(e)}`, Se = {
	file: "tatvapractice-symbol.svg",
	data: xe(ve),
	ar: 78 / 112
}, q = {
	practice: {
		file: "tatvapractice-wordmark.svg",
		data: xe(ye),
		ar: 600 / 105,
		label: "TatvaPractice"
	},
	care: {
		file: "tatvacare-wordmark.svg",
		data: xe(be),
		ar: 600 / 146,
		label: "TatvaCare"
	}
}, Ce = {
	gradient: "linear-gradient(90deg, var(--tesseract-blue-500) 0%, var(--tesseract-violet-500) 100%)",
	dark: "var(--tesseract-slate-900)",
	light: "var(--tesseract-slate-0)",
	violet: "var(--tesseract-violet-500)",
	blue: "var(--tesseract-blue-500)"
};
function we(e, t, n, r) {
	let i = `url("${e}") no-repeat center / contain`;
	return {
		display: "inline-block",
		width: t,
		height: n,
		flexShrink: 0,
		background: r,
		WebkitMask: i,
		mask: i
	};
}
function Te({ variant: e = "wordmark", brand: t = "practice", tone: n = "gradient", height: r = 32, width: i, maxWidth: a, color: o, basePath: s, title: c, className: l, style: u }) {
	let d = {
		display: "inline-flex",
		alignItems: "center",
		...u
	}, f = e === "symbol", p = q[t] || q.practice, m = f ? Se : p, g = s ? `${String(s).replace(/\/$/, "")}/${m.file}` : m.data, _ = m.ar, v = i == null ? r : Math.round(i / _), y = i ?? Math.round(r * _), b = o || Ce[n] || Ce.gradient;
	return /* @__PURE__ */ h("span", {
		role: "img",
		"aria-label": c || p.label,
		className: l,
		style: d,
		children: /* @__PURE__ */ h("span", {
			"aria-hidden": !0,
			style: {
				...we(g, y, v, b),
				...a == null ? null : { maxWidth: a }
			}
		})
	});
}
Te.displayName = "Logo";
//#endregion
//#region src/components/atoms/Avatar/Avatar.jsx
var J = "linear-gradient(var(--tesseract-amber-400, #FED15E), var(--tesseract-warning-600, #D97706))", Ee = {
	circle: "50%",
	rounded: "var(--tesseract-radius-12, 12px)",
	square: "var(--tesseract-radius-4, 4px)"
}, De = {
	slate: {
		bg: "var(--tesseract-slate-100, #f1f1f5)",
		fg: "var(--tesseract-slate-600, #545460)"
	},
	primary: {
		bg: "var(--tesseract-primary-100)",
		fg: "var(--tesseract-primary-600)"
	},
	success: {
		bg: "var(--tesseract-success-100)",
		fg: "var(--tesseract-success-700)"
	},
	warning: {
		bg: "var(--tesseract-warning-100)",
		fg: "var(--tesseract-warning-700)"
	},
	error: {
		bg: "var(--tesseract-error-100)",
		fg: "var(--tesseract-error-600)"
	},
	violet: {
		bg: "var(--tesseract-violet-100)",
		fg: "var(--tesseract-violet-600)"
	}
}, Oe = {
	online: "var(--tesseract-success-500, #10B981)",
	offline: "var(--tesseract-slate-400, #A2A2A8)",
	away: "var(--tesseract-warning-500, #F59E0B)",
	busy: "var(--tesseract-error-500, #E11D48)"
};
function Y(e) {
	let t = String(e || "").trim().split(/\s+/).filter(Boolean);
	return t.length === 0 ? "?" : t.length === 1 ? t[0].slice(0, 2).toUpperCase() : (t[0][0] + t[t.length - 1][0]).toUpperCase();
}
var ke = e.forwardRef(function({ src: t, name: n, alt: r, icon: i, size: a = 40, shape: o = "circle", radius: s, color: c = "slate", status: l, ring: u = !1, onClick: d, className: f, style: p, ...m }, _) {
	let [v, y] = e.useState(!1), b = u ? typeof u == "string" ? u : J : void 0, x = d ? "button" : "span", S = {
		borderRadius: W(s) ?? (Ee[o] || Ee.circle),
		cornerShape: "round"
	}, C = De[c] || De.slate, w = r || n || "User avatar", T, E, D;
	i == null ? t && !v ? T = /* @__PURE__ */ h("img", {
		src: t,
		alt: w,
		onError: () => y(!0),
		style: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		}
	}) : (T = Y(n), E = "img", D = w) : (T = typeof i == "string" ? /* @__PURE__ */ h(z, {
		name: i,
		size: Math.round(a * .5),
		color: C.fg
	}) : i, E = "img", D = w);
	let O = null;
	if (l != null) {
		let e = typeof l == "string" && l in Oe, t = Math.max(8, Math.round(a * .28));
		O = /* @__PURE__ */ h("span", {
			role: e ? "img" : void 0,
			"aria-label": e ? n ? `${n} — ${l}` : `Status: ${l}` : void 0,
			style: {
				position: "absolute",
				bottom: 0,
				right: 0,
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: e ? t : void 0,
				height: e ? t : void 0,
				borderRadius: "50%",
				background: e ? Oe[l] : "transparent",
				border: e ? "2px solid var(--tesseract-slate-0, #fff)" : "none",
				boxSizing: "border-box"
			},
			children: e ? null : l
		});
	}
	return /* @__PURE__ */ g(x, {
		ref: _,
		type: d ? "button" : void 0,
		onClick: d,
		"aria-label": d ? w : void 0,
		className: U(f),
		...m,
		style: {
			boxSizing: "border-box",
			position: "relative",
			...S,
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			width: a,
			height: a,
			flexShrink: 0,
			padding: u ? "var(--tesseract-space-0-5)" : 0,
			border: "none",
			background: b || "transparent",
			cursor: d ? "pointer" : "default",
			...p
		},
		children: [/* @__PURE__ */ h("span", {
			role: d ? void 0 : E,
			"aria-label": d ? void 0 : D,
			style: {
				boxSizing: "border-box",
				...S,
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				overflow: "hidden",
				border: u ? "1px solid var(--tesseract-slate-0, #fff)" : "none",
				background: C.bg,
				color: C.fg,
				fontFamily: "var(--tesseract-font-body)",
				fontWeight: "var(--tesseract-weight-extrabold)",
				fontSize: Math.round(a * .36),
				lineHeight: 1,
				textAlign: "center",
				letterSpacing: "0.01em"
			},
			children: T
		}), O]
	});
});
ke.displayName = "Avatar";
var Ae = {
	dot: "_dot_19xic_4",
	badge: "_badge_19xic_55",
	icon: "_icon_19xic_201"
}, je = n(function({ variant: e = "soft", color: t = "primary", size: n = "md", icon: r, rightIcon: i, sticky: a, radius: o, children: s, className: c, style: l, ...u }, d) {
	let f = o == null ? null : { borderRadius: typeof o == "number" ? `${o}px` : o }, p = f || l ? {
		...f,
		...l
	} : void 0;
	return e === "dot" ? /* @__PURE__ */ h("span", {
		ref: d,
		className: [Ae.dot, c].filter(Boolean).join(" "),
		style: p,
		"data-color": t,
		"data-size": n,
		"aria-hidden": !0,
		...u
	}) : /* @__PURE__ */ g("span", {
		ref: d,
		className: [Ae.badge, c].filter(Boolean).join(" "),
		style: p,
		"data-variant": e,
		"data-color": t,
		"data-size": n,
		"data-sticky": a || void 0,
		...u,
		children: [
			r != null && /* @__PURE__ */ h("span", {
				className: Ae.icon,
				children: r
			}),
			s != null && /* @__PURE__ */ h("span", { children: s }),
			i != null && /* @__PURE__ */ h("span", {
				className: Ae.icon,
				children: i
			})
		]
	});
});
je.displayName = "Badge";
//#endregion
//#region src/components/atoms/Divider/Divider.jsx
var Me = n(function({ orientation: e = "horizontal", variant: t = "solid", color: n = "var(--tesseract-slate-200, #E2E2EA)", spacing: r = 0, thickness: i = 1, lineStyle: a = "solid", label: o, labelPosition: s = "center", inset: c = 0, className: l, style: u, ...d }, f) {
	let p = e === "horizontal", m = typeof c == "object" && c ? c.start ?? 0 : c, _ = typeof c == "object" && c ? c.end ?? 0 : c, v = (e) => {
		let r = p ? {
			height: i,
			width: "100%"
		} : {
			width: i,
			alignSelf: "stretch"
		}, o;
		return o = t === "gradient" ? { background: p ? `linear-gradient(to right, transparent, ${n} 25%, ${n} 75%, transparent)` : `linear-gradient(to bottom, transparent, ${n} 25%, ${n} 75%, transparent)` } : a === "dashed" || a === "dotted" ? p ? {
			height: 0,
			borderTop: `${i}px ${a} ${n}`
		} : {
			width: 0,
			borderLeft: `${i}px ${a} ${n}`
		} : { backgroundColor: n }, {
			flexShrink: 0,
			...r,
			...o,
			...e
		};
	};
	if (o != null && p) {
		let e = s === "start" ? 0 : 1, t = s === "end" ? 0 : 1;
		return /* @__PURE__ */ g("div", {
			ref: f,
			role: "separator",
			"aria-orientation": "horizontal",
			...d,
			className: U(l),
			style: {
				boxSizing: "border-box",
				fontFamily: "var(--tesseract-font-body)",
				display: "flex",
				alignItems: "center",
				gap: "var(--tesseract-space-3)",
				width: "100%",
				marginTop: r,
				marginBottom: r,
				paddingLeft: m,
				paddingRight: _,
				...u
			},
			children: [
				/* @__PURE__ */ h("div", { style: v({
					flex: e,
					minWidth: 0
				}) }),
				/* @__PURE__ */ h("span", {
					style: {
						flexShrink: 0,
						fontSize: "var(--tesseract-text-caption-sm)",
						fontWeight: "var(--tesseract-weight-medium)",
						color: "var(--tesseract-slate-600)",
						whiteSpace: "nowrap"
					},
					children: o
				}),
				/* @__PURE__ */ h("div", { style: v({ flex: t }) })
			]
		});
	}
	let y = p ? {
		marginTop: r,
		marginBottom: r,
		marginLeft: m,
		marginRight: _
	} : {
		marginLeft: r,
		marginRight: r,
		marginTop: m,
		marginBottom: _
	};
	return /* @__PURE__ */ h("div", {
		ref: f,
		role: "separator",
		"aria-orientation": e,
		...d,
		className: U(l),
		style: {
			boxSizing: "border-box",
			fontFamily: "var(--tesseract-font-body)",
			...v(),
			...y,
			...u
		}
	});
});
Me.displayName = "Divider";
var Ne = {
	root: "_root_v5xo4_21",
	skeleton: "_skeleton_v5xo4_28",
	pulse: "_pulse_v5xo4_1",
	wave: "_wave_v5xo4_1"
};
//#endregion
//#region src/components/atoms/Skeleton/Skeleton.jsx
function Pe({ variant: e, width: t, height: n, radius: r, isLast: i, animation: a, speed: o, className: s, styleProp: c, rootRef: l, rootRest: u }) {
	let d = e === "circular" ? "50%" : e === "text" ? 4 : 8, f = i ? t ?? "60%" : t ?? "100%", p = o == null ? void 0 : typeof o == "number" ? `${o}s` : o, m = {
		borderRadius: r ?? d,
		...p ? { "--skeleton-speed": p } : null,
		...e === "text" ? {
			width: f,
			height: n ?? 14
		} : e === "circular" ? {
			width: t ?? 40,
			height: n ?? t ?? 40
		} : {
			width: t ?? "100%",
			height: n ?? 40
		},
		...c
	};
	return /* @__PURE__ */ h("span", {
		ref: l,
		className: U(Ne.skeleton, s),
		"data-animation": a,
		style: m,
		"aria-hidden": !0,
		...u
	});
}
var Fe = n(function({ variant: e = "text", width: t, height: n, radius: r, count: i = 1, animation: a = "pulse", speed: o, className: s, style: c, ...l }, u) {
	let d = Math.max(1, Math.floor(i) || 1), f = (i) => ({
		variant: e,
		width: t,
		height: n,
		radius: r,
		animation: a,
		speed: o,
		isLast: d > 1 && i === d - 1
	});
	return d === 1 ? /* @__PURE__ */ h(Pe, {
		...f(0),
		className: s,
		styleProp: c,
		rootRef: u,
		rootRest: l
	}) : /* @__PURE__ */ h("span", {
		ref: u,
		"aria-hidden": !0,
		className: U(Ne.root, s),
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "var(--tesseract-space-2, 8px)",
			...c
		},
		...l,
		children: Array.from({ length: d }, (e, t) => /* @__PURE__ */ h(Pe, { ...f(t) }, t))
	});
});
Fe.displayName = "Skeleton";
var Ie = {
	track: "_track_1ygay_3",
	fill: "_fill_1ygay_34",
	"tesseract-pg-sweep": "_tesseract-pg-sweep_1ygay_1"
}, Le = e.forwardRef(function({ value: e = null, max: t = 100, size: n = "md", tone: r = "primary", label: i, className: a, style: o, ...s }, c) {
	let l = e == null, u = l ? null : Math.max(0, Math.min(100, e / t * 100));
	return /* @__PURE__ */ h("div", {
		ref: c,
		className: U(Ie.track, a),
		"data-size": n,
		"data-tone": r,
		"data-indeterminate": l || void 0,
		role: "progressbar",
		"aria-label": i,
		"aria-valuemin": l ? void 0 : 0,
		"aria-valuemax": l ? void 0 : t,
		"aria-valuenow": l ? void 0 : e,
		style: o,
		...s,
		children: /* @__PURE__ */ h("div", {
			className: Ie.fill,
			style: l ? void 0 : { width: `${u}%` }
		})
	});
});
Le.displayName = "Progress";
var Re = {
	root: "_root_z80vo_5",
	interactive: "_interactive_z80vo_15",
	remove: "_remove_z80vo_31"
}, ze = ({ size: e = 12 }) => /* @__PURE__ */ h(z, {
	name: "close-square",
	variant: "bold",
	size: e
}), Be = {
	default: "var(--tesseract-slate-700)",
	primary: "var(--tesseract-blue-600)",
	success: "var(--tesseract-success-700)",
	warning: "var(--tesseract-warning-800)",
	error: "var(--tesseract-error-600)"
}, Ve = {
	default: "var(--tesseract-slate-500)",
	primary: "var(--tesseract-blue-500)",
	success: "var(--tesseract-success-500)",
	warning: "var(--tesseract-warning-500)",
	error: "var(--tesseract-error-500)"
}, He = {
	sm: {
		height: 20,
		padX: 8,
		font: "var(--tesseract-text-micro)",
		gap: 4,
		icon: 12
	},
	md: {
		height: 24,
		padX: 10,
		font: "var(--tesseract-text-body-xs)",
		gap: 4,
		icon: 14
	},
	lg: {
		height: 28,
		padX: 12,
		font: "var(--tesseract-text-body-sm)",
		gap: 6,
		icon: 16
	}
}, Ue = n(function({ label: e, color: t = "default", variant: n = "filled", size: r = "md", icon: i, rightIcon: a, onDelete: o, removePosition: s = "right", onClick: c, selected: l = !1, radius: u, track: d, disabled: f = !1, className: p, style: m, ..._ }, v) {
	let y = Be[t] ?? Be.default, b = Ve[t] ?? Ve.default, x = He[r] ?? He.md, S = W(u), C = !!c && !f, w = (!!c || !!o) && !f, { track: T } = H(), E = (t) => {
		if (f) return;
		let n = se(d);
		n && T({
			component: "Chip",
			action: "click",
			label: typeof e == "string" ? e : void 0,
			...n
		}), c?.(t);
	}, D = n === "filled" ? "soft" : n === "outlined" ? "outline" : n, O = D === "solid" ? {
		color: "var(--tesseract-slate-0)",
		backgroundColor: y,
		border: `1px solid ${y}`
	} : D === "outline" ? {
		color: y,
		backgroundColor: "transparent",
		border: `1px solid color-mix(in srgb, ${y} 40%, transparent)`
	} : {
		color: y,
		backgroundColor: `color-mix(in srgb, ${y} 12%, transparent)`,
		border: `1px solid color-mix(in srgb, ${y} 22%, transparent)`
	}, k = l ? D === "solid" ? { border: `1px solid ${b}` } : {
		color: y,
		backgroundColor: `color-mix(in srgb, ${y} 22%, transparent)`,
		border: `1px solid ${b}`
	} : void 0, A = o && /* @__PURE__ */ h("span", {
		role: "button",
		"aria-label": "Remove",
		"aria-disabled": f ? !0 : void 0,
		"data-disabled": f ? "" : void 0,
		className: Re.remove,
		tabIndex: f ? void 0 : 0,
		onClick: (e) => {
			e.stopPropagation(), f || o(e);
		},
		onKeyDown: (e) => {
			(e.key === "Enter" || e.key === " ") && !f && (e.preventDefault(), e.stopPropagation(), o(e));
		},
		style: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			width: x.icon,
			height: x.icon,
			marginRight: s === "right" ? -2 : 0,
			marginLeft: s === "left" ? -2 : 0,
			padding: 0,
			border: "none",
			background: "none",
			color: "inherit",
			opacity: .7,
			cursor: "pointer",
			flexShrink: 0
		},
		children: /* @__PURE__ */ h(ze, { size: x.icon - 2 })
	});
	return /* @__PURE__ */ g("span", {
		..._,
		ref: v,
		role: c ? "button" : void 0,
		tabIndex: C ? 0 : void 0,
		"aria-pressed": c && l ? !0 : void 0,
		"aria-disabled": c && f ? !0 : void 0,
		"data-selected": l ? "" : void 0,
		"data-disabled": f ? "" : void 0,
		onClick: f ? void 0 : E,
		className: [
			Re.root,
			w && Re.interactive,
			p
		].filter(Boolean).join(" ") || void 0,
		style: {
			display: "inline-flex",
			alignItems: "center",
			verticalAlign: "middle",
			gap: x.gap,
			height: x.height,
			padding: `0 ${x.padX}px`,
			borderRadius: S ?? "var(--tesseract-radius-10)",
			cornerShape: "round",
			fontSize: x.font,
			fontWeight: "var(--tesseract-weight-medium)",
			fontFamily: "var(--tesseract-font-body)",
			lineHeight: 1,
			...O,
			...k,
			cursor: C ? "pointer" : "default",
			opacity: f ? .5 : 1,
			whiteSpace: "nowrap",
			userSelect: "none",
			...m
		},
		children: [
			s === "left" && A,
			i && /* @__PURE__ */ h("span", {
				style: {
					display: "inline-flex",
					flexShrink: 0
				},
				children: i
			}),
			/* @__PURE__ */ h("span", {
				style: {
					overflow: "hidden",
					textOverflow: "ellipsis"
				},
				children: e
			}),
			a && /* @__PURE__ */ h("span", {
				style: {
					display: "inline-flex",
					flexShrink: 0
				},
				children: a
			}),
			s === "right" && A
		]
	});
});
Ue.displayName = "TPChip";
var We = {
	wrap: "_wrap_1qj8s_1",
	fullWidth: "_fullWidth_1qj8s_24",
	label: "_label_1qj8s_49",
	required: "_required_1qj8s_59",
	fieldRow: "_fieldRow_1qj8s_63",
	input: "_input_1qj8s_114",
	textarea: "_textarea_1qj8s_220",
	inputWrap: "_inputWrap_1qj8s_235",
	iconLeft: "_iconLeft_1qj8s_246",
	trailing: "_trailing_1qj8s_249",
	tagChip: "_tagChip_1qj8s_253",
	iconRight: "_iconRight_1qj8s_299",
	action: "_action_1qj8s_327",
	unit: "_unit_1qj8s_337",
	statusIcon: "_statusIcon_1qj8s_346",
	clear: "_clear_1qj8s_360",
	loader: "_loader_1qj8s_389",
	addonLeft: "_addonLeft_1qj8s_394",
	addonRight: "_addonRight_1qj8s_395",
	addonText: "_addonText_1qj8s_419",
	addonSelect: "_addonSelect_1qj8s_428",
	addonSelectControl: "_addonSelectControl_1qj8s_435",
	addonChevron: "_addonChevron_1qj8s_450",
	addonButton: "_addonButton_1qj8s_457",
	addonButtonLabel: "_addonButtonLabel_1qj8s_481",
	stepBtn: "_stepBtn_1qj8s_485",
	footer: "_footer_1qj8s_519",
	helper: "_helper_1qj8s_527",
	count: "_count_1qj8s_548"
}, Ge = {
	sm: 16,
	md: 18,
	lg: 20
}, Ke = {
	success: "tick-circle",
	error: "danger",
	warning: "warning"
}, qe = {
	numeric: {
		re: /[^0-9]/g,
		inputMode: "numeric"
	},
	alpha: {
		re: /[^a-zA-Z\s]/g,
		inputMode: "text"
	},
	alphanumeric: {
		re: /[^a-zA-Z0-9\s]/g,
		inputMode: "text"
	}
};
function Je(e, t) {
	Object.getOwnPropertyDescriptor(Object.getPrototypeOf(e), "value")?.set?.call(e, t);
}
function Ye({ options: e = [], value: t, defaultValue: n, onChange: r, ariaLabel: i, placeholder: a }) {
	return /* @__PURE__ */ g("span", {
		className: We.addonSelect,
		children: [/* @__PURE__ */ g("select", {
			className: We.addonSelectControl,
			"aria-label": i,
			value: t,
			defaultValue: n,
			onChange: r,
			children: [a && /* @__PURE__ */ h("option", {
				value: "",
				disabled: !0,
				children: a
			}), e.map((e) => {
				let t = typeof e == "object" ? e : {
					value: e,
					label: e
				};
				return /* @__PURE__ */ h("option", {
					value: t.value ?? t.label,
					children: t.label ?? t.value
				}, t.value ?? t.label);
			})]
		}), /* @__PURE__ */ h(z, {
			name: "arrow-down",
			size: 14,
			className: We.addonChevron,
			"aria-hidden": !0
		})]
	});
}
function Xe({ label: e, icon: t, iconVariant: n = "linear", onClick: r, ariaLabel: i, disabled: a }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: We.addonButton,
		onClick: r,
		"aria-label": i || (typeof e == "string" ? e : void 0),
		disabled: a,
		children: [t && (typeof t == "string" ? /* @__PURE__ */ h(z, {
			name: t,
			variant: n,
			size: 16,
			"aria-hidden": !0
		}) : t), e && /* @__PURE__ */ h("span", {
			className: We.addonButtonLabel,
			children: e
		})]
	});
}
function Ze(e) {
	return e == null || e === !1 ? null : r(e) ? e : typeof e == "string" || typeof e == "number" ? /* @__PURE__ */ h("span", {
		className: We.addonText,
		children: e
	}) : typeof e == "object" ? e.type === "select" ? /* @__PURE__ */ h(Ye, { ...e }) : e.type === "button" ? /* @__PURE__ */ h(Xe, { ...e }) : /* @__PURE__ */ h("span", {
		className: We.addonText,
		children: e.content ?? e.label
	}) : null;
}
var Qe = n(function({ size: e = "md", status: t = "default", variant: n = "default", surface: r = "default", allow: i = "any", label: a, helperText: s, leftIcon: c, rightIcon: l, leftAddon: f, rightAddon: p, unit: m, counter: _ = !1, clearable: v = !1, loading: y = !1, showCount: b = !1, fullWidth: x = !1, disabled: S = !1, readOnly: C = !1, radius: w, statusIcon: T, tags: E, onRemoveTag: O, tagsScroll: k = !1, action: A, minWidth: j, maxWidth: M, height: N, autoGrow: P = !1, maxHeight: F, type: I, id: L, className: ee = "", onChange: te, value: ne, defaultValue: R, maxLength: B, ...re }, V) {
	let ie = o(), ae = L ?? ie, oe = u(null), H = F == null ? null : typeof F == "number" ? F : parseInt(F, 10), se = (e) => {
		if (!e || !P) return;
		e.style.height = "auto";
		let t = e.scrollHeight;
		H != null && (e.style.overflowY = t > H ? "auto" : "hidden", t = Math.min(t, H)), e.style.height = `${t}px`;
	}, ce = (e) => {
		oe.current = e, se(e), typeof V == "function" ? V(e) : V && (V.current = e);
	}, le = String(ne ?? R ?? ""), [ue, U] = d(!!le), [de, fe] = d(le.length), pe = i === "any" ? null : qe[i], G = () => oe.current?.stepUp(), me = () => oe.current?.stepDown();
	function he(e) {
		if (pe) {
			let t = e.target.value.replace(pe.re, "");
			if (t !== e.target.value) {
				let n = e.target, r = n.value.length - t.length, i = Math.max(0, (n.selectionStart ?? t.length) - r);
				n.value = t;
				try {
					n.setSelectionRange(i, i);
				} catch {}
			}
		}
		U(!!e.target.value), fe(e.target.value.length), se(e.target), te?.(e);
	}
	function ge() {
		let e = oe.current;
		e && (Je(e, ""), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.focus(), U(!1), fe(0));
	}
	let K = [
		We.wrap,
		x ? We.fullWidth : "",
		ee
	].filter(Boolean).join(" "), _e = v && ue && !S && !C && !y, ve = t !== "default" && !y, ye = !!(m || _e || l || ve || y || A), be = !!(s || b), xe = Array.isArray(E) && E.length > 0, Se = s ? `${ae}-helper` : void 0, q = re["aria-describedby"] ?? Se, Ce = W(w), we = N == null ? null : typeof N == "number" ? `${N}px` : N, Te = j != null || M != null || Ce != null || we != null ? {
		...j == null ? null : { minWidth: j },
		...M == null ? null : { maxWidth: M },
		...Ce == null ? null : { "--tesseract-input-radius": Ce },
		...we == null ? null : { "--input-height": we }
	} : void 0;
	return /* @__PURE__ */ g("div", {
		className: K,
		"data-size": e,
		"data-variant": n === "default" ? void 0 : n,
		"data-surface": r === "default" ? void 0 : r,
		"data-status": t === "default" ? void 0 : t,
		"data-disabled": S || void 0,
		"data-readonly": C || void 0,
		"data-autogrow": P || void 0,
		style: Te,
		children: [
			a && /* @__PURE__ */ g("label", {
				htmlFor: ae,
				className: We.label,
				children: [a, re.required && /* @__PURE__ */ h("span", {
					className: We.required,
					"aria-hidden": !0,
					children: "*"
				})]
			}),
			/* @__PURE__ */ g("div", {
				className: We.fieldRow,
				"data-tags": xe ? k ? "scroll" : "wrap" : void 0,
				children: [
					f && /* @__PURE__ */ h("div", {
						className: We.addonLeft,
						children: Ze(f)
					}),
					_ && /* @__PURE__ */ h("button", {
						type: "button",
						className: We.stepBtn,
						onClick: me,
						disabled: S,
						"aria-label": "Decrease",
						tabIndex: -1,
						children: /* @__PURE__ */ h(z, {
							name: "minus",
							size: 14,
							"aria-hidden": !0
						})
					}),
					/* @__PURE__ */ g("div", {
						className: We.inputWrap,
						children: [
							c && /* @__PURE__ */ h("span", {
								className: We.iconLeft,
								"aria-hidden": !0,
								children: c
							}),
							xe && E.map((e) => /* @__PURE__ */ h(Ue, {
								size: "sm",
								color: e.color ?? "primary",
								variant: e.variant ?? "filled",
								icon: e.icon,
								label: e.label,
								onDelete: O && !S && !C ? () => O(e.id ?? e.label) : void 0,
								className: We.tagChip
							}, e.id ?? e.label)),
							P ? /* @__PURE__ */ h("textarea", {
								ref: ce,
								id: ae,
								rows: 1,
								className: `${We.input} ${We.textarea}`,
								disabled: S,
								readOnly: C,
								onChange: he,
								value: ne,
								defaultValue: R,
								maxLength: B,
								inputMode: pe?.inputMode,
								"aria-invalid": t === "error" || void 0,
								"aria-describedby": q,
								...re
							}) : /* @__PURE__ */ h("input", {
								ref: ce,
								id: ae,
								type: I,
								className: We.input,
								disabled: S,
								readOnly: C,
								onChange: he,
								value: ne,
								defaultValue: R,
								maxLength: B,
								inputMode: pe?.inputMode,
								"aria-invalid": t === "error" || void 0,
								"aria-describedby": q,
								...re
							}),
							ye && /* @__PURE__ */ g("span", {
								className: We.trailing,
								children: [
									m && /* @__PURE__ */ h("span", {
										className: We.unit,
										children: m
									}),
									_e && /* @__PURE__ */ h("button", {
										type: "button",
										className: We.clear,
										onClick: ge,
										"aria-label": "Clear",
										tabIndex: -1,
										children: /* @__PURE__ */ h(z, {
											name: "close-square",
											variant: "bold",
											size: 12,
											"aria-hidden": !0
										})
									}),
									l && /* @__PURE__ */ h("span", {
										className: We.iconRight,
										"aria-hidden": !0,
										children: l
									}),
									y && /* @__PURE__ */ h(D, {
										type: "line-simple",
										size: Ge[e] ?? 18,
										className: We.loader
									}),
									ve && /* @__PURE__ */ h("span", {
										className: We.statusIcon,
										"aria-hidden": !0,
										children: T == null ? Ke[t] && /* @__PURE__ */ h(z, {
											name: Ke[t],
											size: 18,
											"aria-hidden": !0
										}) : typeof T == "string" ? /* @__PURE__ */ h(z, {
											name: T,
											size: 18,
											"aria-hidden": !0
										}) : T
									}),
									A && /* @__PURE__ */ h("span", {
										className: We.action,
										children: A
									})
								]
							})
						]
					}),
					_ && /* @__PURE__ */ h("button", {
						type: "button",
						className: We.stepBtn,
						onClick: G,
						disabled: S,
						"aria-label": "Increase",
						tabIndex: -1,
						children: /* @__PURE__ */ h(z, {
							name: "add",
							size: 14,
							"aria-hidden": !0
						})
					}),
					p && /* @__PURE__ */ h("div", {
						className: We.addonRight,
						children: Ze(p)
					})
				]
			}),
			be && /* @__PURE__ */ g("div", {
				className: We.footer,
				children: [s && /* @__PURE__ */ g("span", {
					id: Se,
					className: We.helper,
					role: t === "error" ? "alert" : void 0,
					children: [
						t === "error" && /* @__PURE__ */ h(z, {
							name: Ke.error,
							size: 13,
							"aria-hidden": !0
						}),
						t === "warning" && /* @__PURE__ */ h(z, {
							name: Ke.warning,
							size: 13,
							"aria-hidden": !0
						}),
						s
					]
				}), b && /* @__PURE__ */ h("span", {
					className: We.count,
					"data-over": B != null && de > B ? "true" : void 0,
					children: B == null ? de : `${de}/${B}`
				})]
			})
		]
	});
});
Qe.displayName = "InputBox";
var $e = {
	root: "_root_1lsey_3",
	cell: "_cell_1lsey_29",
	separator: "_separator_1lsey_35",
	box: "_box_1lsey_41"
}, et = n(function({ length: e = 6, value: t, defaultValue: n = "", onChange: r, onComplete: i, allow: a = "numeric", size: s = "md", status: c = "default", mask: f = !1, separator: p = "-", groupSize: m, radius: _, disabled: v = !1, autoFocus: y = !1, inputMode: b, ariaLabel: x = "Verification code", className: S, ...C }, w) {
	let T = t != null, [E, D] = d(() => n.slice(0, e)), O = (T ? t : E).slice(0, e), k = u([]), A = o(), j = l(() => a === "numeric" ? /[^0-9]/g : a === "alphanumeric" ? /[^a-zA-Z0-9]/g : null, [a]), M = (e) => j ? e.replace(j, "") : e, N = (t) => {
		let n = t.slice(0, e);
		T || D(n), r?.(n), n.length === e && t.length >= e && i?.(n);
	}, P = (t) => {
		let n = k.current[Math.max(0, Math.min(e - 1, t))];
		n?.focus(), n?.select?.();
	}, F = (t, n) => {
		let r = O.padEnd(e, " ").split("");
		return r[t] = n || " ", r.join("").replace(/ +$/g, "");
	}, I = (t) => (n) => {
		let r = M(n.target.value);
		if (!r) return;
		let i = r[r.length - 1];
		N(F(t, i)), t < e - 1 && P(t + 1);
	}, L = (e) => (t) => {
		t.key === "Backspace" ? (t.preventDefault(), O[e] ? N(F(e, "")) : e > 0 && (N(F(e - 1, "")), P(e - 1))) : t.key === "ArrowLeft" ? (t.preventDefault(), P(e - 1)) : t.key === "ArrowRight" ? (t.preventDefault(), P(e + 1)) : t.key === "Delete" && (t.preventDefault(), N(F(e, "")));
	}, ee = (t) => (n) => {
		n.preventDefault();
		let r = M(n.clipboardData.getData("text"));
		if (!r) return;
		let i = O.padEnd(e, " ").split("");
		for (let n = 0; n < r.length && t + n < e; n++) i[t + n] = r[n];
		N(i.join("").replace(/ +$/g, "")), P(Math.min(t + r.length, e - 1));
	}, te = b || (a === "numeric" ? "numeric" : "text"), ne = _ == null ? void 0 : { "--otp-radius": W(_) };
	return /* @__PURE__ */ h("div", {
		ref: w,
		role: "group",
		"aria-label": x,
		"data-size": s,
		"data-status": c,
		"data-disabled": v || void 0,
		className: U($e.root, S),
		style: ne,
		...C,
		children: Array.from({ length: e }).map((e, t) => {
			let n = m && t > 0 && t % m === 0;
			return /* @__PURE__ */ g("span", {
				className: $e.cell,
				children: [n ? /* @__PURE__ */ h("span", {
					"aria-hidden": "true",
					className: $e.separator,
					children: p
				}) : null, /* @__PURE__ */ h("input", {
					ref: (e) => {
						k.current[t] = e;
					},
					className: $e.box,
					type: f ? "password" : "text",
					inputMode: te,
					autoComplete: t === 0 ? "one-time-code" : "off",
					maxLength: 1,
					disabled: v,
					autoFocus: y && t === 0,
					"aria-label": `${x} digit ${t + 1}`,
					value: O[t] || "",
					onChange: I(t),
					onKeyDown: L(t),
					onPaste: ee(t),
					onFocus: (e) => e.target.select()
				})]
			}, `${A}-${t}`);
		})
	});
});
et.displayName = "InputOTP";
var tt = {
	root: "_root_iozj1_3",
	field: "_field_iozj1_115",
	labelText: "_labelText_iozj1_132",
	labelTitle: "_labelTitle_iozj1_138",
	labelDescription: "_labelDescription_iozj1_144",
	indicator: "_indicator_iozj1_150"
}, nt = (e) => e === "indeterminate", rt = e.forwardRef(function({ checked: t, defaultChecked: n, onCheckedChange: r, disabled: i, required: a, name: o, value: s = "on", size: c = "md", color: l = "primary", error: u = !1, label: d, description: f, labelPosition: p = "right", "aria-label": m, className: _ = "", style: v, onClick: y, onKeyDown: b, id: x, ...S }, C) {
	let w = t !== void 0, [T, E] = e.useState(!!n), D = w ? t : T, O = nt(D) ? !1 : !!D, k = nt(D) ? "indeterminate" : O ? "checked" : "unchecked", A = e.useCallback((e) => {
		if (i) return;
		let t = nt(D) ? !0 : !O;
		w || E(t), r?.(t, e);
	}, [
		i,
		D,
		O,
		w,
		r
	]), j = (e) => {
		y?.(e), !e.defaultPrevented && A(e);
	}, M = (e) => {
		b?.(e), !e.defaultPrevented && e.key === " " && (e.preventDefault(), A(e));
	}, N = [tt.root, _].filter(Boolean).join(" "), P = d != null || f != null, F = e.useId(), I = d == null ? void 0 : `${F}-label`, L = f == null ? void 0 : `${F}-desc`, ee = /* @__PURE__ */ g("button", {
		type: "button",
		role: "checkbox",
		"aria-checked": nt(D) ? "mixed" : O,
		"aria-required": a || void 0,
		"aria-invalid": u || void 0,
		"aria-labelledby": P ? I : void 0,
		"aria-describedby": P ? L : void 0,
		"aria-label": P ? void 0 : m,
		"data-slot": "checkbox",
		"data-state": k,
		"data-size": c,
		"data-color": l,
		"data-error": u || void 0,
		"data-disabled": i || void 0,
		disabled: i,
		ref: C,
		id: P ? void 0 : x,
		className: N,
		style: P ? void 0 : v,
		onClick: j,
		onKeyDown: M,
		...P ? {} : S,
		children: [(O || nt(D)) && /* @__PURE__ */ h("span", {
			className: tt.indicator,
			children: nt(D) ? /* @__PURE__ */ h("svg", {
				width: "12",
				height: "12",
				viewBox: "0 0 12 12",
				fill: "none",
				children: /* @__PURE__ */ h("path", {
					d: "M2.5 6H9.5",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round"
				})
			}) : /* @__PURE__ */ h("svg", {
				width: "12",
				height: "12",
				viewBox: "0 0 12 12",
				fill: "none",
				children: /* @__PURE__ */ h("path", {
					d: "M2.5 6L5 8.5L9.5 3.5",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})
		}), o ? /* @__PURE__ */ h("input", {
			type: "checkbox",
			"aria-hidden": "true",
			tabIndex: -1,
			name: o,
			value: s,
			checked: O,
			required: a,
			disabled: i,
			onChange: () => {},
			style: {
				position: "absolute",
				inset: 0,
				opacity: 0,
				margin: 0,
				pointerEvents: "none"
			}
		}) : null]
	});
	return P ? /* @__PURE__ */ g("label", {
		className: [tt.field, _].filter(Boolean).join(" "),
		"data-position": p,
		"data-disabled": i || void 0,
		id: x,
		style: v,
		...S,
		children: [ee, /* @__PURE__ */ g("span", {
			className: tt.labelText,
			children: [d != null && /* @__PURE__ */ h("span", {
				id: I,
				className: tt.labelTitle,
				children: d
			}), f != null && /* @__PURE__ */ h("span", {
				id: L,
				className: tt.labelDescription,
				children: f
			})]
		})]
	}) : ee;
});
rt.displayName = "Checkbox";
var it = {
	root: "_root_1liyu_3",
	thumb: "_thumb_1liyu_73",
	field: "_field_1liyu_118",
	label: "_label_1liyu_134"
}, at = e.forwardRef(function({ size: t = "md", shape: n = "rounded", color: r = "primary", label: i, ariaLabel: a, labelPosition: o = "right", checked: s, defaultChecked: c, onCheckedChange: l, disabled: u, required: d, name: f, value: p = "on", className: m = "", style: _, onClick: v, onKeyDown: y, track: b, ...x }, S) {
	let C = s !== void 0, [w, T] = e.useState(!!c), E = C ? !!s : w, { track: D } = H(), O = e.useCallback((e) => {
		if (u) return;
		let t = !E;
		C || T(t);
		let n = se(b);
		n && D({
			component: "Toggle",
			action: "toggle",
			value: t,
			...n
		}), l?.(t, e);
	}, [
		u,
		E,
		C,
		l,
		b,
		D
	]), k = (e) => {
		v?.(e), !e.defaultPrevented && O(e);
	}, A = (e) => {
		y?.(e), !e.defaultPrevented && (e.key === " " || e.key === "Enter") && (e.preventDefault(), O(e));
	}, j = [it.root, m].filter(Boolean).join(" "), M = /* @__PURE__ */ g("button", {
		type: "button",
		role: "switch",
		"aria-label": a ?? (i == null ? "Toggle" : void 0),
		"aria-checked": E,
		"aria-required": d || void 0,
		"data-slot": "switch",
		"data-state": E ? "checked" : "unchecked",
		"data-size": t,
		"data-shape": n,
		"data-color": r,
		"data-disabled": u || void 0,
		disabled: u,
		ref: S,
		className: j,
		style: i == null ? _ : void 0,
		onClick: k,
		onKeyDown: A,
		...x,
		children: [/* @__PURE__ */ h("span", { className: it.thumb }), f ? /* @__PURE__ */ h("input", {
			type: "checkbox",
			"aria-hidden": "true",
			tabIndex: -1,
			name: f,
			value: p,
			checked: E,
			required: d,
			disabled: u,
			onChange: () => {},
			style: {
				position: "absolute",
				inset: 0,
				opacity: 0,
				margin: 0,
				pointerEvents: "none"
			}
		}) : null]
	});
	return i == null ? M : /* @__PURE__ */ g("label", {
		className: it.field,
		"data-disabled": u || void 0,
		"data-label-position": o,
		style: _,
		children: [
			o === "left" ? /* @__PURE__ */ h("span", {
				className: it.label,
				children: i
			}) : null,
			M,
			o === "right" ? /* @__PURE__ */ h("span", {
				className: it.label,
				children: i
			}) : null
		]
	});
});
at.displayName = "Toggle";
var ot = {
	root: "_root_a33tb_7",
	box: "_box_a33tb_19",
	input: "_input_a33tb_27",
	dot: "_dot_a33tb_57"
}, st = (...e) => e.filter(Boolean).join(" "), ct = t({
	value: void 0,
	onChange: void 0,
	name: void 0,
	size: void 0,
	color: void 0,
	error: void 0
}), lt = {
	primary: "var(--tesseract-blue-500)",
	success: "var(--tesseract-success-500)",
	error: "var(--tesseract-error-500)",
	warning: "var(--tesseract-warning-500)"
}, ut = e.forwardRef(function({ value: e, onChange: t, name: n, size: r, color: i = "primary", error: a = !1, orientation: o = "vertical", gap: s, children: c, style: l, className: u, ...d }, f) {
	let p = o === "horizontal", m = s ?? (p ? "var(--tesseract-space-5)" : "var(--tesseract-space-2)");
	return /* @__PURE__ */ h(ct.Provider, {
		value: {
			value: e,
			onChange: t,
			name: n,
			size: r,
			color: i,
			error: a
		},
		children: /* @__PURE__ */ h("div", {
			ref: f,
			role: "radiogroup",
			"aria-invalid": a || void 0,
			className: st(ot.root, u),
			style: {
				display: "flex",
				flexDirection: p ? "row" : "column",
				gap: m,
				flexWrap: p ? "wrap" : void 0,
				...l
			},
			...d,
			children: c
		})
	});
}), dt = {
	sm: {
		box: "var(--tesseract-size-14)",
		font: "var(--tesseract-text-body-xs)"
	},
	md: {
		box: "var(--tesseract-size-16)",
		font: "var(--tesseract-text-body-sm)"
	},
	lg: {
		box: "var(--tesseract-size-18)",
		font: "var(--tesseract-text-body-base)"
	}
}, ft = e.forwardRef(function({ value: e, label: t, description: n, checked: r, disabled: a, size: o, color: s, name: c, onChange: l, className: u, style: d, "aria-label": f, ...p }, m) {
	let _ = i(ct), v = r === void 0 ? _.value === e : r, y = dt[o ?? _.size ?? "md"] ?? dt.md, b = _.error === !0, x = s ?? _.color ?? "primary", S = b ? lt.error : lt[x] ?? lt.primary, C = (t) => {
		l?.(t), _.onChange?.(e);
	}, w = b ? "var(--tesseract-error-700)" : "var(--tesseract-slate-700)";
	return /* @__PURE__ */ g("label", {
		ref: m,
		className: st(ot.root, u),
		...p,
		style: {
			display: "inline-flex",
			alignItems: n == null ? "center" : "flex-start",
			gap: t != null || n != null ? "var(--tesseract-space-2)" : 0,
			cursor: a ? "not-allowed" : "pointer",
			opacity: a ? .5 : 1,
			fontSize: y.font,
			color: w,
			userSelect: "none",
			...d
		},
		children: [/* @__PURE__ */ g("span", {
			className: ot.box,
			style: {
				"--radio-accent": S,
				"--radio-size": y.box,
				marginTop: n == null ? 0 : "var(--tesseract-space-1)"
			},
			children: [/* @__PURE__ */ h("input", {
				type: "radio",
				className: ot.input,
				name: c ?? _.name,
				value: e,
				checked: v,
				disabled: a,
				onChange: C,
				"aria-label": f,
				"aria-invalid": b || void 0
			}), /* @__PURE__ */ h("span", {
				className: ot.dot,
				"aria-hidden": "true"
			})]
		}), n == null ? t : /* @__PURE__ */ g("span", {
			style: {
				display: "inline-flex",
				flexDirection: "column",
				gap: "var(--tesseract-space-1)"
			},
			children: [/* @__PURE__ */ h("span", { children: t }), /* @__PURE__ */ h("span", {
				style: {
					fontSize: "var(--tesseract-text-body-xs)",
					color: b ? "var(--tesseract-error-600)" : "var(--tesseract-fg-secondary)",
					lineHeight: 1.4
				},
				children: n
			})]
		})]
	});
}), pt = e.forwardRef(function({ control: e, label: t, className: n, style: r, ...i }, a) {
	return /* @__PURE__ */ g("label", {
		ref: a,
		className: st(ot.root, n),
		...i,
		style: {
			display: "inline-flex",
			alignItems: "center",
			gap: "var(--tesseract-space-2)",
			fontSize: "var(--tesseract-text-body-sm)",
			color: "var(--tesseract-slate-700)",
			cursor: "pointer",
			...r
		},
		children: [e, t]
	});
});
ut.displayName = "RadioGroup", ft.displayName = "Radio", pt.displayName = "FormControlLabel";
var mt = {
	field: "_field_1e7mx_5",
	header: "_header_1e7mx_17",
	label: "_label_1e7mx_24",
	value: "_value_1e7mx_30",
	input: "_input_1e7mx_38",
	marks: "_marks_1e7mx_181",
	mark: "_mark_1e7mx_181"
}, ht = {
	primary: "var(--tesseract-blue-500)",
	success: "var(--tesseract-success-500)",
	warning: "var(--tesseract-warning-500)",
	error: "var(--tesseract-error-500)"
};
function gt(e, t, n) {
	return e ? e === !0 ? [{
		value: t,
		label: String(t)
	}, {
		value: n,
		label: String(n)
	}] : Array.isArray(e) ? e : null : null;
}
var _t = n(function({ value: e, defaultValue: t, min: n = 0, max: r = 100, step: i = 1, onChange: a, disabled: o = !1, color: s = "primary", size: c = "md", error: l = !1, label: u, ariaLabel: d, showValue: f = !1, formatValue: p = (e) => e, marks: m = !1, className: _, style: v, ...y }, b) {
	let x = l ? ht.error : ht[s] ?? ht.primary, S = Number(e ?? t ?? n), C = r > n ? (S - n) / (r - n) * 100 : 0, w = gt(m, n, r), T = !u && !f && !w, E = /* @__PURE__ */ h("input", {
		ref: T ? b : void 0,
		type: "range",
		value: e,
		defaultValue: t,
		min: n,
		max: r,
		step: i,
		disabled: o,
		"aria-label": (typeof u == "string" && u ? u : d) || void 0,
		"data-size": c,
		"data-error": l || void 0,
		"data-disabled": o || void 0,
		onChange: a ? (e) => a(e, Number(e.target.value)) : void 0,
		className: U(mt.input, T && _),
		style: {
			"--slider-fill": x,
			"--slider-pct": `${C}%`,
			...T ? v : null
		},
		...T ? y : null
	});
	return T ? E : /* @__PURE__ */ g("div", {
		ref: b,
		className: U(mt.field, _),
		style: {
			"--slider-fill": x,
			...v
		},
		...y,
		children: [
			(u || f) && /* @__PURE__ */ g("div", {
				className: mt.header,
				children: [u ? /* @__PURE__ */ h("span", {
					className: mt.label,
					children: u
				}) : /* @__PURE__ */ h("span", {}), f && /* @__PURE__ */ h("span", {
					className: mt.value,
					children: p(S)
				})]
			}),
			E,
			w && /* @__PURE__ */ h("div", {
				className: mt.marks,
				children: w.map((e, t) => /* @__PURE__ */ h("span", {
					className: mt.mark,
					children: e.label ?? e.value
				}, `${e.value}-${t}`))
			})
		]
	});
});
_t.displayName = "Slider";
var vt = {
	root: "_root_x3b4o_2",
	fullWidth: "_fullWidth_x3b4o_46",
	indicator: "_indicator_x3b4o_51",
	item: "_item_x3b4o_95",
	icon: "_icon_x3b4o_153",
	label: "_label_x3b4o_159"
}, yt = e.forwardRef(function({ options: t = [], value: n, defaultValue: r, onValueChange: i, size: a = "md", variant: o = "pill", theme: s = "neutral", orientation: c = "horizontal", radius: l, indicatorColor: u, fullWidth: d = !1, disabled: f = !1, className: p = "", style: m, track: _, ...v }, y) {
	let b = c === "vertical", x = n !== void 0, [S, C] = e.useState(r ?? (t.length > 0 ? t[0].value : void 0)), w = x ? n : S, T = e.useRef(null), E = e.useRef({}), [D, O] = e.useState({
		left: 0,
		top: 0,
		width: 0,
		height: 0
	}), [k, A] = e.useState(!1), { track: j } = H(), M = e.useCallback(() => {
		let e = T.current, t = E.current[w];
		if (!e || !t) return;
		let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
		O({
			left: r.left - n.left,
			top: r.top - n.top,
			width: r.width,
			height: r.height
		}), A(!0);
	}, [w]);
	e.useEffect(() => {
		M();
	}, [
		M,
		t.length,
		c
	]), e.useEffect(() => {
		let e = T.current;
		if (!e) return;
		let t = new ResizeObserver(M);
		return t.observe(e), () => t.disconnect();
	}, [M]);
	let N = (e, t) => {
		if (f || e === w) return;
		x || C(e);
		let n = se(_);
		n && j({
			component: "SegmentedControl",
			action: "select",
			value: e,
			...n
		}), i?.(e, t);
	}, P = (e, t) => {
		(t.key === " " || t.key === "Enter") && (t.preventDefault(), N(e, t));
	}, F = [
		vt.root,
		d && vt.fullWidth,
		p
	].filter(Boolean).join(" "), I = W(l), L = {
		...I == null ? null : { "--tesseract-sc-radius": I },
		...u ? { "--tesseract-sc-indicator": u } : null,
		...m
	};
	return /* @__PURE__ */ g("div", {
		ref: (e) => {
			T.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
		},
		role: "radiogroup",
		"data-size": a,
		"data-variant": o,
		"data-theme": s,
		"data-orientation": c,
		"data-disabled": f || void 0,
		className: F,
		style: L,
		...v,
		children: [k && /* @__PURE__ */ h("span", {
			className: vt.indicator,
			"aria-hidden": "true",
			style: b ? {
				transform: `translateY(${D.top}px)`,
				height: D.height
			} : {
				transform: `translateX(${D.left}px)`,
				width: D.width
			}
		}), t.map((e) => {
			let t = e.value === w;
			return /* @__PURE__ */ g("button", {
				ref: (t) => {
					E.current[e.value] = t;
				},
				type: "button",
				role: "radio",
				"aria-checked": t,
				"data-state": t ? "active" : "inactive",
				disabled: f || e.disabled,
				className: vt.item,
				onClick: (t) => N(e.value, t),
				onKeyDown: (t) => P(e.value, t),
				children: [e.icon && /* @__PURE__ */ h("span", {
					className: vt.icon,
					children: e.icon
				}), /* @__PURE__ */ h("span", {
					className: vt.label,
					children: e.label
				})]
			}, e.value);
		})]
	});
});
yt.displayName = "SegmentedControl";
//#endregion
//#region src/components/atoms/icons/tp/TPIcon.jsx
function bt(e) {
	return /* @__PURE__ */ h(z, { ...e });
}
bt.displayName = "TPIcon";
//#endregion
//#region src/components/atoms/icons/tp/constants.js
var xt = [
	"linear",
	"bulk",
	"bold"
], St = /* @__PURE__ */ "plus.verify.chevron-down.chevron-up.chevron-left.chevron-right.search.close.close-circle.eye.edit.trash.more.more-horizontal.success.warning.error.filter.printer.document.profile.settings.refresh.copy.menu.call.clipboard.health.heart.calendar.folder.message.ambulance.hospital.download.sort.notification.send".split("."), Ct = /* @__PURE__ */ "!,0,0-second-back,1,1-way-data,1-way-data-2,1-way-data-3,10-second-back,1chef-hat,1video,2,2-way-lock,24-hour,24-support,2d,2k,3,3-dots-circle,3-dots-more,3-dots-square,360-view,365-arrow,3d,3d-2,3d-cube-scan,3d-rotate,3d-square,3d-video,3d-video2,3dcube,3k,3square,4,4d,4g-internet,4k,5,5-second-back,5g-internet,6,7,8,904026076031,96ac0ff1b35e,a,aave-aave,activity,ad,add,add-alarm,add-basket,add-card,add-circle,add-cloud,add-cloud-2,add-code,add-code-2,add-component,add-contact,add-data,add-effect,add-exposure,add-file,add-frame,add-home,add-home-2,add-item,add-protection,add-prototype,add-protoype,add-receipt,add-server,add-shop,add-sign,add-square,add-text,add-trash,addalarm,addmusic,adult-content,ai-3d,ai-3d-box,ai-3d-square,ai-4k,ai-ac,ai-add,ai-antenna,ai-archive,ai-assist,ai-audio,ai-bag,ai-barcode,ai-book,ai-bookmark,ai-box,ai-brush,ai-business-chart,ai-calendar,ai-call,ai-camera,ai-card,ai-cash,ai-cashworld,ai-cctv,ai-cellphone,ai-chart,ai-chat,ai-chatbot,ai-chatbox,ai-chatting,ai-clipboard,ai-clock,ai-cloud,ai-cloud-bookmark,ai-cloud-connected,ai-cloud-server,ai-cloud-services,ai-code,ai-code-chat,ai-code-file,ai-coding,ai-columns,ai-commentary,ai-conversation,ai-copy,ai-cpu,ai-create,ai-create-document,ai-create-file,ai-creativity,ai-creativity2,ai-credit-card,ai-crop,ai-cube,ai-cut-scissors,ai-data-server,ai-database,ai-delivery,ai-desktop,ai-development,ai-dialogue,ai-direct-inbox,ai-directbox-receive,ai-discount,ai-discover,ai-document,ai-document-2,ai-document2,ai-drink,ai-driving,ai-email,ai-energy,ai-engine,ai-enhance,ai-export,ai-eye,ai-file,ai-file-ai,ai-filter,ai-fire,ai-flame,ai-flask,ai-folder,ai-folders,ai-frame-select,ai-ftp,ai-fuel-tank,ai-gaming,ai-gift,ai-global,ai-graphic,ai-grid,ai-hd,ai-headphone,ai-headset,ai-heart,ai-heart-square,ai-hexagon,ai-home,ai-homepage,ai-hospital,ai-hourglass,ai-house,ai-housing,ai-idea,ai-image,ai-image-generation,ai-inbox,ai-insight,ai-instance,ai-javascript,ai-key,ai-lamp,ai-landscape,ai-laptop,ai-layout,ai-learning,ai-library,ai-like,ai-list,ai-location,ai-lock,ai-loveletter,ai-magic-hat,ai-mail,ai-map,ai-message,ai-message-add,ai-metrics,ai-microphone,ai-mobile,ai-mobile-cloud,ai-monitor,ai-mouse-circle,ai-mouse-square,ai-music,ai-music-file,ai-network,ai-network-dollar,ai-note,ai-note-generator,ai-notepad,ai-open-book,ai-open-book2,ai-organize,ai-paint-brush,ai-paintroller,ai-path,ai-path-vector,ai-payment,ai-pen-edit,ai-pie-chart,ai-pin-location,ai-play-video,ai-pointer,ai-powered-support,ai-reading,ai-receipt,ai-record,ai-record-video,ai-return,ai-ruler-pencil,ai-sand-timer,ai-science,ai-screen,ai-search,ai-security,ai-send,ai-send-message,ai-server-users,ai-servers,ai-setting,ai-settings,ai-shape-triangle,ai-sheet,ai-shield,ai-shop,ai-shop-bag,ai-shopping-cart,ai-simcard,ai-smart-cpu,ai-smart-file,ai-smart-house,ai-smart-lock,ai-smart-notepad,ai-smart-pay,ai-smart-search,ai-smart-watch,ai-sparkle,ai-speaker,ai-storage,ai-strongbox,ai-support,ai-syringe,ai-tag-price,ai-terminal,ai-text,ai-text-generation,ai-text-generation2,ai-text-paragraph,ai-thinking,ai-time,ai-timer,ai-tools,ai-trash,ai-tv,ai-ui,ai-upload,ai-user,ai-users,ai-ux,ai-video,ai-video-create,ai-video-hexagon,ai-videocamera,ai-voice-memo,ai-voice-note,ai-vr,ai-wallet,ai-wallet-2,ai-wallet2,ai-water-cycle,ai-website,ai-weight,ai-world,ai-writing,air-conditioner,air-plane,air-play,airbnb,airbnb-2,airdrop,airplane,airplane-2,airplane-mode,airplane-square,airplane2,airplane3,airpod,airpods,airpods-case,airpods-case-2,airpods-pro,airpods-pro-2,airstrike,alarm,alarm-2,alien,alien2,alien3,align-bottom,align-horizontally,align-left,align-left-2,align-right,align-top,align-top-2,align-vertically,alrook-chess,ambulance,americansoccerball,ammo,ammo2,ampoule,ampoule-program,anal-beads,anal-beads2,anchor-point,anchor-point-2,and,android,angel,angel2,angle-connected,angle-grinder,angled-double-diagonal,angled-double-diagonal2,ankr-ankr,antenna,antenna2,anti-copyright,anti-copyright-2,anxiety,apartment,apartment-2,apartments,aperture,aperture-2,apeture,api-key,app-store,apple,approved-code,approved-code-2,apps-shapes,apron,aquarius,ar-view-see-through-device,ar-view-see-through-device2,ar-view-see-through-eye,ar-view-see-through-eye2,arcade,archery,archive,archive-add,archive-book,archive-minus,archive-slash,archive-tick,aries,arm,arm-muscle,armor,armored,arrow,arrow-back,arrow-circle-down,arrow-circle-left,arrow-circle-right,arrow-circle-up,arrow-diagonal,arrow-diagonal2,arrow-diagonal3,arrow-diagonal4,arrow-down,arrow-down-in-box,arrow-down2,arrow-down3,arrow-down4,arrow-down42,arrow-forward,arrow-horizontal,arrow-left,arrow-left-and-right,arrow-left-in-box,arrow-left2,arrow-left3,arrow-left4,arrow-left42,arrow-right,arrow-right-in-box,arrow-right2,arrow-right22,arrow-right3,arrow-right4,arrow-short-down,arrow-short-left,arrow-short-right,arrow-short-up,arrow-square,arrow-square-down,arrow-square-left,arrow-square-right,arrow-square-up,arrow-swap,arrow-swap2,arrow-swap3,arrow-to-line-down,arrow-to-line-up,arrow-transfer,arrow-transfer2,arrow-up,arrow-up-and-down,arrow-up-down,arrow-up-to-box,arrow-up2,arrow-up22,arrow-up3,arrow-up4,arrow-vertical,arrowed-heart,arrows,art,ascending-arrow,ascending-arrow2,ass,asset,asterisk,astronaut,atom,atom-2,atom-bomb,atsign,attach-circle,attach-file,attach-square,attached-basket,attached-cloud,attached-contact,attached-file,attached-mail,attached-mails,audio-square,augur-rep,auto-flash,autobrightness,autonio-niox,avalanche-avax,avatar,avatar2,avatar3,award,award-badge,award-badge2,award-badge3,award-badge4,award-badge5,award-badge6,award-medal,award-medal2,axe,axe2,b,b-circle,baby,baby-boy,baby-check,baby-girl,baby-girl2,baby2,baby3,back,backpack,backward,backward-10-seconds,backward-10-seconds-rewind-video-time-control-seek-backskip,backward-15-seconds,backward-5-seconds,backward-card,backward-contact,backward-dollar,backward-item,bag,bag-2,bag-cross,bag-cross-2,bag-happy,bag-tick,bag-tick-2,bag-timer,bag-wheel,ball,ball-toy,ball10,ball11,ball112,ball12,ball13,ball14,ball15,ball16,ball17,ball172,ball18,ball182,ball19,ball2,ball2.svg,ball20,ball202,ball21,ball212,ball22,ball222,ball23,ball232,ball24,ball242,ball25,ball252,ball26,ball262,ball27,ball272,ball28,ball3,ball4,ball5,ball6,ball7,ball8,ball9,ball92,balll,balloon,balloon-decoration-party-celebration-festival-air-filled-joy,balloon-decoration-party-event-festivity-celebration-air-filled,balloon-festival-party-celebration-colorful-decorative-inflatable,balloon-festive-party-celebration-decoration-inflate-colorful,balloon-festive-party-celebration-event-colorful-decoration,baloons,ban-nature,band-aids,bandage,bandage-02,bank,bank-2,bank-3,bank-type,bank-verify,bar,barcode,base,base-2,baseball,baseball-ball,baseball-bat,baseballball,baseballbat,basket,basketball,basketball-ball,basketballball,bat,bat2,bat3,bath,bathtub,batoids,battery-2bars,battery-charging,battery-disable,battery-empty,battery-empty-2,battery-full,bayby-check,be,beach,beach-bed,beach-umbrella,bear,bearish,beat,beat-2,beaver,bed,bed-2,beetle,behance,bell,bell2,bells,belt,bezier,bib,bicycle,bid-home,big-brush,bike,bill,binance-coin-bnb,binance-usd-busd,binary,binary-computer,binary-computer-2,binoculars,bio,bird,bird2,birds,bitcoin-btc,bitcoin-card,bitcoin-convert,bitcoin-refresh,blend,blend-2,blending,block-chain-ai,block-contact,blockchain,blockchain-glossary,blockchain-network,blocked-data,blocked-mail,blogger,blood,blood-3,bluetooth,bluetooth-2,bluetooth-circle,bluetooth-rectangle,blur,board,board2,boat,boat-fishing,boat2,boat3,boatriding,body-bag,bolt,bolt-nuts,bomb,bomb2,bomb3,bomb4,bone,book,book-open,book-saved,book-square,booked,booked-basket,booked-card,booked-contact,booked-file,booked-home,booked-home-2,booked-shop,booked-signal,booking-snow,bookmark,bookmark-2,bookmark-ai,bookmarked-cloud,books,boot,bootstrap,bottle,bottle-and-glass,bouquet,bow,bow-tie,bowling,bowling-2,bowling-ball,bowling-pin,bowling2,bowlingball,bowtie,box,box-2,box-add,box-remove,box-search,box-tick,box-time,boxing-claw,boxing-gloves,boxing-gloves2,boxing-gloves3,bradypus,brain,bread,break,break-bone,brewed-coffe,bride,briefcase,brifecase-cross,brifecase-tick,brifecase-timer,brightness,brightness2,brightness3,broadcast-mail,brodcast-mail,broken-bone,broken-condom,broken-heart,broom,brush,brush-2,brush-3,brush-makeup,brush-square,bubble,bucket,bucket-circle,bucket-square,bug,bug2,building,building-2,building-3,building-4,buildings,buildings-2,buildings-3,bulb,bulldozer,bullish,bus,bus-2,buscircle,butt-plug,butt-plug2,butterfly,button,button-bomb,buy-crypto,buy-house,c,c+,c++,c+-2,cabbage,cable,cactus,cactus-2,cake,cake2,calculator,calendar,calendar-2,calendar-add,calendar-christmas,calendar-circle,calendar-date,calendar-edit,calendar-love,calendar-remove,calendar-search,calendar-tick,calendar-tree,calendar2,calendar3,calendar4,calibration,call,call-add,call-calling,call-hospital,call-incoming,call-minus,call-outgoing,call-received,call-remove,call-slash,callenderremove-date-calendar,cambodia,camera,camera-2,camera-3,camera-from-top,camera-preview,camera-refresh,camera-slash,camera-switch,camera-switch-front,canceled,canceled-signal,cancer,candle,candle-2,candom,candom2,candom3,candom4,candom5,candy,candy-cane,candy-cane2,candy-cane3,candy-cane32,candy-cane4,candy-cane42,candy2,candy3,candy4,cannon,cant-receive-mail,cap,cap-2,capa,capsule,capsule-3,captions,captions-2,captions-unavailable,captions-unavailable-2,captions-unavailable-3,car,car-ac,car-battery,car-door,car-door-square,car-lever,car-light,car-light-square,car-low-light,car-low-light-square,card,card-add,card-code,card-coin,card-coins,card-detail,card-edit,card-pos,card-reader,card-receive,card-refresh,card-remove,card-remove-2,card-send,card-slash,card-star,card-star-2,card-symbols,card-tick,card-tick-2,card-time,card-to-left,card-to-right,cardano-ada,cardio,cardio2,cardiogram,cards,cards-2,cards-clubs,cards-diamond,cards-heart,cards-spade,care,carrot,cart-change,cash,cash-desk,cash-left,cash-right,cash-safe,cash-world,cast-to-devices-phone,cast-to-devices-tv,castle,cat,cat2,cat3,cat4,categories-shape,category,category-2,cc,cctv,cd,cdwriter,celebration,celebration2,celebration3,celestial,cellular-data,celo-celo,celsius-cel,celsius-cel-,cencor,centipede,centralized,cesarean,chain,chainlink-link,chair,chair-10,chair-11,chair-12,chair-13,chair-2,chair-3,chair-4,chair-5,chair-6,chair-7,chair-8,chair-9,chair-lampshade,chair-table,change-card,change-currency,change-flash,change-heart,charging,chart,chart-2,chart-3,chart-4,chart-circle,chart-fail,chart-square,chart-square-2,chart-success,chartcircle-chart,chassis,chat,chatbot,chatbox,check,check-mark---tick,check-mark-in-box,checked,checked-basket,checked-circle,checked-figure,checked-file,checked-home,checked-home-2,checked-list,checked-mail,checked-receipt,checked-square,checked-task,checked-task-2,checklist,cheers,cheers-love,cheese,cheese2,chef-hat,cheque,cheque-2,chess,chess-ai,chess-bishop,chess-king,chess-knight,chess-pawn,chess-queen,chess-rook,china,china-2,china10,china102,china11,china112,china12,china122,china13,china2,china3,china4,china5,china6,china7,china8,china9,chocolate,christmas-ball,christmas-bell,christmas-bow,christmas-card,christmas-house,christmas-shoes,christmas-sweater,christmas-tree,christmas-wreath,chrome,church,church2,circle-brush,circle-chart,circle-chart-2,circle-chart-3,circle-cursor,circle-downloads,circle-element,circle-gallery,circle-gallery-2,circle-graphic,circle-home,circle-home-2,circle-home-3,circle-home-4,circle-home0,circle-hotspot,circle-language,circle-library,circle-marker,circle-navigation,circle-pen,circle-pin,circle-product,circle-share,circle-star,circle-stats,circle-up-and-down-control,circle-uploads,circle-voice-record,circle-wifi,circle-wireless,circlefinger,circus,city,city-2,city-hall,civic-cvc,clean,clean-code,cleaver,click-home,clip-board,clipboard,clipboard-activity,clipboard-check,clipboard-close,clipboard-export,clipboard-import,clipboard-text,clipboard-tick,cloche,clock,clock2,close,close-circle,close-shop,close-sign,close-square,closed-home,closet,closet-drawer,cloud,cloud-add,cloud-ai,cloud-change,cloud-code,cloud-connected,cloud-connected-2,cloud-connection,cloud-created,cloud-cross,cloud-drive,cloud-drive-2,cloud-drizzle,cloud-error,cloud-fog,cloud-lightning,cloud-minus,cloud-notif,cloud-plus,cloud-remove,cloud-snow,cloud-sunny,cloud-timeout,cloud-timeout-2,cloud-to-server,cloud-warning,cloudy,cloudywithmoon,clown,clubs,clubs-2,clubs-coin,cluster,cmd,co2,coat,code,code-2,code-brackets,code-chip,code-circle,code-comment,code-comment2,code-feedback,code-import,code-line,code-line-2,code-online,code-online-2,code-review,code-sandbox,code-search,code-snippet,code-to-visual,code-translate,coding,coding-2,coding-3,coding-4,coffe-shop,coffee,coffee-bag,coffee-bag2,coffee-beans,coffee-cup,coffee-grinder,coffee-maker,coffin,coin,coin-2,coin-add,coin-change,coin-diamond,coin-income,coin-left,coin-like,coin-outcome,coin-remove,coin-right,coin-search,coin-up,coins,coins-circle,coins-square,cold-drink,cold-drink2,collar,color,color-2,color-palette,color-palette-2,color-palette-ai,color-pellete,color-pocket,color-swatch,color-switch,colorfilter,colors-square,comedy-mask,comedy-mask-coin,comet,comet2,command,command-2,command-line,command-prompt,command-square,comment,compare-formats,compass,compass-2,complete-file,complete-receipt,completed,completed-bag,completed-file,completed-receipt,component,composion-file,computer-cloud,computer-cloud-2,computer-station,computer-station-2,computer-station-3,computing,cone,connect,connect-links,connect-wallet,connectdev-mode,connected,connected-circle,connected-file,connected-square,connection,connection-error,connection-info,connection-lost,connection-square,console,console-connection,constellation,contact,contacts,content-book,content-book2,contraceptives,contraceptives2,controller,controller-console,conversation-box,convert,convert-3d-cube,convert-arrow,convert-card,convert-contact,convert-home,convert-home-2,convert-home-3,convert-sign,convertshape,convertshape-2,cookie,cooking-hat,cooking-hat-2,cooking-pot,copy,copy-success,copypaste,copyright,copyright-2,copyright-3,copyright-4,copyright-5,corkscrew,corner,corner2,cot-mobile-toy,court,courthouse,cpu,cpu-charge,cpu-setting,crab,crash,cream-cup,creative-commons,credit-card,crib,cricket-bat,croissant,crop,crop-rotate,cross-health,crossbow,crossbow2,crossbow3,crossed-flags,crosshairs,crosshairs2,crown,crown-2,crown2,cruise,crutches,cryptosecurity,crystal-ball,css,cup,cupcake,cupids-bow,curling,curling-stone,curling2,curling3,cursor,cursor-frame,cursor-vector,curtain,curtain-2,curtains,curtains-2,curve-connected,cutting-board,cvv,cycle,cycle2,cycling,cycling2,d,da8c4fb958b3,dai-dai,danger,dark-mode,dark-time,dart,dart-2,dash-dash,dash-dash-navigation-control-speed-transportation-route,dashboard-gauge,data,data-2,data-3,data-base,data-base-2,data-base-connected,data-base-connection,data-base-error,data-base-route,data-transfer,data-transform,data-translate,database,database2,database3,decentralized,decentralized-crypto,decentralized-money,decor,decrease,decrease-cloud,decrease-exposure,decrease-home,decrease-home-2,decred-dcr,deer,delete,delete-basket,delete-card,delete-file,delete-home,delete-home-2,delete-shop,deleted-file,dent-dent,dent-dental-care-oral-health-toothbrush-teeth-cleaning,dent-dental-care-teeth-hygiene-oral-health-appointment,dent-dental-care-tooth-health-hygiene-checkup,dent-dental-care-tooth-hygiene-oral-health-cleaning,dent-dental-care-tooth-oral-health-hygiene-cleaning,dent-dental-care-toothbrush-oral-hygiene-checkup-smile,dent-dental-care-toothbrush-oral-hygiene-cleaning-appointment,deploy,deposit-card,deposit-dollar,descending-arrow,descending-arrow2,design-vector,designtools,desk-lamp,destructive,dev-config,dev-mode,dev-support,dev-tools,developer,devianart,device-calibration,device-message,device-setting,device-setting2,devices,diagnosis,diagonal-arrows,diagonal-arrows2,diagonal-down-left,diagonal-down-right,diagonal-up-left,diagonal-up-right,diagram,diamond-coin,diamonds,diamonds-2,diamonds-3,diaper,diaper2,dice,dice-five,dice-four,dice-one,dice-six,dice-three,dice-two,dice2,digita-timer,digital-timer,dildo,dildo2,dildo3,dildo4,direct,direct-connect,direct-down,direct-inbox,direct-left,direct-normal,direct-notification,direct-right,direct-send,direct-up,directbox-default,directbox-notif,directbox-receive,directbox-send,disconnected-wifi,discord,discount,discount-,discount-2,discount-3,discount-4,discount-5,discount-circle,discount-home,discount-shape,discount-sign,discount-square,discover,disinfectants,dislike,distributed-network,divide,divided-circle,diving,diving-mask,diving2,dna,document,document-cloud,document-code,document-code-2,document-copy,document-download,document-favorite,document-favorite-2,document-filter,document-forward,document-like,document-normal,document-previous,document-sketch,document-sketch-2,document-text,document-text-2,document-upload,dog,dog2,dog3,dog4,dog5,dog6,dog7,dogtags,doll,dollar,dollar-change,dollar-circle,dollar-down,dollar-refresh-left,dollar-refresh-right,dollar-square,dollar-up,dollar-verify,dolphin,dolphin2,dominoes,don't-disturb-mode,done,donut,door,dotted-center,dotted-center2,double-arrow-down,double-arrow-left,double-arrow-right,double-arrow-up,double-bed,double-diagonal-arrows,double-dildo,double-up-and-down,down,down-left-and-up-right,downgrade-file,download,download-2,download-arrow,download-cloud,download-horizontal-arrow,download-in-drive,download-list,download-packet,download-square,downloadfromcloud,drawer,drawer-2,drawer-3,drawer-closet,drawer-closet-2,drawer-mirror,drawing,dress,dresser,dresser-2,dresser-3,dribbble,drill,drill-2,drill-3,drill-4,drill-5,drink,dripping-heart,driver,driver-2,driver-refresh,driving,drop,dropbox,dropper,drops,drumstick,drumstick2,duck,dumbbell,dumbbell2,dumbbell3,dumbbell4,dumbbell6,duplicate,duplicate-2,duplicate-3,duplicate-home,duplicate-money,duplicate-restricted,duplicate-restricted-2,e,e-pen,earrings,earth,earth2,earth3,earth4,earthandmoon,earthandsun,ecg,eco,eco-invoice,ectrocardiogram-monitor-02,edit,edit-2,edit-basket,edit-card,edit-cloud,edit-contact,edit-file,edit-file-2,edit-file-3,edit-format,edit-home,edit-receipt,edit-square,edit-text,edit2,edit3,educare-ekt,effect,effect-2,egg,egg-cup,eggs,electric,electric-bill,electric-mixer,electric-search,electriccable,electricity,electricity-bill,electrocardiogram-monitor-01,element-ornament,element-presentation,elevator,email,email-2,email-box,email-snow,embassy,emercoin-emc,emergency,emergency-icon,emoji-happy,emoji-normal,emoji-sad,empathy,empty-wallet,empty-wallet-add,empty-wallet-change,empty-wallet-remove,empty-wallet-tick,empty-wallet-time,end-to-end-chat,end-to-end-download,enema-bulb,energy,energy-cycle,energyrecovery,engine,enhance,enhance-2,enhance-3,enhance-mood,enhance-prize,enhance-user-ai,enhanced-file,enjin-coin-enj,enter,enter-arrow,enter-arrow2,enter-arrow3,enter-home,envelope,eos-eos,epee,equal,equal-2,equalizer,erase,eraser,error,error-basket,error-code,error-code-2,error-data,error-data-2,error-data-3,error-mail,error-message,error-shop,error-sign,esports,eth,ethereum,ethereum-classic-cryptocurrency-blockchain-decentralized-ledger-smart-contracts,ethereum-classic-etc,ethereum-eth,euro,euro-circle,euro-square,exclamation,exit-arrow,exit-arrow2,exit-arrow3,expand-from-center,expand-full,expand-max,explosive,explosive2,explosive3,export,export-arrow,export-arrow2,export-circle,export-circle2,export-square,exposure,exposure-2,exposure-closed,expresstrain,extension,external-drive,eye,eye-slash,eyedropereyedropper,eyedropper,eyedropper-2,eyedropper-3,eyedropper-4,eyedropper-circle,eyedropper-square,f,face-id,facebook,factory,factory-2,fair-use,famle,fan,fan-blade,favorite-bag,favorite-card,favorite-chart,favorite-circle,favorite-home,favorite-hone,favorite-mails,favorite-page,favorite-search,favorite-square,feather,feather-2,feedback,feedback-2,feedback-shield,feeding-bottle,fencing,ferris-wheel,ferris-wheel2,fidget-spinner,fighter,figma,figma-2,figma-circle,figma-square,file,file-check,file-drawer,filming-camera,filming-camera-2,filmingcamera,filter,filter-2,filter-add,filter-edit,filter-remove,filter-search,filter-square,filter-tick,finger,finger-circle,finger-cross,finger-scan,finger-shield,finger-toshield,fingerfinger,fingerprint,fingerprint-2,fingerprint-3,fingerprint-4,fire,fire-heart,fire2,fire3,fireextinguisher,firefire,fireworks,fireworks2,fireworks3,fireworks4,first-aid,first-aid-box,first-aid-box-2,first-aid-kit,firstline,fish,fish-skeleton,fish2,fish3,fish4,fish5,fishing-hook,fit-to-size,fitness-ab-wheel,fitness-dumbbell,flag,flag-2,flag-3,flag-on-moon,flail,flail2,flame,flash,flash-circle,flash-disabled,flash-slash,flashlight,flask,flip-flops,float-ring,flogger,floral-candelabra,flour,flow,flower,focus-ai,folder,folder-2,folder-add,folder-cloud,folder-connected,folder-connection,folder-cross,folder-favorite,folder-minus,folder-open,folder-route,folder-timeout,food,food-scale,football,football-helmet,footballball,footballstadium,forbidden,forbidden-2,forbidden-basket,forbidden-brand,forbidden-camera,forbidden-card,forbidden-cloud,forbidden-contact,forbidden-copyright,forbidden-copyright-2,forbidden-file,forbidden-file-2,forbidden-home,forbidden-mobile,forbidden-money,forbidden-receipt,forbidden-sign,forbidden-signal,fork,fork-knife,fork-knife-2,fork-knife-crossed,form,form-2,format,format-circle,format-square,forward,forward-10-seconds,forward-15-seconds,forward-2,forward-5-seconds,forward-backward-basket,forward-backward-card,forward-backward-card-2,forward-backward-contact,forward-backward-dollar,forward-basket,forward-basket-2,forward-card,forward-contact,forward-dollar,forward-item,forward-mail,fountain-pen,fox,frame,frame-2,frame-muscle,frame-select,framefinger-cross,framer,framer-2,framer-square,frameramen,france,freezer,french-press,fried,frisbee,frisbee2,frog,frog2,frying-pan,ftp-error,ftp-server,ftp-timeout,ftx-token-ftt,fuel-tank,fuel-tank-2,furnace,g,gag,gallery,gallery-2,gallery-add,gallery-edit,gallery-export,gallery-favorite,gallery-import,gallery-remove,gallery-slash,gallery-tick,gamble,game,game-immersive,game-streamline,game-symbols,gameboy,gamepad,gaming-chair,gaming-mouse,garage,garlic,gas,gas-station,gear,gem,gem2,gem3,gemini,gemini-2,gender-symbol,generate,germany,get-key,ghost,ghost2,ghost3,gift,gift-bag,gift-cupcake,gift10,gift102,gift11,gift12,gift122,gift13,gift14,gift142,gift15,gift152,gift16,gift162,gift17,gift172,gift2,gift3,gift4,gift5,gift6,gift7,gift8,gift9,gift92,ginger,git,git2,git3,git32,github,github-2,github-3,gitlab,gitlab-2,give-blood,give-pill,glass,glass-2,glasses,glob,global,global-cloud,global-edit,global-mail,global-nature,global-network,global-refresh,global-search,global-water,globalenergy,globe,gmail,goal,golf,golf-club,golf2,golfhole,google,google-drive,google-play,google-play-2,gopro,gopro-2,gps,gps-slash,graph,grater,greece,greece2,greece3,green-house,green-tea,grenade,grenade2,grid,grid-2,grid-3,grid-4,grid-5,grid-6,grid-7,grid-8,grid-9,grid-add,grid-edit,grid-equal,grid-eraser,grid-file,grid-lock,grids,grill,grinning,groom,group,guard,guid-left,guid-left-down,guid-right,guid-right-down,guide-book,guide-sign,gun,gun10,gun11,gun12,gun13,gun14,gun15,gun16,gun17,gun2,gun3,gun4,gun5,gun6,gun7,gun8,gun9,gunya,gym-bag,gym-equipment,gym-equipment10,gym-equipment12,gym-equipment13,gym-equipment2,gym-equipment3,gym-equipment4,gym-equipment5,gym-equipment6,gym-equipment7,gym-equipment72,gym-equipment8,gym-equipment9,gym2,gymnastics,gymnastics2,gymnastics3,gymweights,gynec,h,hair-clip,hairdryer,hammer,hammer-2,hammer-legal,hammer2,hamster,hamster2,hand-bag-home,hand-card,hand-gesture-control,hand-gesture-control-expand,hand-gesture-control2,hand-soap,handball,handballball,handcircle,handcuffs,handcuffs2,handtohand,hanger,hanger-2,hanging-ornament,happy,happyemoji,haptic-sensor-vibration-controller,haptic-sensor-vibration-controller2,hapticp-laystation-vr,hard-drive,hard-drive-2,harmony-one,hashtag,hashtag-down,hashtag-file,hashtag-up,hat,hat2,hat3,hd,hd-2,hdr,hdr-mode,headphone,headphones,headset,headset-2,headset-3,heal,heal2,heal3,health,health-care,health-chat,health-circle,health-condition,health-condition-2,health-file-02,health-file-03,health-folder,health-home,health-sign,health-sign-2,health-sync,health-talk,health-watch,healthcare,healthyhouse,heart,heart-2,heart-add,heart-angel,heart-balloon,heart-beat,heart-check,heart-circle,heart-edit,heart-envelope,heart-infinite,heart-infinitie,heart-necklace,heart-protect,heart-puzzle,heart-rate,heart-rate-monitor,heart-remove,heart-search,heart-slash,heart-square,heart-status,heart-tap,heart-tick,heart2,hearted,hearted-eyes,hearts,hearts-coin,heat-level,hedera-hashgraph-hbar,helicopter,helmet,helmets,heterogeneous-network,hex-bolt,hex-hex,hex-nut,hex-setting,hidden,hidden-lock,hide,hide-2,hide-3,hide-text,hierarchical-structure,hierarchy,hierarchy-2,hierarchy-3,hierarchy-4,hierarchy-5,hierarchy-6,hierarchy-7,hierarchy-8,hierarchy-9,hierarchy-square,hierarchy-square-2,hierarchy-square-3,high-tower,hippo,hippopotamus,hiv,ho-ho-ho,hockey,hockey-skates,hockey-stick,hockey2,hold-file,holiday-icons,home,home-2,home-3,home-4,home-5,home-6,home-7,home-book,home-calander,home-calendar,home-click,home-enhance,home-hashtag,home-hover,home-id,home-id-2,home-id-3,home-info,home-key,home-key-2,home-location,home-location-2,home-owner,home-pic,home-place,home-price,home-price-list,home-review,home-route,home-search,home-security,home-settings,home-settings-2,home-split,home-tour,home-trend-down,home-trend-up,home-up-chart,home-wifi,homes,honey-spoon,honeymoon,honeymoon2,honeymoon3,hoodie,hoodie-2,horizontal-box,horizontal-move,horizontal-resize,horizontal-resize2,horseshoe,hospital,hospital-3,hospital-bed,hospital-building-3,hospital-building-4,hospital-land,hospital-location,hospital-symbol,hot-drink,hot-drink2,hot-drink3,hot-drink4,hot-drink5,hotair-balloon,hotspot,hourglass,house,house-2,house-code,house-not-available,housepower,hover-home,hover-mouse,html,html-2,hula-hoop,human,human-circle,human-scan,huobi-token-ht,hybrid-topology,i,ice-cream,ice-skates,ico,icon-icx,id,id-card,id-card-2,id-circle,id-scan,id-square,idea,illustrator,image,image-clarity-sharpness,image-generate,import,import-arrow,import-arrow2,import-circle,import-circle2,import-square,important-mail,inbox,inbox-2,incognito,incognito-check,incognito-circle,incognito-selected,incognito-shield,incognito-square,increase,increase-speed,increase-speed-2,indesign,india,india2,india3,india4,india5,india6,indonesia,indonesia2,indonesia3,indonesia4,inequality-symbol,infinite-canvas,infinite-canvas--streamline,info-circle,info-home,info-square,information,injection,instagram,install,instrument,instrument2,instrument3,internet,internet-drive,iost-iost,ip,ip-2,ip-3,ip-4,ip-5,ip-circle,ip-hexagon,ip-location,ip-octagonal,ip-square,iris-control-function,iso,iso-2,item,item2,item3,item4,itunes,iv,iv-bag,j,jacket,jacket2,jackpot,japan,japan-2,japan-3,japan2,japan3,japan4,japan5,japan6,jar,java,java-script,javascript,jeans,jellyfish,jet,joker,joker-coin,joy,joy-2,joy9,joycon,joystick,js,js-file,judge,juice-bar,juice-jug,jump-rope,jump-rope2,jump-rope21,jump-rope3,jump-rope4,jump-rope5,jump-rope6,jupiter,k,kayak,kettle,kettlebell,kettlebell2,key,key-2,key-3,key-circle,key-frame,key-square,keyboard,keyboard-open,king-chess,kissing,kissing-2,kitchen,knife,kyber-network-knc,l,lab,ladle,ladle-holder,ladle-holder-2,lama,lamp,lamp-charge,lamp-christmas,lamp-on,lamp-slash,lan,landing,language,language-circle,language-square,lantern-star,laptop,laptop-encrypted,laptop-home,laptop-protected,latte,launcher,layer,layers,layers-2,layout,layout-adjust,layout-blocks,lazy-moving-animation,leaf,leaf-2,leaf-3,leaf-circle,leaf-square,leafcircle,leafs,leafsquare,left,left-and-right,left-and-right-control,left-bar-grid,left-chart,left-circle-chart,left-cloud,left-money,left-right,left-right-cloud,left-sidebar-grid,left-signal,legal,lens,lens-distance,leo,letter,letter2,level,libra,libra2,library,library-drawer,library-drawer-2,life-like-interface-volume,lifebuoy,lifting-weights,lifting-weights2,lifting-weights3,light-mode,light-mode-2,lightning,lightning-airpods,lights,like,like-2,like-dislike,like-home,like-money,like-shapes,like-tag,liked-file,liked-list,liked-shop,line,line-2,line-space,linear-chart,link,link-2,link-3,link-4,link-circle,link-square,linkedin,lips,lips-circle,lipstick,lipstick-2,liquid,liquid-2,list,listening,litecoin,litecoinltc,little-grater,live-beat,loading,location,location-add,location-cross,location-hospital,location-mail,location-mark,location-minus,location-slash,location-tick,lock,lock-2,lock-3,lock-4,lock-5,lock-case,lock-circle,lock-heart,lock-heart2,lock-slash,locked-desktop,locked-home,locked-home-2,locked-homes,locked-search,locker,locker-2,locker-key,locker2,lockingneedle,log,login,login2,logout,logout2,lollipop,loop,loop-data,love,love-cake,love-click,love-mail,love-shine,love2,love3,love4,love5,lovely,low-light,lte-sim,lubricant,luggage,luncher,lung,lungs,m,mac-os,macapat,machine-gun,macro,magic,magic-hat,magic-star,magic-wand,magicpen,maiil,mail,mail-schedule,mailbox,mailpost,mails,main-component,maker-mkr,man,manorwoman,manual-focus,map,map-2,map-football,map-tag,mark,marker,marking,martial-arts,mask,mask-2,mask-3,mask2,massager,mastercard,masturbation-sleeve,mat,mat2,mat3,math,maulstick,maximize,maximize-2,maximize-3,maximize-4,maximize-circle,maximize-format,maximize-frame,maximizefinger,meal,measure-hammer,measure-pen,measure-tools,measuring-cup,meat-grinder,medal,medal-2,medal-file,medal-star,medal2,medals,medals-2,medic-cross,medical-book,medical-document,medical-file,medical-information,medical-program,medical-record,medical-report,medical-service,medication,meditation,meditation2,meditation3,medium,melee,melee2,melee3,melee4,melee5,melee6,mental-health,menu,menu-board,menu-burger,mesh-topology,message-add,message-add-2,message-bubble,message-circle,message-edit,message-favorite,message-minus,message-notif,message-programming,message-question,message-remove,message-search,message-square,message-text,message-text-2,message-tick,message-time,messages,messages-2,messages-bubbles,messenger,messenger-2,messenger-square,meta-quest,meta-quest-pro,meta-quest-pro2,meta-quest2,meteor,meteor2,meteor3,meteor4,meteor5,meter,mexico,mexico2,microphone,microphone-2,microphone-slash,microphone-slash-2,microphone2,microscope,microwave,middle-finger,military-base,military-base2,military-hat,milk,milk-bottle,milk-jug,milkshake,mine,mine2,mini-camera,mini-music-square,mini-tank,minimize-format,minus,minus-2,minus-circle,minus-format,minus-receipt,minus-signal,minus-square,mirror,mirror-2,mirror-makeup,mirroring-screen,missile,mistletoe,mitten,mobile,mobile-2,mobile-cloud,mobile-programming,mobile-toy,mocha,modem,moden-city,modern-city,module,module-blocks,molotov,monero-xmr,monetization-unavailable,monetize,monetize-2,money,money-2,money-3,money-4,money-5,money-6,money-7,money-8,money-add,money-archive,money-change,money-comment,money-down,money-forbidden,money-income,money-receipt,money-receive,money-recive,money-remove,money-secure,money-send,money-tick,money-time,money-up,money-wallet,money1,moneys,monitor,monitor-mobile,monitor-recorder,monkey,moon,moon-landing,more,more-circle,more-options,more-square,motorsport,mountaineering,mountains,mouse,mouse-circle,mouse-cursor,mouse-square,moustache,moustache-circle,moustache6,mouth-gag,movies-immersive,moving-cursor,moving-toward-user-object,mpplayer,muffin,mug,mug-2,multi-user-server,multiple-mails,muscle,muscle2,muscle21,muscle3,muscle4,muscle5,muscle52,muscle6,mushroom,mushroom-cloud,music,music-circle,music-copyright,music-copyright-2,music-dashboard,music-filter,music-library,music-play,music-playlist,music-square,music-square-add,music-square-remove,music-square-search,music2,musical-note-ai,musicnote,myanmar,n,nail-polish,nails,natural-feedback,nature,nature-2,nature-cycle,nav,navigate,navy,nebulas-nas,necklace,necklace2,nem-xem,nepal,neptune,network,new-file,new-folder,nexo-nexo,next,nfc,nfc-card,night-mode,nintendo,nipple-clamps,no-antenna,no-bed-sex,no-internet,no-simcard,no-smoke,no-smoke-2,nocturne-mode,nocturne-mode-2,node-communication,note,note-2,note-add,note-favorite,note-remove,note-square,note-text,notification,notification-2,notification-bing,notification-circle,notification-favorite,notification-square,notification-status,notion,nuclear,nuclearenergy,nurse,nut,o,o2,oak,observatory,obstetric,oc,ocean-protocol-ocean,officer,officer2,oil-platform,oil-tank,oil-tank-2,ok-app,okb-okb,omega-circle,omega-square,on-going-data,on-going-data-2,one-bed,one-sofa,onion,online-home,ontology-knowledge-structure-concept-map-relationship-data-model,ontology-knowledge-structure-concept-map-relationships-data,ontology-knowledge-structure-concept-map-semantics-information,ontology-knowledge-structure-concept-mapping-semantic-relation-data-model,ontology-knowledge-structure-concept-network-relationships-entity,ontology-knowledge-structure-concept-relation-model-data,ontology-ont,ontology-ontology-knowledge-structure-concept-map-data-relationships,open-mail,opened-loveletter,openmarker,operating-scissors-01,orbit,orbit2,orbit3,orbit4,orbit5,orbit6,os,outdoor-cafe,oven,oven-mitt,overalls,owl,owl2,p,pacifier,pacifier2,package,package-2,package-file,packaged-terminal,packet,packet-2,packet-error,packet-sent,pacman,paddle,padlock,pager,paint-brush,paint-brush-2,paint-roller,paintbucket,palto,panda,pant,pants,pants2,panty-vibrator,panty-vibrator2,paper,paper-glass,paper2,paperclip,paperclip-2,parachute,parachute2,paragraphspacing,parents,parking,parking-2,parking-sign,parking-ticket,parrot,part-of-circle,partlycloudy,party-hat,party-popper,passport,password-check,path,path-2,path-square,patient-notebook,patient-status,pause,pause-circle,paw,paw2,pawn-chess,paypal,peace,pedal,pen,pen-2,pen-add,pen-brush,pen-close,pen-icon,pen-meter,pen-metter,pen-remove,pen-tool,pen-tool-2,pencil,pencil-edit,pencilholder,pending-code,pending-mail,penguin,penguin2,penguin3,penis,people,percent,percentage-circle,percentage-square,perfume,perfume-2,person,person-2,person-3,personal,personalcard,pet,pet10,pet11,pet12,pet13,pet14,pet15,pet16,pet17,pet18,pet19,pet2,pet20,pet3,pet4,pet5,pet6,pet7,pet8,pet9,pharagraphspacing,phone,photographer,photoshop,pick-axe,picor,picture-frame,pie,piercing,pig,pill,pill-box,pill-tablet,pillar-stats,pills,pills-3,pin,pin-2,pin-3,pine-tree,pine-tree-2,pine-tree-3,pinlocation,pinterest,pinterest-square,pintrestpinterest,pipe-wrench,piping,piranha,pisces,pistol,pitcher,place-mark,planet,planet2,planet3,planet4,plant,plaster,plastic-dish,plastic-fork,play,play-add,play-blocks-toy,play-circle,play-circle-2,play-remove,player,playfinger,playing-cards,playing-cards2,playing-cards3,playing-cards4,playing-cards42,playing-cards5,playlist,playstation-vr,playstation-vr2,plesk,plug,plus,plus-format,plus-signal,point,pointfinger,poker,poker-chip,poker-chip-2,poker-chip-3,poker-chips,polkadot-dot,polo-shirt,polygon-matic,polyswarm-nct,pool,pool2,poop,poop2,popsicle,portable-speaker,positive-home,postive-home,pot,pound-circle,pound-square,powerhouse,powerhouse-ai,powerplug,presentation-chart,pretzel,preview-mail,previous,price-badge,price-list-home,price-tag,price-tag-2,print-mail,printer,printer-slash,private,private-file,processing-data,processor,proctected-home,profile,profile-2,profile-2user,profile-add,profile-circle,profile-delete,profile-remove,profile-tick,programming-arrow,programming-arrows,projector,propose,protect,protect-nature,protect-virus,protected,protected-cloud,protected-data,protected-drive,protected-file,protected-file-2,protected-home,protected-home-2,protected-information,protected-network,protected-network-2,protected-network-3,protected-tasks,protected-text,protected-user,protected-voice,protected-zone,protectfinger,protocol-change,protocol-change-2,prototype,prototype-2,prototype-3,prototype-design,prototype-pick,prototype-select,prototype-select-2,protoype,protoype-2,protoype-design,protoype-pick,protoype-select,prueba,public-domain,public-domain-2,pudding,puffer-jacket,pump,pump2,pump3,pumpkin,pumpkin2,pumpkin3,pumpkin4,pumpkin5,pumpkin6,punching-bag,punching-bag2,punching-bag3,punching-bag4,punching-bag5,push-up,pushbutton,pushfinger,put,puzzle-toy,python,python2,q,quant-qnt,quant-qnt-2,queen-chess,quest-oculus,question,question-bubble,question-circle,question-mark,question-mark-2,question-mark-circle,question-mark-square,question-mark-square-2,question-square,quick-access,quick-mail,quick-search,quick-sent,quote-circle,quote-down,quote-down-circle,quote-down-square,quote-up,quote-up-circle,quote-up-square,r,racket,racket-sports,racket-sports2,racket2,racket3,radar,radar-2,radar2,radar3,radio,radio-active,radio-active-2,radio-button,radiobutton,radiobutton-2,radiobutton-off,radiobutton-on,rain-heart,rainy,raise-exposure,raise-price,ram,ram-2,ramen,random,rank,rank2,ranking,ranking-2,rattle-toy,rattle-toy2,rattle-toy22,razor,reality-streamline,reality-vr-streamline,receipt,receipt-2,receipt-3,receipt-4,receipt-add,receipt-discount,receipt-discount-2,receipt-disscount,receipt-edit,receipt-home,receipt-item,receipt-minus,receipt-search,receipt-square,receipt-text,receive,receive-and-send-signal,receive-cloud,receive-clubs,receive-coin,receive-contact,receive-contact-2,receive-diamonds,receive-hearts,receive-money,receive-spades,receive-square,receive-square2,received,received-signal,recharge,record,record-circle,record-music,recovery-convert,recycle,reddit,redo-arrow,redo-receipt,refresh,refresh-arrow,refresh-arrow2,refresh-circle,refresh-cloud,refresh-file,refresh-left,refresh-mail,refresh-money,refresh-product,refresh-receipt,refresh-right,refresh-shop,refresh-signal,refresh-square,registered-product,registered-product-2,registered-trademark,registered-trademark-2,registered-trademark-3,registered-trademark-4,reindeer,reindeer-antlers,reindeer-arch,reindeer-face,relaxed,remote,remove,remove-basket,remove-card,remove-contact,remove-date-calendar,remove-effect,remove-receipt,remove-sign,remove-sticky,remove-text,rename-file,repeat,repeat-arrow,repeat-arrows,repeat-circle,repeat-music,repeate-music,repeate-one,repeated-shield,reply,reply-2,reply-mail,reporter,reserve,resolution,respect,restricted-payments,reverse-down,reverse-left,reverse-right,reverse-time-arrow,reverse-up,review,rgb-mode,ridingbike,right,right-and-left-signal,right-chart,right-circle-chart,right-cloud,right-left,right-left-money,right-money,right-signal,ring,ring-box,rings,rings2,rings3,rock-climber,rocket,rocket-2,rocket-fire,rocket2,roller-whisk,rollerskate,rolling-pin,romantic-cheers,rook-chess,rope,rope-training,rope-training2,rope-training3,rotate,rotate-left,rotate-right,roulette,route-square,router,routing,routing-2,rover,row-horizontal,row-vertical,rpg,ruble,ruble-square,ruler,ruler-pen,ruler-protractor,rulerprotractor-pencil,running,russia,s,sack,sad,sad-face,sad3,safe-box,safe-card,safe-home,safebox,safebox-2,safebox-money,safebox-money-2,sagittarius,salad,salad2,salt-sprinkler,sandwich,santa,santa-face,santa-hat,santa-mouth,santa2,satellite,satellite-2,satellite-dish,satellite-dish2,satellite2,satisfied,saturn,saturn2,saturn3,saturn32,saturn4,saturn5,sausage,save,save-add,save-frame,save-minus,save-remove,scale,scale-calibration,scales,scales2,scan,scan-barcode,scan-home,scan-human,scan-incognito,scanner,scanning,schedule-product,scheduled,scheduled-2,scheduled-camera,scheduled-cloud,scheduled-file,scheduled-mail,scheduled-mail-2,scheduled-mail-3,schulded-cloud,scientist,scissor,scissors,scoop,scooter,scootering,scoreboard,scorpio,scorpion,screen-size-resolution,screenmirroring,screwdriver,screwdriver-2,screwdriver-3,screwdriver-hammer,screwdriver-measure,screwdriver-pen,scroll,scroll-text,scroll2,scrollfinger,scuba-diving,seal,search,search-2,search-ai,search-basket,search-cloud,search-code,search-contact,search-favorite,search-favorite-2,search-file,search-home,search-home-2,search-home-3,search-home-4,search-mail,search-mail-2,search-money,search-normal,search-property,search-receipt,search-result,search-results,search-status,search-status-2,search-word,search-zoom-in,search-zoom-in-2,search-zoom-out,search-zoom-out-2,search-zoom-out-3,searching-square,secure,security,security-card,security-safe,security-shield,security-time,security-user,seedlings,seedlings-2,seedlings-3,seen-file,selected-file,selected-frame,selected-search,selection,self-playing-area,self-playing-area2,send,send-2,send-basket,send-basket-2,send-cloud,send-mail,send-message,send-money,send-receive,send-receive-2,send-receive-basket,send-receive-cloud,send-receive-contact,send-signal,send-square,send-square2,sense-of-stability,sent-mails,separated,serum,server,server-connected,server-created,server-error,server-maintenance,server-users,servers,service-mark,service-mark-2,serving-dome,setting,setting-2,setting-3,setting-4,setting-5,setting-gear,setting-gear-2,settings,settings-2,settings-3,settings-circle,sewing-needle,sewingmachine,sex,sexual-store,shake,shaker,shakers,shape,shape-2,shape-selected,shapes,shapes-2,shapes-forms,share,share-2,share-health,share-lock,share-protection,share-user,sharefile,shark,sheep,shield,shield-2,shield-3,shield-cross,shield-download,shield-envelope,shield-exclamation,shield-search,shield-security,shield-slash,shield-tick,shield2,shielddone,shieldfail,shieldprotect,shining-heart,ship,shirt,shirt-2,shirt-3,shirt-4,shirt-5,shoe,shoefootwear-sneaker-boot-sandal-sport-collection,shoefootwear-sole-style-fashion-sneaker-boot,shoes,shoes.svg,shoot-ball,shooting,shop,shop-2,shop-3,shop-4,shop-add,shop-gift,shop-remove,shop-snow,shopping-bag,shopping-cart,short,shorts,shorts2,shovel,shower,shower-2,shrimp,shrink-full,shrink-full2,shrink-to-center,shuffle,shuriken,shutter,shutterstock,siacoin-sc,sickle,sidebar-bottom,sidebar-left,sidebar-right,sidebar-top,sign,sign-out,signal,signed-cloud,signpost,simcard,simcard-2,simcard-3,simcard-slot,simcard-switch,simcard-switch2,simcard-switch3,simcard2,simcard3,single-bed,sit-ups,size,skate,skateboard,skateboarding,skates,skating,sketch,sketch-square,skew-frame,ski,ski-boots,skiing,skiing2,skiing3,skiing4,skiing5,skimmer,skimmer-2,skirt,skull,skull2,skull3,skull4,skull5,skull6,skype,slack,slack-2,slash,sleep-zzz,sleigh,sleigh2,slider,slider-horizontal,slider-horizontal-2,slider-vertical,slider-vertical-2,slippers,slot-machine,small-panda,smallcaps,smart-bag,smart-car,smart-cursor,smart-glasses,smart-home,smart-home-ai,smart-lock-ai,smart-paint,smart-prices,smart-thinking,smart-vacuum,smile,smile-heart,smileys,smiling-with-heart,sms,sms-edit,sms-notification,sms-search,sms-star,sms-tracking,snake,snapchat,sneakers,snooze,snow,snow10,snow102,snow11,snow112,snow12,snow13,snow132,snow14,snow2,snow22,snow3,snow4,snow42,snow5,snow6,snow7,snow8,snow9,snowflake,snowman,snowman2,snowman3,snowman4,snowman5,snowman6,snowman7,soccer,sock,socks,socks-2,socks2,socksshorts,sofa,sofa-2,software,solana-scaling-blockchain-crypto-network-token,solana-sol,solar-energy,solar-energy-house,sold-home,song-file,song-file-2,sort,sort-add,sort-add2,sort-ascending,sort-ascending2,sort-check,sort-descending,sort-descending2,sound,sound-file,sound-recording-copyright,sound-recording-copyright-2,soundcloud,source-folder,spade,spades,spades-coin,spam-mail,spam-mail-2,spam-mail-3,sparkler,spatial-audio,spatial-audio-device,spatial-audio-headphone,spatial-audio-headphone2,spatial-audio-user-surround,spatial-audio2,speaker,speaker-2,speaker-3,speaker-off,speaker-on,speakers,special-money,speed,speed-2,speed-meter,speedmeter,speedmeter-2,speedometer,speedometer-2,spell,spell2,spell3,sperm,spicy,spider,spider-web,spiritual-father,spoon,spoon-and-fork,spoon-fork,sporttshirt,spotify,spotify-square,spray,square,square-add-search,square-arrow,square-arrow2,square-backward,square-backward-search,square-basket,square-booked-search,square-brush,square-cancel-search,square-capital-words,square-chart,square-chart-2,square-chart-3,square-chart0,square-code,square-coin,square-command,square-completed-search,square-copyright,square-creative-commons,square-crop,square-cursor,square-decrease-volume,square-diamond,square-downloads,square-edit-search,square-element,square-flag,square-flash,square-flash-off,square-forbidden-money,square-forbidden-product,square-forbidden-product-2,square-forbidden-product-3,square-forbidden-search,square-forward,square-forward-backward-search,square-forward-search,square-fountain-pen,square-headset,square-home,square-home-2,square-home-3,square-home-4,square-hot,square-hotspot,square-language,square-left-chart,square-lens,square-lens-2,square-liquid,square-location,square-lowercase-words,square-mainimize,square-marker,square-maximize,square-medal,square-minimize,square-mute-volume,square-mute-volume-2,square-navigation,square-notification,square-pen,square-pin,square-receive-search,square-refresh-search,square-registered-product,square-registered-product-2,square-right-chart,square-search,square-seen,square-send-receive-search,square-send-search,square-share,square-sleep,square-sound,square-speaker,square-speaker-2,square-speaker-3,square-star,square-thermometer,square-thermometer-2,square-ui,square-unregistered-product,square-unregistred-product,square-unseen,square-uploads,square-ux,square-vip-search,square-voice-record,square-volume-equalizer,square-wifi,square-wireless,square-word,square2,squarefinger,ssh,ssl,stacking-toy,stacks-stx,stage,stairs,stairs-up,stand,star,star-circle,star-garland,star-review,star-slash,star-square,star-topology,star2,star3,star4,star5,stars,starship,starship2,starship3,stats,stats-ios,stats-ios-2,stats-square,status,status-file,status-notif,status-up,steering,stellar-xlm,step-ups,step-ups2,stethoscope,stethoscope-program,stick,stick-shift,stick-shift-circle,stick2,stick3,sticker,sticky-note,stickynote,stingray,stomach-care,stop,stop-circle,storage-refresh,store,storexfbold,story,story-circle,story-download,stove,stove-2,strawberry,stroller,strongbox,strongbox-2,strongbox-3,structure,stylus-pen,stylus-pen-edit,subject,submarine,submarine-2,submarine2,submarine3,subtitle,suit,suitcase,suitcase-heart,sun,sun-cycle,sun-fog,sunrise,sunset,sunset-2,supplements,supplements2,supplements3,supply,support,surfing,surfing2,surfing3,surgical-scissors-02,sushi,suv,swap-horizontal,swap-horizontal2,swap-horizontal3,sweat-smile,swim,swim-cap,swimming,swimming-pool,swimming-pool2,swimming2,swimming21,swimming3,swimmingglasses,swimsuit,sword,sword2,symmetry,sync-modules,syphon,syringe,syrup,t,t-arrow,t-shirt,t-shirt-2,t-shirt-3,t-shirt2,table,table-2,tablets,tactic,tag,tag-2,tag-3,tag-4,tag-add,tag-check,tag-circle,tag-cross,tag-right,tag-square,tag-user,takeoff,tamper,tank,tank-top,tape,tape-2,tape-measure,tape-measure2,tape1,target,target-mail,taser,task,task-square,taurus,teacher,teapot,teapot-and-cup,teddy-bear,teeth,telecabin,telescope,temp-lock,temp-shield,tennis,tennisrocket,tenx-pay,terminal,terminal-2,terminal-3,terminal-4,terminal-connect,terminal-connect-2,terminal-error,terminal-folder,terminal-result,terminal-route,tesla,test-tube,test-tube-02,tether-usdt,text,text-align-right,text-block,text-bold,text-encrypt,text-file,text-file2,text-formating,text-generate,text-italic,text-organize,text-organize-heart,text-underline,textalign-center,textalign-justifycenter,textalign-justifyleft,textalign-justifyright,textalign-left,textalign-right,thailand,the-bag,the-graph-grt,the-pawn-coin,the-pole,theater,thermometer,thermometer-2,thermometer-file,theta,theta-theta,thombstone,thombstone2,thorchain-rune,throwing,throwing-knife,throwing-knife2,throwing-knife3,throwing-knife4,throwing-knife5,throwing-knife6,thumbsdown,thumbsdown-arrowup,thumbsup,thumbsup-arrowdown,tick-circle,tick-square,ticket,ticket-2,ticket-discount,ticket-expired,ticket-star,tickets,tie,tie-2,tiktok-square,tilde-symbol,time,time-bomb,time-tracking,timer,timer-pause,timer-start,tips,tissue,to-down-envelope,to-home,to-left,to-left-arrow,to-left-envelope,to-right,to-right-arrow,to-right-envelope,to-up-envelope,toast,toaster,toggle-off,toggle-off-circle,toggle-on,toggle-on-circle,toilet,toilet-sink,toilet-sink-2,token,toleft,toll,tone,tongue-closed-eyes,tools-ar-kit,tools-reality-accessibility,tools-unity,tooth,top-bottom-grid,torch,torch-bearer,toright,torpedo,touch-finger,touch-id-finger,towel,tower,tower-2,town,town-hall,toy,toy-cart,toy2,toy3,toy4,toy5,toy6,trade,trademark,train,train-2,train-3,training,transaction-arrows,transaction-minus,transfer,transfer-card,transfer-money,transfusion,translate,trash,trash-bin,trash-square,travel,travel-2,travel-guide,travel-ticket,travel-tickets,tree,tree-2,tree-3,tree-4,tree2,tree3,trees,trello,trend-down,trend-up,triangle,triangle-2,triangle-in-circle,triangle-in-square,triangle-ruler,trontron-trx,trophy,trophy2,trophy3,trophy4,trophy5,trophy6,trophy7,trophy8,trowel,trowel-2,truck,truck-fast,truck-remove,truck-tick,truck-time,trunode,tshirt,tub,tulip,turbine,turbine-2,turn-to-left,turn-to-right,turtle,tv,tv-table,twitch,two-bed,two-hearts,two-sofa,type-square,type-text,type-text-square,typing,u,uae,uav,ufo,ufo2,ufo3,ui8,uk,uk2,uk3,ultrasound-monitor-01,ultrasound-monitor-02,un-shield,under-shirt,underwear,underwear-2,underwear2,undo,undo-arrow,undo-receipt,unfit,unlimited,unlimited-file,unlock,unread-mail,unregistered-trademark,unregistered-trademark-2,unregistred-product,up,up-and-down-control,upgrade-file,upload,upload-2,upload-arrow,upload-horizontal-arrow,uploadtocloud,upside-down-face,uranus,us-coin,usa,usb-flash,usbflash,usd-coin-usdc,user,user-add,user-circle-add,user-connected,user-connected-2,user-connections,user-cycle,user-demo,user-denied,user-disconnected,user-edit,user-hexagon,user-log,user-minus,user-profile,user-profile2,user-remove,user-search,user-square,user-tag,user-terminal,user-tick,users,v,v.i.p,v.i.p-cloud,v.i.p-file,valentine-day,valentine-shop,variance-icon,variant,vase,vatican,vector,vector-2,vector-3,vector-4,vector-5,vector-6,velas-vlx,venus,venus2,verified-home,verified-home-2,verified-home-3,verified-home-4,verified-home-5,verified-money,verified-shop,verify,vertical-box,vertical-move,vertical-resize,vest,vest-puffer,vibe-vibe,vibrate,vibrator,vibrator2,vibrator3,video,video-add,video-audience,video-camera,video-camera-2,video-chat,video-circle,video-file,video-folder,video-generate,video-generate2,video-generate3,video-generate4,video-horizontal,video-octagon,video-play,video-remove,video-slash,video-square,video-tick,video-time,video-vertical,videocamera,videotape,vietnam,vietnam2,viking,villa,vip-basket,vip-card,vip-contact,vip-shop,vip-signal,virgo,virgo2,virtual-display-desktop,virtual-display-laptop,virtual-display-tablet,virtual-environment,virtual-environment2,virtual-environment3,virtual-event,virus,virus-lab-research,vision-comfort-eye-strain,vision-comfort-focus,vision-comfort-focus2,visual-resting-point,voice,voice-circle,voice-control,voice-control2,voice-home,voice-memo,voice-protected,voice-square,voice2,volleyball,vollyball,volume,volume-cross,volume-high,volume-low,volume-low-2,volume-mute,volume-slash,volume-up,vpn,vr,vr-chat,vr-controller,vr-controller-area,vr-controller2,vr-headset,vuesax,w,waffle,wagon,walkie,walkie2,walking,wall,wall-roller,wallet,wallet-2,wallet-3,wallet-4,wallet-5,wallet-6,wallet-7,wallet-add,wallet-add-2,wallet-add-3,wallet-change,wallet-check,wallet-diamond,wallet-down,wallet-favorite,wallet-left,wallet-minus,wallet-money,wallet-redius,wallet-remove,wallet-right,wallet-search,wallet-search-2,wallet-up,wallet-verify,walrus,wanchain-wan,wanchain-wan-2,warm-up,warm-up10,warm-up11,warm-up12,warm-up13,warm-up14,warm-up15,warm-up16,warm-up17,warm-up18,warm-up19,warm-up2,warm-up20,warm-up21,warm-up22,warm-up23,warm-up24,warm-up25,warm-up26,warm-up27,warm-up28,warm-up29,warm-up3,warm-up30,warm-up31,warm-up32,warm-up4,warm-up5,warm-up6,warm-up7,warm-up8,warm-up9,warning,washing-machine,watch,watch-status,watchcircle,watchsquare,water,water-cycle,water-house,water-liquid,water-polo,water-power-generator,wave-chart,weary,web-cam,web-development,web-page,web-page-2,web-page-3,web-page-4,web-page-5,webcam,webcam-2,webcam-3,wedding,wedding-altar,wedding-cake,wedding2,wedding3,wedding4,weighing-scale,weighing-scale2,weighing-scale3,weight,welding-mask,whale,whale2,whale3,whatsapp,wheat,wheel,wheel-chair,wheel-chair-3,wheelbarrow,wheelchair,whisk,whistle,whistle-rocket,whistle-rocket2,whistle-rocket3,whistle-rocket4,wifi,wifi-home,wifi-page,wifi-square,wig,wind,wind-2,window,window-2,window-3,window-4,window-workspace,window-workspace2,windows,windows-square,wine,wing,wing-wing,wing-wing-flight-aerodynamic-airplane-freedom-speed,wing-wing-flight-aerodynamic-freedom-soar-speed,wing-wing-flight-aerodynamics-transportation-freedom-aviation,wing-wing-flight-aviation-aircraft-freedom-soar,wing-wing-fly-flight-aerodynamics-aircraft-aviation,wing-wing-fly-flight-aircraft-aerodynamics-wingspan,winter-boots,winter-mitten,winter-pattern,wire-frame,wire-frame-2,wireless-charge,witch-hat,withdraw-card,withdraw-dollar,wizard,wolf,woman,womb,word-file,work-flow,workflow-shapes,workout-plan,workout-plan2,wrench,wrench-2,wrench-measure,write-receipt,write-text,write-text-2,write-text-ai,writing,wrong-file,wrong-file-2,x,x-connected,x-mark-down,x-mark-left,x-mark-right,x-mark-up,x-users,xconnected,xconnected-circle,xd,xiaomi,xrp-xrp,xrp-xrp-cryptocurrency-digital-asset-blockchain-payment-transactions,xyz-movement,y,yacht,yahoo,yen,yen2,youtube,z,zel-zel,zeppelin,zip,zipline,zipped,zombie,zombie2,zombie3,zombie4,zombie42,zombie5,zoom,zoom-in,zoom-out".split(","), wt = [
	[
		1,
		1,
		1,
		416.9
	],
	[
		1,
		416.9,
		139.1,
		278
	],
	[
		1,
		416.9,
		139.1,
		416.9
	],
	[
		1,
		556.1,
		139.1,
		694
	],
	[
		1,
		556.1,
		278,
		556.1
	],
	[
		1,
		694,
		139.1,
		694
	],
	[
		1,
		833.4,
		278,
		833.4
	],
	[
		1,
		972.3,
		139.1,
		972.3
	],
	[
		1,
		1110.8,
		278,
		1110.8
	],
	[
		1,
		1250.3,
		1,
		1527.7
	],
	[
		1,
		1250.3,
		1,
		2498.9
	],
	[
		1,
		1250.3,
		278,
		1250.3
	],
	[
		1,
		1250.3,
		416.9,
		1250.3
	],
	[
		1,
		1527.7,
		1,
		1666.7
	],
	[
		1,
		1527.7,
		139.1,
		1389.1
	],
	[
		1,
		1527.7,
		139.1,
		1666.7
	],
	[
		1,
		1527.7,
		278,
		1250.3
	],
	[
		1,
		1527.7,
		278,
		1527.7
	],
	[
		1,
		1666.7,
		1,
		1944.2
	],
	[
		1,
		1666.7,
		139.1,
		1666.7
	],
	[
		1,
		1944.2,
		1,
		2082.9
	],
	[
		1,
		1944.2,
		139.1,
		1944.2
	],
	[
		1,
		2082.9,
		1,
		2360.8
	],
	[
		1,
		2082.9,
		139.1,
		1944.2
	],
	[
		1,
		2082.9,
		278,
		2082.9
	],
	[
		1,
		2360.8,
		1,
		2498.9
	],
	[
		1,
		2360.8,
		139.1,
		2222.4
	],
	[
		1,
		2360.8,
		278,
		2082.9
	],
	[
		139.1,
		1,
		139.1,
		278
	],
	[
		139.1,
		278,
		139.1,
		416.9
	],
	[
		139.1,
		278,
		278,
		139.1
	],
	[
		139.1,
		416.9,
		278,
		556.1
	],
	[
		139.1,
		416.9,
		416.9,
		416.9
	],
	[
		139.1,
		416.9,
		416.9,
		694
	],
	[
		139.1,
		694,
		278,
		833.4
	],
	[
		139.1,
		694,
		416.9,
		694
	],
	[
		139.1,
		972.3,
		278,
		833.4
	],
	[
		139.1,
		972.3,
		278,
		1110.8
	],
	[
		139.1,
		1389.1,
		278,
		1250.3
	],
	[
		139.1,
		1389.1,
		416.9,
		1389.1
	],
	[
		139.1,
		1389.1,
		694,
		1389.1
	],
	[
		139.1,
		1666.7,
		278,
		1527.7
	],
	[
		139.1,
		1666.7,
		278,
		1805.7
	],
	[
		139.1,
		1666.7,
		694,
		1666.7
	],
	[
		139.1,
		1944.2,
		278,
		1805.7
	],
	[
		139.1,
		1944.2,
		416.9,
		1944.2
	],
	[
		139.1,
		1944.2,
		694,
		1944.2
	],
	[
		139.1,
		2222.4,
		139.1,
		2498.9
	],
	[
		139.1,
		2222.4,
		278,
		2082.9
	],
	[
		139.1,
		2498.9,
		278,
		2360.8
	],
	[
		278,
		1,
		278,
		139.1
	],
	[
		278,
		139.1,
		416.9,
		278
	],
	[
		278,
		556.1,
		416.9,
		694
	],
	[
		278,
		833.4,
		416.9,
		694
	],
	[
		278,
		833.4,
		416.9,
		833.4
	],
	[
		278,
		1110.8,
		416.9,
		1110.8
	],
	[
		278,
		1110.8,
		416.9,
		1250.3
	],
	[
		278,
		1250.3,
		694,
		1250.3
	],
	[
		278,
		1527.7,
		416.9,
		1389.1
	],
	[
		278,
		1527.7,
		556.1,
		1527.7
	],
	[
		278,
		1805.7,
		556.1,
		1805.7
	],
	[
		278,
		2082.9,
		278,
		2360.8
	],
	[
		278,
		2082.9,
		416.9,
		2082.9
	],
	[
		278,
		2082.9,
		416.9,
		2222.4
	],
	[
		278,
		2082.9,
		556.1,
		2082.9
	],
	[
		278,
		2360.8,
		278,
		2498.9
	],
	[
		278,
		2360.8,
		416.9,
		2222.4
	],
	[
		416.9,
		1,
		416.9,
		139.1
	],
	[
		416.9,
		1,
		416.9,
		278
	],
	[
		416.9,
		1,
		556.1,
		139.1
	],
	[
		416.9,
		1,
		972.3,
		1
	],
	[
		416.9,
		1,
		1250.3,
		1
	],
	[
		416.9,
		139.1,
		416.9,
		416.9
	],
	[
		416.9,
		139.1,
		556.1,
		139.1
	],
	[
		416.9,
		278,
		416.9,
		416.9
	],
	[
		416.9,
		416.9,
		416.9,
		694
	],
	[
		416.9,
		416.9,
		556.1,
		416.9
	],
	[
		416.9,
		416.9,
		556.1,
		556.1
	],
	[
		416.9,
		694,
		416.9,
		833.4
	],
	[
		416.9,
		694,
		416.9,
		972.3
	],
	[
		416.9,
		833.4,
		416.9,
		1110.8
	],
	[
		416.9,
		972.3,
		416.9,
		1250.3
	],
	[
		416.9,
		972.3,
		556.1,
		1110.8
	],
	[
		416.9,
		972.3,
		694,
		1250.3
	],
	[
		416.9,
		1110.8,
		416.9,
		1250.3
	],
	[
		416.9,
		1250.3,
		694,
		1250.3
	],
	[
		416.9,
		1389.1,
		694,
		1389.1
	],
	[
		416.9,
		1944.2,
		556.1,
		1805.7
	],
	[
		416.9,
		1944.2,
		694,
		1944.2
	],
	[
		416.9,
		2082.9,
		416.9,
		2222.4
	],
	[
		416.9,
		2082.9,
		694,
		2082.9
	],
	[
		416.9,
		2222.4,
		416.9,
		2360.8
	],
	[
		416.9,
		2360.8,
		416.9,
		2498.9
	],
	[
		416.9,
		2360.8,
		556.1,
		2222.4
	],
	[
		416.9,
		2360.8,
		556.1,
		2498.9
	],
	[
		416.9,
		2360.8,
		694,
		2082.9
	],
	[
		416.9,
		2360.8,
		694,
		2360.8
	],
	[
		416.9,
		2498.9,
		556.1,
		2498.9
	],
	[
		416.9,
		2498.9,
		1250.3,
		2498.9
	],
	[
		556.1,
		139.1,
		694,
		278
	],
	[
		556.1,
		139.1,
		833.4,
		139.1
	],
	[
		556.1,
		139.1,
		1110.8,
		139.1
	],
	[
		556.1,
		416.9,
		556.1,
		556.1
	],
	[
		556.1,
		416.9,
		694,
		278
	],
	[
		556.1,
		416.9,
		833.4,
		416.9
	],
	[
		556.1,
		416.9,
		1110.8,
		416.9
	],
	[
		556.1,
		556.1,
		556.1,
		833.4
	],
	[
		556.1,
		556.1,
		556.1,
		1110.8
	],
	[
		556.1,
		556.1,
		694,
		694
	],
	[
		556.1,
		833.4,
		556.1,
		1110.8
	],
	[
		556.1,
		833.4,
		694,
		972.3
	],
	[
		556.1,
		1110.8,
		694,
		1250.3
	],
	[
		556.1,
		1527.7,
		694,
		1389.1
	],
	[
		556.1,
		1527.7,
		694,
		1666.7
	],
	[
		556.1,
		1805.7,
		694,
		1666.7
	],
	[
		556.1,
		1805.7,
		833.4,
		1805.7
	],
	[
		556.1,
		2082.9,
		694,
		1944.2
	],
	[
		556.1,
		2082.9,
		833.4,
		1805.7
	],
	[
		556.1,
		2082.9,
		833.4,
		2082.9
	],
	[
		556.1,
		2222.4,
		694,
		2082.9
	],
	[
		556.1,
		2222.4,
		833.4,
		2222.4
	],
	[
		556.1,
		2222.4,
		1110.8,
		2222.4
	],
	[
		556.1,
		2498.9,
		694,
		2360.8
	],
	[
		556.1,
		2498.9,
		1110.8,
		2498.9
	],
	[
		694,
		278,
		972.3,
		278
	],
	[
		694,
		694,
		694,
		972.3
	],
	[
		694,
		694,
		833.4,
		556.1
	],
	[
		694,
		972.3,
		694,
		1250.3
	],
	[
		694,
		972.3,
		833.4,
		1110.8
	],
	[
		694,
		1250.3,
		833.4,
		1110.8
	],
	[
		694,
		1250.3,
		833.4,
		1250.3
	],
	[
		694,
		1389.1,
		833.4,
		1250.3
	],
	[
		694,
		1389.1,
		833.4,
		1389.1
	],
	[
		694,
		1666.7,
		833.4,
		1666.7
	],
	[
		694,
		1666.7,
		833.4,
		1805.7
	],
	[
		694,
		1944.2,
		833.4,
		1805.7
	],
	[
		694,
		2082.9,
		833.4,
		2082.9
	],
	[
		694,
		2360.8,
		833.4,
		2222.4
	],
	[
		694,
		2360.8,
		972.3,
		2360.8
	],
	[
		833.4,
		139.1,
		972.3,
		278
	],
	[
		833.4,
		139.1,
		1110.8,
		139.1
	],
	[
		833.4,
		416.9,
		833.4,
		556.1
	],
	[
		833.4,
		416.9,
		833.4,
		694
	],
	[
		833.4,
		416.9,
		1110.8,
		416.9
	],
	[
		833.4,
		556.1,
		833.4,
		694
	],
	[
		833.4,
		694,
		833.4,
		833.4
	],
	[
		833.4,
		694,
		833.4,
		1110.8
	],
	[
		833.4,
		694,
		972.3,
		556.1
	],
	[
		833.4,
		694,
		972.3,
		833.4
	],
	[
		833.4,
		694,
		1110.8,
		416.9
	],
	[
		833.4,
		694,
		1110.8,
		694
	],
	[
		833.4,
		833.4,
		833.4,
		1110.8
	],
	[
		833.4,
		833.4,
		972.3,
		833.4
	],
	[
		833.4,
		1110.8,
		833.4,
		1250.3
	],
	[
		833.4,
		1110.8,
		972.3,
		972.3
	],
	[
		833.4,
		1110.8,
		1110.8,
		833.4
	],
	[
		833.4,
		1250.3,
		833.4,
		1389.1
	],
	[
		833.4,
		1250.3,
		833.4,
		1666.7
	],
	[
		833.4,
		1389.1,
		833.4,
		1666.7
	],
	[
		833.4,
		1666.7,
		833.4,
		1805.7
	],
	[
		833.4,
		1666.7,
		972.3,
		1527.7
	],
	[
		833.4,
		1666.7,
		972.3,
		1666.7
	],
	[
		833.4,
		1666.7,
		972.3,
		1805.7
	],
	[
		833.4,
		1666.7,
		1250.3,
		1666.7
	],
	[
		833.4,
		1805.7,
		833.4,
		2082.9
	],
	[
		833.4,
		1805.7,
		972.3,
		1805.7
	],
	[
		833.4,
		2082.9,
		972.3,
		2082.9
	],
	[
		833.4,
		2082.9,
		1250.3,
		2082.9
	],
	[
		833.4,
		2222.4,
		1110.8,
		2222.4
	],
	[
		972.3,
		1,
		1110.8,
		139.1
	],
	[
		972.3,
		1,
		1250.3,
		1
	],
	[
		972.3,
		1,
		1250.3,
		278
	],
	[
		972.3,
		278,
		1110.8,
		416.9
	],
	[
		972.3,
		278,
		1250.3,
		278
	],
	[
		972.3,
		556.1,
		1110.8,
		416.9
	],
	[
		972.3,
		556.1,
		1250.3,
		556.1
	],
	[
		972.3,
		556.1,
		1527.7,
		556.1
	],
	[
		972.3,
		833.4,
		1110.8,
		694
	],
	[
		972.3,
		833.4,
		1110.8,
		833.4
	],
	[
		972.3,
		972.3,
		972.3,
		1250.3
	],
	[
		972.3,
		972.3,
		972.3,
		1527.7
	],
	[
		972.3,
		972.3,
		1110.8,
		833.4
	],
	[
		972.3,
		1250.3,
		972.3,
		1527.7
	],
	[
		972.3,
		1250.3,
		1110.8,
		1110.8
	],
	[
		972.3,
		1527.7,
		972.3,
		1666.7
	],
	[
		972.3,
		1527.7,
		1110.8,
		1389.1
	],
	[
		972.3,
		1666.7,
		1250.3,
		1666.7
	],
	[
		972.3,
		1805.7,
		1110.8,
		1944.2
	],
	[
		972.3,
		1805.7,
		1250.3,
		1805.7
	],
	[
		972.3,
		1805.7,
		1527.7,
		1805.7
	],
	[
		972.3,
		2082.9,
		1110.8,
		1944.2
	],
	[
		972.3,
		2082.9,
		1527.7,
		2082.9
	],
	[
		972.3,
		2360.8,
		1110.8,
		2222.4
	],
	[
		972.3,
		2360.8,
		1110.8,
		2498.9
	],
	[
		1110.8,
		139.1,
		1250.3,
		278
	],
	[
		1110.8,
		416.9,
		1250.3,
		278
	],
	[
		1110.8,
		416.9,
		1250.3,
		416.9
	],
	[
		1110.8,
		416.9,
		1527.7,
		416.9
	],
	[
		1110.8,
		694,
		1250.3,
		556.1
	],
	[
		1110.8,
		694,
		1389.1,
		694
	],
	[
		1110.8,
		833.4,
		1110.8,
		1110.8
	],
	[
		1110.8,
		833.4,
		1250.3,
		833.4
	],
	[
		1110.8,
		833.4,
		1250.3,
		972.3
	],
	[
		1110.8,
		1110.8,
		1110.8,
		1389.1
	],
	[
		1110.8,
		1110.8,
		1250.3,
		972.3
	],
	[
		1110.8,
		1389.1,
		1250.3,
		1527.7
	],
	[
		1110.8,
		1944.2,
		1389.1,
		1944.2
	],
	[
		1110.8,
		2222.4,
		1250.3,
		2082.9
	],
	[
		1110.8,
		2222.4,
		1250.3,
		2222.4
	],
	[
		1110.8,
		2498.9,
		1250.3,
		2498.9
	],
	[
		1250.3,
		1,
		1250.3,
		139.1
	],
	[
		1250.3,
		1,
		1250.3,
		278
	],
	[
		1250.3,
		139.1,
		1250.3,
		278
	],
	[
		1250.3,
		139.1,
		1389.1,
		278
	],
	[
		1250.3,
		139.1,
		1527.7,
		416.9
	],
	[
		1250.3,
		278,
		1250.3,
		416.9
	],
	[
		1250.3,
		416.9,
		1527.7,
		416.9
	],
	[
		1250.3,
		556.1,
		1527.7,
		556.1
	],
	[
		1250.3,
		833.4,
		1250.3,
		972.3
	],
	[
		1250.3,
		833.4,
		1389.1,
		833.4
	],
	[
		1250.3,
		833.4,
		1389.1,
		972.3
	],
	[
		1250.3,
		833.4,
		1527.7,
		833.4
	],
	[
		1250.3,
		972.3,
		1250.3,
		1250.3
	],
	[
		1250.3,
		1250.3,
		1250.3,
		1389.1
	],
	[
		1250.3,
		1250.3,
		1250.3,
		1527.7
	],
	[
		1250.3,
		1389.1,
		1250.3,
		1666.7
	],
	[
		1250.3,
		1389.1,
		1389.1,
		1527.7
	],
	[
		1250.3,
		1389.1,
		1527.7,
		1666.7
	],
	[
		1250.3,
		1527.7,
		1250.3,
		1666.7
	],
	[
		1250.3,
		1666.7,
		1389.1,
		1666.7
	],
	[
		1250.3,
		1666.7,
		1527.7,
		1666.7
	],
	[
		1250.3,
		1805.7,
		1389.1,
		1944.2
	],
	[
		1250.3,
		1805.7,
		1527.7,
		1805.7
	],
	[
		1250.3,
		2082.9,
		1250.3,
		2222.4
	],
	[
		1250.3,
		2082.9,
		1250.3,
		2498.9
	],
	[
		1250.3,
		2082.9,
		1389.1,
		2082.9
	],
	[
		1250.3,
		2082.9,
		1389.1,
		2222.4
	],
	[
		1250.3,
		2222.4,
		1250.3,
		2498.9
	],
	[
		1389.1,
		1,
		1389.1,
		278
	],
	[
		1389.1,
		1,
		1527.7,
		139.1
	],
	[
		1389.1,
		278,
		1527.7,
		416.9
	],
	[
		1389.1,
		694,
		1527.7,
		556.1
	],
	[
		1389.1,
		694,
		1527.7,
		833.4
	],
	[
		1389.1,
		833.4,
		1389.1,
		972.3
	],
	[
		1389.1,
		833.4,
		1666.7,
		833.4
	],
	[
		1389.1,
		972.3,
		1389.1,
		1250.3
	],
	[
		1389.1,
		972.3,
		1389.1,
		1527.7
	],
	[
		1389.1,
		972.3,
		1527.7,
		1110.8
	],
	[
		1389.1,
		1250.3,
		1389.1,
		1527.7
	],
	[
		1389.1,
		1250.3,
		1527.7,
		1389.1
	],
	[
		1389.1,
		1527.7,
		1527.7,
		1666.7
	],
	[
		1389.1,
		1666.7,
		1527.7,
		1666.7
	],
	[
		1389.1,
		1666.7,
		1527.7,
		1805.7
	],
	[
		1389.1,
		1666.7,
		1666.7,
		1944.2
	],
	[
		1389.1,
		1944.2,
		1527.7,
		2082.9
	],
	[
		1389.1,
		1944.2,
		1666.7,
		1944.2
	],
	[
		1389.1,
		2082.9,
		1389.1,
		2222.4
	],
	[
		1389.1,
		2082.9,
		1527.7,
		2082.9
	],
	[
		1389.1,
		2222.4,
		1389.1,
		2498.9
	],
	[
		1389.1,
		2222.4,
		1527.7,
		2360.8
	],
	[
		1527.7,
		1,
		1527.7,
		139.1
	],
	[
		1527.7,
		139.1,
		1527.7,
		416.9
	],
	[
		1527.7,
		139.1,
		1666.7,
		278
	],
	[
		1527.7,
		416.9,
		1666.7,
		278
	],
	[
		1527.7,
		416.9,
		1666.7,
		416.9
	],
	[
		1527.7,
		556.1,
		1666.7,
		416.9
	],
	[
		1527.7,
		556.1,
		1666.7,
		556.1
	],
	[
		1527.7,
		833.4,
		1666.7,
		833.4
	],
	[
		1527.7,
		1110.8,
		1527.7,
		1389.1
	],
	[
		1527.7,
		1110.8,
		1666.7,
		972.3
	],
	[
		1527.7,
		1389.1,
		1527.7,
		1666.7
	],
	[
		1527.7,
		1389.1,
		1666.7,
		1527.7
	],
	[
		1527.7,
		1666.7,
		1666.7,
		1527.7
	],
	[
		1527.7,
		1666.7,
		1666.7,
		1666.7
	],
	[
		1527.7,
		1805.7,
		1666.7,
		1944.2
	],
	[
		1527.7,
		2082.9,
		1666.7,
		1944.2
	],
	[
		1527.7,
		2082.9,
		1666.7,
		2082.9
	],
	[
		1527.7,
		2360.8,
		1527.7,
		2498.9
	],
	[
		1527.7,
		2360.8,
		1666.7,
		2222.4
	],
	[
		1666.7,
		1,
		1666.7,
		278
	],
	[
		1666.7,
		1,
		1944.2,
		1
	],
	[
		1666.7,
		1,
		2498.9,
		1
	],
	[
		1666.7,
		278,
		1666.7,
		416.9
	],
	[
		1666.7,
		278,
		1805.7,
		139.1
	],
	[
		1666.7,
		278,
		1805.7,
		416.9
	],
	[
		1666.7,
		278,
		1944.2,
		1
	],
	[
		1666.7,
		278,
		1944.2,
		278
	],
	[
		1666.7,
		416.9,
		1666.7,
		556.1
	],
	[
		1666.7,
		416.9,
		1805.7,
		416.9
	],
	[
		1666.7,
		556.1,
		1666.7,
		833.4
	],
	[
		1666.7,
		556.1,
		1805.7,
		416.9
	],
	[
		1666.7,
		556.1,
		1805.7,
		694
	],
	[
		1666.7,
		833.4,
		1666.7,
		972.3
	],
	[
		1666.7,
		833.4,
		1666.7,
		1110.8
	],
	[
		1666.7,
		972.3,
		1666.7,
		1250.3
	],
	[
		1666.7,
		1110.8,
		1666.7,
		1250.3
	],
	[
		1666.7,
		1110.8,
		1805.7,
		972.3
	],
	[
		1666.7,
		1250.3,
		1666.7,
		1527.7
	],
	[
		1666.7,
		1250.3,
		1944.2,
		1250.3
	],
	[
		1666.7,
		1527.7,
		1666.7,
		1666.7
	],
	[
		1666.7,
		1527.7,
		1805.7,
		1389.1
	],
	[
		1666.7,
		1527.7,
		1944.2,
		1250.3
	],
	[
		1666.7,
		1666.7,
		1666.7,
		1944.2
	],
	[
		1666.7,
		1944.2,
		1666.7,
		2082.9
	],
	[
		1666.7,
		2082.9,
		1666.7,
		2222.4
	],
	[
		1666.7,
		2082.9,
		1805.7,
		1944.2
	],
	[
		1666.7,
		2082.9,
		1805.7,
		2082.9
	],
	[
		1666.7,
		2222.4,
		1666.7,
		2498.9
	],
	[
		1666.7,
		2222.4,
		1805.7,
		2082.9
	],
	[
		1666.7,
		2222.4,
		1805.7,
		2360.8
	],
	[
		1666.7,
		2222.4,
		1944.2,
		2222.4
	],
	[
		1666.7,
		2222.4,
		1944.2,
		2498.9
	],
	[
		1666.7,
		2498.9,
		1944.2,
		2498.9
	],
	[
		1666.7,
		2498.9,
		2498.9,
		2498.9
	],
	[
		1805.7,
		139.1,
		1944.2,
		1
	],
	[
		1805.7,
		139.1,
		2082.9,
		139.1
	],
	[
		1805.7,
		139.1,
		2360.8,
		139.1
	],
	[
		1805.7,
		416.9,
		1805.7,
		694
	],
	[
		1805.7,
		416.9,
		1944.2,
		278
	],
	[
		1805.7,
		416.9,
		1944.2,
		556.1
	],
	[
		1805.7,
		416.9,
		2082.9,
		416.9
	],
	[
		1805.7,
		416.9,
		2082.9,
		694
	],
	[
		1805.7,
		416.9,
		2360.8,
		416.9
	],
	[
		1805.7,
		694,
		1805.7,
		972.3
	],
	[
		1805.7,
		694,
		1944.2,
		833.4
	],
	[
		1805.7,
		972.3,
		1944.2,
		1110.8
	],
	[
		1805.7,
		1389.1,
		1805.7,
		1666.7
	],
	[
		1805.7,
		1389.1,
		1805.7,
		1944.2
	],
	[
		1805.7,
		1389.1,
		1944.2,
		1250.3
	],
	[
		1805.7,
		1666.7,
		1805.7,
		1944.2
	],
	[
		1805.7,
		1666.7,
		1944.2,
		1527.7
	],
	[
		1805.7,
		1944.2,
		1805.7,
		2082.9
	],
	[
		1805.7,
		1944.2,
		1944.2,
		1805.7
	],
	[
		1805.7,
		2082.9,
		1944.2,
		2222.4
	],
	[
		1805.7,
		2082.9,
		2082.9,
		2082.9
	],
	[
		1805.7,
		2082.9,
		2360.8,
		2082.9
	],
	[
		1805.7,
		2360.8,
		1944.2,
		2498.9
	],
	[
		1805.7,
		2360.8,
		2082.9,
		2360.8
	],
	[
		1805.7,
		2360.8,
		2360.8,
		2360.8
	],
	[
		1944.2,
		1,
		2498.9,
		1
	],
	[
		1944.2,
		278,
		2082.9,
		139.1
	],
	[
		1944.2,
		278,
		2222.4,
		278
	],
	[
		1944.2,
		556.1,
		1944.2,
		833.4
	],
	[
		1944.2,
		556.1,
		1944.2,
		1110.8
	],
	[
		1944.2,
		556.1,
		2082.9,
		694
	],
	[
		1944.2,
		833.4,
		1944.2,
		1110.8
	],
	[
		1944.2,
		1110.8,
		1944.2,
		1250.3
	],
	[
		1944.2,
		1110.8,
		2082.9,
		1250.3
	],
	[
		1944.2,
		1250.3,
		1944.2,
		1527.7
	],
	[
		1944.2,
		1250.3,
		2082.9,
		1250.3
	],
	[
		1944.2,
		1250.3,
		2082.9,
		1389.1
	],
	[
		1944.2,
		1527.7,
		1944.2,
		1805.7
	],
	[
		1944.2,
		1527.7,
		2082.9,
		1389.1
	],
	[
		1944.2,
		1805.7,
		2082.9,
		1944.2
	],
	[
		1944.2,
		2222.4,
		2082.9,
		2360.8
	],
	[
		1944.2,
		2222.4,
		2222.4,
		2222.4
	],
	[
		1944.2,
		2498.9,
		2498.9,
		2498.9
	],
	[
		2082.9,
		139.1,
		2360.8,
		139.1
	],
	[
		2082.9,
		416.9,
		2082.9,
		556.1
	],
	[
		2082.9,
		416.9,
		2082.9,
		694
	],
	[
		2082.9,
		416.9,
		2222.4,
		556.1
	],
	[
		2082.9,
		416.9,
		2498.9,
		416.9
	],
	[
		2082.9,
		556.1,
		2082.9,
		833.4
	],
	[
		2082.9,
		556.1,
		2222.4,
		556.1
	],
	[
		2082.9,
		694,
		2082.9,
		972.3
	],
	[
		2082.9,
		833.4,
		2082.9,
		972.3
	],
	[
		2082.9,
		833.4,
		2222.4,
		833.4
	],
	[
		2082.9,
		972.3,
		2082.9,
		1250.3
	],
	[
		2082.9,
		972.3,
		2222.4,
		833.4
	],
	[
		2082.9,
		972.3,
		2222.4,
		1110.8
	],
	[
		2082.9,
		972.3,
		2360.8,
		972.3
	],
	[
		2082.9,
		972.3,
		2360.8,
		1250.3
	],
	[
		2082.9,
		1250.3,
		2082.9,
		1389.1
	],
	[
		2082.9,
		1250.3,
		2222.4,
		1250.3
	],
	[
		2082.9,
		1250.3,
		2222.4,
		1389.1
	],
	[
		2082.9,
		1250.3,
		2360.8,
		1250.3
	],
	[
		2082.9,
		1389.1,
		2082.9,
		1805.7
	],
	[
		2082.9,
		1389.1,
		2082.9,
		1944.2
	],
	[
		2082.9,
		1805.7,
		2082.9,
		2082.9
	],
	[
		2082.9,
		1805.7,
		2222.4,
		1944.2
	],
	[
		2082.9,
		1805.7,
		2360.8,
		2082.9
	],
	[
		2082.9,
		1944.2,
		2082.9,
		2082.9
	],
	[
		2082.9,
		2082.9,
		2360.8,
		2082.9
	],
	[
		2082.9,
		2360.8,
		2360.8,
		2360.8
	],
	[
		2222.4,
		278,
		2360.8,
		139.1
	],
	[
		2222.4,
		278,
		2360.8,
		416.9
	],
	[
		2222.4,
		556.1,
		2360.8,
		694
	],
	[
		2222.4,
		556.1,
		2498.9,
		556.1
	],
	[
		2222.4,
		833.4,
		2360.8,
		694
	],
	[
		2222.4,
		833.4,
		2360.8,
		972.3
	],
	[
		2222.4,
		833.4,
		2498.9,
		833.4
	],
	[
		2222.4,
		1110.8,
		2360.8,
		1250.3
	],
	[
		2222.4,
		1110.8,
		2498.9,
		1110.8
	],
	[
		2222.4,
		1250.3,
		2222.4,
		1389.1
	],
	[
		2222.4,
		1250.3,
		2498.9,
		1250.3
	],
	[
		2222.4,
		1389.1,
		2222.4,
		1666.7
	],
	[
		2222.4,
		1389.1,
		2222.4,
		1944.2
	],
	[
		2222.4,
		1389.1,
		2360.8,
		1527.7
	],
	[
		2222.4,
		1666.7,
		2222.4,
		1944.2
	],
	[
		2222.4,
		1666.7,
		2360.8,
		1805.7
	],
	[
		2222.4,
		1944.2,
		2360.8,
		2082.9
	],
	[
		2222.4,
		2222.4,
		2360.8,
		2082.9
	],
	[
		2222.4,
		2222.4,
		2360.8,
		2360.8
	],
	[
		2360.8,
		139.1,
		2498.9,
		1
	],
	[
		2360.8,
		139.1,
		2498.9,
		139.1
	],
	[
		2360.8,
		416.9,
		2498.9,
		416.9
	],
	[
		2360.8,
		694,
		2498.9,
		694
	],
	[
		2360.8,
		972.3,
		2498.9,
		972.3
	],
	[
		2360.8,
		972.3,
		2498.9,
		1110.8
	],
	[
		2360.8,
		1250.3,
		2498.9,
		1250.3
	],
	[
		2360.8,
		1527.7,
		2360.8,
		1805.7
	],
	[
		2360.8,
		1527.7,
		2498.9,
		1389.1
	],
	[
		2360.8,
		1805.7,
		2360.8,
		2082.9
	],
	[
		2360.8,
		1805.7,
		2498.9,
		1944.2
	],
	[
		2360.8,
		2082.9,
		2498.9,
		1944.2
	],
	[
		2360.8,
		2082.9,
		2498.9,
		2082.9
	],
	[
		2360.8,
		2360.8,
		2498.9,
		2360.8
	],
	[
		2360.8,
		2360.8,
		2498.9,
		2498.9
	],
	[
		2498.9,
		1,
		2498.9,
		139.1
	],
	[
		2498.9,
		1,
		2498.9,
		416.9
	],
	[
		2498.9,
		139.1,
		2498.9,
		416.9
	],
	[
		2498.9,
		1250.3,
		2498.9,
		1389.1
	],
	[
		2498.9,
		1250.3,
		2498.9,
		2498.9
	],
	[
		2498.9,
		1389.1,
		2498.9,
		1944.2
	],
	[
		2498.9,
		1944.2,
		2498.9,
		2082.9
	],
	[
		2498.9,
		2082.9,
		2498.9,
		2360.8
	],
	[
		2498.9,
		2360.8,
		2498.9,
		2498.9
	]
], Tt = 2500, Et = 1050, Dt = 3, Ot = 168, kt = 2.75, At = 1.65, jt = 3.5, Mt = 10;
function Nt(e, t, n, r, i) {
	let a = n - e, o = r - t, s = Math.hypot(a, o);
	if (s === 0) return "";
	let c = a / s, l = -(o / s) * i / 2, u = c * i / 2;
	return `M${(e + l).toFixed(2)},${(t + u).toFixed(2)}L${(n + l).toFixed(2)},${(r + u).toFixed(2)}L${(n - l).toFixed(2)},${(r - u).toFixed(2)}L${(e - l).toFixed(2)},${(t - u).toFixed(2)}Z`;
}
var Pt = (() => {
	let e = wt.map(([e, t, n, r]) => {
		let i = n - e, a = r - t, o, s;
		return Math.abs(a) < .5 ? (o = "H", s = t) : Math.abs(i) < .5 ? (o = "V", s = e) : i * a < 0 ? (o = "/", s = t + e) : (o = "\\", s = t - e), {
			kind: o,
			raw: s,
			edge: [
				e,
				t,
				n,
				r
			]
		};
	}), t = [];
	for (let n of [
		"H",
		"V",
		"/",
		"\\"
	]) {
		let r = e.filter((e) => e.kind === n).sort((e, t) => e.raw - t.raw);
		if (!r.length) continue;
		let i = [r[0]], a = () => {
			let e = i.flatMap((e) => [[e.edge[0], e.edge[1]], [e.edge[2], e.edge[3]]]), r = i.reduce((e, t) => e + t.raw, 0) / i.length, a, o, s, c;
			if (n === "H") {
				let t = e.map((e) => e[0]);
				a = Math.max(...t), o = r, s = Math.min(...t), c = r;
			} else if (n === "V") {
				let t = e.map((e) => e[1]);
				a = r, o = Math.min(...t), s = r, c = Math.max(...t);
			} else if (n === "/") {
				let t = e.map((e) => e[1]), n = Math.min(...t), i = Math.max(...t);
				a = r - n, o = n, s = r - i, c = i;
			} else {
				let t = e.map((e) => e[1]), n = Math.min(...t), i = Math.max(...t);
				a = n - r, o = n, s = i - r, c = i;
			}
			let l = i.map((e) => Nt(e.edge[0], e.edge[1], e.edge[2], e.edge[3], jt)).join("");
			t.push({
				kind: n,
				intercept: r,
				sx: a,
				sy: o,
				ex: s,
				ey: c,
				clipD: l
			});
		};
		for (let e = 1; e < r.length; e++) r[e].raw - i[i.length - 1].raw > Mt ? (a(), i = [r[e]]) : i.push(r[e]);
		a();
	}
	let n = {
		H: 0,
		V: 1,
		"/": 2,
		"\\": 3
	};
	return t.sort((e, t) => n[e.kind] === n[t.kind] ? e.kind === "H" ? e.sy - t.sy : e.kind === "V" ? e.sx - t.sx : e.intercept - t.intercept : n[e.kind] - n[t.kind]), t.forEach((e, t) => {
		e.idx = t;
	}), t;
})(), Ft = wt.map(([e, t, n, r]) => `M${e},${t}L${n},${r}`).join("");
function It({ lane: e, gradId: t, speed: n = 1 }) {
	let { sx: r, sy: i, ex: a, ey: o } = e, s = a - r, c = o - i, l = Math.hypot(s, c), u = s / l, d = c / l, f = r - u * Ot, p = i - d * Ot, m = a + u * Ot, g = o + d * Ot, _ = `M${f.toFixed(1)},${p.toFixed(1)} L${m.toFixed(1)},${g.toFixed(1)}`, v = Dt / n, y = (l + 2 * Ot) / (Et * n), b = Math.min(y / v, .999);
	return /* @__PURE__ */ h("rect", {
		x: -168 / 2,
		y: -2.75 / 2,
		width: Ot,
		height: kt,
		fill: `url(#${t})`,
		children: /* @__PURE__ */ h("animateMotion", {
			dur: `${(Dt / n).toFixed(3)}s`,
			repeatCount: "indefinite",
			rotate: "auto",
			keyPoints: "0;1;1",
			keyTimes: `0;${b.toFixed(3)};1`,
			calcMode: "linear",
			path: _
		})
	});
}
var Lt = {
	slow: .6,
	normal: 1,
	fast: 1.6
}, Rt = (e) => typeof e == "number" && Number.isFinite(e) && e > 0 ? e : typeof e == "string" && e in Lt ? Lt[e] : 1;
function zt() {
	let [e, t] = d(!1);
	return a(() => {
		if (typeof window > "u" || !window.matchMedia) return;
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), n = () => t(e.matches);
		return n(), e.addEventListener?.("change", n), () => e.removeEventListener?.("change", n);
	}, []), e;
}
function Bt({ className: e, style: t, lineColor: n = "color-mix(in srgb, var(--tesseract-slate-0) 14%, transparent)", cometColor: r = "var(--tesseract-slate-0)", edgeFade: i = !0, speed: a = "normal", density: s = 1, animated: c = !0 }) {
	let l = zt(), u = c && !l, d = Rt(a), f = Math.max(0, Math.min(1, Number(s))), p = !u || f <= 0 ? [] : f >= 1 ? Pt : Pt.filter((e, t) => Math.floor(t * f) !== Math.floor((t - 1) * f)), m = o().replace(/:/g, ""), _ = `${m}-comet`, v = i === !0 ? .6 : i === !1 ? 0 : Math.max(0, Math.min(1, Number(i) || 0)), y = null;
	if (v > 0) {
		let e = (75 - 55 * v).toFixed(0), t = Math.min(100, 108 - 45 * v).toFixed(0), n = `radial-gradient(closest-side, #000 ${e}%, rgba(0,0,0,0.3) ${(Number(e) + (Number(t) - Number(e)) * .55).toFixed(0)}%, transparent ${t}%)`;
		y = {
			WebkitMaskImage: n,
			maskImage: n
		};
	}
	return /* @__PURE__ */ g("svg", {
		className: e,
		style: {
			...y,
			...t
		},
		viewBox: `0 0 ${Tt} ${Tt}`,
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		preserveAspectRatio: "xMidYMid slice",
		"aria-hidden": !0,
		children: [/* @__PURE__ */ g("defs", { children: [p.map((e) => /* @__PURE__ */ h("clipPath", {
			id: `${m}-lc${e.idx}`,
			clipPathUnits: "userSpaceOnUse",
			children: /* @__PURE__ */ h("path", { d: e.clipD })
		}, e.idx)), /* @__PURE__ */ g("linearGradient", {
			id: _,
			x1: "0",
			y1: "0",
			x2: "1",
			y2: "0",
			children: [
				/* @__PURE__ */ h("stop", {
					offset: "0",
					stopColor: r,
					stopOpacity: "0"
				}),
				/* @__PURE__ */ h("stop", {
					offset: "0.55",
					stopColor: r,
					stopOpacity: "0.5"
				}),
				/* @__PURE__ */ h("stop", {
					offset: "0.9",
					stopColor: r,
					stopOpacity: "0.95"
				}),
				/* @__PURE__ */ h("stop", {
					offset: "1",
					stopColor: r,
					stopOpacity: "1"
				})
			]
		})] }), /* @__PURE__ */ g("g", { children: [/* @__PURE__ */ h("path", {
			d: Ft,
			stroke: n,
			strokeWidth: At,
			strokeLinecap: "square",
			fill: "none"
		}), p.map((e) => /* @__PURE__ */ h("g", {
			clipPath: `url(#${m}-lc${e.idx})`,
			children: /* @__PURE__ */ h(It, {
				lane: e,
				gradId: _,
				speed: d
			})
		}, e.idx))] })]
	});
}
//#endregion
//#region src/components/atoms/LightRays/LightRays.jsx
var Vt = "attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }", Ht = "\nprecision highp float;\nuniform vec2  uResolution;\nuniform float uTime;\nuniform vec2  uRayPos;\nuniform vec2  uRayDir;\nuniform vec3  uColor1;\nuniform vec3  uColor2;\nuniform float uSpread;\nuniform float uLength;\nuniform float uFade;\nuniform float uNoise;\nuniform float uDistort;\nuniform float uIntensity;\nuniform float uSpeed;\n\nfloat hash(vec2 st){ return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }\n\n// ReactBits LightRays — rayStrength: soft, drifting volumetric beams radiating\n// from a source toward a reference direction, with an angular spread + length\n// and fade falloff.\nfloat rayStrength(vec2 src, vec2 refDir, vec2 coord, float seedA, float seedB, float speed){\n  vec2 s2c = coord - src;\n  vec2 dirN = normalize(s2c);\n  float cosA = dot(dirN, refDir);\n  float dAng = cosA + uDistort * sin(uTime * 2.0 + length(s2c) * 0.01) * 0.2;\n  float spread = pow(max(dAng, 0.0), 1.0 / max(uSpread, 0.001));\n\n  float dist = length(s2c);\n  float maxD = uResolution.x * uLength;\n  float lenFall = clamp((maxD - dist) / maxD, 0.0, 1.0);\n  // fade fully to 0 far from the source (ReactBits floors at 0.5, which floods a\n  // short wide banner) so the dark field survives between/beyond the beams.\n  float fadeFall = clamp((uResolution.x * uFade - dist) / (uResolution.x * uFade), 0.0, 1.0);\n\n  // broad, smooth undulation (not thin streaks) — a soft body of light rather\n  // than defined rays. Low seed frequency + higher DC keeps it a gentle wash.\n  float base = clamp(\n    (0.42 + 0.16 * sin(dAng * seedA + uTime * speed)) +\n    (0.34 + 0.14 * cos(-dAng * seedB + uTime * speed)),\n    0.0, 1.0);\n\n  return base * lenFall * fadeFall * spread;\n}\n\nvoid main(){\n  vec2 coord = gl_FragCoord.xy;\n\n  // organic domain warp — displace the sampling point by a slow fbm field so the\n  // light body ripples like a natural wave/cloud instead of a placed radial edge\n  float ws = 0.0016;\n  vec2 warp = vec2(\n    fbm(coord * ws + uTime * 0.03),\n    fbm(coord * ws + vec2(7.3, 2.1) - uTime * 0.025)\n  ) - 0.5;\n  vec2 wc = coord + warp * 260.0;\n\n  float r1 = rayStrength(uRayPos, uRayDir, wc, 6.0, 4.2, 1.5 * uSpeed);\n  float r2 = rayStrength(uRayPos, uRayDir, wc, 4.4, 3.1, 1.1 * uSpeed);\n  float strength = r1 * 0.5 + r2 * 0.4;\n\n  // a second slow fbm gently undulates the whole body (adds the wave feel)\n  float wave = 0.55 + 0.6 * fbm(coord * 0.0012 + vec2(uTime * 0.04, -uTime * 0.03));\n  strength *= wave;\n\n  if (uNoise > 0.0){\n    float n = hash(coord * 0.01 + uTime * 0.1);\n    strength *= (1.0 - uNoise + uNoise * n);\n  }\n\n  // gentle contrast only — keep it a smooth body of light, not hard-edged streaks\n  strength = pow(clamp(strength, 0.0, 1.0), 1.12);\n\n  // blend the two tints across the fan\n  float cmix = 0.5 + 0.5 * sin(dot(normalize(coord - uRayPos), uRayDir) * 3.0);\n  vec3 col = mix(uColor1, uColor2, clamp(cmix, 0.0, 1.0));\n\n  // alpha = 1: dark pixels are ~black and vanish under CSS 'screen' blend;\n  // bright beams lighten the surface. No GL blending needed.\n  gl_FragColor = vec4(col * strength * uIntensity, 1.0);\n}\n";
function Ut(e, t) {
	try {
		let n = document.createElement("span");
		n.style.cssText = "display:none;color:" + e, (t || document.body).appendChild(n);
		let r = getComputedStyle(n).color;
		n.remove();
		let i = r.match(/[\d.]+/g);
		return i ? [
			i[0] / 255,
			i[1] / 255,
			i[2] / 255
		] : [
			1,
			1,
			1
		];
	} catch {
		return [
			1,
			1,
			1
		];
	}
}
function Wt({ color1: t = "var(--tesseract-violet-200)", color2: n = "var(--tesseract-blue-200)", origin: r = [-.04, -.04], direction: i = [1, .6], spread: a = 1.35, length: o = 2.1, fade: s = 1.15, noise: c = .08, distortion: l = .05, intensity: u = .36, speed: d = .35, blur: f = 16, className: p, style: m, ...g }) {
	let _ = e.useRef(null), v = e.useRef(null), [y, b] = r, [x, S] = i;
	return e.useEffect(() => {
		let e = v.current, r = _.current;
		if (!e || !r) return;
		let i = e.getContext("webgl", {
			premultipliedAlpha: !1,
			antialias: !0,
			alpha: !0
		});
		if (!i) return;
		let f = (e, t) => {
			let n = i.createShader(e);
			return i.shaderSource(n, t), i.compileShader(n), n;
		}, p = i.createProgram();
		if (i.attachShader(p, f(i.VERTEX_SHADER, Vt)), i.attachShader(p, f(i.FRAGMENT_SHADER, Ht)), i.linkProgram(p), !i.getProgramParameter(p, i.LINK_STATUS)) return;
		i.useProgram(p);
		let m = i.createBuffer();
		i.bindBuffer(i.ARRAY_BUFFER, m), i.bufferData(i.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			3,
			-1,
			-1,
			3
		]), i.STATIC_DRAW);
		let h = i.getAttribLocation(p, "aPos");
		i.enableVertexAttribArray(h), i.vertexAttribPointer(h, 2, i.FLOAT, !1, 0, 0);
		let g = (e) => i.getUniformLocation(p, e);
		i.uniform3fv(g("uColor1"), Ut(t, r)), i.uniform3fv(g("uColor2"), Ut(n, r)), i.uniform1f(g("uSpread"), a), i.uniform1f(g("uLength"), o), i.uniform1f(g("uFade"), s), i.uniform1f(g("uNoise"), c), i.uniform1f(g("uDistort"), l), i.uniform1f(g("uIntensity"), u), i.uniform1f(g("uSpeed"), d);
		let C = Math.hypot(x, S) || 1;
		i.uniform2f(g("uRayDir"), x / C, -S / C);
		let w = g("uResolution"), T = g("uTime"), E = g("uRayPos"), D = typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, O = Math.min(window.devicePixelRatio || 1, 2), k = () => {
			let t = r.clientWidth || 1, n = r.clientHeight || 1;
			e.width = Math.max(1, Math.floor(t * O)), e.height = Math.max(1, Math.floor(n * O)), i.viewport(0, 0, e.width, e.height), i.uniform2f(w, e.width, e.height), i.uniform2f(E, y * e.width, (1 - b) * e.height);
		};
		k();
		let A = typeof ResizeObserver == "function" ? new ResizeObserver(k) : null;
		A?.observe(r);
		let j = 0, M = performance.now(), N = (e) => {
			i.uniform1f(T, (e - M) / 1e3), i.drawArrays(i.TRIANGLES, 0, 3), j = requestAnimationFrame(N);
		};
		return D ? (i.uniform1f(T, 3.2), i.drawArrays(i.TRIANGLES, 0, 3)) : j = requestAnimationFrame(N), () => {
			j && cancelAnimationFrame(j), A?.disconnect(), i.getExtension("WEBGL_lose_context")?.loseContext();
		};
	}, [
		t,
		n,
		y,
		b,
		x,
		S,
		a,
		o,
		s,
		c,
		l,
		u,
		d
	]), /* @__PURE__ */ h("div", {
		ref: _,
		className: p,
		"aria-hidden": !0,
		style: {
			position: "absolute",
			inset: 0,
			pointerEvents: "none",
			mixBlendMode: "screen",
			filter: f ? `blur(${f}px)` : void 0,
			...m
		},
		...g,
		children: /* @__PURE__ */ h("canvas", {
			ref: v,
			style: {
				width: "100%",
				height: "100%",
				display: "block"
			}
		})
	});
}
Wt.displayName = "LightRays";
var Gt = {
	toast: "_toast_7oemf_3",
	title: "_title_7oemf_43",
	message: "_message_7oemf_46",
	dismiss: "_dismiss_7oemf_49",
	icon: "_icon_7oemf_58",
	body: "_body_7oemf_97",
	action: "_action_7oemf_133",
	progress: "_progress_7oemf_169",
	progressBar: "_progressBar_7oemf_177",
	"toast-progress": "_toast-progress_7oemf_1"
}, Kt = {
	info: {
		name: "info",
		variant: "bold"
	},
	success: {
		name: "verify",
		variant: "bold"
	},
	warning: {
		name: "danger",
		variant: "bold"
	},
	error: {
		name: "danger",
		variant: "bold"
	}
}, qt = (e) => typeof e == "number" ? `${e}px` : e, Jt = n(function({ status: e = "info", surface: t = "dark", title: n, children: r, action: i, showIcon: o = !0, icon: s, statusIcons: c, dismissible: l = !1, closeIcon: f, maxWidth: p, lineClamp: m, progress: _ = !1, duration: v = 0, onDismiss: y, className: b = "", style: x, ...S }, C) {
	let [w, T] = d(!0), [E, D] = d(!1), O = u(y);
	if (a(() => {
		O.current = y;
	}), a(() => {
		if (!v || !w || E) return;
		let e = setTimeout(() => {
			T(!1), O.current?.();
		}, v);
		return () => clearTimeout(e);
	}, [
		v,
		w,
		E
	]), !w) return null;
	let k = () => {
		T(!1), y?.();
	}, A = Kt[e] ?? Kt.info, j = c?.[e], M = j ? {
		...A,
		name: j
	} : A, N = n != null && r != null, P = e === "error" || e === "warning", F = _ && v > 0, I = {
		...p == null ? null : { "--toast-max-width": qt(p) },
		...m == null ? null : { "--toast-line-clamp": m },
		...F ? { "--toast-duration": `${v}ms` } : null
	};
	return /* @__PURE__ */ g("div", {
		ref: C,
		...S,
		className: [Gt.toast, b].filter(Boolean).join(" "),
		style: {
			...I,
			...x
		},
		"data-status": e,
		"data-surface": t,
		"data-lines": N ? "two" : "one",
		"data-paused": F && E ? "true" : void 0,
		role: P ? "alert" : "status",
		"aria-live": P ? "assertive" : "polite",
		onMouseEnter: v ? () => D(!0) : void 0,
		onMouseLeave: v ? () => D(!1) : void 0,
		children: [
			o && /* @__PURE__ */ h("span", {
				className: Gt.icon,
				"data-status": e,
				children: s ?? /* @__PURE__ */ h(bt, {
					name: M.name,
					variant: M.variant,
					size: N ? 42 : 24
				})
			}),
			/* @__PURE__ */ g("div", {
				className: Gt.body,
				children: [n != null && /* @__PURE__ */ h("p", {
					className: Gt.title,
					children: n
				}), r != null && /* @__PURE__ */ h("div", {
					className: Gt.message,
					children: r
				})]
			}),
			i && /* @__PURE__ */ h("div", {
				className: Gt.action,
				children: i
			}),
			l && /* @__PURE__ */ h("button", {
				type: "button",
				className: Gt.dismiss,
				"aria-label": "Dismiss",
				onClick: k,
				children: f == null ? /* @__PURE__ */ h(z, {
					name: "close-square",
					variant: "bold",
					size: 24
				}) : typeof f == "string" ? /* @__PURE__ */ h(z, {
					name: f,
					variant: "bold",
					size: 24
				}) : f
			}),
			F && /* @__PURE__ */ h("div", {
				className: Gt.progress,
				"aria-hidden": "true",
				children: /* @__PURE__ */ h("div", { className: Gt.progressBar })
			})
		]
	});
});
Jt.displayName = "Toast";
//#endregion
//#region src/hooks/ui/Portal.jsx
function Yt({ children: e, container: t }) {
	if (typeof document > "u") return null;
	let n = t || document.body;
	return n ? p(e, n) : null;
}
//#endregion
//#region src/hooks/ui/use-overlay.js
function Xt(t, n = !0) {
	e.useEffect(() => {
		if (!n) return;
		let e = (e) => {
			e.key === "Escape" && t?.(e);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [t, n]);
}
function Zt(t, n, r = !0) {
	e.useEffect(() => {
		if (!r) return;
		let e = (e) => {
			let r = Array.isArray(t) ? t : [t], i = e.target;
			r.some((e) => {
				let t = e?.current;
				return t && t.contains(i);
			}) || n?.(e);
		};
		return document.addEventListener("pointerdown", e, !0), () => document.removeEventListener("pointerdown", e, !0);
	}, [
		t,
		n,
		r
	]);
}
function Qt(t) {
	e.useEffect(() => {
		if (!t || typeof document > "u") return;
		let e = document.body, n = e.style.overflow, r = e.style.paddingRight, i = window.innerWidth - document.documentElement.clientWidth;
		return e.style.overflow = "hidden", i > 0 && (e.style.paddingRight = `${i}px`), () => {
			e.style.overflow = n, e.style.paddingRight = r;
		};
	}, [t]);
}
function $t(t, n) {
	e.useEffect(() => {
		if (!n || typeof document > "u") return;
		let e = document.activeElement, r = t.current;
		if (!r) return;
		let i = () => Array.from(r.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])")).filter((e) => !e.hasAttribute("data-focus-trap-skip")), a = i();
		a.length ? a[0].focus() : (r.setAttribute("tabindex", "-1"), r.focus());
		let o = (e) => {
			if (e.key !== "Tab") return;
			let t = i();
			if (t.length === 0) {
				e.preventDefault();
				return;
			}
			let n = t[0], r = t[t.length - 1];
			e.shiftKey && document.activeElement === n ? (e.preventDefault(), r.focus()) : !e.shiftKey && document.activeElement === r && (e.preventDefault(), n.focus());
		};
		return r.addEventListener("keydown", o), () => {
			r.removeEventListener("keydown", o), e && typeof e.focus == "function" && e.focus();
		};
	}, [t, n]);
}
function en({ triggerRef: t, floatingRef: n, open: r, side: i = "top", align: a = "center", sideOffset: o = 6, collisionPadding: s = 8 }) {
	let [c, l] = e.useState({
		x: 0,
		y: 0,
		side: i
	});
	return e.useLayoutEffect(() => {
		if (!r) return;
		let e = t.current, c = n.current;
		if (!e || !c) return;
		let u = 0, d = () => {
			let t = e.getBoundingClientRect(), n = c.getBoundingClientRect(), r = window.innerWidth, u = window.innerHeight, d = i, f = (e) => e === "top" ? t.top - n.height - o >= s : e === "bottom" ? t.bottom + n.height + o <= u - s : e === "left" ? t.left - n.width - o >= s : e === "right" ? t.right + n.width + o <= r - s : !0, p = {
				top: "bottom",
				bottom: "top",
				left: "right",
				right: "left"
			};
			!f(i) && f(p[i]) && (d = p[i]);
			let m = 0, h = 0;
			d === "top" || d === "bottom" ? (m = a === "start" ? t.left : a === "end" ? t.right - n.width : t.left + (t.width - n.width) / 2, h = d === "top" ? t.top - n.height - o : t.bottom + o) : (h = a === "start" ? t.top : a === "end" ? t.bottom - n.height : t.top + (t.height - n.height) / 2, m = d === "left" ? t.left - n.width - o : t.right + o), m = Math.max(s, Math.min(m, r - n.width - s)), h = Math.max(s, Math.min(h, u - n.height - s)), l((e) => e.x === m && e.y === h && e.side === d ? e : {
				x: m,
				y: h,
				side: d
			});
		}, f = () => {
			cancelAnimationFrame(u), u = requestAnimationFrame(d);
		};
		f();
		let p = typeof ResizeObserver < "u" ? new ResizeObserver(f) : null;
		return p?.observe(c), p?.observe(e), window.addEventListener("scroll", f, !0), window.addEventListener("resize", f), () => {
			cancelAnimationFrame(u), p?.disconnect(), window.removeEventListener("scroll", f, !0), window.removeEventListener("resize", f);
		};
	}, [
		r,
		t,
		n,
		i,
		a,
		o,
		s
	]), c;
}
//#endregion
//#region src/hooks/ui/DialogPrimitive.jsx
var tn = e.createContext(null);
function nn({ open: t, defaultOpen: n = !1, onOpenChange: r, children: i }) {
	let a = t !== void 0, [o, s] = e.useState(!!n), c = a ? !!t : o, l = e.useCallback((e) => {
		a || s(e), r?.(e);
	}, [a, r]), u = e.useRef(null), d = e.useRef(null), f = e.useRef(null), p = e.useId(), m = e.useId(), g = e.useMemo(() => ({
		open: c,
		setOpen: l,
		triggerRef: u,
		contentRef: d,
		interactOutsideRef: f,
		titleId: p,
		descId: m
	}), [
		c,
		l,
		p,
		m
	]);
	return /* @__PURE__ */ h(tn.Provider, {
		value: g,
		children: i
	});
}
function rn({ asChild: t, children: n, ...r }) {
	let i = e.useContext(tn);
	if (!i) return n;
	let a = {
		onClick: (e) => {
			r.onClick?.(e), !e.defaultPrevented && i.setOpen(!0);
		},
		"aria-haspopup": "dialog",
		"aria-expanded": i.open,
		"data-state": i.open ? "open" : "closed",
		ref: i.triggerRef
	};
	return t ? /* @__PURE__ */ h(V, {
		...a,
		children: n
	}) : /* @__PURE__ */ h("button", {
		type: "button",
		...a,
		...r,
		children: n
	});
}
function an({ asChild: t, children: n, ...r }) {
	let i = e.useContext(tn), a = (e) => {
		r.onClick?.(e), !e.defaultPrevented && i?.setOpen(!1);
	};
	return t ? /* @__PURE__ */ h(V, {
		...r,
		onClick: a,
		children: n
	}) : /* @__PURE__ */ h("button", {
		type: "button",
		...r,
		onClick: a,
		children: n
	});
}
function on({ children: t }) {
	return e.useContext(tn)?.open ? /* @__PURE__ */ h(Yt, { children: t }) : null;
}
function sn({ className: t, style: n, onClick: r, ...i }) {
	let a = e.useContext(tn);
	return /* @__PURE__ */ h("div", {
		"data-state": a?.open ? "open" : "closed",
		onClick: (e) => {
			r?.(e), !e.defaultPrevented && (a?.interactOutsideRef?.current?.(e), !e.defaultPrevented && a?.setOpen(!1));
		},
		className: t,
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 50,
			...n
		},
		...i
	});
}
var cn = e.forwardRef(function({ className: t, style: n, children: r, onEscapeKeyDown: i, onInteractOutside: a, "aria-labelledby": o, "aria-describedby": s, ...c }, l) {
	let u = e.useContext(tn), d = e.useRef(null);
	return e.useImperativeHandle(l, () => d.current), e.useEffect(() => {
		let e = d.current, t = u.contentRef, n = u.interactOutsideRef;
		return t.current = e, n.current = a ?? null, () => {
			t.current === e && (t.current = null), n.current = null;
		};
	}, [u, a]), Qt(u.open), $t(d, u.open), Xt((e) => {
		i?.(e), e.defaultPrevented || u.setOpen(!1);
	}, u.open), /* @__PURE__ */ h("div", {
		ref: d,
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": o ?? u.titleId,
		"aria-describedby": s ?? u.descId,
		"data-state": u.open ? "open" : "closed",
		className: t,
		style: {
			position: "fixed",
			zIndex: 51,
			...n
		},
		onClick: (e) => e.stopPropagation(),
		...c,
		children: r
	});
}), ln = e.forwardRef(function({ className: t, style: n, children: r, ...i }, a) {
	return /* @__PURE__ */ h("h2", {
		ref: a,
		id: e.useContext(tn)?.titleId,
		className: t,
		style: n,
		...i,
		children: r
	});
}), un = e.forwardRef(function({ className: t, style: n, children: r, ...i }, a) {
	return /* @__PURE__ */ h("p", {
		ref: a,
		id: e.useContext(tn)?.descId,
		className: t,
		style: n,
		...i,
		children: r
	});
});
nn.displayName = "DialogPrimitive.Root", rn.displayName = "DialogPrimitive.Trigger", an.displayName = "DialogPrimitive.Close", on.displayName = "DialogPrimitive.Portal", sn.displayName = "DialogPrimitive.Overlay", cn.displayName = "DialogPrimitive.Content", ln.displayName = "DialogPrimitive.Title", un.displayName = "DialogPrimitive.Description";
var dn = {
	overlay: "_overlay_12ph0_3",
	content: "_content_12ph0_10",
	header: "_header_12ph0_43",
	headerMain: "_headerMain_12ph0_52",
	headerIcon: "_headerIcon_12ph0_59",
	title: "_title_12ph0_67",
	closeBtn: "_closeBtn_12ph0_76",
	divider: "_divider_12ph0_102",
	body: "_body_12ph0_11",
	callout: "_callout_12ph0_115",
	calloutIcon: "_calloutIcon_12ph0_137",
	calloutText: "_calloutText_12ph0_152",
	description: "_description_12ph0_163",
	checkboxRow: "_checkboxRow_12ph0_175",
	checkboxLabel: "_checkboxLabel_12ph0_183",
	footer: "_footer_12ph0_188",
	footerLeft: "_footerLeft_12ph0_197",
	footerRight: "_footerRight_12ph0_203"
}, fn = {
	Root: nn,
	Portal: on,
	Overlay: sn,
	Content: e.forwardRef(function(e, t) {
		return /* @__PURE__ */ h(cn, {
			ref: t,
			role: "alertdialog",
			...e
		});
	}),
	Title: ln,
	Description: un,
	Close: an
};
function pn(e, { size: t = 24, variant: n = "bold" } = {}) {
	return e == null || e === !1 || e === "" ? null : typeof e == "string" ? /* @__PURE__ */ h(z, {
		name: e,
		variant: n,
		size: t
	}) : e;
}
function mn({ tone: t = "warning", icon: n = !0, customIcon: r, lineClamp: i = 3, children: a }) {
	let o = t === "neutral", s = e.useRef(null), [c, l] = e.useState(1);
	e.useLayoutEffect(() => {
		let e = s.current;
		if (!e) return;
		let t = () => {
			let t = parseFloat(getComputedStyle(e).lineHeight) || 20;
			l(Math.max(1, Math.min(3, Math.round(e.scrollHeight / t))));
		};
		t();
		let n = typeof ResizeObserver < "u" ? new ResizeObserver(t) : null;
		return n?.observe(e), () => n?.disconnect();
	}, [a]);
	let u = c >= 3 ? 42 : 24;
	return /* @__PURE__ */ g("div", {
		className: dn.callout,
		"data-tone": t,
		children: [n && /* @__PURE__ */ h("span", {
			className: dn.calloutIcon,
			"aria-hidden": !0,
			children: r ?? /* @__PURE__ */ h(bt, {
				name: o ? "info" : t === "error" ? "danger" : "warning",
				variant: "bulk",
				size: u
			})
		}), /* @__PURE__ */ h("div", {
			ref: s,
			className: dn.calloutText,
			style: { "--cd-callout-lines": i },
			children: a
		})]
	});
}
function hn({ label: e, onClick: t, variant: n, theme: r, disabled: i, loading: a = !1, autoClose: o = !0, fullWidth: s = !1 }) {
	if (!e) return null;
	let c = i || a, l = /* @__PURE__ */ h(G, {
		variant: n,
		theme: r,
		size: "sm",
		disabled: c,
		loading: a,
		style: s ? { flex: 1 } : void 0,
		onClick: (e) => {
			if (c) {
				e.preventDefault();
				return;
			}
			o || e.preventDefault(), t?.();
		},
		children: e
	});
	return o ? /* @__PURE__ */ h(fn.Close, {
		asChild: !0,
		children: l
	}) : l;
}
var gn = e.forwardRef(function({ open: t, onOpenChange: n, title: r, size: i = "md", icon: a, headerIcon: o, hideClose: s = !1, closeIcon: c = "close-square", description: l, callout: u, calloutTone: d = "warning", calloutIcon: f = !0, calloutCustomIcon: p, calloutPlacement: _ = "above", calloutLines: v = 3, descriptionLines: y = 3, children: b, checkboxLabel: x, checkboxChecked: S, defaultCheckboxChecked: C = !1, onCheckboxChange: w, primaryLabel: T, onPrimary: E, primaryVariant: D = "solid", primaryTheme: O = "primary", primaryDisabled: k = !1, primaryLoading: A = !1, primaryAutoClose: j = !0, secondaryLabel: M, onSecondary: N, secondaryVariant: P = "outline", secondaryTheme: F = "neutral", secondaryDisabled: I = !1, tertiaryLabel: L, onTertiary: ee, tertiaryVariant: te = "link", tertiaryTheme: ne = "neutral", actionsAlign: R = "right", actionsFullWidth: B = !1, warning: re, primaryTone: V, confirmLabel: ie, onConfirm: ae, confirmTheme: oe, confirmDisabled: H, cancelLabel: se, onCancel: ce, secondaryTone: le, className: ue, style: W, ...de }, fe) {
	let pe = T ?? ie, G = E ?? ae, me = oe ?? V ?? O, he = H ?? k, ge = M ?? se, K = N ?? ce, _e = le === "destructive" ? "error" : F, ve = u ?? re, ye = u ? d : re ? "warning" : d, [be, xe] = e.useState(!!C), Se = S === void 0 ? be : S, q = (e) => {
		S === void 0 && xe(!!e), w?.(!!e);
	}, Ce = ve ? /* @__PURE__ */ h(mn, {
		tone: ye,
		icon: f,
		customIcon: p,
		lineClamp: v,
		children: ve
	}) : null, we = l ? /* @__PURE__ */ h(fn.Description, {
		className: dn.description,
		style: { "--cd-desc-lines": y },
		children: l
	}) : null, Te = Ce || we || b || x, J = pn(o ?? a, { size: 24 }), Ee = pn(c, { size: 24 });
	return /* @__PURE__ */ h(fn.Root, {
		open: t,
		onOpenChange: n,
		children: /* @__PURE__ */ g(fn.Portal, { children: [/* @__PURE__ */ h(fn.Overlay, { className: dn.overlay }), /* @__PURE__ */ g(fn.Content, {
			ref: fe,
			"data-voice-allow": !0,
			"data-size": i,
			className: U(dn.content, ue),
			style: W,
			...de,
			children: [
				/* @__PURE__ */ g("div", {
					className: dn.header,
					children: [/* @__PURE__ */ g("div", {
						className: dn.headerMain,
						children: [J && /* @__PURE__ */ h("span", {
							className: dn.headerIcon,
							"aria-hidden": !0,
							children: J
						}), /* @__PURE__ */ h(fn.Title, {
							className: dn.title,
							children: r
						})]
					}), !s && /* @__PURE__ */ h(fn.Close, {
						asChild: !0,
						children: /* @__PURE__ */ h("button", {
							type: "button",
							"aria-label": "Close",
							className: dn.closeBtn,
							children: Ee ?? /* @__PURE__ */ h(z, {
								name: "close-square",
								variant: "bold",
								size: 24
							})
						})
					})]
				}),
				Te && /* @__PURE__ */ h("div", {
					className: dn.divider,
					"aria-hidden": !0
				}),
				Te && /* @__PURE__ */ g("div", {
					className: dn.body,
					children: [b ?? (_ === "above" ? /* @__PURE__ */ g(m, { children: [Ce, we] }) : /* @__PURE__ */ g(m, { children: [we, Ce] })), x && /* @__PURE__ */ g("div", {
						className: dn.checkboxRow,
						children: [/* @__PURE__ */ h(rt, {
							size: "sm",
							checked: Se,
							onCheckedChange: q,
							"aria-label": typeof x == "string" ? x : void 0
						}), /* @__PURE__ */ h("span", {
							className: dn.checkboxLabel,
							onClick: () => q(!Se),
							children: x
						})]
					})]
				}),
				/* @__PURE__ */ g("div", {
					className: dn.footer,
					"data-align": R,
					"data-full": B || void 0,
					children: [/* @__PURE__ */ h("div", {
						className: dn.footerLeft,
						children: /* @__PURE__ */ h(hn, {
							label: L,
							onClick: ee,
							variant: te,
							theme: ne
						})
					}), /* @__PURE__ */ g("div", {
						className: dn.footerRight,
						children: [/* @__PURE__ */ h(hn, {
							label: ge,
							onClick: K,
							variant: P,
							theme: _e,
							disabled: I,
							fullWidth: B
						}), /* @__PURE__ */ h(hn, {
							label: pe,
							onClick: G,
							variant: D,
							theme: me,
							disabled: he,
							loading: A,
							autoClose: j && !he && !A,
							fullWidth: B
						})]
					})]
				})
			]
		})] })
	});
});
gn.displayName = "ConfirmDialog";
var _n = {
	content: "_content_3e27w_3",
	"tp-tooltip-in": "_tp-tooltip-in_3e27w_1",
	inner: "_inner_3e27w_43",
	ttIcon: "_ttIcon_3e27w_54",
	ttBody: "_ttBody_3e27w_60",
	ttDismiss: "_ttDismiss_3e27w_65"
}, vn = e.createContext({ delayDuration: 200 }), yn = e.createContext(null), bn = 0, xn = () => `tp-tt-${++bn}`;
function Sn(e) {
	return e ? e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1 : !1;
}
function Cn({ delayDuration: t = 200, children: n }) {
	let r = e.useMemo(() => ({ delayDuration: t }), [t]);
	return /* @__PURE__ */ h(vn.Provider, {
		value: r,
		children: n
	});
}
function wn({ content: t, children: n, side: r = "top", align: i = "center", sideOffset: a = 6, collisionPadding: o = 8, delayDuration: s, closeDelay: c = 60, skipDelayDuration: l, variant: u = "dark", arrow: d = !0, arrowSize: f = 5, maxWidth: p = 280, disabled: m = !1, whenTruncated: _ = !1, interactive: v = !1, trigger: y = "hover", dismissible: b = !1, icon: x, closeIcon: S, portalContainer: C, className: w, open: T, defaultOpen: E, onOpenChange: D }) {
	let O = e.useContext(vn), k = s ?? O.delayDuration ?? 200, A = y === "click", j = e.useRef(0), M = T !== void 0, [N, P] = e.useState(!!E), F = M ? !!T : N, I = e.useCallback((e) => {
		M || P(e), D?.(e);
	}, [M, D]), L = e.useRef(null), ee = e.useRef(null), [te] = e.useState(xn), ne = e.useRef(0), R = e.useRef(0), z = () => {
		clearTimeout(ne.current), clearTimeout(R.current);
	}, B = () => {
		if (m || _ && !Sn(L.current)) return;
		z();
		let e = l != null && Date.now() - j.current <= l ? 0 : k;
		ne.current = window.setTimeout(() => I(!0), e);
	}, re = () => {
		z(), R.current = window.setTimeout(() => {
			j.current = Date.now(), I(!1);
		}, c);
	}, V = () => {
		m || I(!F);
	};
	e.useEffect(() => () => z(), []), Xt(() => I(!1), F && (A || b)), Zt([L, ee], () => I(!1), F && A);
	let ie = e.useMemo(() => ({
		open: F,
		setOpen: I,
		requestOpen: B,
		requestClose: re,
		toggle: V,
		triggerRef: L,
		floatingRef: ee,
		id: te,
		side: r,
		align: i,
		sideOffset: a,
		collisionPadding: o,
		variant: u,
		arrow: d,
		arrowSize: f,
		maxWidth: p,
		className: w,
		isClick: A,
		dismissible: b,
		icon: x,
		closeIcon: S,
		disabled: m,
		interactive: v,
		portalContainer: C
	}), [
		F,
		te,
		r,
		i,
		a,
		o,
		u,
		d,
		f,
		p,
		w,
		m,
		_,
		A,
		b,
		x,
		S,
		v,
		C
	]);
	if (t != null && t !== "") {
		let r = e.Children.only(n);
		return /* @__PURE__ */ g(yn.Provider, {
			value: ie,
			children: [/* @__PURE__ */ h(En, {
				asChild: !0,
				children: r
			}), F ? /* @__PURE__ */ h(Dn, { children: t }) : null]
		});
	}
	return /* @__PURE__ */ h(yn.Provider, {
		value: ie,
		children: n
	});
}
function Tn(e, t) {
	e && (typeof e == "function" ? e(t) : e.current = t);
}
var En = e.forwardRef(function({ asChild: t, children: n, ...r }, i) {
	let a = e.useContext(yn), o = a?.triggerRef, s = e.useCallback((e) => {
		Tn(o, e), Tn(i, e);
	}, [o, i]);
	if (!a) return n;
	let c = a.isClick ? {
		onClick: (e) => {
			r.onClick?.(e), e.defaultPrevented || a.toggle();
		},
		"aria-expanded": a.open,
		"aria-haspopup": "dialog",
		"aria-controls": a.open ? a.id : void 0,
		ref: s
	} : {
		onPointerEnter: (e) => {
			r.onPointerEnter?.(e), a.requestOpen();
		},
		onPointerLeave: (e) => {
			r.onPointerLeave?.(e), a.requestClose();
		},
		onFocus: (e) => {
			r.onFocus?.(e), a.requestOpen();
		},
		onBlur: (e) => {
			r.onBlur?.(e), a.requestClose();
		},
		"aria-describedby": a.open ? a.id : void 0,
		ref: s
	};
	return t ? /* @__PURE__ */ h(V, {
		...c,
		children: n
	}) : /* @__PURE__ */ h("span", {
		style: { display: "inline-flex" },
		...c,
		...r,
		children: n
	});
}), Dn = e.forwardRef(function({ className: t = "", side: n, align: r, sideOffset: i, collisionPadding: a, style: o, children: s, ...c }, l) {
	let u = e.useContext(yn);
	return !u || !u.open ? null : /* @__PURE__ */ h(On, {
		ctx: u,
		side: n,
		align: r,
		sideOffset: i,
		collisionPadding: a,
		className: t,
		style: o,
		forwardedRef: l,
		...c,
		children: s
	});
});
function On({ ctx: t, side: n, align: r, sideOffset: i, collisionPadding: a, className: o, style: s, forwardedRef: c, children: l, ...u }) {
	let d = e.useRef(null), f = e.useRef(null), [p, m] = e.useState(!1);
	e.useEffect(() => {
		let e = d.current, n = t.floatingRef;
		return n.current = e, () => {
			n.current === e && (n.current = null);
		};
	}, [t]), e.useLayoutEffect(() => {
		let e = f.current;
		if (!e) return;
		let t = parseFloat(getComputedStyle(e).lineHeight) || 17;
		m(e.scrollHeight > t * 1.6);
	}, [l]);
	let _ = en({
		triggerRef: t.triggerRef,
		floatingRef: d,
		open: t.open,
		side: n ?? t.side,
		align: r ?? t.align,
		sideOffset: i ?? t.sideOffset,
		collisionPadding: a ?? t.collisionPadding
	}), v = e.useCallback((e) => {
		Tn(d, e), Tn(c, e);
	}, [c]), y = !t.isClick && t.interactive, b = t.isClick || t.dismissible || y, x = t.isClick || t.dismissible, S = [
		_n.content,
		t.className,
		o
	].filter(Boolean).join(" "), C = y ? {
		onPointerEnter: t.requestOpen,
		onPointerLeave: t.requestClose
	} : {}, w = t.variant === "light" ? "var(--tesseract-slate-0)" : "var(--tesseract-slate-900)";
	return /* @__PURE__ */ h(Yt, {
		container: t.portalContainer,
		children: /* @__PURE__ */ g("div", {
			ref: v,
			id: t.id,
			role: x ? "dialog" : "tooltip",
			"data-state": "open",
			"data-side": _.side,
			"data-variant": t.variant,
			className: S,
			style: {
				position: "fixed",
				left: _.x,
				top: _.y,
				maxWidth: t.maxWidth,
				pointerEvents: b ? "auto" : "none",
				"--tp-tooltip-arrow": w,
				...s
			},
			...C,
			...u,
			children: [/* @__PURE__ */ g("span", {
				className: _n.inner,
				"data-multiline": p || void 0,
				children: [
					t.icon != null && /* @__PURE__ */ h("span", {
						className: _n.ttIcon,
						children: t.icon
					}),
					/* @__PURE__ */ h("span", {
						ref: f,
						className: _n.ttBody,
						children: l
					}),
					t.dismissible && /* @__PURE__ */ h("button", {
						type: "button",
						className: _n.ttDismiss,
						"aria-label": "Dismiss",
						onClick: () => t.setOpen(!1),
						children: kn(t.closeIcon)
					})
				]
			}), t.arrow ? /* @__PURE__ */ h(An, {
				side: _.side,
				size: t.arrowSize
			}) : null]
		})
	});
}
function kn(e) {
	return e == null ? /* @__PURE__ */ h(z, {
		name: "close-square",
		variant: "bold",
		size: 14,
		"aria-hidden": !0
	}) : typeof e == "string" ? /* @__PURE__ */ h(z, {
		name: e,
		variant: "bold",
		size: 14,
		"aria-hidden": !0
	}) : e;
}
function An({ side: e, size: t = 5 }) {
	let n = "var(--tp-tooltip-arrow, var(--tesseract-slate-900))", r = t, i = {
		position: "absolute",
		width: 0,
		height: 0,
		borderStyle: "solid",
		borderColor: "transparent"
	}, a = i;
	return e === "top" ? a = {
		...i,
		bottom: -r,
		left: "50%",
		transform: "translateX(-50%)",
		borderWidth: `${r}px ${r}px 0 ${r}px`,
		borderTopColor: n
	} : e === "bottom" ? a = {
		...i,
		top: -r,
		left: "50%",
		transform: "translateX(-50%)",
		borderWidth: `0 ${r}px ${r}px ${r}px`,
		borderBottomColor: n
	} : e === "left" ? a = {
		...i,
		right: -r,
		top: "50%",
		transform: "translateY(-50%)",
		borderWidth: `${r}px 0 ${r}px ${r}px`,
		borderLeftColor: n
	} : e === "right" && (a = {
		...i,
		left: -r,
		top: "50%",
		transform: "translateY(-50%)",
		borderWidth: `${r}px ${r}px ${r}px 0`,
		borderRightColor: n
	}), /* @__PURE__ */ h("span", {
		"aria-hidden": !0,
		style: a
	});
}
wn.displayName = "Tooltip", Cn.displayName = "TooltipProvider", En.displayName = "TooltipTrigger", Dn.displayName = "TooltipContent";
var jn = {
	root: "_root_1n6lr_5",
	item: "_item_1n6lr_12",
	itemDisabled: "_itemDisabled_1n6lr_17",
	trigger: "_trigger_1n6lr_20",
	chevron: "_chevron_1n6lr_61",
	label: "_label_1n6lr_68",
	content: "_content_1n6lr_87",
	contentInner: "_contentInner_1n6lr_95"
}, Mn = e.createContext(null), Nn = e.createContext(null), Pn = e.forwardRef(function({ type: t = "single", collapsible: n = !1, value: r, defaultValue: i, onValueChange: a, expandIcon: o = "chevron-down", iconPosition: s = "right", density: c = "comfortable", className: l = "", style: u, children: d, ...f }, p) {
	let m = r !== void 0, [g, _] = e.useState(i ?? (t === "multiple" ? [] : "")), v = m ? r : g, y = e.useCallback((e) => {
		m || _(e), a?.(e);
	}, [m, a]), b = e.useCallback((e) => {
		if (t === "multiple") {
			let t = Array.isArray(v) ? v : [];
			y(t.includes(e) ? t.filter((t) => t !== e) : [...t, e]);
		} else v === e ? n && y("") : y(e);
	}, [
		t,
		n,
		v,
		y
	]), x = e.useCallback((e) => t === "multiple" ? Array.isArray(v) && v.includes(e) : v === e, [t, v]), S = e.useMemo(() => ({
		toggle: b,
		isOpen: x,
		expandIcon: o,
		iconPosition: s
	}), [
		b,
		x,
		o,
		s
	]), C = [jn.root, l].filter(Boolean).join(" ");
	return /* @__PURE__ */ h(Mn.Provider, {
		value: S,
		children: /* @__PURE__ */ h("div", {
			ref: p,
			className: C,
			style: u,
			"data-density": c,
			...f,
			children: d
		})
	});
}), Fn = e.forwardRef(function({ value: t, disabled: n = !1, className: r = "", style: i, children: a, ...o }, s) {
	let c = e.useContext(Mn), l = n ? !1 : c?.isOpen(t) ?? !1, u = [
		jn.item,
		n ? jn.itemDisabled : "",
		r
	].filter(Boolean).join(" "), d = e.useId(), f = `${d}-trigger`, p = `${d}-content`, m = e.useMemo(() => ({
		value: t,
		open: l,
		disabled: n,
		triggerId: f,
		contentId: p,
		toggle: () => !n && c?.toggle(t)
	}), [
		t,
		l,
		n,
		f,
		p,
		c
	]);
	return /* @__PURE__ */ h(Nn.Provider, {
		value: m,
		children: /* @__PURE__ */ h("div", {
			ref: s,
			className: u,
			style: i,
			"data-state": l ? "open" : "closed",
			"data-disabled": n ? "" : void 0,
			...o,
			children: a
		})
	});
});
function In(e) {
	return e == null || e === !1 ? null : typeof e == "string" ? /* @__PURE__ */ h(z, {
		name: e,
		size: 16,
		className: jn.chevron
	}) : /* @__PURE__ */ h("span", {
		className: jn.chevron,
		children: e
	});
}
var Ln = e.forwardRef(function({ className: t = "", style: n, children: r, onClick: i, expandIcon: a, iconPosition: o, headingLevel: s = 3, as: c, ...l }, u) {
	let d = e.useContext(Mn), f = e.useContext(Nn), p = f?.open ?? !1, m = f?.disabled ?? !1, _ = [jn.trigger, t].filter(Boolean).join(" "), v = a === void 0 ? d?.expandIcon ?? "chevron-down" : a, y = o || d?.iconPosition || "right", b = In(v);
	return /* @__PURE__ */ h(c || `h${Math.min(6, Math.max(1, s))}`, {
		style: { margin: 0 },
		children: /* @__PURE__ */ g("button", {
			ref: u,
			type: "button",
			id: f?.triggerId,
			"aria-expanded": p,
			"aria-controls": f?.contentId,
			disabled: m,
			"data-state": p ? "open" : "closed",
			"data-icon-position": y,
			className: _,
			style: n,
			onClick: (e) => {
				i?.(e), !e.defaultPrevented && f?.toggle();
			},
			...l,
			children: [
				y === "left" ? b : null,
				/* @__PURE__ */ h("span", {
					className: jn.label,
					children: r
				}),
				y === "right" ? b : null
			]
		})
	});
}), Rn = e.forwardRef(function({ className: t = "", style: n, children: r, ...i }, a) {
	let o = e.useContext(Nn);
	if (!(o?.open ?? !1)) return null;
	let s = [jn.content, t].filter(Boolean).join(" ");
	return /* @__PURE__ */ h("div", {
		ref: a,
		role: "region",
		id: o?.contentId,
		"aria-labelledby": o?.triggerId,
		"data-state": "open",
		className: s,
		style: n,
		...i,
		children: /* @__PURE__ */ h("div", {
			className: jn.contentInner,
			children: r
		})
	});
});
Pn.displayName = "Accordion", Fn.displayName = "AccordionItem", Ln.displayName = "AccordionTrigger", Rn.displayName = "AccordionContent";
var zn = {
	root: "_root_toy6l_10",
	list: "_list_toy6l_17",
	trigger: "_trigger_toy6l_43",
	icon: "_icon_toy6l_121",
	label: "_label_toy6l_127",
	content: "_content_toy6l_133"
}, Bn = e.createContext(null), Vn = {
	sm: 16,
	md: 18,
	lg: 20
}, Hn = e.forwardRef(function({ value: t, defaultValue: n, onValueChange: r, size: i = "md", variant: a = "line", accent: o, color: s, activationMode: c = "automatic", orientation: l = "horizontal", analyticsId: u, className: d = "", style: f, children: p, ...m }, g) {
	let _ = t !== void 0, [v, y] = e.useState(n), b = _ ? t : v, { track: x } = H(), S = e.useId(), C = e.useCallback((e) => {
		_ || y(e), u && x({
			component: "Tabs",
			id: u,
			action: "tab_change",
			value: e
		}), r?.(e);
	}, [
		_,
		r,
		u,
		x
	]), w = o ?? s, T = w ? w.startsWith("var(") || w.startsWith("#") ? w : `var(--${w.replace(/^--/, "")})` : void 0, E = T ? {
		...f,
		"--tesseract-tabs-accent": T
	} : f, D = e.useCallback((e, t) => `${S}-${e}-${String(t).replace(/[^\w-]/g, "_")}`, [S]), O = e.useMemo(() => ({
		value: b,
		setValue: C,
		size: i,
		variant: a,
		activationMode: c,
		orientation: l,
		idFor: D
	}), [
		b,
		C,
		i,
		a,
		c,
		l,
		D
	]), k = [zn.root, d].filter(Boolean).join(" ");
	return /* @__PURE__ */ h(Bn.Provider, {
		value: O,
		children: /* @__PURE__ */ h("div", {
			ref: g,
			className: k,
			style: E,
			...m,
			children: p
		})
	});
});
function Un({ className: t = "", style: n, fullWidth: r = !1, children: i, ...a }) {
	let o = e.useContext(Bn), s = [zn.list, t].filter(Boolean).join(" "), c = e.useRef(null), l = o?.orientation === "vertical", u = l ? "ArrowUp" : "ArrowLeft", d = l ? "ArrowDown" : "ArrowRight";
	return /* @__PURE__ */ h("div", {
		ref: c,
		role: "tablist",
		"data-size": o?.size || "md",
		"data-variant": o?.variant || "line",
		"data-orientation": o?.orientation || "horizontal",
		"data-fullwidth": r || void 0,
		"aria-orientation": l ? "vertical" : "horizontal",
		className: s,
		style: n,
		onKeyDown: (e) => {
			if (![
				u,
				d,
				"Home",
				"End"
			].includes(e.key)) return;
			let t = Array.from(c.current?.querySelectorAll("[role=\"tab\"]:not([disabled])") || []);
			if (t.length === 0) return;
			let n = t.indexOf(document.activeElement), r = n;
			e.key === d ? r = (n + 1) % t.length : e.key === u ? r = (n - 1 + t.length) % t.length : e.key === "Home" ? r = 0 : e.key === "End" && (r = t.length - 1), r !== n && (e.preventDefault(), t[r].focus(), o?.activationMode !== "manual" && t[r].click());
		},
		...a,
		children: i
	});
}
function Wn({ value: t, className: n = "", style: r, disabled: i, asChild: a = !1, onClick: o, leftIcon: s, rightIcon: c, tag: l, tagTone: u = "neutral", children: d, ...f }) {
	let p = e.useContext(Bn), m = p?.value === t, _ = [zn.trigger, n].filter(Boolean).join(" "), v = (e) => {
		o?.(e), !(e.defaultPrevented || i) && p?.setValue(t);
	}, y = (e) => {
		p?.activationMode === "manual" && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), i || p?.setValue(t));
	}, b = Vn[p?.size] || Vn.md, x = (t) => e.isValidElement(t) ? e.cloneElement(t, {
		variant: m ? "bulk" : "linear",
		size: b
	}) : t;
	return a ? /* @__PURE__ */ h(V, {
		role: "tab",
		id: p?.idFor?.("trigger", t),
		"aria-selected": m,
		"aria-controls": p?.idFor?.("panel", t),
		"aria-disabled": i || void 0,
		tabIndex: m ? 0 : -1,
		"data-state": m ? "active" : "inactive",
		"data-disabled": i || void 0,
		className: _,
		style: r,
		onClick: v,
		onKeyDown: y,
		...f,
		children: d
	}) : /* @__PURE__ */ g("button", {
		type: "button",
		role: "tab",
		id: p?.idFor?.("trigger", t),
		"aria-selected": m,
		"aria-controls": p?.idFor?.("panel", t),
		tabIndex: m ? 0 : -1,
		"data-state": m ? "active" : "inactive",
		"data-disabled": i || void 0,
		disabled: i,
		className: _,
		style: r,
		onClick: v,
		onKeyDown: y,
		...f,
		children: [
			s != null && /* @__PURE__ */ h("span", {
				className: zn.icon,
				children: x(s)
			}),
			d != null && /* @__PURE__ */ h("span", {
				className: zn.label,
				children: d
			}),
			l != null && /* @__PURE__ */ h(je, {
				variant: "soft",
				color: u,
				size: p?.size === "lg" ? "md" : "sm",
				children: l
			}),
			c != null && /* @__PURE__ */ h("span", {
				className: zn.icon,
				children: x(c)
			})
		]
	});
}
function Gn({ value: t, className: n = "", style: r, children: i, ...a }) {
	let o = e.useContext(Bn);
	if (o?.value !== t) return null;
	let s = [zn.content, n].filter(Boolean).join(" ");
	return /* @__PURE__ */ h("div", {
		role: "tabpanel",
		id: o?.idFor?.("panel", t),
		"aria-labelledby": o?.idFor?.("trigger", t),
		"data-state": "active",
		className: s,
		style: r,
		...a,
		children: i
	});
}
Hn.displayName = "Tabs", Un.displayName = "TabsList", Wn.displayName = "TabsTrigger", Gn.displayName = "TabsContent";
function Kn(e) {
	let t = e.width ?? e.minWidth ?? 88;
	return typeof t == "number" ? t : 88;
}
function qn(e) {
	let t = e.filter((e) => e.sticky === "left"), n = e.filter((e) => e.sticky !== "left" && e.sticky !== "right"), r = e.filter((e) => e.sticky === "right");
	return [
		...t,
		...n,
		...r
	];
}
function Jn(e, { leadingWidth: t = 0 } = {}) {
	let n = {}, r = e.filter((e) => e.sticky === "left"), i = t;
	r.forEach((e, t) => {
		n[e.id] = {
			side: "left",
			offset: i,
			edge: t === r.length - 1
		}, i += Kn(e);
	});
	let a = e.filter((e) => e.sticky === "right"), o = 0;
	for (let e = a.length - 1; e >= 0; e--) {
		let t = a[e];
		n[t.id] = {
			side: "right",
			offset: o,
			edge: e === 0
		}, o += Kn(t);
	}
	return n;
}
function Yn(e, { rowKey: t, getSubRows: n }) {
	let r = [], i = (e) => {
		e.forEach((e, a) => {
			r.push(t(e, a));
			let o = n ? n(e) : null;
			o && o.length && i(o);
		});
	};
	return i(e), r;
}
function Xn(e, { rowKey: t, getSubRows: n }) {
	return Yn(e, {
		rowKey: t,
		getSubRows: n
	});
}
function Zn(e, t) {
	let { rowKey: n, getSubRows: r, expandedKeys: i, groupBy: a, groupLabel: o, collapsedGroups: s } = t, c = [], l = (e, t, a) => {
		let o = n(e, t), s = r && r(e) || [], u = s.length > 0, d = i?.has(o);
		c.push({
			kind: "data",
			row: e,
			key: o,
			depth: a,
			hasChildren: u,
			expanded: d,
			index: t
		}), u && d && s.forEach((e, t) => l(e, t, a + 1));
	};
	if (a) {
		let t = /* @__PURE__ */ new Map();
		e.forEach((e, n) => {
			let r = a(e, n);
			t.has(r) || t.set(r, []), t.get(r).push(e);
		});
		let i = 0;
		for (let [e, a] of t) {
			let t = s?.has(e) || !1;
			c.push({
				kind: "group",
				group: e,
				label: o ? o(e, a) : String(e),
				count: a.length,
				keys: Xn(a, {
					rowKey: n,
					getSubRows: r
				}),
				collapsed: t,
				gi: i
			}), i += 1, t || a.forEach((e, t) => l(e, t, 0));
		}
	} else e.forEach((e, t) => l(e, t, 0));
	return c;
}
function Qn(e, t) {
	let n = {}, r = /* @__PURE__ */ new Set();
	return t.forEach((t) => {
		if (!t.spanRows) return;
		let i = t.spanAccessor || ((e) => e[t.id]), a = -1, o, s, c = (e) => {
			if (a >= 0 && e - a > 1) {
				n[`${a}:${t.id}`] = e - a;
				for (let n = a + 1; n < e; n++) r.add(`${n}:${t.id}`);
			}
			a = -1;
		};
		e.forEach((e, t) => {
			if (e.kind !== "data") {
				c(t);
				return;
			}
			let n = i(e.row);
			a < 0 ? (a = t, o = n, s = e.depth) : (n !== o || e.depth !== s) && (c(t), a = t, o = n, s = e.depth);
		}), c(e.length);
	}), {
		spanMap: n,
		skip: r
	};
}
var X = {
	root: "_root_12uoq_3",
	scrollerWrap: "_scrollerWrap_12uoq_14",
	scroller: "_scroller_12uoq_14",
	table: "_table_12uoq_40",
	headRow: "_headRow_12uoq_49",
	th: "_th_12uoq_53",
	sortBtn: "_sortBtn_12uoq_87",
	sortGlyph: "_sortGlyph_12uoq_115",
	sortUp: "_sortUp_12uoq_120",
	sortDown: "_sortDown_12uoq_121",
	row: "_row_12uoq_143",
	td: "_td_12uoq_147",
	selectCell: "_selectCell_12uoq_167",
	primary: "_primary_12uoq_271",
	sticky: "_sticky_12uoq_210",
	groupRow: "_groupRow_12uoq_308",
	groupCell: "_groupCell_12uoq_344",
	groupToggle: "_groupToggle_12uoq_351",
	groupLabel: "_groupLabel_12uoq_368",
	groupCount: "_groupCount_12uoq_373",
	expandWrap: "_expandWrap_12uoq_389",
	expandBody: "_expandBody_12uoq_396",
	expander: "_expander_12uoq_401",
	expanderSpacer: "_expanderSpacer_12uoq_424",
	chevron: "_chevron_12uoq_430",
	actionCluster: "_actionCluster_12uoq_444",
	cell: "_cell_12uoq_480",
	cellLine: "_cellLine_12uoq_497",
	cellIcon: "_cellIcon_12uoq_505",
	clamp: "_clamp_12uoq_511",
	secondary: "_secondary_12uoq_523",
	empty: "_empty_12uoq_529",
	tagRow: "_tagRow_12uoq_537",
	actionableTag: "_actionableTag_12uoq_543",
	rppSelect: "_rppSelect_12uoq_570",
	pageBtn: "_pageBtn_12uoq_571",
	pageNav: "_pageNav_12uoq_572",
	pagination: "_pagination_12uoq_578",
	pageLeft: "_pageLeft_12uoq_589",
	pageInfo: "_pageInfo_12uoq_595",
	rpp: "_rpp_12uoq_570",
	rppSelectWrap: "_rppSelectWrap_12uoq_609",
	rppCaret: "_rppCaret_12uoq_640",
	pager: "_pager_12uoq_648",
	ellipsis: "_ellipsis_12uoq_696",
	selectionToolbar: "_selectionToolbar_12uoq_706",
	errorCell: "_errorCell_12uoq_721",
	errorBody: "_errorBody_12uoq_726",
	errorIcon: "_errorIcon_12uoq_734",
	errorMsg: "_errorMsg_12uoq_738",
	dimmed: "_dimmed_12uoq_746",
	loadingOverlay: "_loadingOverlay_12uoq_751"
}, $n = (e, t = 88) => ({
	width: e.width,
	minWidth: e.minWidth ?? t,
	maxWidth: e.expand ? void 0 : e.maxWidth
}), er = (e, t = 48) => {
	let n = {
		width: t,
		minWidth: t,
		maxWidth: t
	};
	return e ? {
		...n,
		left: 0
	} : n;
}, tr = (e, t, n = 88) => {
	let r = $n(e, n), i = t[e.id];
	return i ? {
		...r,
		[i.side]: i.offset
	} : r;
}, nr = {
	neutral: "default",
	primary: "primary",
	success: "success",
	warning: "warning",
	error: "error"
};
function rr() {
	return /* @__PURE__ */ g("svg", {
		className: X.sortGlyph,
		width: "14",
		height: "14",
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": !0,
		children: [/* @__PURE__ */ h("path", {
			className: X.sortUp,
			d: "M12.1549 1.1543C12.2028 1.15981 12.2473 1.16678 12.2867 1.1748L12.4547 1.21777L12.5572 1.25391C12.7055 1.3175 12.8612 1.41698 13.0025 1.56738L13.0045 1.56543L19.9146 8.47559C20.1591 8.7201 20.2325 9.08779 20.1002 9.40723C19.9679 9.72668 19.6559 9.93452 19.3102 9.93457H4.69004C4.34423 9.93457 4.03234 9.72672 3.9 9.40723C3.76768 9.08776 3.84106 8.72011 4.08555 8.47559L10.9957 1.56543L11.0699 1.49512C11.157 1.41763 11.2817 1.32304 11.443 1.25391L11.5963 1.19922C11.7452 1.15616 11.8828 1.14456 11.9996 1.14453L12.1549 1.1543Z"
		}), /* @__PURE__ */ h("path", {
			className: X.sortDown,
			d: "M11.8454 22.8457C11.7974 22.8402 11.753 22.8332 11.7135 22.8252L11.5456 22.7822L11.443 22.7461C11.2947 22.6825 11.1391 22.583 10.9977 22.4326L10.9958 22.4346L4.08559 15.5244C3.84116 15.2799 3.76776 14.9122 3.90005 14.5928C4.03237 14.2733 4.34432 14.0655 4.69009 14.0654L19.3102 14.0654C19.656 14.0654 19.9679 14.2733 20.1002 14.5928C20.2326 14.9122 20.1592 15.2799 19.9147 15.5244L13.0045 22.4346L12.9303 22.5049C12.8433 22.5824 12.7185 22.677 12.5573 22.7461L12.404 22.8008C12.2551 22.8438 12.1175 22.8554 12.0006 22.8555L11.8454 22.8457Z"
		})]
	});
}
function ir({ open: e }) {
	return /* @__PURE__ */ h(z, {
		name: "chevron-right",
		size: 16,
		className: X.chevron,
		"data-open": e || void 0
	});
}
function ar({ message: e, onRetry: t }) {
	return /* @__PURE__ */ g("div", {
		className: X.errorBody,
		children: [
			/* @__PURE__ */ h(z, {
				name: "information",
				size: 20,
				className: X.errorIcon
			}),
			/* @__PURE__ */ h("span", {
				className: X.errorMsg,
				children: e ?? "Something went wrong."
			}),
			t && /* @__PURE__ */ h(G, {
				variant: "outline",
				theme: "neutral",
				size: "sm",
				onClick: t,
				children: "Retry"
			})
		]
	});
}
function or({ children: e, lines: t = 2, className: n, side: r = "top" }) {
	return /* @__PURE__ */ h(wn, {
		content: e,
		whenTruncated: !0,
		side: r,
		sideOffset: 8,
		children: /* @__PURE__ */ h("span", {
			className: U(X.clamp, n),
			style: { WebkitLineClamp: t },
			children: e
		})
	});
}
function sr({ primary: e, secondary: t, primaryLeftIcon: n, primaryRightIcon: r, secondaryLeftIcon: i, secondaryRightIcon: a, maxLines: o, align: s = "left", tooltipSide: c = "top", className: l }) {
	let u = t != null && t !== "", d = o ?? (u ? 1 : 2);
	return /* @__PURE__ */ g("div", {
		className: U(X.cell, l),
		"data-align": s,
		children: [/* @__PURE__ */ g("div", {
			className: X.cellLine,
			children: [
				n != null && /* @__PURE__ */ h("span", {
					className: X.cellIcon,
					children: n
				}),
				/* @__PURE__ */ h(or, {
					lines: d,
					className: X.primary,
					side: c,
					children: e
				}),
				r != null && /* @__PURE__ */ h("span", {
					className: X.cellIcon,
					children: r
				})
			]
		}), u && /* @__PURE__ */ g("div", {
			className: X.cellLine,
			children: [
				i != null && /* @__PURE__ */ h("span", {
					className: X.cellIcon,
					children: i
				}),
				/* @__PURE__ */ h(or, {
					lines: 1,
					className: X.secondary,
					side: c,
					children: t
				}),
				a != null && /* @__PURE__ */ h("span", {
					className: X.cellIcon,
					children: a
				})
			]
		})]
	});
}
sr.displayName = "DataCell";
function cr({ label: e, tone: t = "neutral", actionable: n = !1, onClick: r, icon: i, variant: a = "soft" }) {
	return n || r ? /* @__PURE__ */ h(Ue, {
		label: e,
		color: nr[t] ?? "default",
		variant: a,
		size: "sm",
		icon: i,
		onClick: r || (() => {}),
		className: X.actionableTag
	}) : /* @__PURE__ */ h(je, {
		variant: a,
		color: t,
		children: e
	});
}
cr.displayName = "CellTag";
function lr(e, t, n) {
	if (typeof e.cell == "function") return e.cell(t, n);
	let r = (e) => typeof e == "function" ? e(t, n) : e, i = e.type || "text";
	if (i === "tag") {
		let r = e.tag ? e.tag(t, n) : null;
		return r ? Array.isArray(r) ? /* @__PURE__ */ h("div", {
			className: X.tagRow,
			children: r.map((e, t) => /* @__PURE__ */ h(cr, { ...e }, t))
		}) : /* @__PURE__ */ h(cr, { ...r }) : null;
	}
	return i === "action" ? e.actions ? e.actions(t, n) : null : /* @__PURE__ */ h(sr, {
		primary: e.primary ? e.primary(t, n) : t[e.id],
		secondary: e.secondary ? e.secondary(t, n) : void 0,
		primaryLeftIcon: r(e.leftIcon),
		primaryRightIcon: r(e.rightIcon),
		secondaryLeftIcon: r(e.subLeftIcon),
		secondaryRightIcon: r(e.subRightIcon),
		maxLines: e.maxLines,
		align: e.align
	});
}
var ur = (e, t = 18) => typeof e == "string" ? e.trim() ? /* @__PURE__ */ h(z, {
	name: e.trim(),
	size: t
}) : null : e;
function dr({ primary: e, actions: t = [], align: n = "right" }) {
	return /* @__PURE__ */ g("div", {
		className: X.actionCluster,
		"data-align": n,
		children: [e && /* @__PURE__ */ h(G, {
			variant: e.variant || "outline",
			theme: e.theme || "primary",
			size: "sm",
			icon: ur(e.icon, 16),
			menu: e.menu,
			onClick: e.onClick,
			track: e.track,
			children: e.label
		}), t.filter(Boolean).map((e, t) => /* @__PURE__ */ h(G, {
			variant: e.variant || "ghost",
			theme: e.theme || "neutral",
			size: "sm",
			"aria-label": e.label,
			icon: ur(e.icon, 18),
			menu: e.menu,
			onClick: e.onClick,
			track: e.track
		}, e.id || t))]
	});
}
dr.displayName = "TableActions";
function fr(e, t) {
	if (t <= 7) return Array.from({ length: t }, (e, t) => t);
	let n = [0], r = Math.max(1, e - 1), i = Math.min(t - 2, e + 1);
	r > 1 && n.push("…");
	for (let e = r; e <= i; e++) n.push(e);
	return i < t - 2 && n.push("…"), n.push(t - 1), n;
}
function pr({ page: e, pageCount: t, total: n, pageSize: r, sizeOptions: i, onPageSize: a, onPage: o }) {
	let s = n === 0 ? 0 : e * r + 1, c = Math.min((e + 1) * r, n);
	return /* @__PURE__ */ g("div", {
		className: X.pagination,
		children: [/* @__PURE__ */ g("div", {
			className: X.pageLeft,
			children: [i && i.length > 1 && /* @__PURE__ */ g("label", {
				className: X.rpp,
				children: [/* @__PURE__ */ h("span", { children: "Rows" }), /* @__PURE__ */ g("span", {
					className: X.rppSelectWrap,
					children: [/* @__PURE__ */ h("select", {
						className: X.rppSelect,
						value: r,
						onChange: (e) => a(Number(e.target.value)),
						"aria-label": "Rows per page",
						children: i.map((e) => /* @__PURE__ */ h("option", {
							value: e,
							children: e
						}, e))
					}), /* @__PURE__ */ h(z, {
						name: "chevron-down",
						size: 12,
						className: X.rppCaret
					})]
				})]
			}), /* @__PURE__ */ h("span", {
				className: X.pageInfo,
				children: n === 0 ? "0 results" : `${s}–${c} of ${n}`
			})]
		}), /* @__PURE__ */ g("div", {
			className: X.pager,
			children: [
				/* @__PURE__ */ h("button", {
					type: "button",
					className: X.pageNav,
					disabled: e === 0,
					onClick: () => o(e - 1),
					"aria-label": "Previous page",
					children: /* @__PURE__ */ h(z, {
						name: "chevron-left",
						size: 16
					})
				}),
				fr(e, t).map((t, n) => t === "…" ? /* @__PURE__ */ h("span", {
					className: X.ellipsis,
					children: "…"
				}, `e${n}`) : /* @__PURE__ */ h("button", {
					type: "button",
					className: X.pageBtn,
					"data-active": t === e,
					"aria-current": t === e ? "page" : void 0,
					onClick: () => o(t),
					children: t + 1
				}, t)),
				/* @__PURE__ */ h("button", {
					type: "button",
					className: X.pageNav,
					disabled: e >= t - 1,
					onClick: () => o(e + 1),
					"aria-label": "Next page",
					children: /* @__PURE__ */ h(z, {
						name: "chevron-right",
						size: 16
					})
				})
			]
		})]
	});
}
var mr = e.forwardRef(function({ columns: t, data: n, rowKey: r = (e, t) => e?.id ?? t, emptyState: i = null, rowClassName: a, className: o, style: s, rowHeight: c = "lg", stickyHeader: l = !1, stickyFirst: u = 0, stickyLast: d = 0, maxHeight: f, zebra: p = !1, hoverable: m = !0, bordered: _ = !1, sortable: v = !1, defaultSort: y = null, onSortChange: b, pageSize: x, pageSizeOptions: S, loading: C = !1, loadingVariant: w = "skeleton", renderLoading: T, hasMore: E = !1, onLoadMore: O, lazyRows: k = 3, error: A = !1, errorState: j, onRetry: M, selectable: N = !1, selectionMode: P, selectedKeys: F, onSelectionChange: I, isRowDisabled: L, selectionToolbar: ee, selectColumnWidth: te = 48, minColumnWidth: ne = 88, stickyMaxHeight: R = 420, rowState: z, getSubRows: B, defaultExpandedKeys: re, expandedKeys: V, onExpandedChange: ie, expandColumnId: ae, groupBy: oe, groupLabel: se, defaultCollapsedGroups: ce, analyticsId: le, onRowClick: ue, ...W }, de) {
	let { track: fe } = H(), pe = e.useCallback((e, t) => {
		le && fe({
			component: "DataTable",
			id: le,
			action: e,
			...t
		});
	}, [le, fe]), G = P || (N ? "multiple" : "none"), me = G === "single" || G === "multiple", he = typeof B == "function", ge = e.useId(), K = e.useMemo(() => {
		let e = u === !0 ? 1 : Math.max(0, Number(u) || 0), n = d === !0 ? 1 : Math.max(0, Number(d) || 0);
		if (!e && !n) return t;
		let r = t.length;
		return t.map((t, i) => t.sticky ? t : i < e ? {
			...t,
			sticky: "left"
		} : i >= r - n ? {
			...t,
			sticky: "right"
		} : t);
	}, [
		t,
		u,
		d
	]), _e = e.useMemo(() => qn(K), [K]), ve = e.useMemo(() => Jn(_e, { leadingWidth: me ? te : 0 }), [
		_e,
		me,
		te
	]), ye = _e.some((e) => e.sticky === "left"), be = me && ye, xe = e.useRef(/* @__PURE__ */ new Map()), Se = e.useRef(null), [q, Ce] = e.useState(null), we = _e.filter((e) => e.sticky).map((e) => `${e.sticky}:${e.id}`).join("|") + `#${be}`;
	e.useLayoutEffect(() => {
		let e = _e.filter((e) => e.sticky === "left"), t = _e.filter((e) => e.sticky === "right"), n = () => {
			if (!e.length && !t.length) {
				Ce((e) => e === null ? e : null);
				return;
			}
			let n = {}, r = be && Se.current ? Se.current.offsetWidth : 0;
			for (let t of e) {
				n[t.id] = r;
				let e = xe.current.get(t.id);
				r += e ? e.offsetWidth : Kn(t);
			}
			let i = 0;
			for (let e = t.length - 1; e >= 0; e--) {
				let r = t[e];
				n[r.id] = i;
				let a = xe.current.get(r.id);
				i += a ? a.offsetWidth : Kn(r);
			}
			Ce((e) => {
				if (e) {
					let t = Object.keys(n);
					if (t.length === Object.keys(e).length && t.every((t) => e[t] === n[t])) return e;
				}
				return n;
			});
		};
		n();
		let r = typeof ResizeObserver < "u" ? new ResizeObserver(n) : null;
		return xe.current.forEach((e) => e && r?.observe(e)), Se.current && r?.observe(Se.current), window.addEventListener("resize", n), () => {
			r?.disconnect(), window.removeEventListener("resize", n);
		};
	}, [we]);
	let Te = e.useMemo(() => {
		if (!q) return ve;
		let e = {};
		for (let t of Object.keys(ve)) e[t] = {
			...ve[t],
			offset: q[t] ?? ve[t].offset
		};
		return e;
	}, [ve, q]), [J, Ee] = e.useState(y), [De, Oe] = e.useState(0), [Y, ke] = e.useState(x), [Ae, je] = e.useState(x);
	x !== Ae && (je(x), ke(x));
	let Me = e.useMemo(() => {
		let e = S && S.length ? S : [
			10,
			20,
			50,
			100
		];
		return Array.from(new Set([...x ? [x] : [], ...e])).sort((e, t) => e - t);
	}, [S, x]), Ne = e.useMemo(() => {
		if (!J) return n;
		let e = _e.find((e) => e.id === J.id);
		if (!e) return n;
		let t = e.sortAccessor || ((t) => t?.[e.id]), r = J.dir === "desc" ? -1 : 1;
		return [...n].sort((e, n) => {
			let i = t(e), a = t(n);
			return i == null && a == null ? 0 : i == null ? 1 : a == null ? -1 : typeof i == "number" && typeof a == "number" ? (i - a) * r : String(i).localeCompare(String(a), void 0, { numeric: !0 }) * r;
		});
	}, [
		n,
		J,
		_e
	]), Pe = Y ? Math.max(1, Math.ceil(Ne.length / Y)) : 1, Ie = Math.min(De, Pe - 1);
	De > Ie && Oe(Ie);
	let Le = Y ? Ne.slice(Ie * Y, (Ie + 1) * Y) : Ne, Re = V !== void 0, [ze, Be] = e.useState(() => new Set(re || [])), Ve = Re ? new Set(V) : ze, He = (e) => {
		let t = new Set(Ve), n = !t.has(e);
		t.has(e) ? t.delete(e) : t.add(e), Re || Be(t), ie?.([...t]), pe(n ? "row_expand" : "row_collapse", { value: e });
	}, [Ue, We] = e.useState(() => new Set(ce || [])), Ge = (e) => {
		let t = !Ue.has(e);
		We((t) => {
			let n = new Set(t);
			return n.has(e) ? n.delete(e) : n.add(e), n;
		}), pe(t ? "group_collapse" : "group_expand", { label: String(e) });
	}, Ke = e.useMemo(() => Zn(Le, {
		rowKey: r,
		getSubRows: B,
		expandedKeys: Ve,
		groupBy: oe,
		groupLabel: se,
		collapsedGroups: Ue
	}), [
		Le,
		r,
		B,
		Ve,
		oe,
		se,
		Ue
	]), { spanMap: qe, skip: Je } = e.useMemo(() => Qn(Ke, _e), [Ke, _e]), Ye = F !== void 0, [Xe, Ze] = e.useState(() => /* @__PURE__ */ new Set()), Qe = Ye ? new Set(F) : Xe, $e = (e) => {
		Ye || Ze(e), I?.([...e]);
	}, et = e.useMemo(() => {
		let e = Yn(Le, {
			rowKey: r,
			getSubRows: B
		});
		if (!L) return e;
		let t = /* @__PURE__ */ new Set(), n = (e) => e.forEach((e, i) => {
			L(e, i) && t.add(r(e, i));
			let a = B ? B(e) : null;
			a && a.length && n(a);
		});
		return n(Le), e.filter((e) => !t.has(e));
	}, [
		Le,
		r,
		B,
		L
	]), tt = et.filter((e) => Qe.has(e)).length, nt = et.length > 0 && tt === et.length, it = nt ? !0 : tt > 0 ? "indeterminate" : !1, at = () => {
		let e = new Set(Qe);
		nt ? et.forEach((t) => e.delete(t)) : et.forEach((t) => e.add(t)), $e(e), pe("select_all", { meta: {
			selected: !nt,
			count: e.size
		} });
	}, ot = (e) => {
		if (G === "single") {
			let t = !Qe.has(e);
			$e(new Set(t ? [e] : [])), pe("select_row", {
				value: e,
				meta: {
					selected: t,
					mode: "single"
				}
			});
			return;
		}
		let t = new Set(Qe), n = !t.has(e);
		t.has(e) ? t.delete(e) : t.add(e), $e(t), pe("select_row", {
			value: e,
			meta: {
				selected: n,
				mode: "multiple",
				count: t.size
			}
		});
	}, st = (e, t) => {
		let n = new Set(Qe);
		t ? e.forEach((e) => n.delete(e)) : e.forEach((e) => n.add(e)), $e(n), pe("select_group", { meta: {
			selected: !t,
			count: n.size
		} });
	}, ct = e.useMemo(() => [...Qe], [Qe]), lt = e.useCallback(() => {
		$e(/* @__PURE__ */ new Set()), pe("clear_selection", { meta: { count: 0 } });
	}, [
		Ye,
		I,
		pe
	]), ut = me && typeof ee == "function" && ct.length > 0, dt = _e.length, pt = dt + +!!me, mt = A !== !1 && A != null && A !== "", ht = C && w === "overlay", gt = C && w === "skeleton", _t = he ? ae || _e[0]?.id : null, vt = (e) => {
		let t;
		t = !J || J.id !== e.id ? {
			id: e.id,
			dir: "asc"
		} : J.dir === "asc" ? {
			id: e.id,
			dir: "desc"
		} : null, Ee(t), b?.(t), pe("sort", {
			columnId: e.id,
			label: e.header,
			value: t?.dir || "none"
		});
	}, yt = e.useRef(null), [bt, xt] = e.useState({
		left: !1,
		right: !1
	}), St = f ?? (l ? R : void 0);
	e.useEffect(() => {
		let e = yt.current;
		if (!e) return;
		let t = () => {
			let t = e.scrollWidth > e.clientWidth + 1, n = e.scrollLeft <= 1, r = e.scrollLeft + e.clientWidth >= e.scrollWidth - 1;
			xt({
				left: t && !n,
				right: t && !r
			}), E && !C && O && e.scrollTop + e.clientHeight >= e.scrollHeight - 80 && O();
		};
		t(), e.addEventListener("scroll", t, { passive: !0 });
		let n = typeof ResizeObserver < "u" ? new ResizeObserver(t) : null;
		return n?.observe(e), window.addEventListener("resize", t), () => {
			e.removeEventListener("scroll", t), n?.disconnect(), window.removeEventListener("resize", t);
		};
	}, [
		_e,
		Ke.length,
		E,
		C,
		O
	]);
	let Ct = (e, t) => {
		let { row: n, index: r, depth: i, hasChildren: a, expanded: o } = e;
		return _e.map((s) => {
			let c = `${t}:${s.id}`;
			if (Je.has(c)) return null;
			let l = Te[s.id], u = s.id === _t, d = qe[c];
			return /* @__PURE__ */ h("td", {
				rowSpan: d,
				className: U(X.td, l && X.sticky, s.cellClassName),
				"data-align": s.align || "left",
				"data-edge": l?.edge ? l.side : void 0,
				style: tr(s, Te, ne),
				children: u ? /* @__PURE__ */ g("div", {
					className: X.expandWrap,
					style: { paddingLeft: i * 20 },
					children: [a ? /* @__PURE__ */ h("button", {
						type: "button",
						className: X.expander,
						onClick: () => He(e.key),
						"aria-label": o ? "Collapse row" : "Expand row",
						"aria-expanded": o,
						children: /* @__PURE__ */ h(ir, { open: o })
					}) : he && /* @__PURE__ */ h("span", {
						className: X.expanderSpacer,
						"aria-hidden": !0
					}), /* @__PURE__ */ h("div", {
						className: X.expandBody,
						children: lr(s, n, r)
					})]
				}) : lr(s, n, r)
			}, s.id);
		});
	};
	return /* @__PURE__ */ g("div", {
		ref: de,
		className: U(X.root, o),
		style: s,
		...W,
		children: [
			ut && /* @__PURE__ */ h("div", {
				className: X.selectionToolbar,
				role: "toolbar",
				"aria-label": "Bulk actions",
				children: ee(ct, lt)
			}),
			/* @__PURE__ */ g("div", {
				className: X.scrollerWrap,
				children: [/* @__PURE__ */ h("div", {
					ref: yt,
					className: U(X.scroller, ht && X.dimmed),
					"data-overflow-left": bt.left || void 0,
					"data-overflow-right": bt.right || void 0,
					style: St ? {
						maxHeight: St,
						overflowY: "auto"
					} : void 0,
					children: /* @__PURE__ */ g("table", {
						className: X.table,
						"data-density": c,
						"data-zebra": p || void 0,
						"data-hoverable": m || void 0,
						"data-bordered": _ || void 0,
						children: [/* @__PURE__ */ h("thead", { children: /* @__PURE__ */ g("tr", {
							className: X.headRow,
							"data-sticky-header": l || void 0,
							children: [me && /* @__PURE__ */ h("th", {
								ref: Se,
								className: U(X.th, X.selectCell, be && X.sticky),
								"data-align": "center",
								"data-edge": be ? "left" : void 0,
								style: er(be, te),
								children: G === "multiple" && /* @__PURE__ */ h(rt, {
									size: "sm",
									checked: it,
									onCheckedChange: at,
									"aria-label": nt ? "Deselect all" : "Select all"
								})
							}), _e.map((e) => {
								let t = Te[e.id], n = v && e.sortable, r = J && J.id === e.id;
								return /* @__PURE__ */ h("th", {
									ref: (t) => {
										t ? xe.current.set(e.id, t) : xe.current.delete(e.id);
									},
									className: U(X.th, t && X.sticky, e.headerClassName),
									"data-align": e.headerAlign || "left",
									"data-edge": t?.edge ? t.side : void 0,
									style: tr(e, Te, ne),
									"aria-sort": r ? J.dir === "asc" ? "ascending" : "descending" : void 0,
									children: n ? /* @__PURE__ */ g("button", {
										type: "button",
										className: X.sortBtn,
										"data-dir": r ? J.dir : void 0,
										onClick: () => vt(e),
										children: [/* @__PURE__ */ h("span", { children: e.header }), /* @__PURE__ */ h(rr, {})]
									}) : e.header
								}, e.id);
							})]
						}) }), /* @__PURE__ */ g("tbody", { children: [mt ? /* @__PURE__ */ h("tr", { children: /* @__PURE__ */ h("td", {
							colSpan: pt,
							className: X.errorCell,
							children: j ?? /* @__PURE__ */ h(ar, {
								message: typeof A == "boolean" ? void 0 : A,
								onRetry: M
							})
						}) }) : Ke.length === 0 && !C ? /* @__PURE__ */ h("tr", { children: /* @__PURE__ */ h("td", {
							colSpan: pt,
							className: X.empty,
							children: i || "No data"
						}) }) : Ke.map((e, t) => {
							if (e.kind === "group") {
								let t = e.keys.filter((e) => et.includes(e)), n = t.filter((e) => Qe.has(e)).length, r = t.length > 0 && n === t.length, i = r ? !0 : n > 0 ? "indeterminate" : !1;
								return /* @__PURE__ */ g("tr", {
									className: X.groupRow,
									children: [me && /* @__PURE__ */ h("td", {
										className: U(X.td, X.selectCell, X.groupCell, be && X.sticky),
										"data-align": "center",
										style: er(be, te),
										children: G === "multiple" && /* @__PURE__ */ h(rt, {
											size: "sm",
											checked: i,
											onCheckedChange: () => st(t, r),
											"aria-label": "Select group"
										})
									}), /* @__PURE__ */ h("td", {
										colSpan: dt,
										className: U(X.td, X.groupCell),
										children: /* @__PURE__ */ g("button", {
											type: "button",
											className: X.groupToggle,
											onClick: () => Ge(e.group),
											"aria-expanded": !e.collapsed,
											children: [
												/* @__PURE__ */ h(ir, { open: !e.collapsed }),
												/* @__PURE__ */ h("span", {
													className: X.groupLabel,
													children: e.label
												}),
												/* @__PURE__ */ h("span", {
													className: X.groupCount,
													children: e.count
												})
											]
										})
									})]
								}, `g-${e.gi}`);
							}
							let n = L ? L(e.row, e.index) : !1, r = z ? z(e.row, e.index) : void 0, i = me && Qe.has(e.key), o = !n && !!ue;
							return /* @__PURE__ */ g("tr", {
								className: U(X.row, typeof a == "function" ? a(e.row, e.index) : a),
								"data-selected": i || void 0,
								"data-disabled": n || void 0,
								"data-state": r || void 0,
								"data-depth": e.depth || void 0,
								"data-clickable": o || void 0,
								onClick: (o || le) && !n ? (t) => {
									t.target.closest("button, a, input, select, [role=\"checkbox\"], [role=\"menu\"], [role=\"menuitem\"]") || (ue?.(e.row, e.index), pe("row_click", { value: e.key }));
								} : void 0,
								children: [me && /* @__PURE__ */ h("td", {
									className: U(X.td, X.selectCell, be && X.sticky),
									"data-align": "center",
									"data-edge": be ? "left" : void 0,
									style: er(be, te),
									children: G === "single" ? /* @__PURE__ */ h(ft, {
										size: "sm",
										name: ge,
										checked: i,
										disabled: n,
										onChange: () => ot(e.key),
										"aria-label": "Select row"
									}) : /* @__PURE__ */ h(rt, {
										size: "sm",
										checked: i,
										disabled: n,
										onCheckedChange: () => ot(e.key),
										"aria-label": "Select row"
									})
								}), Ct(e, t)]
							}, e.key);
						}), gt && !mt && Array.from({ length: k }).map((e, t) => /* @__PURE__ */ g("tr", {
							className: X.row,
							"aria-hidden": !0,
							children: [me && /* @__PURE__ */ h("td", {
								className: U(X.td, X.selectCell, be && X.sticky),
								style: er(be, te),
								children: /* @__PURE__ */ h(Fe, {
									variant: "rect",
									width: 16,
									height: 16,
									radius: 5,
									style: { display: "block" }
								})
							}), _e.map((e, n) => /* @__PURE__ */ h("td", {
								className: U(X.td, Te[e.id] && X.sticky),
								"data-align": e.align || "left",
								"data-edge": Te[e.id]?.edge ? Te[e.id].side : void 0,
								style: tr(e, Te, ne),
								children: /* @__PURE__ */ h(Fe, {
									variant: "text",
									width: `${55 + (t * 7 + n * 13) % 35}%`
								})
							}, e.id))]
						}, `sk-${t}`))] })]
					})
				}), ht && /* @__PURE__ */ h("div", {
					className: X.loadingOverlay,
					"aria-live": "polite",
					"aria-busy": "true",
					children: typeof T == "function" ? T() : T ?? /* @__PURE__ */ h(D, {
						type: "line-spinner",
						size: 24,
						color: "var(--tesseract-blue-500)"
					})
				})]
			}),
			x ? /* @__PURE__ */ h(pr, {
				page: Ie,
				pageCount: Pe,
				total: Ne.length,
				pageSize: Y,
				sizeOptions: Me,
				onPageSize: (e) => {
					ke(e), Oe(0), pe("page_size", { value: e });
				},
				onPage: (e) => {
					Oe(e), pe("page_change", { value: e });
				}
			}) : null
		]
	});
});
mr.displayName = "DataTable";
var Z = {
	root: "_root_lnt7f_2",
	label: "_label_lnt7f_15",
	trigger: "_trigger_lnt7f_21",
	editInput: "_editInput_lnt7f_59",
	chevronBtn: "_chevronBtn_lnt7f_78",
	clearBtn: "_clearBtn_lnt7f_102",
	triggerLead: "_triggerLead_lnt7f_124",
	triggerText: "_triggerText_lnt7f_131",
	placeholder: "_placeholder_lnt7f_137",
	triggerChips: "_triggerChips_lnt7f_144",
	triggerChip: "_triggerChip_lnt7f_144",
	chevron: "_chevron_lnt7f_78",
	seamless: "_seamless_lnt7f_167",
	menu: "_menu_lnt7f_234",
	search: "_search_lnt7f_253",
	searchIcon: "_searchIcon_lnt7f_262",
	searchInput: "_searchInput_lnt7f_268",
	groupLabel: "_groupLabel_lnt7f_282",
	list: "_list_lnt7f_292",
	empty: "_empty_lnt7f_314",
	loading: "_loading_lnt7f_322",
	option: "_option_lnt7f_332",
	optTitle: "_optTitle_lnt7f_348",
	optionCustom: "_optionCustom_lnt7f_356",
	optAddIcon: "_optAddIcon_lnt7f_364",
	control: "_control_lnt7f_374",
	optIcon: "_optIcon_lnt7f_380",
	optIconR: "_optIconR_lnt7f_380",
	optText: "_optText_lnt7f_387",
	optSub: "_optSub_lnt7f_402",
	optRight: "_optRight_lnt7f_411",
	kbd: "_kbd_lnt7f_418",
	check: "_check_lnt7f_431",
	footer: "_footer_lnt7f_436",
	hint: "_hint_lnt7f_445",
	fkbd: "_fkbd_lnt7f_459",
	actions: "_actions_lnt7f_474"
}, hr = (e) => /* @__PURE__ */ h(z, {
	name: "chevron-down",
	size: 14,
	...e
}), gr = () => /* @__PURE__ */ h(z, {
	name: "search:search-2",
	size: 15
}), _r = () => /* @__PURE__ */ h(z, {
	name: "add",
	size: 14
}), vr = () => /* @__PURE__ */ h(z, {
	name: "close",
	size: 13
});
function yr({ size: e = 14 }) {
	return /* @__PURE__ */ h("svg", {
		width: e,
		height: e,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": !0,
		children: /* @__PURE__ */ h("path", { d: "M20 6 9 17l-5-5" })
	});
}
var br = {
	primary: {
		variant: "solid",
		theme: "primary"
	},
	secondary: {
		variant: "outline",
		theme: "neutral"
	},
	tertiary: {
		variant: "ghost",
		theme: "neutral"
	}
};
function xr({ action: e, role: t }) {
	if (!e) return null;
	let n = br[t], { label: r, onClick: i, icon: a, iconPosition: o = "left", variant: s, theme: c, ariaLabel: l, disabled: u } = e, d = {
		size: "sm",
		variant: s ?? n.variant,
		theme: c ?? n.theme,
		onClick: i,
		disabled: u
	};
	return a && !r ? /* @__PURE__ */ h(G, {
		...d,
		"aria-label": l || "action",
		icon: a
	}) : a ? /* @__PURE__ */ h(G, {
		...d,
		leftIcon: o === "left" ? a : void 0,
		rightIcon: o === "right" ? a : void 0,
		children: r
	}) : /* @__PURE__ */ h(G, {
		...d,
		children: r
	});
}
var Sr = n(function({ options: e = [], value: t, defaultValue: n, onChange: r, onCommit: i, open: s, defaultOpen: f = !1, onOpenChange: _, mode: v = "single", optionControl: y = "none", chips: b = !1, searchable: x = !1, editable: S = !1, allowCustom: C = !1, addLabel: w, chevron: T = !0, variant: E = "default", status: O, groupLabel: k, showShortcuts: A = !1, footerHint: j = !1, leadingIcon: M, primaryAction: N, secondaryAction: P, tertiaryAction: F, actionsAlign: I = "right", width: L = "trigger", placeholder: ee = "Select…", label: te, ariaLabel: ne, disabled: R = !1, analyticsId: z, className: B, renderOption: re, loading: V = !1, loadingState: ie, emptyState: oe, emptyLabel: se = "No matches", searchPlaceholder: ce = "Search…", maxMenuHeight: le = 340, placement: ue = "auto", clearable: U = !1, style: W, ...de }, fe) {
	let { track: pe } = H(), G = v === "multi", me = t !== void 0, [he, ge] = d(n), K = me ? t : he, _e = (e) => {
		me || ge(e);
	}, ve = G ? Array.isArray(K) ? K : [] : K == null ? [] : [K], ye = s !== void 0, [be, xe] = d(f), Se = ye ? s : be, q = (e) => {
		let t = typeof e == "function" ? e(Se) : e;
		ye || xe(t), _?.(t);
	}, [Ce, we] = d(""), [Te, J] = d(-1), Ee = u(null), De = u(null), Oe = u(null), Y = u(null), ke = u(null), [Ae, je] = d({
		position: "fixed",
		top: 0,
		left: 0,
		visibility: "hidden"
	}), Me = ae(), Ne = o(), Pe = `dd-${Ne}`, Fe = `dd-label-${Ne}`, Ie = (e) => ve.includes(e), Le = te ? void 0 : ne || ee || void 0, Re = S ? S ? String(K ?? "") : "" : Ce, ze = e.length > 0 && e.every((e) => e && Array.isArray(e.options)), Be = l(() => ze ? e.flatMap((e) => e.options ?? []) : e, [e, ze]), Ve = (e) => Be.find((t) => t.value === e)?.label ?? e, He = Re.trim(), We = Be.some((e) => String(e.label).toLowerCase() === He.toLowerCase()), Ge = S && C && He !== "" && !We, Ke = l(() => {
		let t = He.toLowerCase(), n = t !== "" && (x || S), r = (e) => !n || `${e.label} ${e.subtitle ?? ""}`.toLowerCase().includes(t), i = ze ? e.map((e) => ({
			heading: e.heading,
			options: (e.options ?? []).filter(r)
		})) : [{
			heading: k,
			options: e.filter(r)
		}], a = [];
		return Ge && a.push({
			__custom: !0,
			value: He,
			label: He
		}), i.forEach((e) => {
			e.options.length !== 0 && (e.heading && a.push({
				__heading: !0,
				disabled: !0,
				label: e.heading
			}), e.options.forEach((e) => a.push(e)));
		}), a;
	}, [
		e,
		ze,
		k,
		He,
		x,
		S,
		Ge
	]), qe = Ke.filter((e) => !e.__heading && !e.__custom).length;
	function Je(e) {
		if (e.disabled) return;
		let t = (e, t) => {
			z && pe({
				component: "Dropdown",
				id: z,
				action: "select",
				value: e,
				...t
			});
		};
		if (e.__custom) {
			_e(e.value), r?.(e.value), i?.(e.value), t(e.value, { custom: !0 }), q(!1);
			return;
		}
		if (G) {
			let n = Ie(e.value), a = n ? ve.filter((t) => t !== e.value) : [...ve, e.value];
			_e(a), r?.(a), i?.(a), t(e.value, {
				label: e.label,
				selected: !n,
				count: a.length
			});
		} else _e(e.value), r?.(e.value), i?.(e.value), t(e.value, { label: e.label }), q(!1);
	}
	function Ye(e) {
		let t = ve.filter((t) => t !== e);
		_e(t), r?.(t);
	}
	function Xe() {
		_e(""), r?.(""), i?.(""), z && pe({
			component: "Dropdown",
			id: z,
			action: "clear"
		});
	}
	let Ze = U && !G && !R && K != null && K !== "";
	c(() => {
		if (!Se) return;
		let e = () => {
			let e = De.current, t = Y.current;
			if (!e || !t) return;
			let n = e.getBoundingClientRect(), r = window.innerWidth, i = window.innerHeight, a = E === "seamless", o = r - 16;
			if (typeof L == "number") t.style.width = `${Math.min(o, L)}px`;
			else if (L === "trigger" && !a) t.style.width = `${n.width}px`;
			else {
				t.style.width = "";
				let e = a ? Math.max(n.width * 1.45, 200) : n.width;
				t.style.width = `${Math.min(o, Math.max(t.offsetWidth, e))}px`;
			}
			let s = t.offsetWidth, c = t.offsetHeight, l = n.left;
			l + s > r - 8 && (l = r - 8 - s), l < 8 && (l = 8);
			let u = n.bottom + 6, d = n.top - 6 - c, f;
			ue === "top" ? f = d >= 8 ? d : u : ue === "bottom" ? f = u : (f = u, f + c > i - 8 && d >= 8 && (f = d)), f + c > i - 8 && (f = Math.max(8, i - 8 - c)), f < 8 && (f = 8), je({
				position: "fixed",
				top: f,
				left: l,
				zIndex: 9999
			});
		};
		return e(), window.addEventListener("resize", e), window.addEventListener("scroll", e, !0), () => {
			window.removeEventListener("resize", e), window.removeEventListener("scroll", e, !0);
		};
	}, [
		Se,
		L,
		E,
		Ke.length,
		b,
		ue
	]), a(() => {
		function e(e) {
			!Ee.current?.contains(e.target) && !Y.current?.contains(e.target) && q(!1);
		}
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []), a(() => {
		if (Se && x && !S) {
			let e = setTimeout(() => ke.current?.focus(), 0);
			return () => clearTimeout(e);
		}
	}, [
		Se,
		x,
		S
	]);
	function Qe() {
		S || we(""), J(-1), je({
			position: "fixed",
			top: 0,
			left: 0,
			visibility: "hidden"
		}), q(!0);
	}
	function $e(e) {
		if (R) return;
		if (!Se && (e.key === "ArrowDown" || !S && (e.key === "Enter" || e.key === " "))) {
			e.preventDefault(), Qe();
			return;
		}
		if (!Se) return;
		let t = Ke.filter((e) => !e.disabled);
		if (e.key === "Escape") q(!1), (S ? Oe.current : De.current)?.focus();
		else if (e.key === "ArrowDown") e.preventDefault(), J((e) => Cr(Ke, e, 1));
		else if (e.key === "ArrowUp") e.preventDefault(), J((e) => Cr(Ke, e, -1));
		else if (e.key === "Home") e.preventDefault(), J(Cr(Ke, -1, 1));
		else if (e.key === "End") e.preventDefault(), J(Cr(Ke, Ke.length, -1));
		else if (e.key === "Enter") {
			e.preventDefault();
			let n = Ke[Te] ?? (Ge ? Ke[0] : t.length === 1 ? t[0] : null);
			n && Je(n);
		}
	}
	let et = b && G && ve.length ? /* @__PURE__ */ h("span", {
		className: Z.triggerChips,
		children: ve.map((e) => /* @__PURE__ */ h(Ue, {
			size: "sm",
			color: "primary",
			label: Ve(e),
			onDelete: R ? void 0 : () => Ye(e),
			className: Z.triggerChip
		}, e))
	}) : G && ve.length ? /* @__PURE__ */ h("span", {
		className: Z.triggerText,
		children: ve.length === 1 ? Ve(ve[0]) : `${ve.length} selected`
	}) : !G && K != null && K !== "" ? /* @__PURE__ */ h("span", {
		className: Z.triggerText,
		children: Ve(K)
	}) : /* @__PURE__ */ h("span", {
		className: Z.placeholder,
		children: ee
	});
	function tt(e, t) {
		if (e.__heading) return /* @__PURE__ */ h("div", {
			className: Z.groupLabel,
			role: "presentation",
			children: e.label
		}, `__h${t}`);
		if (e.__custom) return /* @__PURE__ */ g("div", {
			role: "option",
			"aria-selected": !1,
			className: `${Z.option} ${Z.optionCustom}`,
			"data-active": t === Te ? "true" : void 0,
			onMouseEnter: () => J(t),
			onMouseDown: (e) => e.preventDefault(),
			onClick: () => Je(e),
			children: [/* @__PURE__ */ h("span", {
				className: Z.optAddIcon,
				"aria-hidden": !0,
				children: /* @__PURE__ */ h(_r, {})
			}), /* @__PURE__ */ h("span", {
				className: Z.optText,
				children: /* @__PURE__ */ h("span", {
					className: Z.optTitle,
					children: w ? w(e.value) : /* @__PURE__ */ g(m, { children: [
						"Add “",
						/* @__PURE__ */ h("strong", { children: e.value }),
						"”"
					] })
				})
			})]
		}, "__custom__");
		let n = Ie(e.value), r = t === Te;
		return /* @__PURE__ */ h("div", {
			role: "option",
			"aria-selected": n,
			"aria-disabled": e.disabled || void 0,
			className: Z.option,
			"data-active": r ? "true" : void 0,
			"data-selected": n ? "true" : void 0,
			"data-disabled": e.disabled ? "true" : void 0,
			onMouseEnter: () => J(t),
			onMouseDown: S ? (e) => e.preventDefault() : void 0,
			onClick: () => Je(e),
			children: re ? re(e, {
				selected: n,
				active: r
			}) : /* @__PURE__ */ g(m, { children: [
				y === "checkbox" && /* @__PURE__ */ h("span", {
					className: Z.control,
					"aria-hidden": !0,
					children: /* @__PURE__ */ h(rt, {
						size: "sm",
						checked: n,
						tabIndex: -1,
						disabled: e.disabled
					})
				}),
				y === "radio" && /* @__PURE__ */ h("span", {
					className: Z.control,
					"aria-hidden": !0,
					children: /* @__PURE__ */ h(ft, {
						checked: n,
						size: "sm"
					})
				}),
				e.icon && /* @__PURE__ */ h("span", {
					className: Z.optIcon,
					children: e.icon
				}),
				/* @__PURE__ */ g("span", {
					className: Z.optText,
					children: [/* @__PURE__ */ h("span", {
						className: Z.optTitle,
						children: e.label
					}), e.subtitle && /* @__PURE__ */ h("span", {
						className: Z.optSub,
						children: e.subtitle
					})]
				}),
				/* @__PURE__ */ g("span", {
					className: Z.optRight,
					children: [
						A && e.shortcut && /* @__PURE__ */ h("kbd", {
							className: Z.kbd,
							children: e.shortcut
						}),
						e.iconRight && /* @__PURE__ */ h("span", {
							className: Z.optIconR,
							children: e.iconRight
						}),
						y === "none" && n && /* @__PURE__ */ h("span", {
							className: Z.check,
							children: /* @__PURE__ */ h(yr, {})
						})
					]
				})
			] })
		}, e.value);
	}
	let nt = { "--tesseract-dropdown-max-height": typeof le == "number" ? `${le}px` : le }, it = /* @__PURE__ */ g("div", {
		ref: Y,
		className: Z.menu,
		style: {
			...Ae,
			...nt
		},
		role: "listbox",
		"aria-multiselectable": G,
		"aria-labelledby": te ? Fe : void 0,
		id: Pe,
		children: [
			x && !S && /* @__PURE__ */ g("div", {
				className: Z.search,
				children: [/* @__PURE__ */ h("span", {
					className: Z.searchIcon,
					children: /* @__PURE__ */ h(gr, {})
				}), /* @__PURE__ */ h("input", {
					ref: ke,
					className: Z.searchInput,
					value: Ce,
					placeholder: ce,
					"aria-label": ce || "Search options",
					onChange: (e) => {
						we(e.target.value), J(-1);
					},
					onKeyDown: $e
				})]
			}),
			/* @__PURE__ */ h("div", {
				className: Z.list,
				children: V ? ie ?? /* @__PURE__ */ g("div", {
					className: Z.loading,
					children: [/* @__PURE__ */ h(D, {
						type: "line-spinner",
						size: 16,
						color: "var(--tesseract-blue-500)"
					}), /* @__PURE__ */ h("span", { children: "Loading…" })]
				}) : /* @__PURE__ */ g(m, { children: [qe === 0 && !Ge && (oe ?? /* @__PURE__ */ h("div", {
					className: Z.empty,
					children: se
				})), Ke.map((e, t) => tt(e, t))] })
			}),
			(j || N || P || F) && /* @__PURE__ */ g("div", {
				className: Z.footer,
				children: [j === "keys" ? /* @__PURE__ */ g("div", {
					className: Z.hint,
					"data-keys": "true",
					children: [
						/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("kbd", {
							className: Z.fkbd,
							children: "↑"
						}), " Up"] }),
						/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("kbd", {
							className: Z.fkbd,
							children: "↓"
						}), " Down"] }),
						/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("kbd", {
							className: Z.fkbd,
							children: "↵"
						}), " Enter"] }),
						/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("kbd", {
							className: Z.fkbd,
							children: "esc"
						}), " Close"] })
					]
				}) : j ? /* @__PURE__ */ g("div", {
					className: Z.hint,
					children: [
						/* @__PURE__ */ g("span", { children: [
							/* @__PURE__ */ h("kbd", {
								className: Z.fkbd,
								children: "↑"
							}),
							/* @__PURE__ */ h("kbd", {
								className: Z.fkbd,
								children: "↓"
							}),
							" navigate"
						] }),
						/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("kbd", {
							className: Z.fkbd,
							children: "↵"
						}), " select"] }),
						/* @__PURE__ */ g("span", { children: [/* @__PURE__ */ h("kbd", {
							className: Z.fkbd,
							children: "esc"
						}), " close"] })
					]
				}) : null, (N || P || F) && /* @__PURE__ */ g("div", {
					className: Z.actions,
					"data-align": I,
					children: [
						/* @__PURE__ */ h(xr, {
							action: F,
							role: "tertiary"
						}),
						/* @__PURE__ */ h(xr, {
							action: P,
							role: "secondary"
						}),
						/* @__PURE__ */ h(xr, {
							action: N,
							role: "primary"
						})
					]
				})]
			})
		]
	}), at = [
		Z.root,
		E === "seamless" && Z.seamless,
		B
	].filter(Boolean).join(" "), ot = (e) => {
		Ee.current = e, typeof fe == "function" ? fe(e) : fe && (fe.current = e);
	};
	return /* @__PURE__ */ g("div", {
		...de,
		ref: ot,
		className: at,
		style: W,
		"data-variant": E === "seamless" ? "seamless" : void 0,
		"data-status": O || void 0,
		"data-open": Se ? "true" : void 0,
		children: [
			te && /* @__PURE__ */ h("span", {
				id: Fe,
				className: Z.label,
				children: te
			}),
			S ? /* @__PURE__ */ g("div", {
				ref: De,
				className: Z.trigger,
				"data-editable": "true",
				"data-open": Se ? "true" : void 0,
				children: [
					M && /* @__PURE__ */ h("span", {
						className: Z.triggerLead,
						children: M
					}),
					Ze && /* @__PURE__ */ h("button", {
						type: "button",
						className: Z.clearBtn,
						"aria-label": "Clear selection",
						tabIndex: -1,
						onMouseDown: (e) => {
							e.preventDefault(), Xe();
						},
						children: /* @__PURE__ */ h(vr, {})
					}),
					/* @__PURE__ */ h("input", {
						ref: Oe,
						className: Z.editInput,
						type: "text",
						role: "combobox",
						"aria-expanded": Se,
						"aria-haspopup": "listbox",
						"aria-controls": Se ? Pe : void 0,
						"aria-labelledby": te ? Fe : void 0,
						"aria-label": Le,
						disabled: R,
						value: K ?? "",
						placeholder: ee,
						onChange: (e) => {
							r?.(e.target.value), Se || q(!0), J(-1);
						},
						onFocus: () => {
							R || (q(!0), J(-1));
						},
						onClick: () => {
							!R && !Se && (q(!0), J(-1));
						},
						onKeyDown: $e
					}),
					T && /* @__PURE__ */ h("button", {
						type: "button",
						className: Z.chevronBtn,
						"data-open": Se ? "true" : void 0,
						"aria-label": "Toggle options",
						tabIndex: -1,
						disabled: R,
						onMouseDown: (e) => {
							e.preventDefault(), R || q((e) => !e);
						},
						children: /* @__PURE__ */ h(hr, {})
					})
				]
			}) : /* @__PURE__ */ g("button", {
				ref: De,
				type: "button",
				className: Z.trigger,
				"data-open": Se ? "true" : void 0,
				disabled: R,
				"aria-haspopup": "listbox",
				"aria-expanded": Se,
				"aria-controls": Se ? Pe : void 0,
				"aria-labelledby": te ? Fe : void 0,
				"aria-label": Le,
				onClick: () => Se ? q(!1) : Qe(),
				onKeyDown: $e,
				children: [
					M && /* @__PURE__ */ h("span", {
						className: Z.triggerLead,
						children: M
					}),
					et,
					Ze && /* @__PURE__ */ h("span", {
						role: "button",
						tabIndex: -1,
						className: Z.clearBtn,
						"aria-label": "Clear selection",
						onMouseDown: (e) => {
							e.preventDefault(), e.stopPropagation(), Xe();
						},
						onClick: (e) => {
							e.stopPropagation();
						},
						children: /* @__PURE__ */ h(vr, {})
					}),
					T && /* @__PURE__ */ h(hr, {
						className: Z.chevron,
						"data-open": Se ? "true" : void 0
					})
				]
			}),
			Se && Me && p(it, document.body)
		]
	});
});
function Cr(e, t, n) {
	let r = t;
	for (let t = 0; t < e.length; t++) if (r += n, r < 0 && (r = e.length - 1), r >= e.length && (r = 0), !e[r]?.disabled) return r;
	return t;
}
Sr.displayName = "Dropdown";
var wr = {
	menu: "_menu_1qrdk_4",
	item: "_item_1qrdk_24",
	itemIcon: "_itemIcon_1qrdk_60",
	itemLabel: "_itemLabel_1qrdk_67",
	itemShortcut: "_itemShortcut_1qrdk_75",
	separator: "_separator_1qrdk_83",
	label: "_label_1qrdk_89"
}, Tr = e.createContext(null);
function Er(e, ...t) {
	for (let n of t) n && (typeof n == "function" ? n(e) : n.current = e);
}
function Dr({ open: t, defaultOpen: n = !1, onOpenChange: r, children: i, ...a }) {
	let [o, s] = e.useState(n), c = t !== void 0, l = c ? t : o, u = e.useCallback((e) => {
		s((n) => {
			let i = typeof e == "function" ? e(c ? t : n) : e;
			return r?.(i), c ? n : i;
		});
	}, [
		c,
		t,
		r
	]), d = e.useRef(null), f = e.useRef(null), p = e.useMemo(() => ({
		open: l,
		setOpen: u,
		triggerRef: d,
		contentRef: f
	}), [l, u]);
	return /* @__PURE__ */ h(Tr.Provider, {
		value: p,
		...a,
		children: i
	});
}
var Or = e.forwardRef(function({ asChild: t = !1, children: n, onClick: r, ...i }, a) {
	let o = e.useContext(Tr), s = o?.triggerRef, c = {
		ref: e.useCallback((e) => Er(e, s, a), [s, a]),
		"aria-haspopup": "menu",
		"aria-expanded": o?.open || !1,
		"data-state": o?.open ? "open" : "closed",
		onClick: (e) => {
			r?.(e), e.defaultPrevented || o?.setOpen((e) => !e);
		},
		...i
	};
	return t ? /* @__PURE__ */ h(V, {
		...c,
		children: n
	}) : /* @__PURE__ */ h("button", {
		type: "button",
		...c,
		children: n
	});
});
function kr({ side: t = "bottom", align: n = "start", sideOffset: r = 6, className: i, style: a, children: o, ...s }) {
	let c = e.useContext(Tr), l = ae(), { open: u, setOpen: d, triggerRef: f, contentRef: p } = c || {}, { x: m, y: g } = en({
		triggerRef: f,
		floatingRef: p,
		open: u,
		side: t,
		align: n,
		sideOffset: r
	});
	Xt(() => {
		d?.(!1), f?.current?.focus?.();
	}, u), Zt([f, p], () => d?.(!1), u), $t(p, u), e.useEffect(() => {
		u && (p?.current?.querySelector("[role=\"menuitem\"]:not([data-disabled])"))?.focus?.();
	}, [u, p]);
	let _ = (e) => {
		let t = Array.from(p?.current?.querySelectorAll("[role=\"menuitem\"]:not([data-disabled])") || []);
		if (!t.length) return;
		let n = t.indexOf(document.activeElement);
		e.key === "ArrowDown" ? (e.preventDefault(), (t[n + 1] || t[0]).focus()) : e.key === "ArrowUp" ? (e.preventDefault(), (t[n - 1] || t[t.length - 1]).focus()) : e.key === "Home" ? (e.preventDefault(), t[0].focus()) : e.key === "End" && (e.preventDefault(), t[t.length - 1].focus());
	};
	return !u || !l ? null : /* @__PURE__ */ h(Yt, { children: /* @__PURE__ */ h("div", {
		ref: p,
		role: "menu",
		className: U(wr.menu, i),
		style: {
			position: "fixed",
			top: g,
			left: m,
			...a
		},
		onKeyDown: _,
		...s,
		children: o
	}) });
}
function Ar({ icon: t, shortcut: n, danger: r = !1, disabled: i = !1, onSelect: a, onClick: o, children: s, className: c, ...l }) {
	let u = e.useContext(Tr);
	return /* @__PURE__ */ g("button", {
		type: "button",
		role: "menuitem",
		tabIndex: -1,
		disabled: i,
		"data-disabled": i || void 0,
		"data-danger": r || void 0,
		className: U(wr.item, c),
		onClick: (e) => {
			i || (o?.(e), a?.(e), u?.setOpen(!1), u?.triggerRef?.current?.focus?.());
		},
		...l,
		children: [
			t != null && /* @__PURE__ */ h("span", {
				className: wr.itemIcon,
				"aria-hidden": !0,
				children: typeof t == "string" ? /* @__PURE__ */ h(z, {
					name: t,
					size: 16
				}) : t
			}),
			/* @__PURE__ */ h("span", {
				className: wr.itemLabel,
				children: s
			}),
			n != null && /* @__PURE__ */ h("span", {
				className: wr.itemShortcut,
				children: n
			})
		]
	});
}
function jr({ className: e, ...t }) {
	return /* @__PURE__ */ h("div", {
		role: "separator",
		className: U(wr.separator, e),
		...t
	});
}
function Mr({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ h("div", {
		className: U(wr.label, e),
		...n,
		children: t
	});
}
Dr.displayName = "Menu", Or.displayName = "MenuTrigger", kr.displayName = "MenuContent", Ar.displayName = "MenuItem", jr.displayName = "MenuSeparator", Mr.displayName = "MenuLabel";
//#endregion
//#region src/components/molecules/ClinicalTable/columns.js
var Nr = (e) => (e ?? []).map((e) => typeof e == "string" ? {
	value: e,
	label: e
} : e), Pr = {
	number: {
		minWidth: 84,
		maxWidth: 120
	},
	date: {
		minWidth: 140,
		maxWidth: 180
	},
	select: {
		minWidth: 120,
		maxWidth: 180
	},
	multiselect: {
		minWidth: 160,
		maxWidth: 260
	},
	combo: {
		minWidth: 140,
		maxWidth: 220
	},
	text: {
		minWidth: 140,
		maxWidth: 260
	},
	search: {
		minWidth: 200,
		maxWidth: 320
	}
}, Fr = (e) => {
	let t = Pr[e.type] ?? Pr.text;
	return {
		width: e.width,
		minWidth: e.minWidth ?? t.minWidth,
		maxWidth: e.expand ? void 0 : e.maxWidth ?? t.maxWidth
	};
}, Ir = (e) => e.type === "search" || !!e.frequentlyUsedLabel;
function Lr(e, t, n) {
	if (e.validate) {
		let r = e.validate(t, n);
		if (r) return r;
	}
	if (e.type === "search" && e.flagCustom) {
		let n = String(t ?? "").trim().toLowerCase();
		if (n && !Nr(e.options).some((e) => String(e.label).toLowerCase() === n || String(e.value).toLowerCase() === n)) return e.flagCustom === !0 ? "warning" : e.flagCustom;
	}
}
var Rr = {
	wrap: "_wrap_q8ocw_6",
	table: "_table_q8ocw_36",
	headRow: "_headRow_q8ocw_44",
	th: "_th_q8ocw_49",
	sideCol: "_sideCol_q8ocw_70",
	row: "_row_q8ocw_79",
	td: "_td_q8ocw_88",
	ctRowSettle: "_ctRowSettle_q8ocw_1",
	dragHandle: "_dragHandle_q8ocw_147",
	actionCol: "_actionCol_q8ocw_152",
	sticky: "_sticky_q8ocw_158",
	stickyLeft: "_stickyLeft_q8ocw_197",
	actionCell: "_actionCell_q8ocw_227",
	moreAnchor: "_moreAnchor_q8ocw_236",
	menu: "_menu_q8ocw_262",
	menuItem: "_menuItem_q8ocw_279",
	menuItemIcon: "_menuItemIcon_q8ocw_299",
	menuItemDanger: "_menuItemDanger_q8ocw_305",
	skelCell: "_skelCell_q8ocw_317",
	emptyCell: "_emptyCell_q8ocw_325",
	customCell: "_customCell_q8ocw_333"
};
//#endregion
//#region src/components/molecules/ClinicalTable/cells.jsx
function zr({ column: e, value: t, row: n, locked: r, onChange: i, onCommit: a }) {
	let o = r ? void 0 : Lr(e, t, n), s = e.editable === !1, c = typeof e.header == "string" && e.header ? e.header : e.id;
	if (e.type === "multiselect") return /* @__PURE__ */ h(Sr, {
		variant: "seamless",
		ariaLabel: c,
		mode: "multi",
		chips: e.chips !== !1,
		chevron: !0,
		searchable: e.searchable,
		optionControl: e.optionControl || "none",
		footerHint: e.footerHint || Ir(e) ? "keys" : !1,
		options: Nr(e.options),
		value: Array.isArray(t) ? t : [],
		placeholder: r ? "" : e.placeholder,
		status: o,
		leadingIcon: e.icon,
		disabled: r || s,
		onChange: i
	});
	if (e.type === "combo") return /* @__PURE__ */ h(Sr, {
		variant: "seamless",
		ariaLabel: c,
		editable: !0,
		chevron: e.chevron !== !1,
		allowCustom: e.allowCustom !== !1,
		searchable: e.searchable,
		groupLabel: e.frequentlyUsedLabel,
		optionControl: e.optionControl || "none",
		footerHint: e.footerHint || Ir(e) ? "keys" : !1,
		options: Nr(e.options),
		value: t,
		placeholder: r ? "" : e.placeholder,
		status: o,
		leadingIcon: e.icon,
		disabled: r || s,
		onChange: i,
		onCommit: a
	});
	if (e.type === "select" || e.type === "search") {
		let n = e.type === "search";
		return /* @__PURE__ */ h(Sr, {
			variant: "seamless",
			ariaLabel: c,
			editable: n,
			chevron: !n,
			searchable: !n && e.searchable,
			allowCustom: n && e.allowCustom !== !1,
			groupLabel: e.frequentlyUsedLabel,
			optionControl: e.optionControl || "none",
			footerHint: e.footerHint || Ir(e) ? "keys" : !1,
			options: Nr(e.options),
			value: t,
			placeholder: r ? "" : e.placeholder,
			status: o,
			leadingIcon: e.icon,
			disabled: r || s,
			onChange: i,
			onCommit: a
		});
	}
	return /* @__PURE__ */ h(Qe, {
		variant: "seamless",
		"aria-label": c,
		fullWidth: !0,
		type: e.type === "date" ? "date" : void 0,
		allow: e.type === "number" ? "numeric" : e.allow ?? "any",
		counter: e.counter,
		clearable: e.clearable,
		value: t ?? "",
		placeholder: r ? "" : e.placeholder,
		status: o ?? "default",
		leftIcon: e.icon,
		disabled: r,
		readOnly: s,
		onChange: (e) => i(e.target.value)
	});
}
function Br() {
	return /* @__PURE__ */ h("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "currentColor",
		"aria-hidden": !0,
		children: [
			5,
			12,
			19
		].flatMap((e) => [/* @__PURE__ */ h("circle", {
			cx: "9",
			cy: e,
			r: "1.4"
		}, `l${e}`), /* @__PURE__ */ h("circle", {
			cx: "15",
			cy: e,
			r: "1.4"
		}, `r${e}`)])
	});
}
function Vr({ icon: e, iconVariant: t, iconFamily: n, onDragStart: r, onDragEnd: i }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: Rr.dragHandle,
		draggable: !0,
		onDragStart: r,
		onDragEnd: i,
		"aria-label": "Drag to reorder row",
		children: e ? /* @__PURE__ */ h(z, {
			name: e,
			variant: t || void 0,
			family: n || void 0,
			size: 18
		}) : /* @__PURE__ */ h(Br, {})
	});
}
function Hr({ items: e, row: t, moreIcon: n, iconVariant: r, iconFamily: i }) {
	return /* @__PURE__ */ g(Dr, { children: [/* @__PURE__ */ h(Or, {
		asChild: !0,
		children: /* @__PURE__ */ h(G, {
			variant: "ghost",
			theme: "neutral",
			size: "sm",
			"aria-label": "More actions",
			icon: /* @__PURE__ */ h(z, {
				name: n || "3-dots-more",
				variant: r || "bold",
				family: i || void 0,
				corner: "straight",
				size: 16
			})
		})
	}), /* @__PURE__ */ h(kr, {
		align: "end",
		children: e.map((e, n) => /* @__PURE__ */ h(Ar, {
			icon: e.icon,
			danger: e.danger,
			onSelect: () => e.onClick?.(t),
			children: e.label
		}, n))
	})] });
}
function Ur({ row: e, deletable: t, menuItems: n, onDelete: r, moreIcon: i, deleteIcon: a, iconVariant: o, iconFamily: s }) {
	return /* @__PURE__ */ g("div", {
		className: Rr.actionCell,
		children: [n.length > 0 && /* @__PURE__ */ h(Hr, {
			items: n,
			row: e,
			moreIcon: i,
			iconVariant: o,
			iconFamily: s
		}), t && /* @__PURE__ */ h(G, {
			variant: "ghost",
			theme: "neutral",
			size: "sm",
			"aria-label": "Delete row",
			icon: /* @__PURE__ */ h(z, {
				name: a || "trash",
				variant: o || void 0,
				family: s || void 0,
				size: 16
			}),
			onClick: () => r(e.id)
		})]
	});
}
//#endregion
//#region src/components/molecules/ClinicalTable/ClinicalTable.jsx
var Wr = 0, Gr = () => ({ id: `ct-${++Wr}` }), Kr = (() => {
	if (typeof document > "u") return null;
	let e = new Image(1, 1);
	return e.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", e;
})(), qr = e.forwardRef(function({ columns: t = [], name: n, notes: r, primaryKey: i, rows: a, defaultRows: o = [], onChange: s, reorderable: c = !0, deletable: l = !0, showRowMenu: u = !0, rowMenu: d, autoRow: f = !0, density: p = "comfortable", loading: m = !1, loadingRows: _ = 4, emptyState: v, stickyHeader: y = !1, stickyFirst: b = !1, stickyLast: x = !1, maxHeight: S, dragIcon: C, moreIcon: w, deleteIcon: T, duplicateIcon: E, iconVariant: D, iconFamily: O, className: k, style: A, ...j }, M) {
	let N = a !== void 0, [P, F] = e.useState(o), I = N ? a : P, L = (e) => {
		N || F(e), s?.(e);
	}, ee = {
		id: "name",
		header: "Name",
		type: "search",
		placeholder: "Search & add",
		frequentlyUsedLabel: "Frequently used",
		allowCustom: !0,
		minWidth: 220,
		maxWidth: 320,
		...n
	}, te = r === !1 ? null : {
		id: "notes",
		header: "Notes",
		type: "text",
		placeholder: "Notes",
		minWidth: 160,
		expand: !0,
		...r
	}, ne = [
		ee,
		...t,
		...te ? [te] : []
	], R = !b && !x ? ne : ne.map((e, t) => e.sticky ? e : b && t === 0 ? {
		...e,
		sticky: "left"
	} : x && t === ne.length - 1 ? {
		...e,
		sticky: "right"
	} : e), B = e.useMemo(() => {
		let e = R.filter((e) => e.sticky !== "right"), t = R.filter((e) => e.sticky === "right");
		return t.length <= 1 ? [...e, ...t] : [
			...e,
			...t.slice(0, -1).map((e) => ({
				...e,
				sticky: void 0
			})),
			t[t.length - 1]
		];
	}, [R]), re = i && B.some((e) => e.id === i) ? i : ee.id, [V, ie] = e.useState(Gr), ae = f ? [...I, V] : I, [oe, H] = e.useState(null), [se, ce] = e.useState(null), le = e.useRef(null);
	e.useEffect(() => () => clearTimeout(le.current), []);
	let ue = e.useRef(/* @__PURE__ */ new Map()), W = e.useRef(null), de = () => {
		let e = /* @__PURE__ */ new Map();
		ue.current.forEach((t, n) => {
			t && t.isConnected && e.set(n, t.getBoundingClientRect().top);
		}), W.current = e;
	};
	e.useLayoutEffect(() => {
		let e = W.current;
		e && (W.current = null, ue.current.forEach((t, n) => {
			let r = e.get(n);
			if (!t || r == null) return;
			let i = r - t.getBoundingClientRect().top;
			Math.abs(i) < .5 || (t.style.transition = "none", t.style.transform = `translateY(${i}px)`, t.getBoundingClientRect(), requestAnimationFrame(() => {
				t.style.transition = "transform 220ms cubic-bezier(.2,.8,.2,1)", t.style.transform = "";
				let e = () => {
					t.style.transition = "", t.removeEventListener("transitionend", e);
				};
				t.addEventListener("transitionend", e);
			}));
		}));
	});
	let fe = (e, t, n) => {
		e === V.id ? ie({
			...V,
			[t]: n
		}) : L(I.map((r) => r.id === e ? {
			...r,
			[t]: n
		} : r));
	}, pe = (e) => {
		let t = String(e ?? "").trim();
		if (!t) return;
		let n = {
			...V,
			[re]: t
		};
		ie(Gr()), L([...I, n]);
	}, G = (e) => {
		de(), L(I.filter((t) => t.id !== e));
	}, me = (e) => {
		let t = I.findIndex((t) => t.id === e.id);
		if (t < 0) return;
		let n = [...I];
		n.splice(t + 1, 0, {
			...e,
			id: `ct-${++Wr}`
		}), de(), L(n);
	}, he = (e, t) => {
		H(t), e.dataTransfer && (e.dataTransfer.effectAllowed = "move", Kr && e.dataTransfer.setDragImage(Kr, 0, 0));
	}, ge = (e, t) => {
		if (e.preventDefault(), oe == null || t >= I.length) return;
		let n = I.findIndex((e) => e.id === oe);
		if (n < 0 || n === t) return;
		let r = [...I], [i] = r.splice(n, 1);
		r.splice(t, 0, i), de(), L(r);
	}, K = () => {
		oe != null && (ce(oe), clearTimeout(le.current), le.current = setTimeout(() => ce(null), 650)), H(null);
	}, _e = u ? (d ?? [{
		label: "Duplicate",
		icon: /* @__PURE__ */ h(z, {
			name: E || "copy",
			variant: D || void 0,
			family: O || void 0,
			size: 15
		})
	}]).map((e) => ({
		...e,
		onClick: e.onClick ?? (e.label === "Duplicate" ? me : void 0)
	})) : [], ve = l || _e.length > 0, ye = e.useRef(null), [be, xe] = e.useState(!1);
	e.useEffect(() => {
		let e = ye.current;
		if (!e) return;
		let t = () => {
			let t = e.scrollWidth - e.clientWidth;
			xe(t > 1 && e.scrollLeft < t - 1);
		};
		t(), e.addEventListener("scroll", t, { passive: !0 });
		let n = typeof ResizeObserver < "u" ? new ResizeObserver(t) : null;
		return n?.observe(e), window.addEventListener("resize", t), () => {
			e.removeEventListener("scroll", t), n?.disconnect(), window.removeEventListener("resize", t);
		};
	}, [t.length]);
	let Se = S == null ? void 0 : {
		maxHeight: typeof S == "number" ? `${S}px` : S,
		overflowY: "auto"
	}, q = e.useCallback((e) => {
		ye.current = e, typeof M == "function" ? M(e) : M && (M.current = e);
	}, [M]), Ce = B.length + +!!c + +!!ve, we = !m && v != null && I.length === 0 && (!f || ae.length === 0);
	return /* @__PURE__ */ h("div", {
		ref: q,
		className: U(Rr.wrap, k),
		"data-behind": be || void 0,
		"data-density": p,
		"data-sticky-header": y || void 0,
		style: {
			...Se,
			...A
		},
		...j,
		children: /* @__PURE__ */ g("table", {
			className: Rr.table,
			children: [/* @__PURE__ */ h("thead", { children: /* @__PURE__ */ g("tr", {
				className: Rr.headRow,
				children: [
					c && /* @__PURE__ */ h("th", {
						className: U(Rr.th, Rr.sideCol),
						"aria-hidden": !0
					}),
					B.map((e) => /* @__PURE__ */ h("th", {
						className: U(Rr.th, e.sticky === "right" && Rr.sticky, e.sticky === "left" && Rr.stickyLeft),
						style: {
							...Fr(e),
							...e.sticky === "right" && ve ? { right: 92 } : {}
						},
						"data-align": e.align,
						"data-shadow": e.sticky === "right" || e.sticky === "left" || void 0,
						children: e.header
					}, e.id)),
					ve && /* @__PURE__ */ h("th", {
						className: U(Rr.th, Rr.actionCol, Rr.sticky),
						"data-shadow": "true",
						"aria-hidden": !0
					})
				]
			}) }), /* @__PURE__ */ g("tbody", { children: [
				m && Array.from({ length: Math.max(1, _) }).map((e, t) => /* @__PURE__ */ g("tr", {
					className: Rr.row,
					"aria-hidden": !0,
					children: [
						c && /* @__PURE__ */ h("td", { className: U(Rr.td, Rr.sideCol) }),
						B.map((e) => /* @__PURE__ */ h("td", {
							className: U(Rr.td, e.sticky === "right" && Rr.sticky, e.sticky === "left" && Rr.stickyLeft),
							style: {
								...Fr(e),
								...e.sticky === "right" && ve ? { right: 92 } : {}
							},
							"data-shadow": e.sticky === "right" || e.sticky === "left" || void 0,
							children: /* @__PURE__ */ h("div", {
								className: Rr.skelCell,
								children: /* @__PURE__ */ h(Fe, {
									variant: "text",
									height: 12,
									width: e.id === re ? "70%" : "55%"
								})
							})
						}, e.id)),
						ve && /* @__PURE__ */ h("td", {
							className: U(Rr.td, Rr.actionCol, Rr.sticky),
							"data-shadow": "true"
						})
					]
				}, `sk-${t}`)),
				we && /* @__PURE__ */ h("tr", {
					className: Rr.row,
					children: /* @__PURE__ */ h("td", {
						className: U(Rr.td, Rr.emptyCell),
						colSpan: Ce,
						children: v
					})
				}),
				!m && !we && ae.map((e, t) => {
					let n = e.id === V.id, r = !!String(e[re] ?? "").trim();
					return /* @__PURE__ */ g("tr", {
						ref: (t) => {
							t ? ue.current.set(e.id, t) : ue.current.delete(e.id);
						},
						className: Rr.row,
						"data-dragging": e.id === oe || void 0,
						"data-moved": e.id === se || void 0,
						onDragOver: c && !n ? (e) => ge(e, t) : void 0,
						onDrop: c ? K : void 0,
						children: [
							c && /* @__PURE__ */ h("td", {
								className: U(Rr.td, Rr.sideCol),
								children: !n && /* @__PURE__ */ h(Vr, {
									icon: C,
									iconVariant: D,
									iconFamily: O,
									onDragStart: (t) => he(t, e.id),
									onDragEnd: K
								})
							}),
							B.map((t) => {
								let i = t.id === re, a = !i && (n || !r), o = typeof t.render == "function" && !n;
								return /* @__PURE__ */ h("td", {
									className: U(Rr.td, t.sticky === "right" && Rr.sticky, t.sticky === "left" && Rr.stickyLeft),
									style: {
										...Fr(t),
										...t.sticky === "right" && ve ? { right: 92 } : {}
									},
									"data-shadow": t.sticky === "right" || t.sticky === "left" || void 0,
									children: o ? /* @__PURE__ */ h("div", {
										className: Rr.customCell,
										"data-align": t.align,
										children: t.render(e[t.id], e)
									}) : /* @__PURE__ */ h(zr, {
										column: t,
										value: e[t.id],
										row: e,
										locked: a,
										onChange: (n) => fe(e.id, t.id, n),
										onCommit: n && i ? pe : void 0
									})
								}, t.id);
							}),
							ve && /* @__PURE__ */ h("td", {
								className: U(Rr.td, Rr.actionCol, Rr.sticky),
								"data-shadow": "true",
								children: !n && /* @__PURE__ */ h(Ur, {
									row: e,
									deletable: l,
									menuItems: _e,
									onDelete: G,
									moreIcon: w,
									deleteIcon: T,
									iconVariant: D,
									iconFamily: O
								})
							})
						]
					}, e.id);
				})
			] })]
		})
	});
});
qr.displayName = "ClinicalTable";
var Jr = {
	root: "_root_1f6gy_3",
	bar: "_bar_1f6gy_10",
	ddRoot: "_ddRoot_1f6gy_17",
	trigger: "_trigger_1f6gy_22",
	triggerIcon: "_triggerIcon_1f6gy_50",
	caret: "_caret_1f6gy_56",
	panel: "_panel_1f6gy_66",
	sections: "_sections_1f6gy_84",
	section: "_section_1f6gy_84",
	sectionTitle: "_sectionTitle_1f6gy_96",
	panelFooter: "_panelFooter_1f6gy_105",
	option: "_option_1f6gy_114",
	control: "_control_1f6gy_146",
	activeBar: "_activeBar_1f6gy_154",
	activeLabel: "_activeLabel_1f6gy_165",
	chips: "_chips_1f6gy_173",
	chipGroup: "_chipGroup_1f6gy_184"
}, Yr = () => /* @__PURE__ */ h(z, {
	name: "chevron-down",
	size: 14,
	className: Jr.caret
}), Xr = () => /* @__PURE__ */ h(z, {
	name: "filter-2",
	size: 15
}), Zr = (e) => typeof e == "number" ? `${e}px` : e || void 0, Qr = e.forwardRef(function({ groups: t = [], value: n, defaultValue: r, onChange: i, label: a = "Filter", icon: o, mode: s = "live", clearLabel: c = "Clear all", doneLabel: l = "Done", width: u, maxHeight: d, className: f }, p) {
	let _ = n !== void 0, [v, y] = e.useState(r || {}), b = _ ? n : v, x = s === "apply", [S, C] = e.useState(b), [w, T] = e.useState(!1), E = (e) => {
		T((t) => {
			let n = typeof e == "function" ? e(t) : e;
			return x && n && C(b), n;
		});
	}, D = x ? S : b, O = (e) => {
		if (x) {
			C(e);
			return;
		}
		_ || y(e), i?.(e);
	}, k = () => {
		_ || y(S), i?.(S), T(!1);
	}, A = e.useRef(null), j = e.useId();
	Zt(A, () => T(!1), w);
	let M = (e, n) => {
		if (t.find((t) => t.id === e)?.type === "single") {
			let t = (D[e] || []).includes(n) ? [] : [n];
			O({
				...D,
				[e]: t
			});
			return;
		}
		let r = D[e] || [], i = r.includes(n) ? r.filter((e) => e !== n) : [...r, n];
		O({
			...D,
			[e]: i
		});
	}, N = (e) => {
		_ || y(e), x && C(e), i?.(e);
	}, P = (e, t) => N({
		...b,
		[e]: (b[e] || []).filter((e) => e !== t)
	}), F = () => N({}), I = () => O({}), L = t.reduce((e, t) => e + (D[t.id]?.length || 0), 0), ee = t.flatMap((e) => (b[e.id] || []).map((t) => ({
		gid: e.id,
		value: t,
		group: e.label,
		label: e.options.find((e) => e.value === t)?.label ?? t
	})));
	return /* @__PURE__ */ g("div", {
		ref: p,
		className: U(Jr.root, f),
		children: [/* @__PURE__ */ h("div", {
			className: Jr.bar,
			children: /* @__PURE__ */ g("div", {
				ref: A,
				className: Jr.ddRoot,
				children: [/* @__PURE__ */ g("button", {
					type: "button",
					className: Jr.trigger,
					"data-active": L > 0 || void 0,
					"aria-expanded": w,
					"aria-haspopup": "dialog",
					"aria-controls": w ? j : void 0,
					onClick: () => E((e) => !e),
					children: [
						/* @__PURE__ */ h("span", {
							className: Jr.triggerIcon,
							children: o ?? /* @__PURE__ */ h(Xr, {})
						}),
						a,
						L > 0 ? ` (${L})` : "",
						/* @__PURE__ */ h(Yr, {})
					]
				}), w && /* @__PURE__ */ g("div", {
					id: j,
					className: Jr.panel,
					role: "dialog",
					"aria-label": a,
					style: {
						"--filter-panel-width": Zr(u),
						"--filter-panel-max-height": Zr(d)
					},
					children: [/* @__PURE__ */ h("div", {
						className: Jr.sections,
						children: t.map((e) => {
							let t = e.type === "single";
							return /* @__PURE__ */ g("div", {
								className: Jr.section,
								children: [/* @__PURE__ */ h("div", {
									className: Jr.sectionTitle,
									children: e.label
								}), e.options.map((n) => {
									let r = (D[e.id] || []).includes(n.value), i = () => M(e.id, n.value);
									return /* @__PURE__ */ g("div", {
										role: "option",
										"aria-selected": r,
										tabIndex: 0,
										className: Jr.option,
										onClick: i,
										onKeyDown: (e) => {
											(e.key === "Enter" || e.key === " ") && (e.preventDefault(), i());
										},
										children: [/* @__PURE__ */ h("span", {
											className: Jr.control,
											"aria-hidden": !0,
											children: t ? /* @__PURE__ */ h(ft, {
												size: "sm",
												checked: r
											}) : /* @__PURE__ */ h(rt, {
												size: "sm",
												checked: r,
												tabIndex: -1
											})
										}), n.label]
									}, n.value);
								})]
							}, e.id);
						})
					}), /* @__PURE__ */ g("div", {
						className: Jr.panelFooter,
						children: [/* @__PURE__ */ h(G, {
							variant: "ghost",
							theme: "warning",
							size: "sm",
							onClick: I,
							disabled: L === 0,
							children: c
						}), /* @__PURE__ */ h(G, {
							variant: "solid",
							theme: "primary",
							size: "sm",
							onClick: x ? k : () => T(!1),
							children: l
						})]
					})]
				})]
			})
		}), ee.length > 0 && /* @__PURE__ */ g("div", {
			className: Jr.activeBar,
			children: [
				/* @__PURE__ */ g("span", {
					className: Jr.activeLabel,
					children: [a, ":"]
				}),
				/* @__PURE__ */ h("div", {
					className: Jr.chips,
					children: ee.map((e) => /* @__PURE__ */ h(Ue, {
						color: "primary",
						label: /* @__PURE__ */ g(m, { children: [
							/* @__PURE__ */ g("span", {
								className: Jr.chipGroup,
								children: [e.group, ":"]
							}),
							" ",
							e.label
						] }),
						onDelete: () => P(e.gid, e.value)
					}, `${e.gid}:${e.value}`))
				}),
				/* @__PURE__ */ h(G, {
					variant: "ghost",
					theme: "warning",
					size: "sm",
					onClick: F,
					children: c
				})
			]
		})]
	});
});
Qr.displayName = "Filter";
var $r = {
	overlay: "_overlay_1gxkz_4",
	"tesseract-drawer-fade": "_tesseract-drawer-fade_1gxkz_1",
	content: "_content_1gxkz_9",
	"tesseract-drawer-right": "_tesseract-drawer-right_1gxkz_1",
	"tesseract-drawer-left": "_tesseract-drawer-left_1gxkz_1",
	"tesseract-drawer-top": "_tesseract-drawer-top_1gxkz_1",
	"tesseract-drawer-bottom": "_tesseract-drawer-bottom_1gxkz_1",
	header: "_header_1gxkz_62",
	closeBtn: "_closeBtn_1gxkz_73",
	divider: "_divider_1gxkz_96",
	headerText: "_headerText_1gxkz_105",
	title: "_title_1gxkz_113",
	description: "_description_1gxkz_125",
	action: "_action_1gxkz_132",
	body: "_body_1gxkz_141",
	footer: "_footer_1gxkz_149"
};
//#endregion
//#region src/components/molecules/Drawer/Drawer.jsx
function ei(e) {
	return /* @__PURE__ */ h(nn, { ...e });
}
function ti(e) {
	return /* @__PURE__ */ h(rn, { ...e });
}
function ni(e) {
	return /* @__PURE__ */ h(an, { ...e });
}
function ri(e, t, n) {
	if (e == null) return t;
	if (e === "full") return n === "vh" ? "100vh" : "100vw";
	if (typeof e == "number") return `min(100${n}, ${e}px)`;
	let r = String(e).trim();
	return r.endsWith("%") ? `${parseFloat(r)}${n}` : /^\d+(\.\d+)?$/.test(r) ? `min(100${n}, ${r}px)` : r;
}
var ii = e.forwardRef(function({ side: e = "right", width: t, height: n, title: r, description: i, action: a, footer: o, header: s, showClose: c = !0, closeIcon: l = "close-square", bodyPadding: u, bodyClassName: d, className: f, children: p, ...m }, _) {
	let v = e === "top" || e === "bottom" ? { "--drawer-h": ri(n, "85vh", "vh") } : { "--drawer-w": ri(t, "min(440px, 100vw)", "vw") };
	u != null && (v["--drawer-body-pad"] = typeof u == "number" ? `${u}px` : u);
	let y = s != null || r != null || a != null || c;
	return /* @__PURE__ */ g(on, { children: [/* @__PURE__ */ h(sn, { className: $r.overlay }), /* @__PURE__ */ g(cn, {
		ref: _,
		"data-side": e,
		className: U($r.content, f),
		style: v,
		...m,
		children: [
			y && (s ?? /* @__PURE__ */ h(ai, {
				title: r,
				description: i,
				action: a,
				showClose: c,
				closeIcon: l
			})),
			/* @__PURE__ */ h("div", {
				className: U($r.body, d),
				children: p
			}),
			o != null && /* @__PURE__ */ h(li, { children: o })
		]
	})] });
}), ai = e.forwardRef(function({ title: e, description: t, action: n, showClose: r = !0, closeIcon: i = "close-square", className: a, children: o, ...s }, c) {
	return /* @__PURE__ */ g("div", {
		ref: c,
		className: U($r.header, a),
		...s,
		children: [
			r && /* @__PURE__ */ h(an, {
				asChild: !0,
				children: /* @__PURE__ */ h("button", {
					type: "button",
					className: $r.closeBtn,
					"aria-label": "Close",
					children: /* @__PURE__ */ h(z, {
						name: i,
						variant: "bold",
						size: 22
					})
				})
			}),
			r && (e != null || o != null) && /* @__PURE__ */ h("span", {
				className: $r.divider,
				"aria-hidden": "true"
			}),
			o ?? /* @__PURE__ */ g("div", {
				className: $r.headerText,
				children: [e != null && /* @__PURE__ */ h(oi, { children: e }), t != null && /* @__PURE__ */ h(si, { children: t })]
			}),
			n != null && /* @__PURE__ */ h("div", {
				className: $r.action,
				children: n
			})
		]
	});
}), oi = e.forwardRef(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ h(ln, {
		ref: n,
		className: U($r.title, e),
		...t
	});
}), si = e.forwardRef(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ h(un, {
		ref: n,
		className: U($r.description, e),
		...t
	});
}), ci = e.forwardRef(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ h("div", {
		ref: n,
		className: U($r.body, e),
		...t
	});
}), li = e.forwardRef(function({ className: e, align: t = "end", children: n, ...r }, i) {
	return /* @__PURE__ */ h("div", {
		ref: i,
		className: U($r.footer, e),
		"data-align": t,
		...r,
		children: n
	});
});
ei.displayName = "Drawer", ti.displayName = "DrawerTrigger", ii.displayName = "DrawerContent", ai.displayName = "DrawerHeader", oi.displayName = "DrawerTitle", si.displayName = "DrawerDescription", ci.displayName = "DrawerBody", li.displayName = "DrawerFooter", ni.displayName = "DrawerClose";
var ui = {
	overlay: "_overlay_pky6l_3",
	"tesseract-cmd-fade": "_tesseract-cmd-fade_pky6l_1",
	palette: "_palette_pky6l_8",
	"tesseract-cmd-pop": "_tesseract-cmd-pop_pky6l_1",
	searchRow: "_searchRow_pky6l_32",
	searchIcon: "_searchIcon_pky6l_42",
	input: "_input_pky6l_47",
	list: "_list_pky6l_61",
	group: "_group_pky6l_67",
	groupLabel: "_groupLabel_pky6l_71",
	item: "_item_pky6l_80",
	itemIcon: "_itemIcon_pky6l_100",
	itemLabel: "_itemLabel_pky6l_107",
	itemShortcut: "_itemShortcut_pky6l_115",
	empty: "_empty_pky6l_122"
}, di = (e) => String(e ?? "").toLowerCase().trim(), fi = (e, t) => t ? `${di(e.label)} ${di((e.keywords || []).join(" "))}`.includes(t) : !0, pi = e.forwardRef(function({ open: t, defaultOpen: n = !1, onOpenChange: r, groups: i, items: a, placeholder: o = "Type a command or search…", emptyText: s = "No results found.", label: c = "Command palette", className: l, ...u }, d) {
	let f = t !== void 0, [p, m] = e.useState(n), _ = f ? t : p, v = e.useCallback((e) => {
		m((n) => {
			let i = typeof e == "function" ? e(f ? t : n) : e;
			return r?.(i), f ? n : i;
		});
	}, [
		f,
		t,
		r
	]), y = i ?? (a ? [{ items: a }] : []), [b, x] = e.useState(""), [S, C] = e.useState(0), w = e.useRef(null);
	e.useEffect(() => {
		if (_) {
			let e = setTimeout(() => w.current?.focus(), 20);
			return () => clearTimeout(e);
		}
	}, [_]);
	let T = di(b), E = y.map((e) => ({
		...e,
		items: (e.items || []).filter((e) => fi(e, T))
	})).filter((e) => e.items.length > 0), D = E.flatMap((e) => e.items), O = () => {
		v(!1), x("");
	}, k = (e) => {
		!e || e.disabled || (e.onSelect?.(e), O());
	}, A = (e) => {
		e.key === "ArrowDown" ? (e.preventDefault(), C((e) => Math.min(e + 1, D.length - 1))) : e.key === "ArrowUp" ? (e.preventDefault(), C((e) => Math.max(e - 1, 0))) : e.key === "Enter" && (e.preventDefault(), k(D[S]));
	}, j = -1;
	return /* @__PURE__ */ h(nn, {
		open: _,
		onOpenChange: (e) => {
			v(e), e || x("");
		},
		children: _ && /* @__PURE__ */ g(on, { children: [/* @__PURE__ */ h(sn, { className: ui.overlay }), /* @__PURE__ */ g(cn, {
			ref: d,
			"aria-label": c,
			className: U(ui.palette, l),
			onKeyDown: A,
			...u,
			children: [/* @__PURE__ */ g("div", {
				className: ui.searchRow,
				children: [/* @__PURE__ */ h(z, {
					name: "search:search-2",
					size: 18,
					className: ui.searchIcon,
					"aria-hidden": !0
				}), /* @__PURE__ */ h("input", {
					ref: w,
					className: ui.input,
					placeholder: o,
					value: b,
					onChange: (e) => {
						x(e.target.value), C(0);
					},
					role: "combobox",
					"aria-expanded": "true",
					"aria-controls": "tesseract-command-list",
					"aria-label": "Command search"
				})]
			}), /* @__PURE__ */ h("div", {
				id: "tesseract-command-list",
				role: "listbox",
				className: ui.list,
				children: D.length === 0 ? /* @__PURE__ */ h("div", {
					className: ui.empty,
					children: s
				}) : E.map((e, t) => /* @__PURE__ */ g("div", {
					className: ui.group,
					role: "group",
					"aria-label": e.heading,
					children: [e.heading && /* @__PURE__ */ h("div", {
						className: ui.groupLabel,
						children: e.heading
					}), e.items.map((e) => {
						j += 1;
						let t = j, n = t === S;
						return /* @__PURE__ */ g("div", {
							role: "option",
							"aria-selected": n,
							"data-active": n || void 0,
							"data-disabled": e.disabled || void 0,
							className: ui.item,
							onMouseEnter: () => C(t),
							onClick: () => k(e),
							children: [
								e.icon != null && /* @__PURE__ */ h("span", {
									className: ui.itemIcon,
									"aria-hidden": !0,
									children: typeof e.icon == "string" ? /* @__PURE__ */ h(z, {
										name: e.icon,
										size: 16
									}) : e.icon
								}),
								/* @__PURE__ */ h("span", {
									className: ui.itemLabel,
									children: e.label
								}),
								e.shortcut && /* @__PURE__ */ h("span", {
									className: ui.itemShortcut,
									children: e.shortcut
								})
							]
						}, e.id ?? e.label);
					})]
				}, e.heading ?? t))
			})]
		})] })
	});
});
pi.displayName = "Command";
var mi = {
	alert: "_alert_1c60h_3",
	icon: "_icon_1c60h_43",
	body: "_body_1c60h_51",
	title: "_title_1c60h_59",
	description: "_description_1c60h_66",
	action: "_action_1c60h_72",
	close: "_close_1c60h_79"
}, hi = {
	info: "info-circle",
	success: "tick-circle",
	warning: "warning",
	error: "danger"
}, gi = e.forwardRef(function({ status: e = "info", title: t, children: n, icon: r, action: i, onDismiss: a, variant: o = "soft", className: s, ...c }, l) {
	let u = r === !1 ? null : r ?? hi[e], d = e === "warning" || e === "error";
	return /* @__PURE__ */ g("div", {
		ref: l,
		className: U(mi.alert, s),
		"data-status": e,
		"data-variant": o,
		role: d ? "alert" : "status",
		...c,
		children: [
			u != null && /* @__PURE__ */ h("span", {
				className: mi.icon,
				"aria-hidden": !0,
				children: typeof u == "string" ? /* @__PURE__ */ h(z, {
					name: u,
					variant: "bold",
					size: 18
				}) : u
			}),
			/* @__PURE__ */ g("div", {
				className: mi.body,
				children: [t != null && /* @__PURE__ */ h("p", {
					className: mi.title,
					children: t
				}), n != null && /* @__PURE__ */ h("div", {
					className: mi.description,
					children: n
				})]
			}),
			i != null && /* @__PURE__ */ h("div", {
				className: mi.action,
				children: i
			}),
			a && /* @__PURE__ */ h(G, {
				className: mi.close,
				variant: "ghost",
				theme: "neutral",
				size: "sm",
				"aria-label": "Dismiss",
				icon: /* @__PURE__ */ h(z, {
					name: "close-square",
					variant: "bold",
					size: 16
				}),
				onClick: a
			})
		]
	});
});
gi.displayName = "Alert";
var _i = {
	root: "_root_15ts8_3",
	list: "_list_15ts8_19",
	item: "_item_15ts8_30",
	crumbIcon: "_crumbIcon_15ts8_37",
	link: "_link_15ts8_43",
	current: "_current_15ts8_73",
	sep: "_sep_15ts8_86",
	ellipsis: "_ellipsis_15ts8_93"
}, vi = ({ separator: e }) => typeof e == "string" ? /* @__PURE__ */ h(z, {
	name: e,
	size: 14,
	className: _i.sep,
	"aria-hidden": !0
}) : /* @__PURE__ */ h("span", {
	className: _i.sep,
	"aria-hidden": !0,
	children: e
}), yi = ({ icon: e }) => e == null ? null : /* @__PURE__ */ h("span", {
	className: _i.crumbIcon,
	"aria-hidden": !0,
	children: typeof e == "string" ? /* @__PURE__ */ h(z, {
		name: e,
		size: 15
	}) : e
}), bi = e.forwardRef(function({ items: e = [], separator: t = "arrow-right3", maxItems: n, size: r = "md", className: i, ...a }, o) {
	let s = e;
	return typeof n == "number" && n >= 2 && e.length > n && (s = [
		e[0],
		{ ellipsis: !0 },
		...e.slice(e.length - (n - 1))
	]), /* @__PURE__ */ h("nav", {
		ref: o,
		"aria-label": "Breadcrumb",
		className: U(_i.root, i),
		"data-size": r,
		...a,
		children: /* @__PURE__ */ h("ol", {
			className: _i.list,
			children: s.map((r, i) => {
				let a = i === s.length - 1;
				return /* @__PURE__ */ g("li", {
					className: _i.item,
					children: [r.ellipsis ? /* @__PURE__ */ h("span", {
						className: _i.ellipsis,
						title: e.slice(1, e.length - (n - 1)).map((e) => e.label).join(" › "),
						children: "…"
					}) : a ? /* @__PURE__ */ g("span", {
						className: _i.current,
						"aria-current": "page",
						children: [/* @__PURE__ */ h(yi, { icon: r.icon }), r.label]
					}) : r.href == null ? r.onClick ? /* @__PURE__ */ g("button", {
						type: "button",
						className: _i.link,
						onClick: r.onClick,
						children: [/* @__PURE__ */ h(yi, { icon: r.icon }), r.label]
					}) : /* @__PURE__ */ g("span", {
						className: _i.link,
						"data-static": !0,
						children: [/* @__PURE__ */ h(yi, { icon: r.icon }), r.label]
					}) : /* @__PURE__ */ g("a", {
						href: r.href,
						className: _i.link,
						onClick: r.onClick,
						children: [/* @__PURE__ */ h(yi, { icon: r.icon }), r.label]
					}), !a && /* @__PURE__ */ h(vi, { separator: t })]
				}, i);
			})
		})
	});
});
bi.displayName = "Breadcrumb";
var xi = {
	card: "_card_1d0qr_3",
	title: "_title_1d0qr_82",
	description: "_description_1d0qr_82",
	content: "_content_1d0qr_82",
	header: "_header_1d0qr_89",
	footer: "_footer_1d0qr_119"
}, Si = e.forwardRef(function({ variant: e = "default", padding: t = "md", radius: n, tone: r = "neutral", gradient: i = !1, background: a, interactive: o = !1, className: s, style: c, children: l, ...u }, d) {
	let f = W(n), p = {
		...f == null ? null : { "--card-radius": f },
		...a ? { "--card-bg": a } : null,
		...c
	};
	return /* @__PURE__ */ h("div", {
		ref: d,
		className: U(xi.card, s),
		"data-variant": e,
		"data-padding": t,
		"data-tone": r === "neutral" ? void 0 : r,
		"data-gradient": i ? "" : void 0,
		"data-interactive": o ? "" : void 0,
		style: Object.keys(p).length ? p : void 0,
		...u,
		children: l
	});
}), Ci = e.forwardRef(function({ className: e, children: t, ...n }, r) {
	return /* @__PURE__ */ h("div", {
		ref: r,
		className: U(xi.header, e),
		...n,
		children: t
	});
}), wi = e.forwardRef(function({ as: e = "h3", className: t, children: n, ...r }, i) {
	return /* @__PURE__ */ h(e, {
		ref: i,
		className: U(xi.title, t),
		...r,
		children: n
	});
}), Ti = e.forwardRef(function({ className: e, children: t, ...n }, r) {
	return /* @__PURE__ */ h("p", {
		ref: r,
		className: U(xi.description, e),
		...n,
		children: t
	});
}), Ei = e.forwardRef(function({ className: e, children: t, ...n }, r) {
	return /* @__PURE__ */ h("div", {
		ref: r,
		className: U(xi.content, e),
		...n,
		children: t
	});
}), Di = e.forwardRef(function({ className: e, children: t, ...n }, r) {
	return /* @__PURE__ */ h("div", {
		ref: r,
		className: U(xi.footer, e),
		...n,
		children: t
	});
});
Si.displayName = "Card", Ci.displayName = "CardHeader", wi.displayName = "CardTitle", Ti.displayName = "CardDescription", Ei.displayName = "CardContent", Di.displayName = "CardFooter";
var Oi = {
	root: "_root_1avl9_3",
	ellipsis: "_ellipsis_1avl9_14"
}, ki = "…";
function Ai(e, t, n) {
	if (t <= n * 2 + 5) return Array.from({ length: t }, (e, t) => t);
	let r = Math.max(e - n, 1), i = Math.min(e + n, t - 2), a = [0];
	r > 1 && a.push(ki);
	for (let e = r; e <= i; e++) a.push(e);
	return i < t - 2 && a.push(ki), a.push(t - 1), a;
}
var ji = e.forwardRef(function({ page: e = 0, pageCount: t = 1, onPageChange: n, siblingCount: r = 1, size: i = "md", className: a, ...o }, s) {
	let c = (r) => {
		r >= 0 && r < t && r !== e && n?.(r);
	}, l = i === "sm" ? 16 : 18, u = i === "sm" ? 32 : 36, d = Ai(e, Math.max(1, t), r);
	return /* @__PURE__ */ g("nav", {
		ref: s,
		"aria-label": "Pagination",
		className: U(Oi.root, a),
		"data-size": i,
		...o,
		children: [
			/* @__PURE__ */ h(G, {
				variant: "ghost",
				theme: "neutral",
				size: i,
				icon: /* @__PURE__ */ h(z, {
					name: "arrow-left3",
					corner: "straight",
					size: l
				}),
				"aria-label": "Previous page",
				disabled: e <= 0,
				onClick: () => c(e - 1)
			}),
			d.map((t, n) => t === ki ? /* @__PURE__ */ h("span", {
				className: Oi.ellipsis,
				"aria-hidden": !0,
				children: ki
			}, `e${n}`) : /* @__PURE__ */ h(G, {
				variant: t === e ? "tonal" : "ghost",
				theme: t === e ? "primary" : "neutral",
				size: i,
				"aria-label": `Page ${t + 1}`,
				"aria-current": t === e ? "page" : void 0,
				onClick: () => c(t),
				style: { minWidth: u },
				children: t + 1
			}, t)),
			/* @__PURE__ */ h(G, {
				variant: "ghost",
				theme: "neutral",
				size: i,
				icon: /* @__PURE__ */ h(z, {
					name: "arrow-right3",
					corner: "straight",
					size: l
				}),
				"aria-label": "Next page",
				disabled: e >= t - 1,
				onClick: () => c(e + 1)
			})
		]
	});
});
ji.displayName = "Pagination";
var Mi = {
	root: "_root_exgkk_3",
	icon: "_icon_exgkk_22",
	media: "_media_exgkk_41",
	title: "_title_exgkk_45",
	description: "_description_exgkk_56",
	action: "_action_exgkk_63",
	linkRow: "_linkRow_exgkk_73"
}, Ni = e.forwardRef(function({ icon: e, media: t, iconSize: n, title: r, description: i, action: a, secondaryAction: o, link: s, size: c = "md", className: l, style: u, ...d }, f) {
	let p = n ?? (c === "sm" ? 22 : 28), m = n == null ? void 0 : { "--empty-disc": `${Math.round(n * 1.9)}px` };
	return /* @__PURE__ */ g("div", {
		ref: f,
		className: U(Mi.root, l),
		"data-size": c,
		role: "status",
		style: {
			...m,
			...u
		},
		...d,
		children: [
			t == null ? e == null ? null : /* @__PURE__ */ h("div", {
				className: Mi.icon,
				"aria-hidden": !0,
				children: typeof e == "string" ? /* @__PURE__ */ h(z, {
					name: e,
					size: p
				}) : e
			}) : /* @__PURE__ */ h("div", {
				className: Mi.media,
				children: t
			}),
			r != null && /* @__PURE__ */ h("p", {
				className: Mi.title,
				children: r
			}),
			i != null && /* @__PURE__ */ h("p", {
				className: Mi.description,
				children: i
			}),
			(a != null || o != null) && /* @__PURE__ */ g("div", {
				className: Mi.action,
				children: [a, o]
			}),
			s != null && /* @__PURE__ */ h("div", {
				className: Mi.linkRow,
				children: /* @__PURE__ */ h(G, {
					variant: "link",
					theme: "primary",
					size: c === "sm" ? "sm" : "md",
					href: s.href,
					onClick: s.onClick,
					children: s.label
				})
			})
		]
	});
});
Ni.displayName = "Empty";
var Q = {
	root: "_root_16vcw_3",
	head: "_head_16vcw_30",
	headCollapsed: "_headCollapsed_16vcw_38",
	logo: "_logo_16vcw_44",
	search: "_search_16vcw_50",
	toggleBtn: "_toggleBtn_16vcw_82",
	toggleBtnSm: "_toggleBtnSm_16vcw_104",
	flipIcon: "_flipIcon_16vcw_109",
	divider: "_divider_16vcw_113",
	scrollArea: "_scrollArea_16vcw_124",
	list: "_list_16vcw_132",
	collapsed: "_collapsed_16vcw_145",
	empty: "_empty_16vcw_155",
	header: "_header_16vcw_163",
	skeletonWrap: "_skeletonWrap_16vcw_169",
	skeletonRow: "_skeletonRow_16vcw_175",
	skeletonRowRail: "_skeletonRowRail_16vcw_182",
	skeletonChip: "_skeletonChip_16vcw_199",
	sidebarShimmer: "_sidebarShimmer_16vcw_1",
	skeletonLabel: "_skeletonLabel_16vcw_208",
	chip: "_chip_16vcw_217",
	chipActive: "_chipActive_16vcw_230",
	chipOpen: "_chipOpen_16vcw_235",
	section: "_section_16vcw_240",
	sectionOpen: "_sectionOpen_16vcw_258",
	sectionActiveLeaf: "_sectionActiveLeaf_16vcw_265",
	sectionAncestor: "_sectionAncestor_16vcw_272",
	sectionBadge: "_sectionBadge_16vcw_277",
	sectionLabel: "_sectionLabel_16vcw_285",
	sectionLabelActive: "_sectionLabelActive_16vcw_297",
	caret: "_caret_16vcw_302",
	caretOpen: "_caretOpen_16vcw_309",
	children: "_children_16vcw_314",
	childrenLine: "_childrenLine_16vcw_319",
	childrenList: "_childrenList_16vcw_328",
	childItem: "_childItem_16vcw_337",
	childItemActive: "_childItemActive_16vcw_354",
	childItemIcon: "_childItemIcon_16vcw_358",
	childItemLabel: "_childItemLabel_16vcw_371",
	childItemBadge: "_childItemBadge_16vcw_388",
	railItem: "_railItem_16vcw_393",
	railItemActive: "_railItemActive_16vcw_410",
	railBar: "_railBar_16vcw_414",
	railLabel: "_railLabel_16vcw_424",
	railLabelActive: "_railLabelActive_16vcw_437",
	railBadge: "_railBadge_16vcw_442",
	footer: "_footer_16vcw_456",
	fade: "_fade_16vcw_468",
	flyoutHost: "_flyoutHost_16vcw_482",
	flyout: "_flyout_16vcw_482",
	flyoutTitle: "_flyoutTitle_16vcw_510",
	flyoutList: "_flyoutList_16vcw_520",
	flyoutItem: "_flyoutItem_16vcw_529",
	flyoutItemActive: "_flyoutItemActive_16vcw_551",
	flyoutItemIcon: "_flyoutItemIcon_16vcw_557",
	flyoutItemLabel: "_flyoutItemLabel_16vcw_565",
	flyoutItemBadge: "_flyoutItemBadge_16vcw_572"
}, Pi = e.forwardRef(function({ href: e, children: t, ...n }, r) {
	if (e != null) {
		let { type: i, ...a } = n;
		return /* @__PURE__ */ h("a", {
			ref: r,
			href: e,
			...a,
			children: t
		});
	}
	return /* @__PURE__ */ h("button", {
		ref: r,
		type: "button",
		...n,
		children: t
	});
}), Fi = (e) => !e.children || e.children.length === 0, Ii = (e, t) => Fi(e) ? e.id === t : e.children.some((e) => e.id === t);
function Li({ icon: e, active: t, size: n = 20, variant: r }) {
	return typeof e == "string" ? /* @__PURE__ */ h(bt, {
		name: e,
		variant: r || (t ? "bulk" : "linear"),
		size: n
	}) : e ?? null;
}
function Ri({ badge: e }) {
	if (e == null) return null;
	let t = e;
	return e === "trial" && (t = {
		text: "Trial",
		variant: "gradient",
		color: "warning",
		sticky: "right"
	}), e === "soon" && (t = {
		text: "Soon",
		variant: "soft",
		color: "violet"
	}), typeof e == "string" && !t?.text ? null : t && typeof t == "object" && t.text != null ? /* @__PURE__ */ h(je, {
		variant: t.variant || "soft",
		color: t.color || "primary",
		size: "xs",
		sticky: t.sticky,
		children: t.text
	}) : e;
}
function zi({ anchor: t, children: n, offset: r = 10, accentVars: i }) {
	let a = e.useRef(null), [o, s] = e.useState(!1), [c, l] = e.useState(null), u = e.useRef(null), [d, f] = e.useState(!1);
	e.useEffect(() => f(!0), []);
	let _ = () => {
		u.current && clearTimeout(u.current), u.current = null;
	}, v = () => {
		_(), u.current = setTimeout(() => s(!1), 160);
	}, y = () => {
		if (_(), a.current) {
			let e = a.current.getBoundingClientRect();
			l({
				left: e.right + r,
				top: e.top
			});
		}
		s(!0);
	};
	return e.useLayoutEffect(() => {
		if (!o) return;
		let e = () => {
			if (a.current) {
				let e = a.current.getBoundingClientRect();
				l({
					left: e.right + r,
					top: e.top
				});
			}
		};
		return window.addEventListener("scroll", e, !0), window.addEventListener("resize", e), () => {
			window.removeEventListener("scroll", e, !0), window.removeEventListener("resize", e);
		};
	}, [o, r]), /* @__PURE__ */ g(m, { children: [t({
		onMouseEnter: y,
		onMouseLeave: v,
		onFocus: y,
		onBlur: v
	}, a), d && o && c ? p(/* @__PURE__ */ h("div", {
		className: Q.flyoutHost,
		style: {
			left: c.left,
			top: Math.max(8, c.top - 4),
			...i
		},
		onMouseEnter: y,
		onMouseLeave: v,
		children: n
	}), document.body) : null] });
}
function Bi({ item: e, activeId: t, onSelect: n }) {
	return /* @__PURE__ */ g("div", {
		className: Q.flyout,
		role: "menu",
		"aria-label": e.label,
		children: [/* @__PURE__ */ h("p", {
			className: Q.flyoutTitle,
			children: e.label
		}), /* @__PURE__ */ h("ul", {
			className: Q.flyoutList,
			children: e.children.map((e) => {
				let r = e.id === t;
				return /* @__PURE__ */ h("li", { children: /* @__PURE__ */ g(Pi, {
					href: e.href,
					role: "menuitem",
					"aria-current": r ? "page" : void 0,
					className: U(Q.flyoutItem, r && Q.flyoutItemActive),
					onClick: () => n(e.id),
					children: [
						/* @__PURE__ */ h("span", {
							className: Q.flyoutItemIcon,
							children: /* @__PURE__ */ h(Li, {
								icon: e.icon,
								active: r,
								size: 18
							})
						}),
						/* @__PURE__ */ h("span", {
							className: Q.flyoutItemLabel,
							children: e.label
						}),
						e.badge && /* @__PURE__ */ h("span", {
							className: Q.flyoutItemBadge,
							children: /* @__PURE__ */ h(Ri, { badge: e.badge })
						})
					]
				}) }, e.id);
			})
		})]
	});
}
function Vi({ collapsed: e, count: t = 6 }) {
	return /* @__PURE__ */ h("div", {
		className: Q.skeletonWrap,
		"aria-hidden": !0,
		children: Array.from({ length: t }).map((t, n) => /* @__PURE__ */ g("div", {
			className: U(Q.skeletonRow, e && Q.skeletonRowRail),
			children: [/* @__PURE__ */ h("span", { className: Q.skeletonChip }), !e && /* @__PURE__ */ h("span", { className: Q.skeletonLabel })]
		}, n))
	});
}
function Hi({ item: e, activeId: t, onSelect: n, accentVars: r }) {
	let i = Ii(e, t), a = Fi(e), o = (t, r) => /* @__PURE__ */ g(Pi, {
		href: a ? e.href : void 0,
		ref: r,
		className: U(Q.railItem, i && Q.railItemActive),
		onClick: () => n(a ? e.id : null, e),
		title: e.label,
		"aria-current": a && i ? "page" : void 0,
		"aria-haspopup": a ? void 0 : "menu",
		...t,
		children: [
			i && /* @__PURE__ */ h("span", { className: Q.railBar }),
			/* @__PURE__ */ h("span", {
				className: U(Q.chip, i && Q.chipActive),
				children: /* @__PURE__ */ h(Li, {
					icon: e.icon,
					active: i,
					size: 20
				})
			}),
			e.badge && /* @__PURE__ */ h("span", {
				className: Q.railBadge,
				children: /* @__PURE__ */ h(Ri, { badge: e.badge })
			}),
			/* @__PURE__ */ h("span", {
				className: U(Q.railLabel, i && Q.railLabelActive),
				children: e.label
			})
		]
	});
	return a ? o({}, null) : /* @__PURE__ */ h(zi, {
		anchor: (e, t) => o(e, t),
		accentVars: r,
		children: /* @__PURE__ */ h(Bi, {
			item: e,
			activeId: t,
			onSelect: n
		})
	});
}
function Ui({ item: e, activeId: t, expanded: n, onToggle: r, onSelect: i, caretIcon: a = "chevron-down" }) {
	let o = Fi(e), s = o ? e.id === t : !1, c = !o && Ii(e, t);
	return o ? /* @__PURE__ */ g(Pi, {
		href: e.href,
		className: U(Q.section, s && Q.sectionActiveLeaf),
		onClick: () => i(e.id),
		"aria-current": s ? "page" : void 0,
		children: [
			/* @__PURE__ */ h("span", {
				className: U(Q.chip, s && Q.chipActive),
				children: /* @__PURE__ */ h(Li, {
					icon: e.icon,
					active: s,
					size: 18
				})
			}),
			/* @__PURE__ */ h("span", {
				className: U(Q.sectionLabel, s && Q.sectionLabelActive),
				children: e.label
			}),
			e.badge && /* @__PURE__ */ h("span", {
				className: Q.sectionBadge,
				children: /* @__PURE__ */ h(Ri, { badge: e.badge })
			})
		]
	}) : /* @__PURE__ */ g("div", {
		className: Q.group,
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			className: U(Q.section, n && Q.sectionOpen, !n && c && Q.sectionAncestor),
			onClick: r,
			"aria-expanded": n,
			children: [
				/* @__PURE__ */ h("span", {
					className: U(Q.chip, !n && c && Q.chipActive, n && Q.chipOpen),
					children: /* @__PURE__ */ h(Li, {
						icon: e.icon,
						active: !n && c,
						size: 18
					})
				}),
				/* @__PURE__ */ h("span", {
					className: U(Q.sectionLabel, !n && c && Q.sectionLabelActive),
					children: e.label
				}),
				e.badge && /* @__PURE__ */ h("span", {
					className: Q.sectionBadge,
					children: /* @__PURE__ */ h(Ri, { badge: e.badge })
				}),
				/* @__PURE__ */ h("span", {
					className: U(Q.caret, n && Q.caretOpen),
					children: /* @__PURE__ */ h(bt, {
						name: a,
						variant: "linear",
						size: 14
					})
				})
			]
		}), n && /* @__PURE__ */ g("div", {
			className: Q.children,
			children: [/* @__PURE__ */ h("span", { className: Q.childrenLine }), /* @__PURE__ */ h("ul", {
				className: Q.childrenList,
				children: e.children.map((e) => {
					let n = e.id === t;
					return /* @__PURE__ */ h("li", { children: /* @__PURE__ */ g(Pi, {
						href: e.href,
						className: U(Q.childItem, n && Q.childItemActive),
						onClick: () => i(e.id),
						"aria-current": n ? "page" : void 0,
						children: [
							/* @__PURE__ */ h("span", {
								className: Q.childItemIcon,
								children: /* @__PURE__ */ h(Li, {
									icon: e.icon,
									active: n,
									size: 18
								})
							}),
							/* @__PURE__ */ h("span", {
								className: Q.childItemLabel,
								children: e.label
							}),
							e.badge && /* @__PURE__ */ h("span", {
								className: Q.childItemBadge,
								children: /* @__PURE__ */ h(Ri, { badge: e.badge })
							})
						]
					}) }, e.id);
				})
			})]
		})]
	});
}
var Wi = e.forwardRef(function({ items: t = [], activeId: n, onSelect: r, collapsed: i, defaultCollapsed: a = !1, onCollapsedChange: o, search: s = !1, searchPlaceholder: c = "Search…", showCollapseToggle: l = !0, expandedWidth: u = 236, collapsedWidth: d = 80, bottomFade: f = !0, logo: p, header: _, footer: v, className: y, style: b, accent: x = "var(--tesseract-blue-500)", density: S = "comfortable", emptyState: C, emptyText: w = "No matches.", loading: T = !1, collapseIcon: E = "sidebar-left", searchIcon: D = "search:search-2", caretIcon: O = "chevron-down", defaultOpenIds: k, onOpenChange: A, ...j }, M) {
	let N = i !== void 0, [P, F] = e.useState(a), I = N ? i : P, [L, ee] = e.useState(""), [te, ne] = e.useState(() => {
		if (k) return new Set(k);
		let e = t.find((e) => Ii(e, n));
		return new Set(e && !Fi(e) ? [e.id] : []);
	}), R = e.useCallback((e) => {
		ne((t) => {
			let n = typeof e == "function" ? e(t) : e;
			return A?.([...n]), n;
		});
	}, [A]);
	e.useEffect(() => {
		let e = t.find((e) => Ii(e, n));
		e && !Fi(e) && ne((t) => t.has(e.id) ? t : new Set(t).add(e.id));
	}, [n, t]);
	let z = () => {
		let e = !I;
		N || F(e), o?.(e);
	}, B = (e) => {
		if (Fi(e)) {
			r?.(e.id);
			return;
		}
		if (e.children?.length === 1) {
			r?.(e.children[0].id);
			return;
		}
		if (I) {
			N || F(!1), o?.(!1), R((t) => new Set(t).add(e.id));
			return;
		}
		R((t) => {
			let n = new Set(t);
			return n.has(e.id) ? n.delete(e.id) : n.add(e.id), n;
		});
	}, re = (e, t) => {
		e ? r?.(e) : t && B(t);
	}, V = x === "var(--tesseract-blue-500)", ie = {
		"--sidebar-accent": x,
		"--sidebar-accent-mid": V ? "var(--tesseract-blue-600)" : `color-mix(in srgb, ${x} 85%, #000)`,
		"--sidebar-accent-strong": V ? "var(--tesseract-blue-700)" : `color-mix(in srgb, ${x} 72%, #000)`
	}, ae = e.useMemo(() => {
		let e = L.trim().toLowerCase();
		if (!e) return t;
		let n = [];
		for (let r of t) {
			if (r.label.toLowerCase().includes(e)) {
				n.push(r);
				continue;
			}
			if (Fi(r)) continue;
			let t = r.children.filter((t) => t.label.toLowerCase().includes(e));
			t.length && n.push({
				...r,
				children: t
			});
		}
		return n;
	}, [t, L]);
	return /* @__PURE__ */ g("aside", {
		ref: M,
		className: U(Q.root, I && Q.collapsed, y),
		style: {
			width: I ? d : u,
			...ie,
			...b
		},
		"data-density": S,
		"aria-label": "Navigation",
		...j,
		children: [
			I ? /* @__PURE__ */ g(m, { children: [l && /* @__PURE__ */ h("div", {
				className: U(Q.head, Q.headCollapsed),
				children: /* @__PURE__ */ h("button", {
					className: Q.toggleBtn,
					onClick: z,
					title: "Expand sidebar",
					"aria-label": "Expand sidebar",
					children: /* @__PURE__ */ h(bt, {
						name: E,
						variant: "linear",
						size: 20,
						className: Q.flipIcon
					})
				})
			}), /* @__PURE__ */ h("span", { className: Q.divider })] }) : /* @__PURE__ */ g("div", {
				className: Q.head,
				children: [
					p != null && /* @__PURE__ */ h("div", {
						className: Q.logo,
						children: p
					}),
					s && /* @__PURE__ */ h(Qe, {
						surface: "muted",
						height: 40,
						radius: 10,
						fullWidth: !0,
						style: {
							flex: 1,
							minWidth: 0
						},
						value: L,
						onChange: (e) => ee(e.target.value),
						placeholder: c,
						"aria-label": c,
						leftIcon: /* @__PURE__ */ h(bt, {
							name: D,
							variant: "linear",
							size: 16
						})
					}),
					l && /* @__PURE__ */ h("button", {
						className: U(Q.toggleBtn, Q.toggleBtnSm),
						onClick: z,
						title: "Collapse sidebar",
						"aria-label": "Collapse sidebar",
						children: /* @__PURE__ */ h(bt, {
							name: E,
							variant: "linear",
							size: 20
						})
					})
				]
			}),
			_ != null && !I && /* @__PURE__ */ h("div", {
				className: Q.header,
				children: _
			}),
			/* @__PURE__ */ g("div", {
				className: Q.scrollArea,
				children: [/* @__PURE__ */ h("nav", {
					className: Q.list,
					children: T ? /* @__PURE__ */ h(Vi, { collapsed: I }) : ae.length === 0 ? C ?? /* @__PURE__ */ h("p", {
						className: Q.empty,
						children: w
					}) : I ? ae.map((e) => /* @__PURE__ */ h(Hi, {
						item: e,
						activeId: n,
						onSelect: re,
						accentVars: ie
					}, e.id)) : ae.map((e) => /* @__PURE__ */ h(Ui, {
						item: e,
						activeId: n,
						caretIcon: O,
						expanded: !Fi(e) && (te.has(e.id) || !!L),
						onToggle: () => B(e),
						onSelect: (e) => r?.(e)
					}, e.id))
				}), f && !I && /* @__PURE__ */ h("div", {
					className: Q.fade,
					"aria-hidden": !0
				})]
			}),
			v != null && /* @__PURE__ */ h("div", {
				className: Q.footer,
				children: v
			})
		]
	});
});
Wi.displayName = "Sidebar";
var Gi = {
	rail: "_rail_10b5h_3",
	collapsedHead: "_collapsedHead_10b5h_42",
	expHead: "_expHead_10b5h_49",
	expSearch: "_expSearch_10b5h_56",
	expToggle: "_expToggle_10b5h_88",
	flipIcon: "_flipIcon_10b5h_106",
	empty: "_empty_10b5h_110",
	scroll: "_scroll_10b5h_118",
	slotHeader: "_slotHeader_10b5h_137",
	slotFooter: "_slotFooter_10b5h_143",
	item: "_item_10b5h_152",
	inner: "_inner_10b5h_178",
	pill: "_pill_10b5h_188",
	signal: "_signal_10b5h_216",
	railBadge: "_railBadge_10b5h_229",
	label: "_label_10b5h_242",
	bar: "_bar_10b5h_259",
	pointer: "_pointer_10b5h_272",
	expItem: "_expItem_10b5h_287",
	expPill: "_expPill_10b5h_312",
	expLabel: "_expLabel_10b5h_329",
	expBadge: "_expBadge_10b5h_345",
	caret: "_caret_10b5h_349",
	caretOpen: "_caretOpen_10b5h_356",
	expGroup: "_expGroup_10b5h_360",
	expChildren: "_expChildren_10b5h_364",
	expChild: "_expChild_10b5h_364",
	expChildLabel: "_expChildLabel_10b5h_397",
	fade: "_fade_10b5h_445"
}, Ki = e.forwardRef(function({ href: e, disabled: t, children: n, ...r }, i) {
	if (e != null && !t) {
		let { type: t, ...a } = r;
		return /* @__PURE__ */ h("a", {
			ref: i,
			href: e,
			...a,
			children: n
		});
	}
	return /* @__PURE__ */ h("button", {
		ref: i,
		type: "button",
		disabled: t,
		...r,
		children: n
	});
}), qi = (e) => !e.children || e.children.length === 0, Ji = (e, t) => qi(e) ? e.id === t : e.children.some((e) => e.id === t);
function Yi({ icon: e, active: t, collapsed: n }) {
	return typeof e == "string" ? /* @__PURE__ */ h(bt, {
		name: e,
		variant: t ? "bulk" : "linear",
		size: n ? 20 : 18,
		color: t ? "var(--ss-active-icon, var(--ss-ramp-500, #4b4ad5))" : "var(--tesseract-slate-0)"
	}) : e ?? null;
}
function Xi({ badge: e }) {
	if (e == null) return null;
	let t = e;
	return e === "trial" && (t = {
		text: "Trial",
		variant: "gradient",
		color: "warning",
		sticky: "right"
	}), e === "soon" && (t = {
		text: "Soon",
		variant: "soft",
		color: "violet",
		sticky: "right"
	}), typeof e == "string" && !t?.text ? null : t && typeof t == "object" && t.text != null ? /* @__PURE__ */ h(je, {
		variant: t.variant || "soft",
		color: t.color || "primary",
		size: "xs",
		sticky: t.sticky,
		children: t.text
	}) : e;
}
function Zi({ item: e, activeId: t, onSelect: n }) {
	let r = qi(e) ? e.id === t : Ji(e, t);
	return /* @__PURE__ */ g(Ki, {
		href: qi(e) ? e.href : void 0,
		disabled: e.disabled,
		className: Gi.item,
		"data-active": r || void 0,
		"data-disabled": e.disabled || void 0,
		"aria-current": r ? "page" : void 0,
		onClick: () => n(qi(e) ? e.id : e.children?.[0]?.id),
		title: e.label,
		children: [
			/* @__PURE__ */ g("span", {
				className: Gi.inner,
				children: [/* @__PURE__ */ g("span", {
					className: Gi.pill,
					"data-active": r || void 0,
					children: [/* @__PURE__ */ h(Yi, {
						icon: e.icon,
						active: r,
						collapsed: !0
					}), e.signal && /* @__PURE__ */ h("span", {
						className: Gi.signal,
						children: /* @__PURE__ */ h(je, {
							variant: "dot",
							color: "error",
							size: "md"
						})
					})]
				}), /* @__PURE__ */ h("span", {
					className: Gi.label,
					children: e.label
				})]
			}),
			e.badge && !e.signal && /* @__PURE__ */ h("span", {
				className: Gi.railBadge,
				children: /* @__PURE__ */ h(Xi, { badge: e.badge })
			}),
			r && /* @__PURE__ */ h("span", {
				className: Gi.bar,
				"aria-hidden": !0
			}),
			r && /* @__PURE__ */ h("span", {
				className: Gi.pointer,
				"aria-hidden": !0
			})
		]
	}, e.id);
}
function Qi({ item: e, activeId: t, onSelect: n, expanded: r, onToggle: i, caretIcon: a = "chevron-down" }) {
	let o = qi(e), s = o ? e.id === t : !1, c = !o && Ji(e, t), l = s || c, u = `ss-section-${e.id}`;
	return o ? /* @__PURE__ */ g(Ki, {
		href: e.href,
		disabled: e.disabled,
		className: Gi.expItem,
		"data-active": s || void 0,
		"data-disabled": e.disabled || void 0,
		onClick: () => n(e.id),
		"aria-current": s ? "page" : void 0,
		children: [
			/* @__PURE__ */ h("span", {
				className: Gi.expPill,
				"data-active": s || void 0,
				children: /* @__PURE__ */ h(Yi, {
					icon: e.icon,
					active: s,
					collapsed: !1
				})
			}),
			/* @__PURE__ */ h("span", {
				className: Gi.expLabel,
				"data-active": s || void 0,
				children: e.label
			}),
			e.badge && /* @__PURE__ */ h("span", {
				className: Gi.expBadge,
				children: /* @__PURE__ */ h(Xi, { badge: e.badge })
			}),
			s && /* @__PURE__ */ h("span", {
				className: Gi.bar,
				"aria-hidden": !0
			})
		]
	}) : /* @__PURE__ */ g("div", {
		className: Gi.expGroup,
		children: [/* @__PURE__ */ g("button", {
			type: "button",
			className: Gi.expItem,
			"data-active": l || void 0,
			"data-open": r || void 0,
			onClick: i,
			"aria-expanded": r,
			"aria-controls": u,
			children: [
				/* @__PURE__ */ h("span", {
					className: Gi.expPill,
					"data-active": !r && c || void 0,
					children: /* @__PURE__ */ h(Yi, {
						icon: e.icon,
						active: !r && c,
						collapsed: !1
					})
				}),
				/* @__PURE__ */ h("span", {
					className: Gi.expLabel,
					"data-active": !r && c || void 0,
					children: e.label
				}),
				e.badge && /* @__PURE__ */ h("span", {
					className: Gi.expBadge,
					children: /* @__PURE__ */ h(Xi, { badge: e.badge })
				}),
				/* @__PURE__ */ h("span", {
					className: U(Gi.caret, r && Gi.caretOpen),
					children: /* @__PURE__ */ h(bt, {
						name: a,
						variant: "linear",
						size: 12
					})
				})
			]
		}), r && /* @__PURE__ */ h("div", {
			className: Gi.expChildren,
			id: u,
			children: e.children.map((e) => {
				let r = e.id === t;
				return /* @__PURE__ */ g(Ki, {
					href: e.href,
					disabled: e.disabled,
					className: Gi.expChild,
					"data-active": r || void 0,
					"data-disabled": e.disabled || void 0,
					onClick: () => n(e.id),
					"aria-current": r ? "page" : void 0,
					children: [
						/* @__PURE__ */ h(Yi, {
							icon: e.icon,
							active: r,
							collapsed: !1
						}),
						/* @__PURE__ */ h("span", {
							className: Gi.expChildLabel,
							"data-active": r || void 0,
							children: e.label
						}),
						e.badge && /* @__PURE__ */ h("span", {
							className: Gi.expBadge,
							children: /* @__PURE__ */ h(Xi, { badge: e.badge })
						})
					]
				}, e.id);
			})
		})]
	});
}
var $i = e.forwardRef(function({ items: t = [], activeId: n, onSelect: r, collapsed: i, defaultCollapsed: a = !0, onCollapsedChange: o, search: s = !1, searchPlaceholder: c = "Search…", showCollapseToggle: l = !0, expandedWidth: u = 200, collapsedWidth: d = 80, width: f, bottomFade: p = !0, tone: m = "blue", gradient: _, density: v = "comfortable", header: y, footer: b, emptyState: x, emptyText: S = "No matches", pointerColor: C, searchIcon: w = "search:search-2", collapseIcon: T = "sidebar-left", caretIcon: E = "chevron-down", className: D, style: O, ...k }, A) {
	let j = i !== void 0, [M, N] = e.useState(a), P = j ? i : M, F = P ? f || d : u, [I, L] = e.useState(""), [ee, te] = e.useState(() => {
		let e = t.find((e) => Ji(e, n));
		return new Set(e && !qi(e) ? [e.id] : []);
	});
	e.useEffect(() => {
		let e = t.find((e) => Ji(e, n));
		e && !qi(e) && te((t) => t.has(e.id) ? t : new Set(t).add(e.id));
	}, [n, t]);
	let ne = () => {
		let e = !P;
		j || N(e), o?.(e);
	}, R = (e) => {
		te((t) => {
			let n = new Set(t);
			return n.has(e.id) ? n.delete(e.id) : n.add(e.id), n;
		});
	}, z = e.useMemo(() => {
		let e = I.trim().toLowerCase();
		if (!e) return t;
		let n = [];
		for (let r of t) {
			if (r.label.toLowerCase().includes(e)) {
				n.push(r);
				continue;
			}
			if (qi(r)) continue;
			let t = r.children.filter((t) => t.label.toLowerCase().includes(e));
			t.length && n.push({
				...r,
				children: t
			});
		}
		return n;
	}, [t, I]), B = {
		width: F,
		minWidth: F,
		maxWidth: F,
		flexBasis: F
	};
	return _ && (B["--ss-gradient"] = _), C && (B["--ss-pointer"] = C), /* @__PURE__ */ g("nav", {
		ref: A,
		className: U(Gi.rail, P && Gi.collapsed, D),
		style: {
			...B,
			...O
		},
		"data-tone": m === "blue" ? void 0 : m,
		"data-density": v === "compact" ? "compact" : void 0,
		"aria-label": "Secondary",
		...k,
		children: [
			!P && (s || l) && /* @__PURE__ */ g("div", {
				className: Gi.expHead,
				children: [s && /* @__PURE__ */ g("div", {
					className: Gi.expSearch,
					children: [/* @__PURE__ */ h(bt, {
						name: w,
						variant: "linear",
						size: 14
					}), /* @__PURE__ */ h("input", {
						value: I,
						onChange: (e) => L(e.target.value),
						placeholder: c,
						"aria-label": c || "Search"
					})]
				}), l && /* @__PURE__ */ h("button", {
					className: Gi.expToggle,
					onClick: ne,
					title: "Collapse sidebar",
					"aria-label": "Collapse sidebar",
					children: /* @__PURE__ */ h(bt, {
						name: T,
						variant: "linear",
						size: 16
					})
				})]
			}),
			P && l && /* @__PURE__ */ h("div", {
				className: Gi.collapsedHead,
				children: /* @__PURE__ */ h("button", {
					className: Gi.expToggle,
					onClick: ne,
					title: "Expand sidebar",
					"aria-label": "Expand sidebar",
					children: /* @__PURE__ */ h(bt, {
						name: T,
						variant: "linear",
						size: 16,
						className: Gi.flipIcon
					})
				})
			}),
			y != null && /* @__PURE__ */ h("div", {
				className: Gi.slotHeader,
				children: y
			}),
			/* @__PURE__ */ h("div", {
				className: Gi.scroll,
				children: z.length === 0 ? x ?? /* @__PURE__ */ h("p", {
					className: Gi.empty,
					children: S
				}) : P ? z.map((e) => /* @__PURE__ */ h(Zi, {
					item: e,
					activeId: n,
					onSelect: (e) => r?.(e)
				}, e.id)) : z.map((e) => /* @__PURE__ */ h(Qi, {
					item: e,
					activeId: n,
					onSelect: (e) => r?.(e),
					expanded: !qi(e) && (ee.has(e.id) || !!I),
					onToggle: () => R(e),
					caretIcon: E
				}, e.id))
			}),
			b != null && /* @__PURE__ */ h("div", {
				className: Gi.slotFooter,
				children: b
			}),
			p && /* @__PURE__ */ h("div", {
				className: Gi.fade,
				"aria-hidden": !0
			})
		]
	});
});
$i.displayName = "SecondarySidebar";
var ea = {
	header: "_header_x4rlc_4",
	left: "_left_x4rlc_59",
	actions: "_actions_x4rlc_63",
	center: "_center_x4rlc_76",
	backZone: "_backZone_x4rlc_94",
	back: "_back_x4rlc_94",
	logo: "_logo_x4rlc_130",
	search: "_search_x4rlc_137",
	titleBlock: "_titleBlock_x4rlc_150",
	title: "_title_x4rlc_150",
	subtitle: "_subtitle_x4rlc_160",
	user: "_user_x4rlc_185",
	userText: "_userText_x4rlc_208",
	userName: "_userName_x4rlc_214",
	userMeta: "_userMeta_x4rlc_229",
	iconWrap: "_iconWrap_x4rlc_238",
	dot: "_dot_x4rlc_245",
	ctaLabel: "_ctaLabel_x4rlc_261",
	infoTag: "_infoTag_x4rlc_271",
	infoTagIcon: "_infoTagIcon_x4rlc_284",
	infoTagBody: "_infoTagBody_x4rlc_291",
	infoTagLabel: "_infoTagLabel_x4rlc_298",
	infoTagValue: "_infoTagValue_x4rlc_306",
	tutorial: "_tutorial_x4rlc_317"
}, ta = (e, t = 20) => typeof e == "string" ? /* @__PURE__ */ h(z, {
	name: e,
	size: t
}) : e;
function na({ dir: e = "down", size: t = 18, name: n, variant: r = "linear", corner: i = "rounded" }) {
	return /* @__PURE__ */ h(z, {
		name: n ?? (e === "left" ? "arrow-left3" : "arrow-down-02"),
		variant: r,
		corner: i,
		size: t
	});
}
function ra({ title: e, subtitle: t }) {
	return /* @__PURE__ */ g("div", {
		className: ea.titleBlock,
		children: [/* @__PURE__ */ h("div", {
			className: ea.title,
			children: e
		}), t != null && /* @__PURE__ */ h("div", {
			className: ea.subtitle,
			children: t
		})]
	});
}
function ia({ items: e }) {
	return /* @__PURE__ */ g(Dr, { children: [/* @__PURE__ */ h(Or, {
		asChild: !0,
		children: /* @__PURE__ */ h(G, {
			variant: "tonal",
			theme: "neutral",
			leftIcon: /* @__PURE__ */ h(z, {
				name: "more",
				size: 18
			}),
			style: { height: "var(--tesseract-header-control)" },
			children: "More"
		})
	}), /* @__PURE__ */ h(kr, {
		align: "end",
		children: e.map((e, t) => /* @__PURE__ */ h(Ar, {
			icon: e.icon,
			onSelect: () => e.onClick?.(),
			children: e.label ?? e.value ?? "Action"
		}, e.key ?? t))
	})] });
}
var aa = /* @__PURE__ */ g("svg", {
	width: "42",
	height: "42",
	viewBox: "0 0 48 48",
	fill: "none",
	"aria-hidden": !0,
	style: { color: "var(--tesseract-violet-600)" },
	children: [
		/* @__PURE__ */ h("circle", {
			cx: "24",
			cy: "24",
			r: "21",
			stroke: "currentColor",
			strokeWidth: "3.5",
			fill: "none"
		}),
		/* @__PURE__ */ h("circle", {
			cx: "24",
			cy: "24",
			r: "15",
			fill: "currentColor"
		}),
		/* @__PURE__ */ h("path", {
			d: "M20.5 15L33 24L20.5 33V15Z",
			style: { fill: "var(--tesseract-slate-0)" }
		})
	]
});
function oa({ onClick: e, glyph: t }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		className: ea.tutorial,
		"aria-label": "Play tutorial",
		onClick: e,
		children: t == null ? aa : typeof t == "string" ? ta(t, 42) : t
	});
}
function sa({ name: e, meta: t, avatar: n, dropdown: r, onClick: i }) {
	return /* @__PURE__ */ g("button", {
		type: "button",
		className: ea.user,
		"aria-haspopup": r ? "menu" : void 0,
		onClick: i,
		children: [n !== !1 && (typeof n == "string" ? /* @__PURE__ */ h(ke, {
			src: n,
			name: e,
			size: 40
		}) : n || /* @__PURE__ */ h(ke, {
			name: e,
			size: 40
		})), /* @__PURE__ */ g("span", {
			className: ea.userText,
			children: [/* @__PURE__ */ g("span", {
				className: ea.userName,
				children: [e, r && /* @__PURE__ */ h(na, { size: 16 })]
			}), t && /* @__PURE__ */ h("span", {
				className: ea.userMeta,
				children: t
			})]
		})]
	});
}
function ca({ item: e }) {
	let t = e.icon ? ta(e.icon) : void 0, n = !!t && e.label == null, r = /* @__PURE__ */ h(G, {
		variant: e.variant || "solid",
		theme: e.theme || "primary",
		size: "md",
		onClick: e.onClick,
		menu: e.menu,
		"aria-label": n ? e.ariaLabel || e.label : void 0,
		icon: n || e.menu ? t : void 0,
		leftIcon: !n && !e.menu ? t : void 0,
		style: n ? {
			width: "var(--tesseract-header-control)",
			height: "var(--tesseract-header-control)"
		} : { height: "var(--tesseract-header-control)" },
		children: n ? void 0 : /* @__PURE__ */ h("span", {
			className: ea.ctaLabel,
			children: e.label
		})
	});
	return e.badge ? /* @__PURE__ */ g("span", {
		className: ea.iconWrap,
		children: [r, /* @__PURE__ */ h("span", {
			className: ea.dot,
			children: /* @__PURE__ */ h(je, {
				variant: "dot",
				color: e.badge.color || "error",
				size: "md"
			})
		})]
	}) : r;
}
function la({ item: e }) {
	let t = e.icon ? ta(e.icon, 18) : null, n = e.radius ? { borderRadius: e.radius } : void 0;
	return /* @__PURE__ */ g("div", {
		className: ea.infoTag,
		style: n,
		role: "status",
		children: [
			t && e.iconPosition !== "right" && /* @__PURE__ */ h("span", {
				className: ea.infoTagIcon,
				children: t
			}),
			/* @__PURE__ */ g("span", {
				className: ea.infoTagBody,
				children: [e.label && /* @__PURE__ */ h("span", {
					className: ea.infoTagLabel,
					children: e.label
				}), /* @__PURE__ */ h("span", {
					className: ea.infoTagValue,
					children: e.value
				})]
			}),
			t && e.iconPosition === "right" && /* @__PURE__ */ h("span", {
				className: ea.infoTagIcon,
				children: t
			})
		]
	});
}
function ua({ item: e, controlPx: t = 42 }) {
	switch (e.type) {
		case "divider": return /* @__PURE__ */ h(Me, {
			orientation: "vertical",
			variant: "gradient",
			color: "var(--tesseract-slate-300)",
			style: {
				height: "var(--tesseract-header-control)",
				opacity: .8
			}
		});
		case "tutorial": return /* @__PURE__ */ h(oa, {
			onClick: e.onClick,
			glyph: e.icon
		});
		case "avatar": return /* @__PURE__ */ h(ke, {
			src: e.src,
			name: e.name,
			ring: e.ring,
			size: t,
			onClick: e.onClick || (() => {})
		});
		case "select": return /* @__PURE__ */ h(Sr, {
			mode: "single",
			options: e.options || [],
			value: e.value,
			onChange: e.onChange,
			searchable: e.searchable ?? (e.options || []).length > 5,
			leadingIcon: e.icon ? ta(e.icon, 18) : void 0,
			width: e.width || "auto",
			placeholder: e.placeholder || "Select"
		});
		case "info": return /* @__PURE__ */ h(la, { item: e });
		case "node": return e.node ?? null;
		default: return /* @__PURE__ */ h(ca, { item: e });
	}
}
var da = e.forwardRef(function({ back: t, onBack: n, backIcon: r = "arrow-left3", backIconVariant: i = "outline", backIconCorner: a = "straight", backDivider: o = !0, logo: s, user: c, title: l, subtitle: u, leading: d, actions: f = [], align: p = "left", search: m, maxVisibleActions: _, height: v = 62, bordered: y = !0, density: b = "comfortable", sticky: x = !1, elevation: S = !1, trailing: C, background: w, borderColor: T, onUserClick: E, tutorialIcon: D, className: O, style: k, ...A }, j) {
	let M = D == null ? f : f.map((e) => e && e.type === "tutorial" && e.icon == null ? {
		...e,
		icon: D
	} : e), N = b === "compact" ? 36 : 42, P = p === "center", F = S === !0 || S === "always" ? "always" : S === "onScroll" || S === "scroll" ? "scroll" : "none", [I, L] = e.useState(!1);
	e.useEffect(() => {
		if (F !== "scroll" || typeof window > "u") return;
		let e = () => L(window.scrollY > 2);
		return e(), window.addEventListener("scroll", e, { passive: !0 }), () => window.removeEventListener("scroll", e);
	}, [F]);
	let ee = F === "always" || F === "scroll" && I, te = typeof _ == "number" && M.length > _, ne = te ? M.slice(0, _) : M, R = te ? M.slice(_) : [], B = {
		height: v,
		...k
	};
	w && (B["--tesseract-header-bg"] = w), T && (B["--tesseract-header-border"] = T);
	let re = m ? /* @__PURE__ */ h("div", {
		className: ea.search,
		style: m.width ? { width: m.width } : void 0,
		children: /* @__PURE__ */ h(Qe, {
			size: b === "compact" ? "sm" : "md",
			placeholder: m.placeholder || "Search…",
			value: m.value,
			onChange: m.onChange,
			leftIcon: /* @__PURE__ */ h(z, {
				name: "search:search-2",
				size: 18
			}),
			radius: "pill",
			fullWidth: !0
		})
	}) : null;
	return /* @__PURE__ */ g("header", {
		ref: j,
		className: U(ea.header, O),
		"data-bordered": y || void 0,
		"data-density": b === "compact" ? "compact" : void 0,
		"data-align": P ? "center" : void 0,
		"data-sticky": x || void 0,
		"data-elevation": F === "none" ? void 0 : F,
		"data-elevated": ee || void 0,
		style: B,
		...A,
		children: [
			/* @__PURE__ */ g("div", {
				className: ea.left,
				children: [
					t && (o && (s != null || c || !P && l != null || d != null) ? /* @__PURE__ */ h("div", {
						className: ea.backZone,
						children: /* @__PURE__ */ h("button", {
							type: "button",
							className: ea.back,
							"aria-label": "Go back",
							onClick: n,
							children: /* @__PURE__ */ h(na, {
								dir: "left",
								size: 20,
								name: r,
								variant: i,
								corner: a
							})
						})
					}) : /* @__PURE__ */ h("button", {
						type: "button",
						className: ea.back,
						"aria-label": "Go back",
						onClick: n,
						children: /* @__PURE__ */ h(na, {
							dir: "left",
							size: 20,
							name: r,
							variant: i,
							corner: a
						})
					})),
					s != null && /* @__PURE__ */ h("div", {
						className: ea.logo,
						children: s
					}),
					c && /* @__PURE__ */ h(sa, {
						...c,
						onClick: c.onClick || E
					}),
					!P && l != null && /* @__PURE__ */ h(ra, {
						title: l,
						subtitle: u
					}),
					d,
					!P && re
				]
			}),
			P && (l != null || re) && /* @__PURE__ */ h("div", {
				className: ea.center,
				children: l == null ? re : /* @__PURE__ */ h(ra, {
					title: l,
					subtitle: u
				})
			}),
			/* @__PURE__ */ g("div", {
				className: ea.actions,
				children: [
					ne.map((e, t) => /* @__PURE__ */ h(ua, {
						item: e,
						controlPx: N
					}, e.key ?? t)),
					R.length > 0 && /* @__PURE__ */ h(ia, { items: R }),
					C
				]
			})
		]
	});
});
da.displayName = "Header";
var $ = {
	root: "_root_1vh3p_1",
	fullWidth: "_fullWidth_1vh3p_12",
	fieldLabel: "_fieldLabel_1vh3p_17",
	req: "_req_1vh3p_23",
	helper: "_helper_1vh3p_28",
	trigger: "_trigger_1vh3p_43",
	triggerText: "_triggerText_1vh3p_71",
	triggerLabel: "_triggerLabel_1vh3p_102",
	triggerIcon: "_triggerIcon_1vh3p_109",
	chevron: "_chevron_1vh3p_121",
	popover: "_popover_1vh3p_130",
	body: "_body_1vh3p_149",
	presets: "_presets_1vh3p_153",
	groupLabel: "_groupLabel_1vh3p_163",
	preset: "_preset_1vh3p_153",
	presetDivider: "_presetDivider_1vh3p_197",
	pendingHint: "_pendingHint_1vh3p_203",
	main: "_main_1vh3p_214",
	timeWrap: "_timeWrap_1vh3p_222",
	timePanel: "_timePanel_1vh3p_227",
	dtRow: "_dtRow_1vh3p_234",
	dtCal: "_dtCal_1vh3p_240",
	timeSide: "_timeSide_1vh3p_245",
	timeCol: "_timeCol_1vh3p_256",
	timeItem: "_timeItem_1vh3p_279",
	timeSep: "_timeSep_1vh3p_302",
	navRow: "_navRow_1vh3p_309",
	headLabels: "_headLabels_1vh3p_316",
	monthBtn: "_monthBtn_1vh3p_324",
	navBtn: "_navBtn_1vh3p_347",
	calendars: "_calendars_1vh3p_372",
	calCol: "_calCol_1vh3p_376",
	calDivider: "_calDivider_1vh3p_380",
	mypanel: "_mypanel_1vh3p_387",
	mygrid: "_mygrid_1vh3p_394",
	mycell: "_mycell_1vh3p_401",
	month: "_month_1vh3p_324",
	weekdays: "_weekdays_1vh3p_432",
	weekday: "_weekday_1vh3p_432",
	grid: "_grid_1vh3p_446",
	cell: "_cell_1vh3p_451",
	day: "_day_1vh3p_470",
	todayDot: "_todayDot_1vh3p_519",
	actions: "_actions_1vh3p_531",
	actionsRight: "_actionsRight_1vh3p_540"
};
//#endregion
//#region src/components/molecules/DateRangePicker/DateRangePicker.jsx
function fa({ dir: e = "down", size: t = 14, className: n, ...r }) {
	return /* @__PURE__ */ h(z, {
		name: `chevron-${e}`,
		size: t,
		className: n,
		...r
	});
}
function pa(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate());
}
function ma(e, t) {
	let n = new Date(e);
	return n.setDate(n.getDate() + t), n;
}
function ha(e, t) {
	let n = new Date(e);
	return n.setMonth(n.getMonth() + t), n;
}
function ga(e, t) {
	return e && t && e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function _a(e, t, n) {
	return t && e < t ? pa(t) : n && e > n ? pa(n) : e;
}
function va(e, t = 1) {
	let n = pa(e);
	return ma(n, -((n.getDay() - t + 7) % 7));
}
function ya(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function ba(e) {
	return new Date(e.getFullYear(), e.getMonth() + 1, 0);
}
function xa(e) {
	return new Date(e.getFullYear(), 0, 1);
}
function Sa(e) {
	return new Date(e.getFullYear(), 11, 31);
}
var Ca = (e) => String(e).padStart(2, "0");
function wa(e, t = "en-IN", n) {
	return n ? n(e) : e.toLocaleDateString(t, {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function Ta(e, t = "en-IN") {
	return e.toLocaleDateString(t, {
		month: "long",
		year: "numeric"
	});
}
function Ea(e, t = "en-IN") {
	return e ? e.toLocaleDateString(t, {
		day: "2-digit",
		month: "short",
		year: "numeric"
	}) : "";
}
function Da(e, t, n) {
	if (n) {
		let n = e < 12 ? "AM" : "PM";
		return `${Ca(e % 12 || 12)}:${Ca(t)} ${n}`;
	}
	return `${Ca(e)}:${Ca(t)}`;
}
var Oa = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
], ka = [
	"Su",
	"Mo",
	"Tu",
	"We",
	"Th",
	"Fr",
	"Sa"
];
function Aa(e = 1) {
	return Array.from({ length: 7 }, (t, n) => ka[(n + e) % 7]);
}
var ja = [
	{
		id: "today",
		label: "Today",
		getRange: () => {
			let e = pa(/* @__PURE__ */ new Date());
			return {
				start: e,
				end: e
			};
		}
	},
	{
		id: "yesterday",
		label: "Yesterday",
		getRange: () => {
			let e = ma(pa(/* @__PURE__ */ new Date()), -1);
			return {
				start: e,
				end: e
			};
		}
	},
	{
		id: "last-7",
		label: "Past 7 days",
		getRange: () => ({
			start: ma(pa(/* @__PURE__ */ new Date()), -6),
			end: pa(/* @__PURE__ */ new Date())
		})
	},
	{
		id: "last-30",
		label: "Past 30 days",
		getRange: () => ({
			start: ma(pa(/* @__PURE__ */ new Date()), -29),
			end: pa(/* @__PURE__ */ new Date())
		})
	},
	{
		id: "this-month",
		label: "This month",
		getRange: () => ({
			start: ya(/* @__PURE__ */ new Date()),
			end: pa(/* @__PURE__ */ new Date())
		})
	},
	{
		id: "last-month",
		label: "Last month",
		getRange: () => {
			let e = ha(/* @__PURE__ */ new Date(), -1);
			return {
				start: ya(e),
				end: ba(e)
			};
		}
	},
	{
		id: "this-year",
		label: "This year",
		getRange: () => ({
			start: xa(/* @__PURE__ */ new Date()),
			end: pa(/* @__PURE__ */ new Date())
		})
	},
	{
		id: "last-year",
		label: "Last year",
		getRange: () => {
			let e = new Date((/* @__PURE__ */ new Date()).getFullYear() - 1, 0, 1);
			return {
				start: xa(e),
				end: Sa(e)
			};
		}
	}
];
function Ma(e, t = 1) {
	let n = e.getFullYear(), r = e.getMonth(), i = (new Date(n, r, 1).getDay() - t + 7) % 7, a = new Date(n, r + 1, 0).getDate(), o = [];
	for (let e = 0; e < i; e++) o.push(null);
	for (let e = 1; e <= a; e++) o.push(new Date(n, r, e));
	for (; o.length % 7 != 0;) o.push(null);
	return o;
}
function Na({ viewDate: e, stagedStart: t, stagedEnd: n, pendingStart: r, hoverDate: i, focusDate: a, isDisabledDay: o, onDayClick: s, onDayHover: c, weekStartsOn: l = 1, locale: u = "en-IN", formatDateFn: d }) {
	let f = (() => {
		if (r && i) {
			let [e, t] = r <= i ? [r, i] : [i, r];
			return {
				start: e,
				end: t
			};
		}
		return t && n ? {
			start: t,
			end: n
		} : null;
	})(), p = f ? ga(f.start, f.end) : !1, m = Ma(e, l), _ = Aa(l), v = (e) => f && f.start && f.end ? e >= f.start && e <= f.end : !1, y = (e) => f ? ga(e, f.start) : !1, b = (e) => f ? ga(e, f.end) : !1;
	return /* @__PURE__ */ g("div", {
		className: $.month,
		children: [/* @__PURE__ */ h("div", {
			className: $.weekdays,
			children: _.map((e) => /* @__PURE__ */ h("div", {
				className: $.weekday,
				children: e
			}, e))
		}), /* @__PURE__ */ h("div", {
			className: $.grid,
			children: m.map((e, t) => {
				if (!e) return /* @__PURE__ */ h("div", {}, t);
				let n = v(e), i = y(e), l = b(e), f = ga(e, /* @__PURE__ */ new Date()), m = i || l, _ = p && i, x = o(e), S = a && ga(e, a);
				return /* @__PURE__ */ h("div", {
					className: $.cell,
					"data-in-range": n && !_ && !x ? "true" : void 0,
					"data-start": i && !_ ? "true" : void 0,
					"data-end": l && !_ ? "true" : void 0,
					onMouseEnter: () => r && !x && c(e),
					onMouseLeave: () => r && c(null),
					children: /* @__PURE__ */ g("button", {
						type: "button",
						disabled: x,
						onClick: () => !x && s(e),
						className: $.day,
						"data-edge": m || _ ? "true" : void 0,
						"data-inrange": n && !m && !_ ? "true" : void 0,
						"data-today": f && !m && !n ? "true" : void 0,
						"data-focused": S && !m ? "true" : void 0,
						"data-disabled": x ? "true" : void 0,
						"aria-label": wa(e, u, d),
						"aria-current": f ? "date" : void 0,
						children: [e.getDate(), f && !m && /* @__PURE__ */ h("span", { className: $.todayDot })]
					})
				}, t);
			})
		})]
	});
}
function Pa({ view: e, viewDate: t, selected: n, minDate: r, maxDate: i, onPickMonth: a, onPickYear: o }) {
	let s = t.getFullYear();
	if (e === "years") {
		let e = Math.floor(s / 12) * 12, t = Array.from({ length: 12 }, (t, n) => e + n), a = r ? r.getFullYear() : -Infinity, c = i ? i.getFullYear() : Infinity;
		return /* @__PURE__ */ h("div", {
			className: $.mypanel,
			children: /* @__PURE__ */ h("div", {
				className: $.mygrid,
				children: t.map((e) => /* @__PURE__ */ h("button", {
					type: "button",
					className: $.mycell,
					disabled: e < a || e > c,
					"data-selected": n?.kind === "year" && n.year === e ? "true" : void 0,
					onClick: () => o(e),
					children: e
				}, e))
			})
		});
	}
	return /* @__PURE__ */ h("div", {
		className: $.mypanel,
		children: /* @__PURE__ */ h("div", {
			className: $.mygrid,
			children: Oa.map((e, t) => {
				let o = ba(new Date(s, t, 1)), c = ya(new Date(s, t, 1)), l = i && c > i || r && o < r, u = n?.kind === "month" && n.year === s && n.month === t;
				return /* @__PURE__ */ h("button", {
					type: "button",
					className: $.mycell,
					disabled: l,
					"data-selected": u ? "true" : void 0,
					onClick: () => a(t),
					children: e
				}, e);
			})
		})
	});
}
function Fa({ items: e, isActive: t, onPick: n, fmt: r }) {
	return /* @__PURE__ */ h("div", {
		className: $.timeCol,
		role: "listbox",
		children: e.map((e) => /* @__PURE__ */ h("button", {
			type: "button",
			role: "option",
			"aria-selected": t(e),
			className: $.timeItem,
			"data-selected": t(e) ? "true" : void 0,
			onClick: () => n(e),
			children: r ? r(e) : Ca(e)
		}, e))
	});
}
function Ia({ value: e, use12: t, step: n, onChange: r }) {
	let { h: i, m: o } = e, s = u(null);
	a(() => {
		let e = requestAnimationFrame(() => {
			s.current?.querySelectorAll("[data-selected=\"true\"]").forEach((e) => {
				let t = e.parentElement;
				t && (t.scrollTop = e.offsetTop - t.clientHeight / 2 + e.offsetHeight / 2);
			});
		});
		return () => cancelAnimationFrame(e);
	}, []);
	let c = t ? Array.from({ length: 12 }, (e, t) => t + 1) : Array.from({ length: 24 }, (e, t) => t), l = Array.from({ length: Math.ceil(60 / n) }, (e, t) => t * n), d = i % 12 || 12, f = i < 12 ? "AM" : "PM";
	return /* @__PURE__ */ g("div", {
		className: $.timePanel,
		ref: s,
		children: [
			/* @__PURE__ */ h(Fa, {
				items: c,
				fmt: (e) => Ca(e),
				isActive: (e) => t ? e === d : e === i,
				onPick: t ? (e) => r({
					h: e % 12 + (f === "PM" ? 12 : 0),
					m: o
				}) : (e) => r({
					h: e,
					m: o
				})
			}),
			/* @__PURE__ */ h("span", {
				className: $.timeSep,
				children: ":"
			}),
			/* @__PURE__ */ h(Fa, {
				items: l,
				isActive: (e) => e === o,
				onPick: (e) => r({
					h: i,
					m: e
				})
			}),
			t && /* @__PURE__ */ h(Fa, {
				items: ["AM", "PM"],
				fmt: (e) => e,
				isActive: (e) => e === f,
				onPick: (e) => r({
					h: i % 12 + (e === "PM" ? 12 : 0),
					m: o
				})
			})
		]
	});
}
var La = n(function({ value: e, onChange: t, className: n, style: r, icon: i, mode: l = "single", months: f, showPresets: _, presets: v = ja, minDate: y, maxDate: b, isDateDisabled: x, use12Hour: S = !0, minuteStep: C = 5, label: w, helperText: T, status: E, required: D = !1, disabled: O = !1, placeholder: k, size: A = "md", fullWidth: j = !0, analyticsId: M, locale: N = "en-IN", formatDate: P, weekStartsOn: F = 1, applyLabel: I = "Apply", cancelLabel: L = "Cancel", clearLabel: ee = "Clear", showFooter: te = !0, commitMode: ne = "outside-click", ...R }, B) {
	let { track: re } = H(), V = o(), ie = `tp-drp-trigger-${V}`, oe = `tp-drp-popover-${V}`, se = `tp-drp-label-${V}`, ce = l === "range", le = l === "single", ue = l === "month", U = l === "year", W = l === "time", de = l === "datetime", fe = le || ce || de, pe = W || de, me = Math.max(1, Math.min(2, f ?? (ce ? 2 : 1))), he = ce ? _ ?? !0 : !1, ge = y ? pa(y) : null, K = b ? pa(b) : null, _e = (e) => ge && e < ge || K && e > K ? !0 : x ? x(e) : !1, ve = (e) => wa(e, N, P), ye = (e) => Ta(e, N), be = (e) => Ea(e, N), xe = (e) => e.toLocaleDateString(N, {
		month: "short",
		year: "numeric"
	}), Se = ue ? "months" : U ? "years" : "days", [q, Ce] = d(!1), [we, Te] = d(() => pa(/* @__PURE__ */ new Date())), [J, Ee] = d(Se), [De, Oe] = d(null), [Y, ke] = d(null), [Ae, je] = d(null), [Me, Ne] = d(null), [Pe, Fe] = d(null), [Ie, Le] = d(null), [Re, ze] = d({
		h: 9,
		m: 0
	}), Be = u(null);
	s(B, () => Be.current, []);
	let Ve = u(null), He = u(null), Ue = u(null), We = u(null), [Ge, Ke] = d({
		position: "fixed",
		top: 0,
		left: 0,
		visibility: "hidden"
	}), qe = ae();
	function Je(e) {
		let t = {
			preset: null,
			start: null,
			end: null,
			time: null
		};
		if (e == null) return t;
		if (ce) {
			if (e instanceof Date) return t.start = pa(e), t.end = pa(e), t;
			if (typeof e == "object" && e.start) return t.start = pa(e.start), t.end = e.end ? pa(e.end) : pa(e.start), t;
			let n = v.find((t) => t.id === e);
			if (n) {
				let r = n.getRange();
				t.preset = e, t.start = r.start, t.end = r.end;
			}
			return t;
		}
		if (W) {
			if (e instanceof Date) t.time = {
				h: e.getHours(),
				m: e.getMinutes()
			};
			else if (typeof e == "string") {
				let [n, r] = e.split(":");
				t.time = {
					h: +n || 0,
					m: +r || 0
				};
			} else typeof e == "object" && (t.time = {
				h: e.hours ?? 0,
				m: e.minutes ?? 0
			});
			return t;
		}
		if (U) {
			let n = e instanceof Date ? e.getFullYear() : Number(e);
			return isNaN(n) || (t.start = new Date(n, 0, 1)), t;
		}
		return ue ? (e instanceof Date ? t.start = ya(e) : typeof e == "object" && (t.start = new Date(e.year, e.month, 1)), t) : (e instanceof Date && (t.start = pa(e), t.end = pa(e), de && (t.time = {
			h: e.getHours(),
			m: e.getMinutes()
		})), t);
	}
	let [Ye, Xe] = d(e);
	if (e !== Ye) {
		Xe(e);
		let t = Je(e);
		Oe(t.preset), ke(t.start), je(t.end), t.time && ze(t.time), Ne(null);
	}
	let Ze = (() => {
		if (ce) {
			if (e && typeof e == "object" && e.start) return `${be(e.start)}${e.end ? ` – ${be(e.end)}` : ""}`;
			let t = v.find((t) => t.id === e);
			if (t) return t.label;
			if (e instanceof Date) return be(e);
		} else if (W) {
			if (e != null) {
				let t = Je(e);
				if (t.time) return Da(t.time.h, t.time.m, S);
			}
		} else if (U) {
			if (e != null) return String(e instanceof Date ? e.getFullYear() : e);
		} else if (ue) {
			if (e != null) {
				let t = Je(e);
				if (t.start) return xe(t.start);
			}
		} else if (e instanceof Date) return de ? `${be(e)}, ${Da(e.getHours(), e.getMinutes(), S)}` : be(e);
		return k || Ra[l] || "Select";
	})(), Qe = (() => {
		if (W) return Da(Re.h, Re.m, S);
		if (U) return Y ? String(Y.getFullYear()) : null;
		if (ue) return Y ? xe(Y) : null;
		if (ce) {
			if (Y && Ae) {
				let e = v.find((e) => e.id === De);
				return e ? e.label : `${be(Y)} – ${be(Ae)}`;
			}
			return Y ? be(Y) : null;
		}
		return Y ? de ? `${be(Y)}, ${Da(Re.h, Re.m, S)}` : be(Y) : null;
	})(), $e = q && Qe ? Qe : Ze, et = e != null && !(typeof e == "object" && !(e instanceof Date) && !e.start) || q && !!Qe;
	c(() => {
		if (!q) return;
		let e = () => {
			let e = Ve.current, t = He.current;
			if (!e || !t) return;
			let n = e.getBoundingClientRect(), r = t.offsetWidth, i = t.offsetHeight, a = window.innerWidth, o = window.innerHeight, s = n.left;
			s + r > a - 8 && (s = a - 8 - r), s < 8 && (s = 8);
			let c = n.bottom + 6;
			c + i > o - 8 && n.top - 6 - i >= 8 && (c = n.top - 6 - i), c < 8 && (c = 8), Ke({
				position: "fixed",
				top: c,
				left: s,
				zIndex: 9999
			});
		};
		return e(), window.addEventListener("resize", e), window.addEventListener("scroll", e, !0), () => {
			window.removeEventListener("resize", e), window.removeEventListener("scroll", e, !0);
		};
	}, [
		q,
		l,
		me,
		he,
		J
	]), a(() => {
		function e(e) {
			!Be.current?.contains(e.target) && !He.current?.contains(e.target) && We.current?.();
		}
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, []), a(() => {
		if (q) {
			let e = requestAnimationFrame(() => He.current?.focus());
			return () => cancelAnimationFrame(e);
		}
		Ve.current?.focus();
	}, [q]), a(() => {
		if (!q) return;
		let e = He.current;
		if (!e) return;
		let t = (e) => Ue.current?.(e);
		return e.addEventListener("keydown", t), () => e.removeEventListener("keydown", t);
	}, [q]);
	function tt(e) {
		Te(ya(e?.start ?? e?.end ?? /* @__PURE__ */ new Date()));
	}
	function nt() {
		if (O) return;
		let t = Je(e);
		Oe(t.preset), ke(t.start), je(t.end), t.time && ze(t.time), Ne(null), Fe(null), Ee(Se), Le(null), Te(ya(_a(t.start || /* @__PURE__ */ new Date(), ge, K))), Ke({
			position: "fixed",
			top: 0,
			left: 0,
			visibility: "hidden"
		}), Ce(!0);
	}
	function rt(e) {
		Oe(e.id);
		let t = e.getRange(), n = t.start ? _a(t.start, ge, K) : t.start, r = t.end ? _a(t.end, ge, K) : t.end;
		ke(n), je(r), Ne(null), tt({
			start: n,
			end: r
		});
	}
	function it(e) {
		if (!_e(e)) if (Le(e), ce) if (!Me) Ne(e), ke(e), je(e), Oe(null);
		else {
			let [t, n] = Me <= e ? [Me, e] : [e, Me];
			ke(t), je(n), Ne(null);
		}
		else ke(e), je(e);
	}
	function at() {
		Ce(!1);
	}
	function ot(e) {
		if (e.key === "Escape") {
			e.preventDefault(), at();
			return;
		}
		if (J !== "days" || !fe || e.target.tagName === "INPUT") return;
		let t = Ie || _a(Y || /* @__PURE__ */ new Date(), ge, K), n;
		switch (e.key) {
			case "ArrowLeft":
				n = ma(t, -1);
				break;
			case "ArrowRight":
				n = ma(t, 1);
				break;
			case "ArrowUp":
				n = ma(t, -7);
				break;
			case "ArrowDown":
				n = ma(t, 7);
				break;
			case "Home":
				n = va(t, F);
				break;
			case "End":
				n = ma(va(t, F), 6);
				break;
			case "PageUp":
				n = ha(t, -1);
				break;
			case "PageDown":
				n = ha(t, 1);
				break;
			case "Enter":
				e.preventDefault(), it(t);
				return;
			default: return;
		}
		e.preventDefault(), n = _a(n, ge, K), Le(n);
		let r = ba(ha(we, me - 1));
		n < ya(we) ? Te(ya(n)) : n > r && Te(ya(ha(n, -(me - 1))));
	}
	a(() => {
		Ue.current = ot;
	});
	function st(e, t) {
		M && re({
			component: "DatePicker",
			id: M,
			action: e,
			...t
		});
	}
	function ct() {
		if (W) {
			let e = Da(Re.h, Re.m, S);
			t?.({
				mode: "time",
				hours: Re.h,
				minutes: Re.m,
				time: `${Ca(Re.h)}:${Ca(Re.m)}`,
				label: e
			}), st("apply", { value: e });
		} else if (U && Y) {
			let e = Y.getFullYear();
			t?.({
				mode: "year",
				year: e,
				date: new Date(e, 0, 1),
				label: String(e)
			}), st("apply", { value: e });
		} else if (ue && Y) {
			let e = xe(Y);
			t?.({
				mode: "month",
				year: Y.getFullYear(),
				month: Y.getMonth(),
				date: Y,
				label: e
			}), st("apply", { value: e });
		} else if (ce) {
			if (Y && Ae) {
				let e = v.find((e) => e.id === De), n = e ? e.label : `${ve(Y)} – ${ve(Ae)}`;
				t?.({
					mode: "range",
					type: De ? "preset" : "custom",
					presetId: De,
					range: {
						start: Y,
						end: Ae
					},
					start: Y,
					end: Ae,
					label: n
				}), st("apply", {
					value: n,
					presetId: De || void 0
				});
			}
		} else if (Y) {
			let e = Y;
			de && (e = new Date(Y), e.setHours(Re.h, Re.m, 0, 0));
			let n = de ? `${be(e)}, ${Da(Re.h, Re.m, S)}` : ve(e);
			t?.({
				mode: l,
				date: e,
				label: n
			}), st("apply", { value: n });
		}
		Ce(!1);
	}
	a(() => {
		We.current = () => {
			if (ne === "apply") {
				Ce(!1);
				return;
			}
			if (ce && Me) {
				Ce(!1);
				return;
			}
			ct();
		};
	});
	function lt() {
		Oe(null), ke(null), je(null), Ne(null), ze({
			h: 9,
			m: 0
		}), Le(null), t?.(ce ? {
			mode: "range",
			range: null,
			start: null,
			end: null,
			presetId: null,
			label: ""
		} : W ? {
			mode: "time",
			time: null,
			hours: null,
			minutes: null,
			label: ""
		} : U ? {
			mode: "year",
			year: null,
			date: null,
			label: ""
		} : {
			mode: l,
			date: null,
			label: ""
		}), st("clear", {});
	}
	let ut = W ? !1 : ce ? !Y || !Ae : !Y, dt = ge && fe && J === "days" ? ba(ha(we, -1)) < ge : !1, ft = K && fe && J === "days" ? ya(ha(we, me)) > K : !1, pt = ue && Y ? {
		kind: "month",
		year: Y.getFullYear(),
		month: Y.getMonth()
	} : U && Y ? {
		kind: "year",
		year: Y.getFullYear()
	} : null, mt = fe || ue || U, ht = /* @__PURE__ */ h("div", {
		ref: He,
		id: oe,
		tabIndex: -1,
		className: $.popover,
		style: Ge,
		"data-mode": l,
		role: "dialog",
		"aria-label": `Choose ${l}`,
		children: /* @__PURE__ */ g("div", {
			className: $.body,
			children: [he && /* @__PURE__ */ g("div", {
				className: $.presets,
				children: [v.map((e) => /* @__PURE__ */ h("button", {
					type: "button",
					onClick: () => rt(e),
					className: $.preset,
					"data-selected": e.id === De ? "true" : void 0,
					children: e.label
				}, e.id)), Me && /* @__PURE__ */ h("p", {
					className: $.pendingHint,
					children: "Tip: click another day to make a range"
				})]
			}), /* @__PURE__ */ g("div", {
				className: $.main,
				children: [(() => {
					let e = mt && /* @__PURE__ */ g("div", {
						className: $.navRow,
						children: [
							/* @__PURE__ */ h("button", {
								type: "button",
								className: $.navBtn,
								disabled: dt,
								onClick: () => Te((e) => ha(e, J === "days" ? -1 : J === "months" ? -12 : -144)),
								"aria-label": "Previous",
								children: /* @__PURE__ */ h(fa, {
									dir: "left",
									size: 16
								})
							}),
							/* @__PURE__ */ h("div", {
								className: $.headLabels,
								children: J === "days" ? Array.from({ length: me }).map((e, t) => /* @__PURE__ */ g("button", {
									type: "button",
									className: $.monthBtn,
									onClick: () => Ee("months"),
									children: [ye(ha(we, t)), /* @__PURE__ */ h(fa, {
										dir: "down",
										size: 13
									})]
								}, t)) : /* @__PURE__ */ h("button", {
									type: "button",
									className: $.monthBtn,
									onClick: () => Ee(J === "months" ? "years" : "days"),
									children: J === "months" ? we.getFullYear() : `${Math.floor(we.getFullYear() / 12) * 12} – ${Math.floor(we.getFullYear() / 12) * 12 + 11}`
								})
							}),
							/* @__PURE__ */ h("button", {
								type: "button",
								className: $.navBtn,
								disabled: ft,
								onClick: () => Te((e) => ha(e, J === "days" ? 1 : J === "months" ? 12 : 144)),
								"aria-label": "Next",
								children: /* @__PURE__ */ h(fa, {
									dir: "right",
									size: 16
								})
							})
						]
					}), t = J === "days" && fe ? /* @__PURE__ */ h("div", {
						className: $.calendars,
						children: Array.from({ length: me }).map((e, t) => /* @__PURE__ */ g("div", {
							className: $.calCol,
							children: [t > 0 && /* @__PURE__ */ h("div", { className: $.calDivider }), /* @__PURE__ */ h(Na, {
								viewDate: ha(we, t),
								stagedStart: Y,
								stagedEnd: Ae,
								pendingStart: Me,
								hoverDate: Pe,
								focusDate: Ie,
								isDisabledDay: _e,
								onDayClick: it,
								onDayHover: Fe,
								weekStartsOn: F,
								locale: N,
								formatDateFn: P
							})]
						}, t))
					}) : J === "days" ? null : /* @__PURE__ */ h(Pa, {
						view: J,
						viewDate: we,
						selected: pt,
						minDate: ge,
						maxDate: K,
						onPickMonth: (e) => {
							ue ? ke(new Date(we.getFullYear(), e, 1)) : (Te((t) => new Date(t.getFullYear(), e, 1)), Ee("days"));
						},
						onPickYear: (e) => {
							U ? ke(new Date(e, 0, 1)) : (Te((t) => new Date(e, t.getMonth(), 1)), Ee("months"));
						}
					}), n = /* @__PURE__ */ h(Ia, {
						value: Re,
						use12: S,
						step: C,
						onChange: ze
					});
					return de ? /* @__PURE__ */ g("div", {
						className: $.dtRow,
						children: [/* @__PURE__ */ g("div", {
							className: $.dtCal,
							children: [e, t]
						}), /* @__PURE__ */ h("div", {
							className: $.timeSide,
							children: n
						})]
					}) : /* @__PURE__ */ g(m, { children: [
						e,
						t,
						W && /* @__PURE__ */ h("div", {
							className: $.timeWrap,
							children: n
						})
					] });
				})(), te && /* @__PURE__ */ g("div", {
					className: $.actions,
					children: [/* @__PURE__ */ h(G, {
						variant: "link",
						theme: "warning",
						size: "sm",
						onClick: lt,
						children: ee
					}), /* @__PURE__ */ g("div", {
						className: $.actionsRight,
						children: [/* @__PURE__ */ h(G, {
							variant: "outline",
							theme: "neutral",
							size: "sm",
							onClick: at,
							children: L
						}), /* @__PURE__ */ h(G, {
							variant: "solid",
							theme: "primary",
							size: "sm",
							disabled: ut,
							onClick: ct,
							children: I
						})]
					})]
				})]
			})]
		})
	});
	return /* @__PURE__ */ g("div", {
		ref: Be,
		className: [
			$.root,
			j && $.fullWidth,
			n
		].filter(Boolean).join(" "),
		style: r,
		...R,
		children: [
			w && /* @__PURE__ */ g("label", {
				id: se,
				htmlFor: ie,
				className: $.fieldLabel,
				children: [w, D && /* @__PURE__ */ h("span", {
					className: $.req,
					children: "*"
				})]
			}),
			/* @__PURE__ */ g("button", {
				ref: Ve,
				type: "button",
				id: ie,
				disabled: O,
				onClick: () => q ? Ce(!1) : nt(),
				className: $.trigger,
				"data-size": A,
				"data-status": E || void 0,
				"data-open": q ? "true" : void 0,
				"data-placeholder": et ? void 0 : "true",
				"aria-haspopup": "dialog",
				"aria-expanded": q,
				"aria-controls": q ? oe : void 0,
				"aria-labelledby": w ? se : void 0,
				"aria-required": D || void 0,
				children: [/* @__PURE__ */ g("span", {
					className: $.triggerLabel,
					children: [/* @__PURE__ */ h("span", {
						className: $.triggerIcon,
						children: i ?? /* @__PURE__ */ h(z, {
							name: pe && !fe ? "clock" : "calendar-1",
							size: 16
						})
					}), /* @__PURE__ */ h("span", {
						className: $.triggerText,
						children: $e
					})]
				}), /* @__PURE__ */ h(fa, {
					dir: "down",
					size: 14,
					className: $.chevron,
					"data-open": q ? "true" : void 0
				})]
			}),
			T && /* @__PURE__ */ h("p", {
				className: $.helper,
				"data-status": E || void 0,
				children: T
			}),
			q && qe && p(ht, document.body)
		]
	});
}), Ra = {
	single: "Select date",
	range: "Select range",
	month: "Select month",
	year: "Select year",
	time: "Select time",
	datetime: "Select date & time"
};
La.displayName = "DatePicker";
var za = La, Ba = {
	violet: "\n    linear-gradient(118deg, transparent 0%,\n      color-mix(in srgb, var(--tesseract-violet-600) 18%, transparent) 34%,\n      color-mix(in srgb, var(--tesseract-violet-400) 12%, transparent) 47%,\n      color-mix(in srgb, var(--tesseract-violet-700) 14%, transparent) 60%,\n      transparent 84%),\n    radial-gradient(52% 125% at 60% -18%,\n      color-mix(in srgb, var(--tesseract-violet-600) 30%, transparent) 0%,\n      color-mix(in srgb, var(--tesseract-violet-800) 13%, transparent) 34%,\n      transparent 60%),\n    radial-gradient(24% 78% at 34% -8%,\n      color-mix(in srgb, var(--tesseract-violet-500) 14%, transparent) 0%,\n      transparent 54%),\n    radial-gradient(125% 150% at 50% 42%,\n      color-mix(in srgb, var(--tesseract-violet-900) 82%, var(--tesseract-slate-900)) 0%,\n      color-mix(in srgb, var(--tesseract-violet-900) 40%, var(--tesseract-slate-900)) 52%,\n      color-mix(in srgb, var(--tesseract-violet-900) 8%, var(--tesseract-slate-900)) 100%)",
	blue: "\n    linear-gradient(118deg, transparent 0%,\n      color-mix(in srgb, var(--tesseract-blue-600) 18%, transparent) 34%,\n      color-mix(in srgb, var(--tesseract-blue-400) 12%, transparent) 47%,\n      color-mix(in srgb, var(--tesseract-blue-700) 14%, transparent) 60%,\n      transparent 84%),\n    radial-gradient(52% 125% at 60% -18%,\n      color-mix(in srgb, var(--tesseract-blue-500) 38%, transparent) 0%,\n      color-mix(in srgb, var(--tesseract-blue-700) 17%, transparent) 34%,\n      transparent 60%),\n    radial-gradient(24% 78% at 34% -8%,\n      color-mix(in srgb, var(--tesseract-blue-400) 20%, transparent) 0%,\n      transparent 54%),\n    radial-gradient(125% 150% at 50% 42%,\n      color-mix(in srgb, var(--tesseract-blue-700) 62%, var(--tesseract-blue-900)) 0%,\n      color-mix(in srgb, var(--tesseract-blue-900) 74%, var(--tesseract-slate-900)) 55%,\n      color-mix(in srgb, var(--tesseract-blue-900) 16%, var(--tesseract-slate-900)) 100%)"
}, Va = {
	violet: ["var(--tesseract-violet-300)", "var(--tesseract-blue-300)"],
	blue: ["var(--tesseract-blue-300)", "var(--tesseract-violet-300)"]
}, Ha = "violet", Ua = {
	position: "absolute",
	inset: 0,
	zIndex: 0,
	pointerEvents: "none",
	opacity: .09,
	mixBlendMode: "screen",
	backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
	backgroundSize: "120px 120px"
}, Wa = {
	rays: "_rays_zoljx_5",
	back: "_back_zoljx_13"
}, Ga = Ba, Ka = Va, qa = Ha, Ja = {
	sm: 80,
	md: 120,
	lg: 160
}, Ya = {
	sm: 20,
	md: 24,
	lg: 32
}, Xa = 42, Za = {
	sm: 18,
	md: 24
}, Qa = {
	sm: 13,
	md: 16
}, $a = {
	sm: 14,
	md: 18
}, eo = {
	sm: 20,
	md: 28
}, to = e.forwardRef(function({ size: e = "md", height: t, bottomRadius: n, tone: r = qa, background: i, eyebrow: a, align: o = "center", title: s, subtitle: c, titleSize: l = "md", subtitleSize: u = "sm", showBackButton: d = !1, backIcon: f = "arrow-left3", backIconVariant: p = "outline", backIconCorner: m = "straight", onBack: _, actions: v, rays: y = !0, pattern: b = !0, className: x = "", style: S, ...C }, w) {
	let T = t ?? Ja[e] ?? Ja.md, E = Za[l] ? l : "md", D = Math.min(Xa, n ?? Ya[e] ?? Ya.md), O = i ?? Ga[r] ?? Ga[qa], [k, A] = Ka[r] ?? Ka[qa];
	return /* @__PURE__ */ g("div", {
		ref: w,
		className: U(x) || void 0,
		style: {
			boxSizing: "border-box",
			fontFamily: "var(--tesseract-font-body)",
			position: "relative",
			width: "100%",
			overflow: "hidden",
			height: T,
			background: O,
			borderBottomLeftRadius: D,
			borderBottomRightRadius: D,
			...S
		},
		...C,
		children: [
			y && /* @__PURE__ */ h(Wt, {
				color1: k,
				color2: A,
				origin: [.6, -.12],
				direction: [-.2, 1],
				className: Wa.rays
			}),
			b && /* @__PURE__ */ h(Bt, {
				lineColor: "color-mix(in srgb, var(--tesseract-slate-0) 20%, transparent)",
				style: {
					position: "absolute",
					top: "50%",
					transform: "translateY(-50%)",
					width: "30%",
					right: "-8%",
					height: "250%",
					pointerEvents: "none",
					mixBlendMode: "screen",
					opacity: 1,
					WebkitMaskImage: "linear-gradient(to left, black 0%, black 26%, transparent 92%)",
					maskImage: "linear-gradient(to left, black 0%, black 26%, transparent 92%)"
				}
			}),
			/* @__PURE__ */ h("div", {
				style: Ua,
				"aria-hidden": !0
			}),
			/* @__PURE__ */ g("div", {
				style: {
					position: "relative",
					zIndex: 1,
					display: "flex",
					alignItems: o === "top" ? "flex-start" : "center",
					justifyContent: "space-between",
					gap: "var(--tesseract-space-3)",
					padding: "var(--tesseract-space-3-5) var(--tesseract-space-4-5)"
				},
				children: [/* @__PURE__ */ g("div", {
					style: {
						display: "flex",
						alignItems: "flex-start",
						gap: "var(--tesseract-space-2)",
						minWidth: 0,
						flex: 1
					},
					children: [d && /* @__PURE__ */ h("button", {
						type: "button",
						className: Wa.back,
						"aria-label": "Go back",
						onClick: _,
						style: { height: eo[E] },
						children: /* @__PURE__ */ h(z, {
							name: f,
							variant: p,
							corner: m,
							size: $a[E],
							color: "currentColor"
						})
					}), /* @__PURE__ */ g("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "var(--tesseract-space-1-5)",
							minWidth: 0,
							flex: 1
						},
						children: [
							a && /* @__PURE__ */ h("span", {
								style: {
									color: "color-mix(in srgb, var(--tesseract-slate-0) 70%, transparent)",
									fontSize: "var(--tesseract-text-body-xs, 12px)",
									fontWeight: "var(--tesseract-weight-semibold)",
									letterSpacing: "0.06em",
									textTransform: "uppercase",
									lineHeight: 1.2,
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis"
								},
								children: a
							}),
							/* @__PURE__ */ h(wn, {
								content: s,
								whenTruncated: !0,
								side: "bottom",
								sideOffset: 10,
								children: /* @__PURE__ */ h("h1", {
									style: {
										margin: 0,
										color: "var(--tesseract-fg-inverse)",
										fontSize: Za[E],
										fontWeight: "var(--tesseract-weight-bold)",
										lineHeight: 1.15,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										minWidth: 0
									},
									children: s
								})
							}),
							c && /* @__PURE__ */ h(wn, {
								content: c,
								whenTruncated: !0,
								side: "bottom",
								sideOffset: 8,
								children: /* @__PURE__ */ h("p", {
									style: {
										margin: 0,
										color: "color-mix(in srgb, var(--tesseract-slate-0) 75%, transparent)",
										fontSize: Qa[u] ?? 13,
										lineHeight: 1.4,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis"
									},
									children: c
								})
							})
						]
					})]
				}), v && /* @__PURE__ */ h("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "var(--tesseract-space-2)",
						flexShrink: 0
					},
					children: v
				})]
			})
		]
	});
});
to.displayName = "HeroBanner";
var no = {
	card: "_card_125qj_1",
	header: "_header_125qj_12",
	titleWrap: "_titleWrap_125qj_20",
	iconChip: "_iconChip_125qj_27",
	titleText: "_titleText_125qj_36",
	title: "_title_125qj_20",
	subtitle: "_subtitle_125qj_55",
	collapseBtn: "_collapseBtn_125qj_67",
	chevronCollapsed: "_chevronCollapsed_125qj_86",
	actions: "_actions_125qj_97",
	headerMeta: "_headerMeta_125qj_104",
	body: "_body_125qj_111",
	fields: "_fields_125qj_118",
	suggest: "_suggest_125qj_124",
	suggestLabel: "_suggestLabel_125qj_130",
	chips: "_chips_125qj_139",
	loading: "_loading_125qj_145",
	empty: "_empty_125qj_151"
}, ro = 0, io = (e) => ({
	id: `rx-${++ro}`,
	name: e
});
function ao(e, t, n = "linear") {
	if (!e) return {
		name: t,
		variant: n
	};
	let r = String(e);
	if (r.includes("/")) {
		let e = r.indexOf("/");
		return {
			name: r.slice(e + 1),
			variant: r.slice(0, e)
		};
	}
	return {
		name: r,
		variant: n
	};
}
function oo({ iconProp: e, defaultIcon: t, defaultVariant: n = "linear", tip: r, onClick: i, disabled: a, size: o = 18, color: s, buttonProps: c }) {
	let { name: l, variant: u } = ao(e, t, n), { variant: d = "tonal", theme: f = "neutral", size: p = "sm", ...m } = c || {}, g = /* @__PURE__ */ h(G, {
		variant: d,
		theme: f,
		size: p,
		"aria-label": r || (l ? l.replace(/[-_]/g, " ") : "Action"),
		disabled: a,
		onClick: i,
		icon: /* @__PURE__ */ h(z, {
			name: l,
			variant: u,
			size: o,
			color: s
		}),
		...m
	});
	return r ? /* @__PURE__ */ h(wn, {
		content: r,
		side: "bottom",
		children: g
	}) : g;
}
var so = e.forwardRef(function({ title: t = "Symptoms", subtitle: n, headerMeta: r, icon: i = "virus", iconColor: a = "var(--tesseract-violet-500)", mode: o = "table-first", bodyType: s = "table", columns: c = [], name: l, notes: u, fields: d = [], search: f = !0, searchPlaceholder: p, frequentlyUsed: _ = [], showRepeat: v = !0, showTemplate: y = !0, showSave: b = !0, showClear: x = !0, onRepeat: S, onTemplate: C, onSave: w, onClear: T, headerActions: E, actionButtonProps: D, repeatIcon: O = "refresh-arrow", templateIcon: k = "grid-5", saveIcon: A = "ram", clearIcon: j = "eraser", searchIcon: M = "search:search-2", dragIcon: N = "menu", moreIcon: P = "3-dots-more", deleteIcon: F = "trash", duplicateIcon: I = "copy", rows: L, defaultRows: ee = [], onRowsChange: te, loading: ne = !1, emptyState: R, collapsible: B = !1, defaultCollapsed: re = !1, children: V, renderBody: ie, className: ae, style: oe, ...H }, se) {
	let ce = L !== void 0, [le, ue] = e.useState(ee), U = ce ? L : le, W = (e) => {
		ce || ue(e), te?.(e);
	}, [de, fe] = e.useState(""), [pe, me] = e.useState({}), [he, ge] = e.useState(""), [K, _e] = e.useState(re), ve = e.useId(), ye = s === "table" ? U.length > 0 : s === "text" ? de.trim().length > 0 : Object.values(pe).some((e) => (e || "").trim()), be = _.filter((e) => !U.some((t) => String(t.name || "").toLowerCase() === e.toLowerCase())), xe = (e) => {
		let t = (e || "").trim();
		t && (W([...U, io(t)]), ge(""));
	}, Se = () => {
		W([]), fe(""), me({}), T?.();
	}, q = s === "table" && (o === "table-first" || U.length > 0), Ce = ao(i, "virus", "bulk"), we = ao(M, "search:search-2"), Te = /* @__PURE__ */ g(m, { children: [
		v && /* @__PURE__ */ h(oo, {
			iconProp: O,
			defaultIcon: "refresh-arrow",
			tip: "Repeat previous Rx",
			onClick: S,
			buttonProps: D
		}),
		y && /* @__PURE__ */ h(oo, {
			iconProp: k,
			defaultIcon: "grid-5",
			tip: "Browse templates",
			onClick: C,
			buttonProps: D
		}),
		b && /* @__PURE__ */ h(oo, {
			iconProp: A,
			defaultIcon: "ram",
			tip: "Save as template",
			onClick: w,
			disabled: !ye,
			buttonProps: D
		}),
		x && /* @__PURE__ */ h(oo, {
			iconProp: j,
			defaultIcon: "eraser",
			tip: "Clear all entries",
			onClick: Se,
			disabled: !ye,
			buttonProps: D
		})
	] }), J = Array.isArray(E) ? E.map((e, t) => /* @__PURE__ */ h(oo, {
		iconProp: e.icon,
		defaultIcon: e.icon,
		tip: e.tip,
		onClick: e.onClick,
		disabled: e.disabled,
		buttonProps: {
			...D,
			...e.variant ? { variant: e.variant } : null
		}
	}, t)) : E, Ee = E == null ? Te : J, De = !(B && K);
	return /* @__PURE__ */ g("section", {
		ref: se,
		className: [no.card, ae].filter(Boolean).join(" "),
		style: oe,
		...H,
		children: [/* @__PURE__ */ g("header", {
			className: no.header,
			children: [/* @__PURE__ */ g("div", {
				className: no.titleWrap,
				children: [
					B && /* @__PURE__ */ h("button", {
						type: "button",
						className: no.collapseBtn,
						"aria-expanded": !K,
						"aria-controls": ve,
						"aria-label": K ? "Expand section" : "Collapse section",
						onClick: () => _e((e) => !e),
						children: /* @__PURE__ */ h(z, {
							name: "chevron-down",
							variant: "linear",
							size: 18,
							className: K ? no.chevronCollapsed : void 0
						})
					}),
					/* @__PURE__ */ h("span", {
						className: no.iconChip,
						style: { color: a },
						children: /* @__PURE__ */ h(z, {
							name: Ce.name,
							variant: Ce.variant,
							size: 24,
							color: a
						})
					}),
					/* @__PURE__ */ g("div", {
						className: no.titleText,
						children: [/* @__PURE__ */ h("h3", {
							className: no.title,
							children: t
						}), n && /* @__PURE__ */ h("p", {
							className: no.subtitle,
							children: n
						})]
					})
				]
			}), /* @__PURE__ */ g("div", {
				className: no.actions,
				children: [r && /* @__PURE__ */ h("div", {
					className: no.headerMeta,
					children: r
				}), Ee]
			})]
		}), De && /* @__PURE__ */ h("div", {
			id: ve,
			className: no.body,
			children: (V ?? ie?.()) == null ? ne ? /* @__PURE__ */ h("div", {
				className: no.loading,
				"aria-busy": "true",
				"aria-live": "polite",
				children: Array.from({ length: 3 }, (e, t) => /* @__PURE__ */ h(Fe, {
					variant: "rectangular",
					height: 40,
					radius: 8
				}, t))
			}) : !ye && R != null ? /* @__PURE__ */ h("div", {
				className: no.empty,
				children: R
			}) : /* @__PURE__ */ g(m, { children: [
				q && /* @__PURE__ */ h(qr, {
					columns: c,
					name: l,
					notes: u,
					rows: U,
					onChange: W,
					autoRow: o === "table-first",
					dragIcon: N,
					moreIcon: P,
					deleteIcon: F,
					duplicateIcon: I
				}),
				s === "text" && /* @__PURE__ */ h(Qe, {
					fullWidth: !0,
					autoGrow: !0,
					maxHeight: 160,
					value: de,
					onChange: (e) => fe(e.target?.value ?? e),
					"aria-label": p || `${t} notes`,
					placeholder: p || "Add clinical notes…"
				}),
				s === "fields" && /* @__PURE__ */ h("div", {
					className: no.fields,
					children: d.map((e) => /* @__PURE__ */ h(Qe, {
						fullWidth: !0,
						label: e.label,
						type: e.type,
						placeholder: e.placeholder,
						"aria-label": e.label || e.placeholder || e.id,
						leftIcon: e.icon,
						value: pe[e.id] || "",
						onChange: (t) => me((n) => ({
							...n,
							[e.id]: t.target?.value ?? t
						}))
					}, e.id))
				}),
				f && s === "table" && o !== "table-first" && /* @__PURE__ */ h(Qe, {
					fullWidth: !0,
					value: he,
					onChange: (e) => ge(e.target?.value ?? e),
					onKeyDown: (e) => {
						e.key === "Enter" && xe(he);
					},
					leftIcon: /* @__PURE__ */ h(z, {
						name: we.name,
						variant: we.variant,
						size: 18
					}),
					"aria-label": p || `Search & add ${t}`,
					placeholder: p || `Search & add ${t}`
				}),
				be.length > 0 && /* @__PURE__ */ h("div", {
					className: no.chips,
					children: be.map((e) => /* @__PURE__ */ h(G, {
						variant: "tonal",
						theme: "neutral",
						size: "sm",
						onClick: () => xe(e),
						children: e
					}, e))
				})
			] }) : V ?? ie()
		})]
	});
});
so.displayName = "RxPadSection";
var co = {
	card: "_card_ntcy9_4",
	bordered: "_bordered_ntcy9_57",
	header: "_header_ntcy9_62",
	sticky: "_sticky_ntcy9_79",
	titleRow: "_titleRow_ntcy9_85",
	titleRowClickable: "_titleRowClickable_ntcy9_93",
	collapseBtnEnd: "_collapseBtnEnd_ntcy9_99",
	collapseBtn: "_collapseBtn_ntcy9_99",
	chevron: "_chevron_ntcy9_133",
	chevronOpen: "_chevronOpen_ntcy9_137",
	numberChip: "_numberChip_ntcy9_143",
	iconChip: "_iconChip_ntcy9_160",
	titleText: "_titleText_ntcy9_167",
	title: "_title_ntcy9_85",
	metaRow: "_metaRow_ntcy9_187",
	amount: "_amount_ntcy9_194",
	subtitle: "_subtitle_ntcy9_206",
	headerActions: "_headerActions_ntcy9_213",
	headerExtra: "_headerExtra_ntcy9_221",
	body: "_body_ntcy9_226",
	footer: "_footer_ntcy9_233"
}, lo = "tonal", uo = e.forwardRef(function({ title: t, subtitle: n, icon: r, iconColor: i, number: a, leading: o, amount: s, tone: c = "neutral", headerGradient: l = !1, headerFill: u, headerColor: d, tools: f, headerActions: p, headerExtra: m, footer: _, footerAlign: v = "end", collapsible: y = !1, collapsed: b, defaultCollapsed: x = !1, onCollapsedChange: S, collapseIcon: C = "chevron-down", collapseIconPosition: w = "right", sticky: T = !1, maxBodyHeight: E, elevation: D = !1, bordered: O = !0, divided: k = !0, radius: A, padding: j, surface: M, headerBg: N, bodyBg: P, footerBg: F, children: I, className: L, style: ee, ...te }, ne) {
	let R = b !== void 0, [B, re] = e.useState(x), V = R ? b : B, ie = (e) => {
		R || re(e), S?.(e);
	}, ae = e.useId(), oe = (e) => typeof e == "number" ? `${e}px` : e, H = t != null || n != null || r != null || a != null || o != null || p != null || m != null || f && f.length || y, se = u ?? (l ? "gradient" : "none"), ce = {
		...A == null ? null : { "--sc-radius": W(A) },
		...j == null ? null : { "--sc-pad": oe(j) },
		...M ? { "--sc-bg": M } : null,
		...N ? { "--sc-header-bg": N } : null,
		...P ? { "--sc-body-bg": P } : null,
		...F ? { "--sc-footer-bg": F } : null,
		...d ? {
			"--sc-header-solid": d,
			"--sc-grad": `color-mix(in srgb, ${d} 14%, transparent)`
		} : null,
		...ee
	}, le = E == null ? void 0 : {
		maxHeight: oe(E),
		overflowY: "auto"
	}, ue = D === !0 ? "md" : D || void 0, de = r == null ? null : typeof r == "string" ? /* @__PURE__ */ h(z, {
		name: r,
		variant: "bulk",
		size: 20,
		color: i
	}) : r, fe = y ? /* @__PURE__ */ h("button", {
		type: "button",
		className: U(co.collapseBtn, w === "right" && co.collapseBtnEnd),
		"aria-expanded": !V,
		"aria-controls": ae,
		"aria-label": V ? "Expand section" : "Collapse section",
		onClick: (e) => {
			e.stopPropagation(), ie(!V);
		},
		children: /* @__PURE__ */ h(z, {
			name: C,
			variant: "linear",
			size: 18,
			className: U(co.chevron, !V && co.chevronOpen)
		})
	}) : null, pe = y ? (e) => {
		e.target.closest("button, a, input, select, textarea, label") || ie(!V);
	} : void 0;
	return /* @__PURE__ */ g("section", {
		ref: ne,
		className: U(co.card, O && co.bordered, L),
		style: ce,
		"data-tone": c === "neutral" ? void 0 : c,
		"data-divided": k ? "" : void 0,
		"data-collapsed": V ? "" : void 0,
		"data-elevation": ue,
		...te,
		children: [
			H && /* @__PURE__ */ g("header", {
				className: U(co.header, T && co.sticky),
				"data-fill": se === "none" ? void 0 : se,
				children: [/* @__PURE__ */ g("div", {
					className: U(co.titleRow, y && co.titleRowClickable),
					onClick: pe,
					children: [
						w === "left" && fe,
						(o != null || a != null) && /* @__PURE__ */ h("span", {
							className: co.numberChip,
							children: o ?? a
						}),
						de && /* @__PURE__ */ h("span", {
							className: co.iconChip,
							style: i ? { color: i } : void 0,
							children: de
						}),
						(t != null || n != null || s != null) && /* @__PURE__ */ g("div", {
							className: co.titleText,
							children: [t != null && /* @__PURE__ */ h("h3", {
								className: co.title,
								children: t
							}), (s != null || n != null) && /* @__PURE__ */ g("div", {
								className: co.metaRow,
								children: [s != null && /* @__PURE__ */ h(je, {
									variant: "soft",
									color: "neutral",
									size: "sm",
									radius: 6,
									children: s
								}), n != null && /* @__PURE__ */ h("span", {
									className: co.subtitle,
									children: n
								})]
							})]
						}),
						(p != null || f && f.length) && /* @__PURE__ */ g("div", {
							className: co.headerActions,
							children: [p, f && f.map((e, t) => /* @__PURE__ */ h(G, {
								variant: lo,
								theme: e.danger ? "error" : "neutral",
								size: "sm",
								"aria-label": e.title,
								title: e.title,
								disabled: e.disabled,
								onClick: e.onClick,
								icon: typeof e.icon == "string" ? /* @__PURE__ */ h(z, {
									name: e.icon,
									variant: "linear",
									size: 16
								}) : e.icon
							}, t))]
						}),
						w === "right" && fe
					]
				}), m != null && /* @__PURE__ */ h("div", {
					className: co.headerExtra,
					children: m
				})]
			}),
			!V && I != null && /* @__PURE__ */ h("div", {
				id: ae,
				className: co.body,
				style: le,
				children: I
			}),
			_ != null && /* @__PURE__ */ h("footer", {
				className: co.footer,
				"data-align": v,
				children: _
			})
		]
	});
});
uo.displayName = "SectionCard";
//#endregion
//#region src/components/charts/internal/lib.js
var fo = (e, t = (e) => e) => {
	let n = Infinity, r = -Infinity;
	for (let i of e) {
		let e = t(i);
		e == null || Number.isNaN(e) || (e < n && (n = e), e > r && (r = e));
	}
	return [n === Infinity ? 0 : n, r === -Infinity ? 0 : r];
}, po = (e, t = (e) => e) => e.reduce((e, n) => e + (Number(t(n)) || 0), 0), mo = (e, t = (e) => e) => e.reduce((e, n) => Math.max(e, Number(t(n)) || 0), 0);
function ho(e, t) {
	let [n, r] = e, [i, a] = t;
	n === r && (r = n + 1);
	let o = (a - i) / (r - n), s = (e) => i + (e - n) * o;
	return s.invert = (e) => n + (e - i) / o, s.domain = [n, r], s.range = [i, a], s;
}
function go(e, t, n = .2) {
	let [r, i] = t, a = e.length || 1, o = (i - r) / a, s = o * (1 - n), c = new Map(e.map((e, t) => [String(e), t])), l = (e) => r + (c.get(String(e)) ?? 0) * o + (o - s) / 2;
	return l.bandwidth = s, l.step = o, l.domain = e, l.range = [r, i], l;
}
function _o(e, t, n = 5) {
	if (!Number.isFinite(e) || !Number.isFinite(t)) return {
		ticks: [0, 1],
		niceMin: 0,
		niceMax: 1,
		step: 1
	};
	e === t && (t = e + 1);
	let r = (t - e) / Math.max(1, n), i = 10 ** Math.floor(Math.log10(r)), a = r / i, o = (a < 1.5 ? 1 : a < 3 ? 2 : a < 7 ? 5 : 10) * i, s = Math.floor(e / o) * o, c = Math.ceil(t / o) * o, l = [];
	for (let e = s; e <= c + o * .5; e += o) l.push(Number(e.toFixed(10)));
	return {
		ticks: l,
		niceMin: s,
		niceMax: c,
		step: o
	};
}
var vo = (e) => e.length ? "M" + e.map((e) => `${e.x},${e.y}`).join("L") : "";
function yo(e) {
	if (e.length < 3) return vo(e);
	let t = `M${e[0].x},${e[0].y}`;
	for (let n = 0; n < e.length - 1; n++) {
		let r = e[n - 1] || e[n], i = e[n], a = e[n + 1], o = e[n + 2] || a, s = i.x + (a.x - r.x) / 6, c = i.y + (a.y - r.y) / 6, l = a.x - (o.x - i.x) / 6, u = a.y - (o.y - i.y) / 6;
		t += `C${s},${c} ${l},${u} ${a.x},${a.y}`;
	}
	return t;
}
function bo(e) {
	if (!e.length) return "";
	let t = `M${e[0].x},${e[0].y}`;
	for (let n = 1; n < e.length; n++) t += `L${e[n].x},${e[n - 1].y}L${e[n].x},${e[n].y}`;
	return t;
}
function xo(e, t = "linear") {
	return t === !0 || t === "smooth" ? yo(e) : t === "step" ? bo(e) : vo(e);
}
function So(e, t, n = "linear") {
	if (!e.length) return "";
	let r = xo(e, n), i = e[e.length - 1], a = e[0];
	return `${r}L${i.x},${t}L${a.x},${t}Z`;
}
function Co(e, t, n, r, i, a) {
	let o = Math.max(0, Math.min(i, n / 2, r / 2));
	return o <= 0 || n <= 0 || r <= 0 ? `M${e},${t}h${n}v${r}h${-n}Z` : a ? `M${e},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}V${t + r - o}Q${e + n},${t + r} ${e + n - o},${t + r}H${e}Z` : `M${e},${t + r}V${t + o}Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}V${t + r}Z`;
}
var wo = (e, t, n, r) => {
	let i = r - Math.PI / 2;
	return {
		x: e + n * Math.cos(i),
		y: t + n * Math.sin(i)
	};
};
function To(e, t, n, r, i, a) {
	let o = +(a - i > Math.PI), s = wo(e, t, n, i), c = wo(e, t, n, a);
	if (r <= 0) return `M${e},${t}L${s.x},${s.y}A${n},${n} 0 ${o} 1 ${c.x},${c.y}Z`;
	let l = wo(e, t, r, a), u = wo(e, t, r, i);
	return `M${s.x},${s.y}A${n},${n} 0 ${o} 1 ${c.x},${c.y}L${l.x},${l.y}A${r},${r} 0 ${o} 0 ${u.x},${u.y}Z`;
}
function Eo(e) {
	if (e == null || Number.isNaN(e)) return "";
	let t = Math.abs(e), n = (e) => e.toFixed(1).replace(/\.0$/, "");
	return t >= 1e9 ? n(e / 1e9) + "B" : t >= 1e6 ? n(e / 1e6) + "M" : t >= 1e3 ? n(e / 1e3) + "k" : String(Math.round(e * 100) / 100);
}
var Do = (e) => e == null || Number.isNaN(e) ? "" : e.toLocaleString();
function Oo(e) {
	if (e == null || Number.isNaN(e)) return "";
	let t = Math.abs(e), n = (e) => e.toFixed(1).replace(/\.0$/, "");
	return t >= 1e7 ? n(e / 1e7) + "Cr" : t >= 1e5 ? n(e / 1e5) + "L" : t >= 1e3 ? n(e / 1e3) + "k" : String(Math.round(e * 100) / 100);
}
var ko = [
	"var(--tesseract-blue-500)",
	"var(--tesseract-violet-500)",
	"var(--tesseract-amber-500)",
	"var(--tesseract-success-500)",
	"var(--tesseract-error-500)",
	"var(--tesseract-blue-300)",
	"var(--tesseract-violet-300)",
	"var(--tesseract-slate-400)"
], Ao = (e, t) => t && t[e] || ko[e % ko.length], jo = {
	top: 12,
	right: 16,
	bottom: 28,
	left: 40
};
function Mo(e, t) {
	try {
		let n = t.map((e) => e.map((e) => `"${String(e ?? "").replace(/"/g, "\"\"")}"`).join(",")).join("\n"), r = new Blob([n], { type: "text/csv;charset=utf-8" }), i = URL.createObjectURL(r), a = document.createElement("a");
		a.href = i, a.download = e, a.click(), setTimeout(() => URL.revokeObjectURL(i), 500);
	} catch {}
}
//#endregion
//#region src/components/charts/internal/hooks.js
function No(t = 640) {
	let n = e.useRef(null), [r, i] = e.useState(t);
	return e.useLayoutEffect(() => {
		let e = n.current;
		if (!e) return;
		let t = () => {
			let t = e.clientWidth;
			t && t !== r && i(t);
		};
		if (t(), typeof ResizeObserver != "function") return;
		let a = new ResizeObserver(t);
		return a.observe(e), () => a.disconnect();
	}, []), [n, r];
}
function Po(t) {
	let [n, r] = e.useState({
		lo: 0,
		hi: 1
	}), i = e.useRef(null), a = (e, t) => {
		let n = Math.max(.05, Math.min(1, t - e));
		return e < 0 && (e = 0), e + n > 1 && (e = 1 - n), {
			lo: e,
			hi: e + n
		};
	}, o = (e) => {
		if (!t) return;
		e.preventDefault();
		let i = e.currentTarget.getBoundingClientRect(), o = i.width ? (e.clientX - i.left) / i.width : .5, s = n.lo + o * (n.hi - n.lo), c = e.deltaY > 0 ? 1.15 : 1 / 1.15, l = (n.hi - n.lo) * c;
		r(a(s - o * l, s + (1 - o) * l));
	}, s = (e) => {
		t && (i.current = {
			x: e.clientX,
			win: n,
			width: e.currentTarget.getBoundingClientRect().width
		}, e.currentTarget.setPointerCapture?.(e.pointerId));
	}, c = (e) => {
		if (!t || !i.current) return;
		let { x: n, win: o, width: s } = i.current, c = o.hi - o.lo, l = s ? (e.clientX - n) / s * c : 0;
		r(a(o.lo - l, o.hi - l));
	}, l = (e) => {
		i.current = null, e.currentTarget?.releasePointerCapture?.(e.pointerId);
	}, u = (e) => {
		let t = (n.lo + n.hi) / 2, i = (n.hi - n.lo) * e;
		r(a(t - i / 2, t + i / 2));
	}, d = () => r({
		lo: 0,
		hi: 1
	}), f = t && (n.lo > .001 || n.hi < .999);
	return {
		win: t ? n : {
			lo: 0,
			hi: 1
		},
		active: f,
		handlers: t ? {
			onWheel: o,
			onPointerDown: s,
			onPointerMove: c,
			onPointerUp: l,
			onPointerLeave: l
		} : {},
		zoomIn: () => u(1 / 1.4),
		zoomOut: () => u(1.4),
		reset: d
	};
}
//#endregion
//#region src/components/charts/internal/primitives.jsx
var Fo = {
	fontSize: 11,
	fill: "var(--tesseract-fg-tertiary)",
	fontFamily: "var(--tesseract-font-body)",
	fontVariantNumeric: "tabular-nums"
};
function Io({ x: e, y: t, w: n, h: r, yTicks: i = [], xTicks: a = [], showX: o = !1, dashed: s = !1 }) {
	let c = s ? "3 3" : void 0;
	return /* @__PURE__ */ g("g", {
		pointerEvents: "none",
		children: [i.map((t, r) => /* @__PURE__ */ h("line", {
			x1: e,
			x2: e + n,
			y1: t.y,
			y2: t.y,
			stroke: "var(--tesseract-border-soft)",
			strokeWidth: 1,
			strokeDasharray: c
		}, `gy${r}`)), o && a.map((e, n) => /* @__PURE__ */ h("line", {
			x1: e.x,
			x2: e.x,
			y1: t,
			y2: t + r,
			stroke: "var(--tesseract-border-soft)",
			strokeWidth: 1,
			strokeDasharray: c
		}, `gx${n}`))]
	});
}
function Lo({ x: e, ticks: t, format: n }) {
	return /* @__PURE__ */ h("g", {
		pointerEvents: "none",
		children: t.map((t, r) => /* @__PURE__ */ h("text", {
			x: e - 8,
			y: t.y + 4,
			textAnchor: "end",
			style: Fo,
			children: n ? n(t.value) : t.value
		}, r))
	});
}
function Ro({ y: e, ticks: t, format: n }) {
	return /* @__PURE__ */ h("g", {
		pointerEvents: "none",
		children: t.map((t, r) => /* @__PURE__ */ h("text", {
			x: t.x,
			y: e + 16,
			textAnchor: "middle",
			style: Fo,
			children: n ? n(t.value) : t.value
		}, r))
	});
}
function zo({ items: e, onToggle: t, align: n = "start" }) {
	return /* @__PURE__ */ h("div", {
		style: {
			display: "flex",
			flexWrap: "wrap",
			gap: 14,
			justifyContent: n === "center" ? "center" : n === "end" ? "flex-end" : "flex-start",
			padding: "2px 2px",
			fontFamily: "var(--tesseract-font-body)"
		},
		children: e.map((e, n) => /* @__PURE__ */ g("button", {
			type: "button",
			onClick: t ? () => t(n) : void 0,
			"aria-pressed": t ? !e.hidden : void 0,
			style: {
				display: "inline-flex",
				alignItems: "center",
				gap: 6,
				background: "none",
				border: 0,
				padding: 0,
				cursor: t ? "pointer" : "default",
				opacity: e.hidden ? .45 : 1
			},
			children: [/* @__PURE__ */ h("span", { style: {
				width: 10,
				height: 10,
				borderRadius: 3,
				background: e.color,
				flexShrink: 0
			} }), /* @__PURE__ */ h("span", {
				style: {
					fontSize: 12,
					color: "var(--tesseract-fg-secondary)",
					textDecoration: e.hidden ? "line-through" : "none"
				},
				children: e.label
			})]
		}, n))
	});
}
var Bo = {
	zoomIn: /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("circle", {
		cx: "7",
		cy: "7",
		r: "4.5",
		stroke: "currentColor",
		strokeWidth: "1.5"
	}), /* @__PURE__ */ h("path", {
		d: "M7 5v4M5 7h4M10.5 10.5l3 3",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	})] }),
	zoomOut: /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("circle", {
		cx: "7",
		cy: "7",
		r: "4.5",
		stroke: "currentColor",
		strokeWidth: "1.5"
	}), /* @__PURE__ */ h("path", {
		d: "M5 7h4M10.5 10.5l3 3",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	})] }),
	reset: /* @__PURE__ */ h("path", {
		d: "M12.5 6a5 5 0 1 0 .9 3M12.5 3v3h-3",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}),
	export: /* @__PURE__ */ h("path", {
		d: "M8 2v7m0 0 2.5-2.5M8 9 5.5 6.5M3 11v1.5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V11",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	})
};
function Vo({ glyph: e, label: t, onClick: n }) {
	return /* @__PURE__ */ h("button", {
		type: "button",
		"aria-label": t,
		title: t,
		onClick: n,
		style: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			width: 28,
			height: 28,
			borderRadius: 8,
			border: "1px solid var(--tesseract-border-neutral)",
			background: "var(--tesseract-bg-surface)",
			color: "var(--tesseract-fg-secondary)",
			cursor: "pointer"
		},
		children: /* @__PURE__ */ h("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			"aria-hidden": !0,
			children: Bo[e]
		})
	});
}
function Ho({ onZoomIn: e, onZoomOut: t, onReset: n, onExport: r, zoomable: i }) {
	return /* @__PURE__ */ g("div", {
		style: {
			display: "inline-flex",
			gap: 6
		},
		children: [i && /* @__PURE__ */ g(m, { children: [
			/* @__PURE__ */ h(Vo, {
				glyph: "zoomOut",
				label: "Zoom out",
				onClick: t
			}),
			/* @__PURE__ */ h(Vo, {
				glyph: "zoomIn",
				label: "Zoom in",
				onClick: e
			}),
			/* @__PURE__ */ h(Vo, {
				glyph: "reset",
				label: "Reset zoom",
				onClick: n
			})
		] }), r && /* @__PURE__ */ h(Vo, {
			glyph: "export",
			label: "Export CSV",
			onClick: r
		})]
	});
}
function Uo({ x: e, y: t, title: n, rows: r, containerWidth: i }) {
	let a = i != null && e > i - 168;
	return /* @__PURE__ */ g("div", {
		style: {
			position: "absolute",
			left: a ? e - 12 : e + 14,
			top: t,
			transform: a ? "translate(-100%, -50%)" : "translateY(-50%)",
			pointerEvents: "none",
			background: "var(--tesseract-bg-surface)",
			border: "1px solid var(--tesseract-border-neutral)",
			borderRadius: 10,
			boxShadow: "0 8px 24px -8px color-mix(in srgb, var(--tesseract-slate-900) 24%, transparent)",
			padding: "8px 10px",
			minWidth: 128,
			zIndex: 5,
			fontFamily: "var(--tesseract-font-body)"
		},
		children: [n != null && /* @__PURE__ */ h("div", {
			style: {
				fontSize: 11,
				color: "var(--tesseract-fg-tertiary)",
				marginBottom: 6
			},
			children: n
		}), r.map((e, t) => /* @__PURE__ */ g("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: 8,
				fontSize: 12,
				lineHeight: "18px"
			},
			children: [
				/* @__PURE__ */ h("span", { style: {
					width: 9,
					height: 9,
					borderRadius: 3,
					background: e.color,
					flexShrink: 0
				} }),
				/* @__PURE__ */ h("span", {
					style: {
						color: "var(--tesseract-fg-secondary)",
						marginRight: "auto"
					},
					children: e.label
				}),
				/* @__PURE__ */ h("strong", {
					style: {
						color: "var(--tesseract-fg-primary)",
						fontWeight: 600
					},
					children: e.value
				})
			]
		}, t))]
	});
}
//#endregion
//#region src/components/charts/LineChart/LineChart.jsx
function Wo(e, t) {
	return (e || []).map((e, n) => {
		let r = typeof e == "string" ? { key: e } : e;
		return {
			key: r.key,
			label: r.label ?? r.key,
			color: r.color ?? Ao(n, t)
		};
	});
}
var Go = e.forwardRef(function({ data: t = [], xKey: n = "x", series: r = [], height: i = 260, width: a, margin: o, curve: s = "smooth", strokeWidth: c = 2, area: l = !1, areaOpacity: u = .14, markers: d = !1, markerSize: f = 2.5, yMin: p, yMax: m, yTickCount: _ = 5, yFormat: v = Eo, showYAxis: y = !0, yAxisLabel: b, xFormat: x = (e) => e, showXAxis: S = !0, xAxisLabel: C, xTickCount: w = 6, showGrid: T = !0, gridStyle: E = "solid", showVerticalGrid: D = !1, showLegend: O = !0, legendPosition: k = "bottom", legendAlign: A = "start", showTooltip: j = !0, showCrosshair: M = !0, zoomable: N = !1, showToolbar: P = !1, colors: F, emptyText: I = "No data", className: L = "", style: ee, ...te }, ne) {
	let [R, z] = No(), B = a || z, re = e.useId(), V = Wo(r, F), [ie, ae] = e.useState(() => /* @__PURE__ */ new Set()), [oe, H] = e.useState(null), se = Po(N), ce = V.filter((e) => !ie.has(e.key)), le = t.length, ue = {
		top: o?.top ?? jo.top,
		right: o?.right ?? jo.right,
		bottom: (o?.bottom ?? jo.bottom) + (C ? 18 : 0),
		left: (o?.left ?? jo.left) + (b ? 16 : 0)
	}, W = {
		x: ue.left,
		y: ue.top,
		w: Math.max(10, B - ue.left - ue.right),
		h: Math.max(10, i - ue.top - ue.bottom)
	}, de = [];
	for (let e of ce) for (let n of t) de.push(Number(n[e.key]));
	let [fe, pe] = fo(de), G = _o(p ?? Math.min(fe, 0), m ?? pe, _), me = p ?? G.niceMin, he = m ?? G.niceMax, ge = ho([me, he], [W.y + W.h, W.y]), K = ge(Math.max(me, 0)), _e = (e) => le <= 1 ? .5 : e / (le - 1), ve = (e) => W.x + (_e(e) - se.win.lo) / (se.win.hi - se.win.lo) * W.w, ye = G.ticks.filter((e) => e >= me - 1e-9 && e <= he + 1e-9).map((e) => ({
		value: e,
		y: ge(e)
	})), be = Math.max(0, Math.floor(se.win.lo * (le - 1))), xe = Math.min(le - 1, Math.ceil(se.win.hi * (le - 1))), Se = Math.max(1, Math.round((xe - be) / Math.max(1, w))), q = [];
	for (let e = be; e <= xe; e += Se) q.push({
		value: x(t[e]?.[n]),
		x: ve(e)
	});
	let Ce = (e) => t.map((t, n) => ({
		x: ve(n),
		y: ge(Number(t[e.key])),
		i: n,
		v: Number(t[e.key])
	})), we = (e) => {
		if (!j || !le) return;
		let t = e.currentTarget.getBoundingClientRect(), n = se.win.lo + (e.clientX - t.left - W.x) / W.w * (se.win.hi - se.win.lo);
		H(Math.max(0, Math.min(le - 1, Math.round(n * (le - 1)))));
	}, Te = (e) => {
		let t = V[e].key;
		ae((e) => {
			let n = new Set(e);
			return n.has(t) ? n.delete(t) : n.size < V.length - 1 && n.add(t), n;
		});
	}, J = () => {
		Mo("linechart.csv", [[n, ...V.map((e) => e.label)], ...t.map((e) => [e[n], ...V.map((t) => e[t.key])])]);
	}, Ee = oe == null ? null : ve(oe), De = O && V.length > 0 && /* @__PURE__ */ h(zo, {
		items: V.map((e) => ({
			label: e.label,
			color: e.color,
			hidden: ie.has(e.key)
		})),
		onToggle: Te,
		align: A
	});
	return /* @__PURE__ */ g("div", {
		ref: ne,
		className: U(L) || void 0,
		style: {
			fontFamily: "var(--tesseract-font-body)",
			...ee
		},
		...te,
		children: [
			P && /* @__PURE__ */ h("div", {
				style: {
					display: "flex",
					justifyContent: "flex-end",
					marginBottom: 6
				},
				children: /* @__PURE__ */ h(Ho, {
					zoomable: N,
					onZoomIn: se.zoomIn,
					onZoomOut: se.zoomOut,
					onReset: se.reset,
					onExport: J
				})
			}),
			k === "top" && De && /* @__PURE__ */ h("div", {
				style: { marginBottom: 10 },
				children: De
			}),
			/* @__PURE__ */ g("div", {
				ref: R,
				style: {
					position: "relative",
					width: "100%"
				},
				children: [le === 0 ? /* @__PURE__ */ h("div", {
					style: {
						height: i,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "var(--tesseract-fg-tertiary)",
						fontSize: 13
					},
					children: I
				}) : /* @__PURE__ */ g("svg", {
					width: "100%",
					height: i,
					viewBox: `0 0 ${B} ${i}`,
					role: "img",
					style: {
						display: "block",
						touchAction: N ? "none" : void 0
					},
					children: [
						/* @__PURE__ */ h("defs", { children: /* @__PURE__ */ h("clipPath", {
							id: re,
							children: /* @__PURE__ */ h("rect", {
								x: W.x,
								y: W.y - 4,
								width: W.w,
								height: W.h + 8
							})
						}) }),
						T && /* @__PURE__ */ h(Io, {
							x: W.x,
							y: W.y,
							w: W.w,
							h: W.h,
							yTicks: ye,
							xTicks: q,
							showX: D,
							dashed: E === "dashed"
						}),
						/* @__PURE__ */ h("line", {
							x1: W.x,
							x2: W.x + W.w,
							y1: W.y + W.h,
							y2: W.y + W.h,
							stroke: "var(--tesseract-border-neutral)",
							strokeWidth: 1
						}),
						/* @__PURE__ */ g("g", {
							clipPath: `url(#${re})`,
							children: [ce.map((e) => {
								let t = Ce(e);
								return /* @__PURE__ */ g("g", { children: [
									l && /* @__PURE__ */ h("path", {
										d: So(t, K, s),
										fill: e.color,
										fillOpacity: u,
										stroke: "none"
									}),
									/* @__PURE__ */ h("path", {
										d: xo(t, s),
										fill: "none",
										stroke: e.color,
										strokeWidth: c,
										strokeLinejoin: "round",
										strokeLinecap: "round"
									}),
									d && t.map((t) => /* @__PURE__ */ h("circle", {
										cx: t.x,
										cy: t.y,
										r: f,
										fill: "var(--tesseract-bg-surface)",
										stroke: e.color,
										strokeWidth: 1.5
									}, t.i))
								] }, e.key);
							}), oe != null && Ee != null && /* @__PURE__ */ g("g", {
								pointerEvents: "none",
								children: [M && /* @__PURE__ */ h("line", {
									x1: Ee,
									x2: Ee,
									y1: W.y,
									y2: W.y + W.h,
									stroke: "var(--tesseract-border-strong)",
									strokeWidth: 1,
									strokeDasharray: "3 3"
								}), ce.map((e) => /* @__PURE__ */ h("circle", {
									cx: Ee,
									cy: ge(Number(t[oe][e.key])),
									r: 3.5,
									fill: e.color,
									stroke: "var(--tesseract-bg-surface)",
									strokeWidth: 1.5
								}, e.key))]
							})]
						}),
						y && /* @__PURE__ */ h(Lo, {
							x: W.x,
							ticks: ye,
							format: v
						}),
						S && /* @__PURE__ */ h(Ro, {
							y: W.y + W.h,
							ticks: q
						}),
						b && /* @__PURE__ */ h("text", {
							transform: `translate(12,${W.y + W.h / 2}) rotate(-90)`,
							textAnchor: "middle",
							style: {
								fontSize: 11,
								fill: "var(--tesseract-fg-secondary)",
								fontFamily: "var(--tesseract-font-body)"
							},
							children: b
						}),
						C && /* @__PURE__ */ h("text", {
							x: W.x + W.w / 2,
							y: i - 2,
							textAnchor: "middle",
							style: {
								fontSize: 11,
								fill: "var(--tesseract-fg-secondary)",
								fontFamily: "var(--tesseract-font-body)"
							},
							children: C
						}),
						/* @__PURE__ */ h("rect", {
							x: W.x,
							y: W.y,
							width: W.w,
							height: W.h,
							fill: "transparent",
							style: { cursor: N ? "grab" : "crosshair" },
							onMouseMove: we,
							onMouseLeave: () => H(null),
							...se.handlers
						})
					]
				}), j && oe != null && Ee != null && le > 0 && /* @__PURE__ */ h(Uo, {
					x: Ee,
					y: W.y + 8,
					containerWidth: B,
					title: x(t[oe]?.[n]),
					rows: ce.map((e) => ({
						color: e.color,
						label: e.label,
						value: v(Number(t[oe][e.key]))
					}))
				})]
			}),
			k !== "top" && De && /* @__PURE__ */ h("div", {
				style: { marginTop: 10 },
				children: De
			})
		]
	});
});
Go.displayName = "LineChart";
//#endregion
//#region src/components/charts/BarChart/BarChart.jsx
function Ko(e, t) {
	return (e || []).map((e, n) => {
		let r = typeof e == "string" ? { key: e } : e;
		return {
			key: r.key,
			label: r.label ?? r.key,
			color: r.color ?? Ao(n, t)
		};
	});
}
var qo = e.forwardRef(function({ data: t = [], xKey: n = "x", series: r = [], height: i = 280, width: a, margin: o, stacked: s = !1, horizontal: c = !1, barRadius: l = 3, barPadding: u = .3, groupPadding: d = .18, barOpacity: f = 1, dimOnHover: p = !0, valueLabels: _ = !1, yMin: v = 0, yMax: y, yTickCount: b = 5, valueFormat: x = Eo, showValueAxis: S = !0, valueAxisLabel: C, showCategoryAxis: w = !0, categoryAxisLabel: T, showGrid: E = !0, gridStyle: D = "solid", showLegend: O = !0, legendPosition: k = "bottom", legendAlign: A = "start", showTooltip: j = !0, showToolbar: M = !1, colors: N, emptyText: P = "No data", className: F = "", style: I, ...L }, ee) {
	let [te, ne] = No(), R = a || ne, z = Ko(r, N), [B, re] = e.useState(() => /* @__PURE__ */ new Set()), [V, ie] = e.useState(null), ae = z.filter((e) => !B.has(e.key)), oe = {
		top: o?.top ?? jo.top,
		right: o?.right ?? jo.right,
		bottom: (o?.bottom ?? jo.bottom) + (T && !c ? 18 : 0) + (C && c ? 18 : 0),
		left: (o?.left ?? jo.left) + (C && !c ? 16 : 0) + (T && c ? 16 : 0)
	}, H = {
		x: oe.left,
		y: oe.top,
		w: Math.max(10, R - oe.left - oe.right),
		h: Math.max(10, i - oe.top - oe.bottom)
	}, se = t.map((e) => e[n]), ce = s ? mo(t, (e) => po(ae, (t) => Number(e[t.key]))) : mo(t.flatMap((e) => ae.map((t) => Number(e[t.key])))), le = _o(v, y ?? (ce || 1), b), ue = y ?? le.niceMax, W = c ? go(se, [H.y, H.y + H.h], u) : go(se, [H.x, H.x + H.w], u), de = c ? ho([v, ue], [H.x, H.x + H.w]) : ho([v, ue], [H.y + H.h, H.y]), fe = [];
	t.forEach((e, t) => {
		let n = W(se[t]), r = W.bandwidth;
		if (s) {
			let i = 0, a = ae.length - 1;
			ae.forEach((o, s) => {
				let l = Number(e[o.key]) || 0, u = s === a;
				if (c) {
					let e = de(i), a = de(i + l);
					fe.push({
						x: e,
						y: n,
						w: Math.max(0, a - e),
						h: r,
						color: o.color,
						v: l,
						ci: t,
						round: u
					});
				} else {
					let e = de(i), a = de(i + l);
					fe.push({
						x: n,
						y: a,
						w: r,
						h: Math.max(0, e - a),
						color: o.color,
						v: l,
						ci: t,
						round: u
					});
				}
				i += l;
			});
		} else {
			let i = r / Math.max(1, ae.length), a = i * d;
			ae.forEach((r, o) => {
				let s = Number(e[r.key]) || 0;
				if (c) {
					let e = de(s);
					fe.push({
						x: H.x,
						y: n + o * i + a / 2,
						w: Math.max(0, e - H.x),
						h: i - a,
						color: r.color,
						v: s,
						ci: t,
						round: !0
					});
				} else {
					let e = de(s);
					fe.push({
						x: n + o * i + a / 2,
						y: e,
						w: i - a,
						h: Math.max(0, H.y + H.h - e),
						color: r.color,
						v: s,
						ci: t,
						round: !0
					});
				}
			});
		}
	});
	let pe = le.ticks.filter((e) => e <= ue + 1e-9).map((e) => ({
		value: e,
		[c ? "x" : "y"]: de(e)
	})), G = se.map((e) => ({
		value: e,
		[c ? "y" : "x"]: W(e) + W.bandwidth / 2
	})), me = (e) => {
		let t = z[e].key;
		re((e) => {
			let n = new Set(e);
			return n.has(t) ? n.delete(t) : n.size < z.length - 1 && n.add(t), n;
		});
	}, he = () => Mo("barchart.csv", [[n, ...z.map((e) => e.label)], ...t.map((e) => [e[n], ...z.map((t) => e[t.key])])]), ge = V == null ? null : c ? {
		x: H.x + H.w,
		y: W(se[V]) + W.bandwidth / 2
	} : {
		x: W(se[V]) + W.bandwidth / 2,
		y: H.y + 8
	}, K = O && z.length > 0 && /* @__PURE__ */ h(zo, {
		items: z.map((e) => ({
			label: e.label,
			color: e.color,
			hidden: B.has(e.key)
		})),
		onToggle: me,
		align: A
	});
	return /* @__PURE__ */ g("div", {
		ref: ee,
		className: U(F) || void 0,
		style: {
			fontFamily: "var(--tesseract-font-body)",
			...I
		},
		...L,
		children: [
			M && /* @__PURE__ */ h("div", {
				style: {
					display: "flex",
					justifyContent: "flex-end",
					marginBottom: 6
				},
				children: /* @__PURE__ */ h(Ho, { onExport: he })
			}),
			k === "top" && K && /* @__PURE__ */ h("div", {
				style: { marginBottom: 10 },
				children: K
			}),
			/* @__PURE__ */ g("div", {
				ref: te,
				style: {
					position: "relative",
					width: "100%"
				},
				children: [t.length === 0 ? /* @__PURE__ */ h("div", {
					style: {
						height: i,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "var(--tesseract-fg-tertiary)",
						fontSize: 13
					},
					children: P
				}) : /* @__PURE__ */ g("svg", {
					width: "100%",
					height: i,
					viewBox: `0 0 ${R} ${i}`,
					role: "img",
					style: { display: "block" },
					children: [
						E && /* @__PURE__ */ h(Io, {
							x: H.x,
							y: H.y,
							w: H.w,
							h: H.h,
							yTicks: c ? [] : pe,
							xTicks: c ? pe : [],
							showX: c,
							dashed: D === "dashed"
						}),
						/* @__PURE__ */ h("line", {
							x1: H.x,
							y1: H.y + H.h,
							x2: H.x + H.w,
							y2: H.y + H.h,
							stroke: "var(--tesseract-border-neutral)",
							strokeWidth: 1
						}),
						fe.map((e, t) => /* @__PURE__ */ h("path", {
							d: Co(e.x, e.y, e.w, e.h, e.round ? l : 0, c),
							fill: e.color,
							opacity: (p && V != null && V !== e.ci ? .4 : 1) * f,
							style: { transition: "opacity 120ms" }
						}, t)),
						_ && fe.map((e, t) => e.v ? /* @__PURE__ */ h("text", {
							x: c ? e.x + e.w + 4 : e.x + e.w / 2,
							y: c ? e.y + e.h / 2 + 4 : e.y - 4,
							textAnchor: c ? "start" : "middle",
							style: {
								fontSize: 10,
								fill: "var(--tesseract-fg-tertiary)",
								fontFamily: "var(--tesseract-font-body)"
							},
							children: x(e.v)
						}, `l${t}`) : null),
						c ? /* @__PURE__ */ g(m, { children: [S && /* @__PURE__ */ h(Ro, {
							y: H.y + H.h,
							ticks: pe,
							format: x
						}), w && /* @__PURE__ */ h("g", {
							pointerEvents: "none",
							children: G.map((e, t) => /* @__PURE__ */ h("text", {
								x: H.x - 8,
								y: e.y + 4,
								textAnchor: "end",
								style: {
									fontSize: 11,
									fill: "var(--tesseract-fg-tertiary)",
									fontFamily: "var(--tesseract-font-body)"
								},
								children: e.value
							}, t))
						})] }) : /* @__PURE__ */ g(m, { children: [S && /* @__PURE__ */ h(Lo, {
							x: H.x,
							ticks: pe,
							format: x
						}), w && /* @__PURE__ */ h(Ro, {
							y: H.y + H.h,
							ticks: G
						})] }),
						C && (c ? /* @__PURE__ */ h("text", {
							x: H.x + H.w / 2,
							y: i - 2,
							textAnchor: "middle",
							style: {
								fontSize: 11,
								fill: "var(--tesseract-fg-secondary)",
								fontFamily: "var(--tesseract-font-body)"
							},
							children: C
						}) : /* @__PURE__ */ h("text", {
							transform: `translate(12,${H.y + H.h / 2}) rotate(-90)`,
							textAnchor: "middle",
							style: {
								fontSize: 11,
								fill: "var(--tesseract-fg-secondary)",
								fontFamily: "var(--tesseract-font-body)"
							},
							children: C
						})),
						T && (c ? /* @__PURE__ */ h("text", {
							transform: `translate(12,${H.y + H.h / 2}) rotate(-90)`,
							textAnchor: "middle",
							style: {
								fontSize: 11,
								fill: "var(--tesseract-fg-secondary)",
								fontFamily: "var(--tesseract-font-body)"
							},
							children: T
						}) : /* @__PURE__ */ h("text", {
							x: H.x + H.w / 2,
							y: i - 2,
							textAnchor: "middle",
							style: {
								fontSize: 11,
								fill: "var(--tesseract-fg-secondary)",
								fontFamily: "var(--tesseract-font-body)"
							},
							children: T
						})),
						j && se.map((e, t) => /* @__PURE__ */ h("rect", {
							x: c ? H.x : W(e),
							y: c ? W(e) : H.y,
							width: c ? H.w : W.bandwidth,
							height: c ? W.bandwidth : H.h,
							fill: "transparent",
							onMouseEnter: () => ie(t),
							onMouseLeave: () => ie(null)
						}, `h${t}`))
					]
				}), j && V != null && ge && t.length > 0 && /* @__PURE__ */ h(Uo, {
					x: ge.x,
					y: ge.y,
					containerWidth: R,
					title: se[V],
					rows: ae.map((e) => ({
						color: e.color,
						label: e.label,
						value: x(Number(t[V][e.key]))
					}))
				})]
			}),
			k !== "top" && K && /* @__PURE__ */ h("div", {
				style: { marginTop: 10 },
				children: K
			})
		]
	});
});
qo.displayName = "BarChart";
//#endregion
//#region src/components/charts/DonutChart/DonutChart.jsx
var Jo = e.forwardRef(function({ data: t = [], height: n = 240, size: r, innerRadius: i = .62, padAngle: a = 0, startAngle: o = 0, sort: s = "none", sliceStroke: c = 2, sliceStrokeColor: l = "var(--tesseract-bg-surface)", hoverExpand: u = 4, centerLabel: d, centerValueFormat: f, showCenter: p = !0, legend: m = "right", showPercent: _ = !0, showValue: v = !0, showTooltip: y = !0, colors: b, valueFormat: x = Eo, emptyText: S = "No data", className: C = "", style: w, ...T }, E) {
	let [D, O] = e.useState(null), k = t.map((e, t) => ({
		label: e.label,
		value: Number(e.value) || 0,
		color: e.color ?? Ao(t, b)
	}));
	s === "desc" ? k = [...k].sort((e, t) => t.value - e.value) : s === "asc" && (k = [...k].sort((e, t) => e.value - t.value));
	let A = po(k, (e) => e.value), j = r || n, M = j / 2, N = j / 2, P = j / 2 - (u + 4), F = Math.max(0, i) * P, I = F > 0, L = a * Math.PI / 180, ee = o * Math.PI / 180, te = f || x, ne = 0, R = k.map((e) => {
		let t = (A > 0 ? ne / A * Math.PI * 2 : 0) + ee;
		ne += e.value;
		let n = (A > 0 ? ne / A * Math.PI * 2 : 0) + ee;
		return {
			...e,
			a0: t,
			a1: n,
			pct: A > 0 ? e.value / A : 0
		};
	}), z = D == null ? A : R[D].value, B = D == null ? d ?? "Total" : R[D].label;
	return /* @__PURE__ */ g("div", {
		ref: E,
		className: U(C) || void 0,
		style: {
			display: "flex",
			flexDirection: m === "bottom" ? "column" : "row",
			alignItems: "center",
			gap: 20,
			flexWrap: "wrap",
			fontFamily: "var(--tesseract-font-body)",
			...w
		},
		...T,
		children: [t.length === 0 ? /* @__PURE__ */ h("div", {
			style: {
				width: j,
				height: j,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "var(--tesseract-fg-tertiary)",
				fontSize: 13
			},
			children: S
		}) : /* @__PURE__ */ g("div", {
			style: {
				position: "relative",
				width: j,
				height: j,
				flexShrink: 0
			},
			children: [
				/* @__PURE__ */ h("svg", {
					width: j,
					height: j,
					viewBox: `0 0 ${j} ${j}`,
					role: "img",
					style: { display: "block" },
					children: R.map((e, t) => {
						let n = e.a1 - e.a0;
						if (n <= 0) return null;
						let r = n > L ? L : 0;
						return /* @__PURE__ */ h("path", {
							d: To(M, N, D === t ? P + u : P, F, e.a0 + r / 2, e.a1 - r / 2),
							fill: e.color,
							stroke: l,
							strokeWidth: c,
							opacity: D == null || D === t ? 1 : .5,
							style: {
								transition: "opacity 120ms",
								cursor: "pointer"
							},
							onMouseEnter: () => O(t),
							onMouseLeave: () => O(null)
						}, t);
					})
				}),
				I && p && /* @__PURE__ */ g("div", {
					style: {
						position: "absolute",
						inset: 0,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						pointerEvents: "none"
					},
					children: [/* @__PURE__ */ h("div", {
						style: {
							fontSize: 22,
							fontWeight: 700,
							color: "var(--tesseract-fg-heading)",
							lineHeight: 1.1
						},
						children: te(z)
					}), /* @__PURE__ */ h("div", {
						style: {
							fontSize: 11,
							color: "var(--tesseract-fg-tertiary)",
							marginTop: 2,
							maxWidth: F * 1.7,
							textAlign: "center",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						},
						children: B
					})]
				}),
				!I && y && D != null && /* @__PURE__ */ h(Uo, {
					x: M,
					y: N,
					containerWidth: j,
					rows: [{
						color: R[D].color,
						label: R[D].label,
						value: `${x(R[D].value)} · ${Math.round(R[D].pct * 100)}%`
					}]
				})
			]
		}), m !== "none" && t.length > 0 && /* @__PURE__ */ h("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: 8,
				minWidth: 140,
				flex: m === "bottom" ? void 0 : 1
			},
			children: R.map((e, t) => /* @__PURE__ */ g("button", {
				type: "button",
				onMouseEnter: () => O(t),
				onMouseLeave: () => O(null),
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					background: "none",
					border: 0,
					padding: "2px 0",
					cursor: "default",
					textAlign: "left",
					opacity: D == null || D === t ? 1 : .5,
					transition: "opacity 120ms"
				},
				children: [
					/* @__PURE__ */ h("span", { style: {
						width: 10,
						height: 10,
						borderRadius: 3,
						background: e.color,
						flexShrink: 0
					} }),
					/* @__PURE__ */ h("span", {
						style: {
							fontSize: 12,
							color: "var(--tesseract-fg-secondary)",
							marginRight: "auto"
						},
						children: e.label
					}),
					v && /* @__PURE__ */ h("span", {
						style: {
							fontSize: 12,
							fontWeight: 600,
							color: "var(--tesseract-fg-primary)",
							fontVariantNumeric: "tabular-nums"
						},
						children: x(e.value)
					}),
					_ && /* @__PURE__ */ g("span", {
						style: {
							fontSize: 11,
							color: "var(--tesseract-fg-tertiary)",
							width: 34,
							textAlign: "right",
							fontVariantNumeric: "tabular-nums"
						},
						children: [Math.round(e.pct * 100), "%"]
					})
				]
			}, t))
		})]
	});
});
Jo.displayName = "DonutChart";
var Yo = e.forwardRef(function(e, t) {
	return /* @__PURE__ */ h(Jo, {
		ref: t,
		innerRadius: 0,
		showCenter: !1,
		...e
	});
});
Yo.displayName = "PieChart";
//#endregion
//#region src/components/charts/Sparkline/Sparkline.jsx
var Xo = e.forwardRef(function({ data: e = [], valueKey: t, width: n = 96, height: r = 28, color: i = Ao(0), strokeWidth: a = 1.5, curve: o = "smooth", area: s = !1, fillOpacity: c = .15, showLastDot: l = !0, markers: u = !1, dotColor: d, dotRadius: f, min: p, max: m, className: _, style: v, ...y }, b) {
	let x = e.map((e) => Number(t ? e[t] : e)), S = x.length, C = f ?? a + .5, w = a + (l || u ? C + 1 : 1), [T, E] = fo(x), D = p ?? T, O = m ?? E, k = ho([0, Math.max(1, S - 1)], [w, n - w]), A = D === O ? () => r / 2 : ho([D, O], [r - w, w]), j = x.map((e, t) => ({
		x: k(t),
		y: A(e)
	})), M = j[j.length - 1], N = d || i;
	return /* @__PURE__ */ g("svg", {
		ref: b,
		width: n,
		height: r,
		viewBox: `0 0 ${n} ${r}`,
		className: _,
		style: {
			display: "inline-block",
			verticalAlign: "middle",
			...v
		},
		role: "img",
		...y,
		children: [
			s && S > 1 && /* @__PURE__ */ h("path", {
				d: So(j, r - w + a, o),
				fill: i,
				fillOpacity: c,
				stroke: "none"
			}),
			S > 1 && /* @__PURE__ */ h("path", {
				d: xo(j, o),
				fill: "none",
				stroke: i,
				strokeWidth: a,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			u && j.map((e, t) => /* @__PURE__ */ h("circle", {
				cx: e.x,
				cy: e.y,
				r: C,
				fill: N
			}, t)),
			!u && l && M && /* @__PURE__ */ h("circle", {
				cx: M.x,
				cy: M.y,
				r: C,
				fill: N
			})
		]
	});
});
Xo.displayName = "Sparkline";
//#endregion
//#region src/components/charts/StatCard/StatCard.jsx
var Zo = {
	surface: {
		background: "var(--tesseract-bg-surface)",
		border: "1px solid var(--tesseract-border-soft)"
	},
	soft: {
		background: "var(--tesseract-bg-page-subtle)",
		border: "1px solid transparent"
	},
	outline: {
		background: "transparent",
		border: "1px solid var(--tesseract-border-neutral)"
	}
}, Qo = {
	sm: {
		pad: 14,
		value: 22,
		radius: 12,
		label: 12
	},
	md: {
		pad: 18,
		value: 30,
		radius: 16,
		label: 13
	}
}, $o = e.forwardRef(function({ label: e, value: t, format: n = (e) => typeof e == "number" ? Eo(e) : e, delta: r, deltaSuffix: i = "%", invertDelta: a = !1, trend: o, spark: s, sparkColor: c = Ao(0), sparkArea: l = !0, sparkCurve: u = "smooth", showSparkline: d = !0, sparkPosition: f = "bottom", icon: p, iconPosition: m = "left", footer: _, deltaPlacement: v = "header", variant: y = "surface", size: b = "md", align: x = "left", bordered: S = !0, className: C = "", style: w, ...T }, E) {
	let [D, O] = No(240), k = o || (r == null ? null : r > 0 ? "up" : r < 0 ? "down" : "flat"), A = k === "flat" || k == null ? null : k === "up" !== a, j = Qo[b] || Qo.md, M = Zo[y] || Zo.surface, N = x === "center", P = A == null ? "var(--tesseract-fg-tertiary)" : A ? "var(--tesseract-fg-success)" : "var(--tesseract-fg-error)", F = A == null ? "var(--tesseract-bg-page-subtle)" : A ? "var(--tesseract-bg-success-soft)" : "var(--tesseract-bg-error-soft)", I = k === "up" ? "M6 9.5V2.5M6 2.5 3 5.5M6 2.5l3 3" : k === "down" ? "M6 2.5v7M6 9.5 3 6.5M6 9.5l3-3" : null, L = (e) => {
		D.current = e, typeof E == "function" ? E(e) : E && (E.current = e);
	}, ee = r != null && /* @__PURE__ */ g("span", {
		style: {
			display: "inline-flex",
			alignItems: "center",
			gap: 2,
			padding: "2px 7px 2px 5px",
			borderRadius: 999,
			background: F,
			color: P,
			fontSize: 11.5,
			fontWeight: 600,
			lineHeight: 1,
			whiteSpace: "nowrap",
			fontVariantNumeric: "tabular-nums"
		},
		children: [
			I && /* @__PURE__ */ h("svg", {
				width: "12",
				height: "12",
				viewBox: "0 0 12 12",
				fill: "none",
				"aria-hidden": !0,
				children: /* @__PURE__ */ h("path", {
					d: I,
					stroke: "currentColor",
					strokeWidth: "1.6",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			}),
			Math.abs(r),
			i
		]
	}), te = p && /* @__PURE__ */ h("span", {
		style: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			width: 26,
			height: 26,
			borderRadius: 8,
			background: "var(--tesseract-bg-brand-soft)",
			color: "var(--tesseract-fg-link)",
			flexShrink: 0
		},
		children: p
	}), ne = v === "below" || m === "right", R = m === "right" ? te : !ne && !N ? ee : null, z = ne || N ? ee : null, B = d && s && s.length > 0, re = Math.max(60, O - j.pad * 2);
	return /* @__PURE__ */ g("div", {
		ref: L,
		className: U(C) || void 0,
		style: {
			display: "flex",
			flexDirection: "column",
			gap: 10,
			padding: j.pad,
			borderRadius: j.radius,
			background: M.background,
			border: S ? M.border : "1px solid transparent",
			fontFamily: "var(--tesseract-font-body)",
			minWidth: 180,
			boxSizing: "border-box",
			textAlign: N ? "center" : "left",
			...w
		},
		...T,
		children: [
			/* @__PURE__ */ g("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					justifyContent: N ? "center" : "space-between"
				},
				children: [/* @__PURE__ */ g("span", {
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: 8,
						minWidth: 0
					},
					children: [m === "left" && te, /* @__PURE__ */ h("span", {
						style: {
							fontSize: j.label,
							color: "var(--tesseract-fg-secondary)",
							fontWeight: 500,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						},
						children: e
					})]
				}), !N && R]
			}),
			/* @__PURE__ */ g("div", {
				style: {
					display: "flex",
					alignItems: "flex-end",
					justifyContent: N ? "center" : "space-between",
					gap: 12
				},
				children: [/* @__PURE__ */ g("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 6,
						alignItems: N ? "center" : "flex-start"
					},
					children: [/* @__PURE__ */ h("span", {
						style: {
							fontSize: j.value,
							fontWeight: 700,
							color: "var(--tesseract-fg-heading)",
							lineHeight: 1.05,
							letterSpacing: "-0.01em",
							fontVariantNumeric: "tabular-nums"
						},
						children: n(t)
					}), z]
				}), B && f === "side" && /* @__PURE__ */ h(Xo, {
					data: s,
					color: c,
					area: l,
					curve: u,
					width: 96,
					height: 40
				})]
			}),
			_ && /* @__PURE__ */ h("div", {
				style: {
					fontSize: 11.5,
					color: "var(--tesseract-fg-tertiary)"
				},
				children: _
			}),
			B && f === "bottom" && /* @__PURE__ */ h(Xo, {
				data: s,
				color: c,
				area: l,
				curve: u,
				width: re,
				height: 44,
				style: {
					marginTop: 2,
					display: "block"
				}
			})
		]
	});
});
$o.displayName = "StatCard";
//#endregion
//#region src/components/charts/RadarChart/RadarChart.jsx
function es(e, t) {
	return (e || []).map((e, n) => {
		let r = typeof e == "string" ? { key: e } : e;
		return {
			key: r.key,
			label: r.label ?? r.key,
			color: r.color ?? Ao(n, t)
		};
	});
}
var ts = e.forwardRef(function({ data: t = [], axisKey: n = "axis", series: r = [], height: i = 300, max: a, levels: o = 4, fillOpacity: s = .15, strokeWidth: c = 2, dot: l = !0, showGrid: u = !0, showAxisLabels: d = !0, showLegend: f = !0, showTooltip: p = !0, legendAlign: m = "center", colors: _, valueFormat: v = Eo, className: y = "", style: b, ...x }, S) {
	let C = es(r, _), [w, T] = e.useState(() => /* @__PURE__ */ new Set()), [E, D] = e.useState(null), O = C.filter((e) => !w.has(e.key)), k = t.map((e) => e[n]), A = k.length, j = i, M = j / 2, N = j / 2, P = Math.max(10, j / 2 - 46), F = mo(t.flatMap((e) => O.map((t) => Number(e[t.key])))), I = a ?? _o(0, F || 1, o).niceMax, L = (e) => e / Math.max(1, A) * Math.PI * 2, ee = (e, t) => wo(M, N, Math.max(0, Number(t)) / I * P, L(e)), te = (e) => A ? k.map((t, n) => {
		let r = ee(n, e(n));
		return `${r.x},${r.y}`;
	}).join(" ") : "", ne = (e) => {
		let t = C[e].key;
		T((e) => {
			let n = new Set(e);
			return n.has(t) ? n.delete(t) : n.size < C.length - 1 && n.add(t), n;
		});
	}, R = (e) => {
		if (!p || !A) return;
		let t = e.currentTarget.getBoundingClientRect(), n = e.clientX - t.left - M, r = e.clientY - t.top - N;
		if (Math.hypot(n, r) < P * .12) return D(null);
		let i = Math.atan2(n, -r);
		i < 0 && (i += Math.PI * 2), D(Math.round(i / (Math.PI * 2 / A)) % A);
	}, z = E == null ? null : wo(M, N, P + 4, L(E));
	return /* @__PURE__ */ g("div", {
		ref: S,
		className: U(y) || void 0,
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			gap: 10,
			fontFamily: "var(--tesseract-font-body)",
			...b
		},
		...x,
		children: [/* @__PURE__ */ g("div", {
			style: {
				position: "relative",
				width: j,
				height: j
			},
			children: [/* @__PURE__ */ g("svg", {
				width: j,
				height: j,
				viewBox: `0 0 ${j} ${j}`,
				role: "img",
				style: {
					display: "block",
					overflow: "visible"
				},
				children: [
					u && /* @__PURE__ */ g("g", {
						pointerEvents: "none",
						children: [Array.from({ length: o }, (e, t) => {
							let n = (t + 1) / o * P;
							return /* @__PURE__ */ h("polygon", {
								points: k.map((e, t) => {
									let r = wo(M, N, n, L(t));
									return `${r.x},${r.y}`;
								}).join(" "),
								fill: "none",
								stroke: "var(--tesseract-border-soft)",
								strokeWidth: 1
							}, t);
						}), k.map((e, t) => {
							let n = wo(M, N, P, L(t));
							return /* @__PURE__ */ h("line", {
								x1: M,
								y1: N,
								x2: n.x,
								y2: n.y,
								stroke: E === t ? "var(--tesseract-border-strong)" : "var(--tesseract-border-soft)",
								strokeWidth: 1
							}, t);
						})]
					}),
					O.map((e) => /* @__PURE__ */ g("g", { children: [/* @__PURE__ */ h("polygon", {
						points: te((n) => t[n][e.key]),
						fill: e.color,
						fillOpacity: s,
						stroke: e.color,
						strokeWidth: c,
						strokeLinejoin: "round"
					}), l && k.map((n, r) => {
						let i = ee(r, t[r][e.key]);
						return /* @__PURE__ */ h("circle", {
							cx: i.x,
							cy: i.y,
							r: 3,
							fill: e.color,
							stroke: "var(--tesseract-bg-surface)",
							strokeWidth: 1.5
						}, r);
					})] }, e.key)),
					d && k.map((e, t) => {
						let n = wo(M, N, P + 18, L(t)), r = Math.abs(n.x - M) < 2 ? "middle" : n.x > M ? "start" : "end";
						return /* @__PURE__ */ h("text", {
							x: n.x,
							y: n.y + 4,
							textAnchor: r,
							style: {
								fontSize: 11,
								fill: E === t ? "var(--tesseract-fg-secondary)" : "var(--tesseract-fg-tertiary)",
								fontFamily: "var(--tesseract-font-body)",
								fontWeight: E === t ? 600 : 400
							},
							children: e
						}, t);
					}),
					/* @__PURE__ */ h("rect", {
						x: 0,
						y: 0,
						width: j,
						height: j,
						fill: "transparent",
						onMouseMove: R,
						onMouseLeave: () => D(null)
					})
				]
			}), p && E != null && z && /* @__PURE__ */ h(Uo, {
				x: z.x,
				y: z.y,
				containerWidth: j,
				title: k[E],
				rows: O.map((e) => ({
					color: e.color,
					label: e.label,
					value: v(Number(t[E][e.key]))
				}))
			})]
		}), f && C.length > 0 && /* @__PURE__ */ h(zo, {
			items: C.map((e) => ({
				label: e.label,
				color: e.color,
				hidden: w.has(e.key)
			})),
			onToggle: ne,
			align: m
		})]
	});
});
ts.displayName = "RadarChart";
//#endregion
//#region src/components/charts/GaugeChart/GaugeChart.jsx
function ns(e, t, n, r, i) {
	let a = wo(e, t, n, r), o = wo(e, t, n, i), s = +(i - r > Math.PI);
	return `M${a.x},${a.y}A${n},${n} 0 ${s} 1 ${o.x},${o.y}`;
}
var rs = e.forwardRef(function({ value: e = 0, min: t = 0, max: n = 100, height: r = 180, arcDegrees: i = 240, thickness: a, rounded: o = !0, color: s = "var(--tesseract-blue-500)", trackColor: c = "var(--tesseract-slate-100)", segments: l, label: u, unit: d = "", valueFormat: f = (e) => Eo(e), showValue: p = !0, showRange: _ = !0, className: v = "", style: y, ...b }, x) {
	let S = r, C = S / 2, w = S * .52, T = S * .38, E = a ?? Math.max(6, S * .08), D = Math.min(300, Math.max(60, i)) * Math.PI / 180, O = -D / 2, k = Math.max(0, Math.min(1, (e - t) / (n - t || 1))), A = O + k * D, j = s;
	if (Array.isArray(l) && l.length) {
		let t = [...l].sort((e, t) => e.upTo - t.upTo);
		j = (t.find((t) => e <= t.upTo) || t[t.length - 1]).color;
	}
	let M = wo(C, w, T, O), N = wo(C, w, T, O + D);
	return /* @__PURE__ */ h("div", {
		ref: x,
		className: U(v) || void 0,
		style: {
			display: "inline-flex",
			flexDirection: "column",
			alignItems: "center",
			fontFamily: "var(--tesseract-font-body)",
			...y
		},
		...b,
		children: /* @__PURE__ */ g("div", {
			style: {
				position: "relative",
				width: S,
				height: S
			},
			children: [
				/* @__PURE__ */ g("svg", {
					width: S,
					height: S,
					viewBox: `0 0 ${S} ${S}`,
					role: "img",
					style: {
						display: "block",
						overflow: "visible"
					},
					children: [/* @__PURE__ */ h("path", {
						d: ns(C, w, T, O, O + D),
						fill: "none",
						stroke: c,
						strokeWidth: E,
						strokeLinecap: o ? "round" : "butt"
					}), k > .001 && /* @__PURE__ */ h("path", {
						d: ns(C, w, T, O, A),
						fill: "none",
						stroke: j,
						strokeWidth: E,
						strokeLinecap: o ? "round" : "butt"
					})]
				}),
				/* @__PURE__ */ g("div", {
					style: {
						position: "absolute",
						inset: 0,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						pointerEvents: "none"
					},
					children: [p && /* @__PURE__ */ g("div", {
						style: {
							fontSize: S * .2,
							fontWeight: 700,
							color: "var(--tesseract-fg-heading)",
							lineHeight: 1,
							fontVariantNumeric: "tabular-nums"
						},
						children: [f(e), d && /* @__PURE__ */ h("span", {
							style: {
								fontSize: S * .1,
								fontWeight: 600,
								color: "var(--tesseract-fg-tertiary)"
							},
							children: d
						})]
					}), u && /* @__PURE__ */ h("div", {
						style: {
							fontSize: 12,
							color: "var(--tesseract-fg-tertiary)",
							marginTop: 4
						},
						children: u
					})]
				}),
				_ && /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("span", {
					style: {
						position: "absolute",
						left: M.x,
						top: M.y + 6,
						transform: "translate(-50%,0)",
						fontSize: 11,
						color: "var(--tesseract-fg-tertiary)",
						fontVariantNumeric: "tabular-nums"
					},
					children: f(t)
				}), /* @__PURE__ */ h("span", {
					style: {
						position: "absolute",
						left: N.x,
						top: N.y + 6,
						transform: "translate(-50%,0)",
						fontSize: 11,
						color: "var(--tesseract-fg-tertiary)",
						fontVariantNumeric: "tabular-nums"
					},
					children: f(n)
				})] })
			]
		})
	});
});
rs.displayName = "GaugeChart";
//#endregion
//#region src/theme/defaultTheme.js
var is = (e) => ({
	50: e[0],
	100: e[1],
	200: e[2],
	300: e[3],
	400: e[4],
	500: e[5],
	600: e[6],
	700: e[7],
	800: e[8],
	900: e[9]
}), as = {
	colorScheme: "light",
	iconBaseUrl: O,
	breakpoints: {
		mobile: 0,
		tablet: 768,
		desktop: 1280
	},
	foundation: {
		colors: {
			blue: is([
				"#EEEEFF",
				"#D8D8FA",
				"#B5B4F2",
				"#8E8DE8",
				"#6C6BDE",
				"#4B4AD5",
				"#3C3BB5",
				"#2E2D96",
				"#212077",
				"#161558"
			]),
			violet: is([
				"#FAF5FE",
				"#EDDFF7",
				"#DBBFEF",
				"#C89FE7",
				"#BA7DE9",
				"#A461D8",
				"#8A4DBB",
				"#703A9E",
				"#572A81",
				"#3E1C64"
			]),
			amber: is([
				"#FFFBEB",
				"#FFF4CC",
				"#FFE8AE",
				"#FEDC85",
				"#FED15E",
				"#F5B832",
				"#D99B1A",
				"#B47D10",
				"#8F6008",
				"#6A4504"
			]),
			slate: {
				0: "#FFFFFF",
				...is([
					"#FAFAFB",
					"#F1F1F5",
					"#E2E2EA",
					"#D0D5DD",
					"#A2A2A8",
					"#717179",
					"#545460",
					"#454551",
					"#2C2C35",
					"#171725"
				])
			},
			success: is([
				"#ECFDF5",
				"#D1FAE5",
				"#A7F3D0",
				"#6EE7B7",
				"#34D399",
				"#10B981",
				"#059669",
				"#047857",
				"#065F46",
				"#064E3B"
			]),
			warning: is([
				"#FFFBEB",
				"#FEF3C7",
				"#FDE68A",
				"#FCD34D",
				"#FBBF24",
				"#F59E0B",
				"#D97706",
				"#B45309",
				"#92400E",
				"#78350F"
			]),
			error: is([
				"#FFF1F2",
				"#FFE4E6",
				"#FECDD3",
				"#FDA4AF",
				"#FB7185",
				"#E11D48",
				"#C8102E",
				"#9F1239",
				"#881337",
				"#4C0519"
			])
		},
		typography: {
			fontHeading: "\"Mulish\", system-ui, sans-serif",
			fontBody: "\"Inter\", system-ui, sans-serif",
			fontMono: "ui-monospace, SFMono-Regular, Menlo, monospace",
			weight: {
				regular: 400,
				medium: 500,
				semibold: 600,
				bold: 700,
				extrabold: 800
			},
			scale: {
				"display-xl": {
					size: "56px",
					lineHeight: "64px",
					weight: 800
				},
				display: {
					size: "48px",
					lineHeight: "56px",
					weight: 700
				},
				h1: {
					size: "36px",
					lineHeight: "44px",
					weight: 700
				},
				h2: {
					size: "30px",
					lineHeight: "38px",
					weight: 600
				},
				h3: {
					size: "24px",
					lineHeight: "32px",
					weight: 600
				},
				h4: {
					size: "20px",
					lineHeight: "28px",
					weight: 600
				},
				h5: {
					size: "16px",
					lineHeight: "24px",
					weight: 600
				},
				h6: {
					size: "14px",
					lineHeight: "20px",
					weight: 600
				},
				"body-base": {
					size: "16px",
					lineHeight: "24px",
					weight: 400
				},
				"body-sm": {
					size: "14px",
					lineHeight: "20px",
					weight: 400
				},
				"body-xs": {
					size: "12px",
					lineHeight: "18px",
					weight: 400
				},
				caption: {
					size: "12px",
					lineHeight: "16px",
					weight: 500
				},
				micro: {
					size: "10px",
					lineHeight: "12px",
					weight: 500
				}
			}
		},
		spacing: {
			"0.5": "2px",
			1: "4px",
			"1.5": "6px",
			2: "8px",
			3: "12px",
			4: "16px",
			5: "20px",
			6: "24px",
			8: "32px",
			10: "40px",
			12: "48px",
			16: "64px"
		},
		radius: {
			0: "0",
			4: "4px",
			6: "6px",
			8: "8px",
			10: "10px",
			12: "12px",
			16: "16px",
			20: "20px",
			24: "24px",
			full: "9999px"
		},
		shadow: {
			xs: "0 1px 2px 0 rgba(23,23,37,0.04)",
			sm: "0 1px 3px 0 rgba(23,23,37,0.08)",
			md: "0 4px 8px -2px rgba(23,23,37,0.08)",
			lg: "0 12px 24px -4px rgba(23,23,37,0.08)",
			xl: "0 20px 40px -8px rgba(23,23,37,0.12)",
			"2xl": "0 32px 64px -12px rgba(23,23,37,0.20)"
		}
	},
	components: {
		button: {
			radius: "10px",
			height: {
				sm: "36px",
				md: "42px",
				lg: "48px"
			},
			fontWeight: 600
		},
		input: {
			radius: "10px",
			height: {
				sm: "36px",
				md: "42px",
				lg: "48px"
			}
		},
		card: {
			radius: "12px",
			shadow: "0 1px 3px 0 rgba(23,23,37,0.08)"
		},
		badge: { radius: "9999px" },
		dropdown: {
			radius: "12px",
			shadow: "0 16px 32px -8px rgba(23,23,37,0.16)"
		}
	}
}, os = t({
	theme: as,
	colorScheme: "light",
	setColorScheme: () => {},
	breakpoint: "desktop",
	__provided: !1
});
function ss() {
	return i(os);
}
function cs() {
	return i(os).breakpoint;
}
function ls(e) {
	return i(os).theme.components?.[e] ?? {};
}
//#endregion
//#region src/theme/TesseractThemeProvider.jsx
var us = (e) => e && typeof e == "object" && !Array.isArray(e);
function ds(e, t) {
	if (!us(t)) return e;
	let n = Array.isArray(e) ? [...e] : { ...e };
	for (let r of Object.keys(t)) n[r] = us(e?.[r]) && us(t[r]) ? ds(e[r], t[r]) : t[r];
	return n;
}
var fs = [
	"#FFFFFF",
	"#FAFAFB",
	"#F1F1F5",
	"#E2E2EA",
	"#D0D5DD",
	"#A2A2A8",
	"#717179",
	"#545460",
	"#454551",
	"#2C2C35",
	"#171725"
], ps = [
	"0",
	"50",
	"100",
	"200",
	"300",
	"400",
	"500",
	"600",
	"700",
	"800",
	"900"
], ms = {
	blue: [
		"#EEEEFF",
		"#D8D8FA",
		"#B5B4F2",
		"#8E8DE8",
		"#6C6BDE",
		"#4B4AD5",
		"#3C3BB5",
		"#2E2D96",
		"#212077",
		"#161558"
	],
	violet: [
		"#FAF5FE",
		"#EDDFF7",
		"#DBBFEF",
		"#C89FE7",
		"#BA7DE9",
		"#A461D8",
		"#8A4DBB",
		"#703A9E",
		"#572A81",
		"#3E1C64"
	],
	success: [
		"#ECFDF5",
		"#D1FAE5",
		"#A7F3D0",
		"#6EE7B7",
		"#34D399",
		"#10B981",
		"#059669",
		"#047857",
		"#065F46",
		"#064E3B"
	],
	warning: [
		"#FFFBEB",
		"#FEF3C7",
		"#FDE68A",
		"#FCD34D",
		"#FBBF24",
		"#F59E0B",
		"#D97706",
		"#B45309",
		"#92400E",
		"#78350F"
	],
	error: [
		"#FFF1F2",
		"#FFE4E6",
		"#FECDD3",
		"#FDA4AF",
		"#FB7185",
		"#E11D48",
		"#C8102E",
		"#9F1239",
		"#881337",
		"#4C0519"
	]
}, hs = [
	50,
	100,
	200,
	300,
	400,
	500,
	600,
	700,
	800,
	900
], gs = (() => {
	let e = {};
	ps.forEach((t, n) => {
		e[`--tesseract-slate-${t}`] = fs[fs.length - 1 - n];
	});
	for (let [t, n] of Object.entries(ms)) [
		400,
		500,
		600,
		700
	].forEach((r) => {
		let i = hs.indexOf(r);
		e[`--tesseract-${t}-${r}`] = n[i - 2];
	});
	return Object.assign(e, {
		"--tesseract-blue-50": "rgba(75, 74, 213, 0.22)",
		"--tesseract-violet-50": "rgba(164, 97, 216, 0.20)",
		"--tesseract-success-50": "rgba(16, 185, 129, 0.16)",
		"--tesseract-warning-50": "rgba(245, 158, 11, 0.16)",
		"--tesseract-error-50": "rgba(225, 29, 72, 0.16)"
	}), e;
})();
function _s(e) {
	let t = {};
	return e?.button?.radius && (t["--tesseract-btn-radius"] = e.button.radius), e?.input?.radius && (t["--tesseract-input-radius"] = e.input.radius), e?.dropdown?.radius && (t["--tesseract-dropdown-radius"] = e.dropdown.radius), e?.badge?.radius && (t["--tesseract-badge-radius"] = e.badge.radius), t;
}
function vs(e, t, n, r) {
	let i = { colorScheme: e === "dark" ? "dark" : "light" };
	e === "dark" && Object.assign(i, gs);
	let a = t?.foundation?.colors;
	if (a) {
		for (let [e, t] of Object.entries(a)) if (us(t)) for (let [n, r] of Object.entries(t)) i[`--tesseract-${e}-${n}`] = r;
	}
	if (Object.assign(i, _s(t?.components)), n) for (let [e, t] of Object.entries(n)) i[e.startsWith("--") ? e : `--tesseract-${e}`] = t;
	return r && Object.assign(i, r), i;
}
function ys(t) {
	let [n, r] = e.useState(() => typeof window < "u" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	return e.useEffect(() => {
		if (t !== "system" || typeof window > "u" || !window.matchMedia) return;
		let e = window.matchMedia("(prefers-color-scheme: dark)"), n = () => r(e.matches ? "dark" : "light");
		return n(), e.addEventListener("change", n), () => e.removeEventListener("change", n);
	}, [t]), t === "system" ? n : t;
}
function bs(t) {
	let n = (e) => {
		let n = Object.keys(t)[0];
		for (let [r, i] of Object.entries(t)) e >= i && (n = r);
		return n;
	}, [r, i] = e.useState(() => typeof window < "u" ? n(window.innerWidth) : "desktop");
	return e.useEffect(() => {
		if (typeof window > "u") return;
		let e = () => i(n(window.innerWidth));
		return e(), window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, [JSON.stringify(t)]), r;
}
function xs({ theme: t, colorScheme: n = "light", tokens: r, vars: i, as: a = "div", rootTheme: o = !0, className: s, style: c, children: l, ...u }) {
	let d = !e.useContext(os).__provided, [f, p] = e.useState(null), m = ys(f ?? n);
	e.useEffect(() => {
		t?.iconBaseUrl && j(t.iconBaseUrl);
	}, [t?.iconBaseUrl]);
	let g = e.useMemo(() => ds(as, {
		...t,
		colorScheme: m
	}), [t, m]), _ = bs(g.breakpoints), v = e.useMemo(() => vs(m, t, r, i), [
		m,
		t,
		r,
		i
	]);
	e.useEffect(() => {
		if (!d || typeof document > "u") return;
		let e = document.documentElement, t = e.getAttribute("data-tp-theme"), n = e.style.colorScheme, r = Object.keys(v).filter((e) => e.startsWith("--")), i = {};
		return r.forEach((t) => {
			i[t] = e.style.getPropertyValue(t), e.style.setProperty(t, v[t]);
		}), o && (e.setAttribute("data-tp-theme", m), e.style.colorScheme = m === "dark" ? "dark" : "light"), () => {
			r.forEach((t) => {
				i[t] ? e.style.setProperty(t, i[t]) : e.style.removeProperty(t);
			}), o && (t ? e.setAttribute("data-tp-theme", t) : e.removeAttribute("data-tp-theme"), e.style.colorScheme = n);
		};
	}, [
		d,
		m,
		v,
		o
	]);
	let y = e.useMemo(() => ({
		theme: g,
		colorScheme: m,
		setColorScheme: p,
		breakpoint: _,
		__provided: !0
	}), [
		g,
		m,
		_
	]);
	return /* @__PURE__ */ h(os.Provider, {
		value: y,
		children: /* @__PURE__ */ h(a, {
			"data-tp-theme": m,
			className: s,
			style: {
				...v,
				...c
			},
			...u,
			children: l
		})
	});
}
xs.displayName = "TesseractThemeProvider";
//#endregion
//#region src/theme/createTheme.js
var Ss = (e) => e && typeof e == "object" && !Array.isArray(e);
function Cs(e, t) {
	if (!Ss(t)) return e;
	let n = Array.isArray(e) ? [...e] : { ...e };
	for (let r of Object.keys(t)) n[r] = Ss(e?.[r]) && Ss(t[r]) ? Cs(e[r], t[r]) : t[r];
	return n;
}
function ws(e) {
	let t = String(e).replace("#", ""), n = t.length === 3 ? t.split("").map((e) => e + e).join("") : t, r = parseInt(n, 16);
	return [
		r >> 16 & 255,
		r >> 8 & 255,
		r & 255
	];
}
var Ts = (e) => Math.max(0, Math.min(255, e));
function Es(e) {
	return "#" + e.map((e) => Ts(Math.round(e)).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function Ds(e, t, n) {
	let r = ws(e), i = ws(t);
	return Es(r.map((e, t) => e + (i[t] - e) * n));
}
var Os = "#FFFFFF", ks = "#000000";
function As(e) {
	return {
		50: Ds(e, Os, .92),
		100: Ds(e, Os, .84),
		200: Ds(e, Os, .68),
		300: Ds(e, Os, .48),
		400: Ds(e, Os, .24),
		500: e,
		600: Ds(e, ks, .16),
		700: Ds(e, ks, .32),
		800: Ds(e, ks, .48),
		900: Ds(e, ks, .62)
	};
}
var js = (e) => typeof e == "string" ? As(e) : e;
function Ms(e = {}) {
	let { brand: t, accent: n, success: r, warning: i, error: a, neutral: o, radius: s, fontBody: c, fontHeading: l, colorScheme: u, extend: d } = e, f = {};
	t && (f.blue = js(t)), n && (f.violet = js(n)), r && (f.success = js(r)), i && (f.warning = js(i)), a && (f.error = js(a)), o && (f.slate = {
		0: "#FFFFFF",
		...js(o)
	});
	let p = {};
	c && (p.fontBody = c), l && (p.fontHeading = l);
	let m = {};
	Object.keys(f).length && (m.colors = f), Object.keys(p).length && (m.typography = p);
	let h = {};
	if (Object.keys(m).length && (h.foundation = m), s != null) {
		let e = typeof s == "number" ? `${s}px` : s;
		h.components = {
			button: { radius: e },
			input: { radius: e },
			card: { radius: e },
			dropdown: { radius: e },
			badge: { radius: e }
		};
	}
	return u && (h.colorScheme = u), d ? Cs(h, d) : h;
}
//#endregion
//#region src/analytics/TPAnalyticsProvider.jsx
function Ns({ onTrack: t, context: n, disabled: r = !1, children: i }) {
	let a = e.useRef(t), o = e.useRef(n);
	e.useEffect(() => {
		a.current = t, o.current = n;
	});
	let s = !r && typeof t == "function", c = e.useMemo(() => ({
		enabled: s,
		track: (e) => {
			let t = a.current;
			if (r || typeof t != "function") return;
			let n = o.current || {};
			t({
				timestamp: Date.now(),
				...n,
				...e,
				meta: {
					...n.meta || {},
					...e?.meta || {}
				}
			});
		}
	}), [s, r]);
	return /* @__PURE__ */ h(oe.Provider, {
		value: c,
		children: i
	});
}
Ns.displayName = "TPAnalyticsProvider";
//#endregion
export { Pn as Accordion, Rn as AccordionContent, Fn as AccordionItem, Ln as AccordionTrigger, gi as Alert, Bt as AnimatedGrid, ke as Avatar, je as Badge, qo as BarChart, bi as Breadcrumb, G as Button, Si as Card, Ei as CardContent, Ti as CardDescription, Di as CardFooter, Ci as CardHeader, wi as CardTitle, cr as CellTag, rt as Checkbox, Ue as Chip, qr as ClinicalTable, pi as Command, gn as ConfirmDialog, sr as DataCell, mr as DataTable, La as DatePicker, za as DateRangePicker, Me as Divider, Jo as DonutChart, ei as Drawer, ci as DrawerBody, ni as DrawerClose, ii as DrawerContent, si as DrawerDescription, li as DrawerFooter, ai as DrawerHeader, oi as DrawerTitle, ti as DrawerTrigger, Sr as Dropdown, Ni as Empty, Qr as Filter, pt as FormControlLabel, rs as GaugeChart, da as Header, to as HeroBanner, O as ICON_BASE_DEFAULT, Qe as InputBox, et as InputOTP, Wt as LightRays, Go as LineChart, D as LoadingIndicator, Te as Logo, _e as MedicalIcon, _e as TPMedicalIcon, ji as Pagination, Yo as PieChart, Le as Progress, ts as RadarChart, ft as Radio, ut as RadioGroup, so as RxPadSection, $i as SecondarySidebar, uo as SectionCard, yt as SegmentedControl, Wi as Sidebar, Fe as Skeleton, _t as Slider, Xo as Sparkline, $o as StatCard, Ns as TPAnalyticsProvider, bt as TPIcon, z as TPLibraryIcon, St as TP_ICON_NAMES, xt as TP_ICON_VARIANTS, Ct as TP_LIBRARY_ICONS, dr as TableActions, Hn as Tabs, Gn as TabsContent, Un as TabsList, Wn as TabsTrigger, xs as TesseractThemeProvider, Jt as Toast, at as Toggle, wn as Tooltip, Dn as TooltipContent, Cn as TooltipProvider, En as TooltipTrigger, Ms as createTheme, as as defaultTheme, Eo as formatCompact, Oo as formatIndian, Do as formatNumber, A as getIconBaseUrl, R as iconPath, As as ramp, ge as resolveTPMedicalIconName, se as resolveTrack, j as setIconBaseUrl, me as tpMedicalIconNames, H as useAnalytics, cs as useBreakpoint, ls as useComponentTokens, ss as useTheme };
