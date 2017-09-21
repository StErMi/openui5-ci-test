/* global QUnit */

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/demo/todo/test/integration/pages/App"
], function (opaTest) {
	"use strict";

	QUnit.module("Todo List");

	opaTest("should add an item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewProductAndPressEnter("Asus ROG Strix RX570 4GB", 3, 100, false);

		// Assertions
		Then.onTheAppPage.iShouldSeeTheItemBeingAdded(3, "Asus ROG Strix RX570 4GB").
			and.iTeardownTheApp();
	});

	opaTest("should remove a completed item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewProductAndPressEnter("Asus ROG Strix RX570 4GB", 3, 100, false)
			.and.iSelectAllItems(true)
			.and.iClearTheUnavailableItems()
			.and.iEnterTextForNewProductAndPressEnter("Asus ROG Strix RX570 8GB", 3, 100, false);

		// Assertions
		Then.onTheAppPage.iShouldSeeAllButOneItemBeingRemoved("Asus ROG Strix RX570 8GB").
			and.iTeardownTheApp();
	});

	opaTest("should select an item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewProductAndPressEnter("Asus ROG Strix RX570 4GB", 3, 100, false)
			.and.iSelectTheLastItem(true);

		// Assertions
		Then.onTheAppPage.iShouldSeeTheLastItemBeingUnavailable(true).
			and.iTeardownTheApp();
	});

	opaTest("should unselect an item", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewProductAndPressEnter("Asus ROG Strix RX570 4GB", 3, 100, false)
			.and.iSelectAllItems(true)
			.and.iClearTheUnavailableItems()
			.and.iEnterTextForNewProductAndPressEnter("Asus ROG Strix RX570 8GB", 3, 100, false)
			.and.iSelectTheLastItem(true)
			.and.iSelectTheLastItem(false);

		// Assertions
		Then.onTheAppPage.iShouldSeeTheLastItemBeingUnavailable(false).
			and.iTeardownTheApp();
	});

	opaTest("should show correct count for completed items", function (Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheAppPage.iEnterTextForNewProductAndPressEnter("Asus ROG Strix RX570 4GB", 3, 100, false)
			.and.iSelectAllItems(true)
			.and.iClearTheUnavailableItems()
			.and.iEnterTextForNewProductAndPressEnter("Asus ROG Strix RX570 8GB", 3, 100, false)
			.and.iSelectTheLastItem(true)
			.and.iEnterTextForNewProductAndPressEnter("EVGA 1080TI 8GB", 3, 100, false)
			.and.iEnterTextForNewProductAndPressEnter("EVGA 1080TI 4GB", 3, 100, false)
			.and.iSelectTheLastItem(true);

		// Assertions
		Then.onTheAppPage.iShouldSeeTotalValuePrice(300).
		and.iTeardownTheApp();
	});

});
