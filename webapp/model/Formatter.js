sap.ui.define(function() {
	"use strict";

	var Formatter = {

        unavailableText : function (unavailable) {
			if (unavailable === null || unavailable === undefined) {
				return "";
			} else if (unavailable) {
				return "Nope";
			} else {
				return "Yes";
			}
		},

		unavailableState :  function (unavailable) {
			if (unavailable === null || unavailable === undefined) {
				return "None";
			} else if (unavailable) {
				return "Error";
			} else {
				return "Success";
			}
		}
	};

	return Formatter;

}, /* bExport= */ true);
