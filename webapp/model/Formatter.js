sap.ui.define(function() {
	"use strict";

	var Formatter = {

        availableText : function (available) {
			if (available === null || available === undefined) {
				return "";
			} else if (available) {
				return "Yes";
			} else {
				return "Nope";
			}
		},

		availableState :  function (available) {
			if (available === null || available === undefined) {
				return "None";
			} else if (available) {
				return "Success";
			} else {
				return "Error";
			}
		}
	};

	return Formatter;

}, /* bExport= */ true);
