sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/demo/todo/model/Formatter',
], function(Controller, JSONModel, Filter, FilterOperator, Formatter) {
	'use strict';

	return Controller.extend('sap.ui.demo.todo.controller.App', {

		/**
		 * Init controller
		 */
		onInit: function() {
			this.aSearchFilters = [];
			this.aTabFilters = [];
		},

		/**
		 * Adds a new todo item to the bottom of the list.
		 */
		onAddNewProduct: function() {
			var oModel = this.getView().getModel();
			var aProducts = jQuery.extend(true, [], oModel.getProperty('/products'));
			var oEmptyProduct = jQuery.extend(true, {}, oModel.getProperty('/emptyProduct'));
			var oNewProduct = jQuery.extend(true, {}, oModel.getProperty('/newProduct'));

			aProducts.push(oNewProduct);

			oModel.setProperty('/products', aProducts);
			oModel.setProperty('/newProduct', oEmptyProduct);
		},

		/**
		 * Removes all completed unavailable products from the list
		 */
		clearUnavailable: function() {
			var oModel = this.getView().getModel();
			var aProducts = jQuery.extend(true, [], oModel.getProperty('/products'));

			var i = aProducts.length;
			while (i--) {
				var oProduct = aProducts[i];
				if (!oProduct.available) {
					aProducts.splice(i, 1);
				}
			}

			oModel.setProperty('/products', aProducts);
		},


		/**
		 * Update total values counting only available products
		 */
		updateTotalValue: function() {
			var oModel = this.getView().getModel();
			var aProducts = oModel.getProperty('/products') || [];

			var dTotalValue = 0;
			aProducts.forEach(function(oProduct) {
				dTotalValue += oProduct.available ? oProduct.price * oProduct.quantity : 0;
			});

			oModel.setProperty('/totalValue', dTotalValue);
		},

		/**
		 * Trigger search for specific items. The removal of items is disable as long as the search is used.
		 * @param {sap.ui.base.Event} oEvent Input changed event
		 */
		onSearch: function(oEvent) {
			var oModel = this.getView().getModel();

			// First reset current filters
			this.aSearchFilters = [];

			// add filter for search
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oModel.setProperty('/itemsRemovable', false);
				var filter = new Filter("name", FilterOperator.Contains, sQuery);
				this.aSearchFilters.push(filter);
			} else {
				oModel.setProperty('/itemsRemovable', true);
			}

			this._applyListFilters();
		},

		/**
		 * Filter products based on available status
		 * @param {sap.ui.base.Event} oEvent Input changed event
		 */
		onFilterAvailable: function(oEvent) {

			// First reset current filters
			this.aTabFilters = [];

			// add filter for search
			var sFilterKey = oEvent.getParameter("key");

			// eslint-disable-line default-case
			switch (sFilterKey) {
				case "available":
					this.aTabFilters.push(new Filter("available", FilterOperator.EQ, true));
					break;
				case "not-available":
					this.aTabFilters.push(new Filter("available", FilterOperator.EQ, false));
					break;
				case "all":
				default:
					// Don't use any filter
			}

			this._applyListFilters();
		},

		/**
		 * Apply filters
		 */
		_applyListFilters: function() {
			var oList = this.byId("productList");
			var oBinding = oList.getBinding("items");

			oBinding.filter(this.aSearchFilters.concat(this.aTabFilters), "todos");
		}

	});

});
