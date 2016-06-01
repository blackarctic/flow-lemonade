(function () {

	let LemonadeStand = function () {
		let _prices;
		let _sold;
		let _remaining;
		let _cash;
		let _location;

		const _set_price = function(size, price) {
			_prices[size] = price;

			flow.view.action({
				name: "PRICE_UPDATE",
				data: {
					prices: _prices
				}
			})
		};

		const _sell = function (size) {
			if (_remaining - Number(size.slice(0, -2)) < 0) {
				return false;
			}
			if (!_prices.hasOwnProperty(size)) {
				return false;
			}
			_remaining -= Number(size.slice(0, -2));
			_cash += _prices[size];
			_sold[size] = _sold[size]+1 || 1;

			flow.view.action({
				name: "CASH_UPDATE",
				data: {
					cash: _cash
				}
			});

			return true;
		};

		const _action_purchase = function (action) {
			let size = action.data.size;
			if (_sell(size)) {
				flow.view.action({name: "CASH_UPDATE", data: { cash: _cash } });
			}
			else {
				flow.view.action({name: "SELL_ERROR"});
			}
		};

		const _action = function (action) {
			switch (action.name) {
				case "PURCHASE":
					_action_purchase(action);
					break;
			}
		};

		const _init = function (inventory, location) {
			_prices = {};
			_sold = {};
			_remaining = inventory || 100;
			_cash = 0;
			_location = location;

			flow.dispatcher.register("PURCHASE", _action);

			flow.view.action({
				name: "INIT",
				data: {
					cash: _cash,
					prices: _prices,
					location: _location,
				}
			})
		};
		_init.apply(this, arguments);

		return {
			set_price: _set_price,
			sell: _sell,
		};
	};



	var lemonade_stand = new LemonadeStand(200, "12 W Elm St.");
	lemonade_stand.set_price("8oz", 1.25);
	lemonade_stand.set_price("12oz", 1.75);
	lemonade_stand.set_price("16oz", 2.00);
})();