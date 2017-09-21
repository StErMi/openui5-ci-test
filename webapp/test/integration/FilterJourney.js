/* global QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/demo/todo/test/integration/pages/App"
], function (opaTest) {
	"use strict";

	QUnit.module("Filter");

	opaTest("should show correct items when filtering for 'Available' items", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iFilterForItems("available");

		// Assertions
		Then.onTheAppPage.iShouldSeeItemCount(1).
			and.iTeardownTheApp();
	});

	opaTest("should show correct items when filtering for 'Unavailable' items", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iFilterForItems("not-available");

		// Assertions
		Then.onTheAppPage.iShouldSeeItemCount(1).
			and.iTeardownTheApp();
	});

	opaTest("should show correct items when filtering for 'Unavailable' items and switch back to 'All'", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iFilterForItems("not-available");

		// Assertions
		Then.onTheAppPage.iShouldSeeItemCount(1);

		//Actions
		When.onTheAppPage.iFilterForItems("all");

		// Assertions
		Then.onTheAppPage.iShouldSeeItemCount(2).
			and.iTeardownTheApp();
	});

});
