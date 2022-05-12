const hashUrls = require("./hashUrls.json");

// setTimeout(() => {
//     dropdownListener();
// }, 1300)

// const getSelects = (value) => {
//         let drops = [],
//         dropdowns = $('.dropdown:visible').filter('.selection').each((i, item) => {

//         if ($(item).dropdown('get value') !== null) {
//             let $item = $(item).parent().children('.selection').children('select')

//             if (value !== null) {
//                 let str = {
//                     "id": $item.attr('data-ref') ? $item.attr('data-ref') : $item.prop('id') || `sel${i}`,
//                     "value": $(item).dropdown('get value')
//                 }
//                     drops.push(str);
//             }
//         }
//     })

//     setTimeout(() => {

//         let wHash =  window.location.hash.split('&')[0];

//             let uHash = drops.map((x) => {
//                 return `${x.id}=${x.value}`;
//             });

//             uHash = `${wHash}&${uHash.join('&')}`;

//             appState.countyHash = uHash;

//             if (uHash[uHash.length -1] == '&') {
//                 window.location.hash = window.location.hash
//             }

//             else {
//                 if (appState.NAV_ITEM != 'trends_dailycases') {
//                     window.location.hash = uHash;
//                 }
//             }

//     }, 500);
// }
// const dropdownListener = () => {
//     $('.dropdown').dropdown({
//         onChange: function(value) {
//             getSelects(value)
//         }
//     })

//     if (window.location.hash.includes('county-view')) {
//         setTimeout(() => {
//             $("#list_select_state").dropdown('set selected', 'Select a State')
//         }, 500);
//     }
// }

const storeHash = () => {
	document.addEventListener(
		"click",
		function (event) {
			if (event.target.type == "radio") {
				let r = $(
						'.radio-selection-container input[type="radio"]:checked:visible, .selectsED-container input[type="radio"]:checked:visible'
					),
					m = [...r].map(function (item) {
						return item.getAttribute("id");
					});
				appState.hash = window.btoa(m);
				setTimeout(() => {
					applyHash();
				}, 300);
			}
		},
		false
	);
};

document.addEventListener(
	"click",
	function (event) {
		if (event.target.type == "radio") {
			let r = $(
					'.radio-selection-container input[type="radio"]:checked:visible, .selectsED-container input[type="radio"]:checked:visible'
				),
				m = [...r].map(function (item) {
					return item.getAttribute("id");
				});
			appState.hash = window.btoa(m);
			setTimeout(() => {
				applyHash();
			}, 300);
		}
	},
	false
);

const applyHash = () => {
	prettyUrlfromHash();

	let urlHash = window.location.hash.split("_")[1];

	if (urlHash) {
		let prettyUrlObj = hashUrls.urls.filter(function (entry) {
			return entry.id == urlHash;
		});

		if (prettyUrlObj[0]) {
			let hashObj = window.atob(prettyUrlObj[0].hash).replace(/['"]+/g, "").split(",");

			hashObj.forEach((element) => {
				let stateCheck = setInterval(() => {
					if ($(`#${element}`).length) {
						clearInterval(stateCheck);
						$(`#${element}`).click();
						appState.hash = "";
					}
				}, 100);
			});
		}

		appState.prevTabHash = window.location.hash.split("_")[0];
	}
};

const prettyUrlfromHash = () => {
	if (appState.hash) {
		let prettyUrlObj = hashUrls.urls.filter(function (entry) {
			return entry.hash == appState.hash;
		});

		if (prettyUrlObj[0] && appState.NAV_ITEM != undefined) {
			window.location.hash = `${appState.NAV_ITEM.split("_")[0]}_${prettyUrlObj[0].id}`;
		} else if (appState.NAV_ITEM != undefined) {
			window.location.hash = `${appState.NAV_ITEM}`;
		}
	}
};

export { storeHash, applyHash, prettyUrlfromHash };
