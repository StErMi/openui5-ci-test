sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/mvc/Controller",
	"sap/ui/demo/todo/controller/App.controller",
	"sap/ui/demo/todo/model/Formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(ManagedObject, Controller, AppController, Formatter, JSONModel/*, sinon, sinonQunit*/) {
	"use strict";

	QUnit.module("Test model modification", {

		beforeEach: function() {

			this.oAppController = new AppController();
			this.oViewStub = new ManagedObject({});
			sinon.stub(Controller.prototype, "getView").returns(this.oViewStub);

			this.oJSONModelStub = new JSONModel({
				products: []
			});
			this.oViewStub.setModel(this.oJSONModelStub);
		},

		afterEach: function() {
			Controller.prototype.getView.restore();

			this.oViewStub.destroy();
		}
	});
	
	QUnit.test("Test unavailable text formatter", function(assert) {
		// Arrange
		// initial assumption: to-do list is empty
		assert.strictEqual(this.oJSONModelStub.getObject('/products').length, 0, "There must be no products defined.");

		// Act
		var fnIsolatedFormatter = Formatter.unavailableText.bind(this.oAppController);

		// Assumption
		assert.strictEqual(fnIsolatedFormatter(true), "Nope", "Formatted text for unavailable items is correct");
		assert.strictEqual(fnIsolatedFormatter(false), "Yes", "Formatted text for available items is correct");
		assert.strictEqual(fnIsolatedFormatter(null), "", "Formatted text for null items is correct");
	});
	
	QUnit.test("Test unavailable text status formatter", function(assert) {
		// Arrange
		// initial assumption: to-do list is empty
		assert.strictEqual(this.oJSONModelStub.getObject('/products').length, 0, "There must be no products defined.");

		// Act
		var fnIsolatedFormatter = Formatter.unavailableState.bind(this.oAppController);

		// Assumption
		assert.strictEqual(fnIsolatedFormatter(true), "Error", "Formatted text for unavailable items is correct");
		assert.strictEqual(fnIsolatedFormatter(false), "Success", "Formatted text for available items is correct");
		assert.strictEqual(fnIsolatedFormatter(null), "None", "Formatted text for null items is correct");
	});

	QUnit.test("Should add a product element to the model", function(assert) {
		// Arrange
		// initial assumption: to-do list is empty
		assert.strictEqual(this.oJSONModelStub.getObject('/products').length, 0, "There must be no products defined.");

		// Act
		this.oJSONModelStub.setProperty('/newProduct', {
			"name": "This is just a test product",
			"quantity": 1,
			"price": 99,
			"currency": "EUR",
			"unavailable": false
		});
		this.oAppController.onAddNewProduct();

		// Assumption
		assert.strictEqual(this.oJSONModelStub.getObject('/products').length, 1, "There is one new item.");
	});

	QUnit.test("Should toggle the unavailable items in the model", function(assert) {
		// Arrange
		var oModelData = {
			products: [{
				"name": "This is just a test product",
				"quantity": 1,
				"price": 99,
				"currency": "EUR",
				"unavailable": false
			}, {
				"name": "This is just a test product 2",
				"quantity": 1,
				"price": 100,
				"currency": "EUR",
				"unavailable": false
			}],
			totalValue: 199
		};
		this.oJSONModelStub.setData(oModelData);


		// Initial assumption
		assert.strictEqual(this.oJSONModelStub.getObject('/products').length, 2, "There are two items.");
		assert.strictEqual(this.oJSONModelStub.getProperty('/totalValue'), 199, "Total value is 199 EURO.");

		// Act
		this.oJSONModelStub.setProperty("/products/0/unavailable", true);
		this.oAppController.updateTotalValue();

		// Assumption
		assert.strictEqual(this.oJSONModelStub.getProperty('/totalValue'), 100, "There is just one item available priced 100.");
	});

	QUnit.test("Should remove unavailable products", function(assert) {
		// Arrange
		var oModelData = {
			products: [{
				"name": "This is just a test product",
				"quantity": 1,
				"price": 99,
				"currency": "EUR",
				"unavailable": false
			}, {
				"name": "This is just a test product 2",
				"quantity": 1,
				"price": 100,
				"currency": "EUR",
				"unavailable": true
			}],
			totalValue: 99
		};
		this.oJSONModelStub.setData(oModelData);


		// initial assumption
		assert.strictEqual(this.oJSONModelStub.getObject('/products').length, 2, "There are two items.");
		assert.strictEqual(this.oJSONModelStub.getProperty('/totalValue'), 99, "Total value is 99 EURO.");

		// Act
		this.oAppController.clearUnavailable();
		this.oAppController.updateTotalValue();

		// Assumption
		assert.strictEqual(this.oJSONModelStub.getObject('/products').length, 1, "There are two items.");
		assert.strictEqual(this.oJSONModelStub.getProperty('/totalValue'), 99, "Total value is 99 EURO.");
	});

});
