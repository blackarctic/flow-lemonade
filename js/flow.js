
let flow = (function () {

	let dispatcher = (function () {

		let _actions;

		const _action = function(action) {
			if (_actions.hasOwnProperty(action.name)) {
				_handlers = _actions[action.name];
				_handlers.forEach(handler => handler(action));
			}
		};

		const _register = function (name, handler) {
			if (_actions.hasOwnProperty(name)) {
				_actions[action.name].push(handler);
			}
			else {
				_actions[name] = [handler];
			}
		};

		const _init = function () {
			_actions = {};
		};
		_init.apply(this, arguments);

		return {
			action: _action,
			register: _register,
		};

	})();



	let view = (function () {

		const _action_init = function (action) {
			let location = action.data.location;
			_action_cash_update(action);
			_action_price_update(action);
			$(".location").html(location);
		};

		const _action_cash_update = function (action) {
			let cash = action.data.cash;
			$(".sales_amount").html(`$${cash}`);
		};

		const _action_price_update = function (action) {
			let prices = action.data.prices;
			$(".prices").html("");
			$(".purchase_buttons").html("");
			for (size in prices) {
				let price = prices[size];
				$(".prices").append(`<li>${size} : $${price}</li>`);
				$(".purchase_buttons").append(`<div class="row"><button data-size="${size}">buy ${size} lemonade</button></div>`);
			}
			_bind_purchase_buttons();
		};

		const _action_sell_error = function (action) {
			alert("Sorry. We cannot fulfill that order at this time.");
		}

		const _action = function (action) {
			switch (action.name) {
				case "INIT":
					_action_init(action);
					break;
				case "CASH_UPDATE":
					_action_cash_update(action);
					break;
				case "PRICE_UPDATE":
					_action_price_update(action)
					break;
				case "SELL_ERROR":
					_action_sell_error(action);
					break;
			}
		};

		const _bind_purchase_buttons = function () {
			$(".purchase_buttons button").unbind("click");
			$(".purchase_buttons button").bind("click", function () {
				let size = $(this).attr("data-size");
				flow.dispatcher.action({name: "PURCHASE", data: { size }});
			});
		}

		const _bind = function () {
			_bind_purchase_buttons();
		};

		const _init = function () {

		};
		_init.apply(this, arguments);

		return {
			action: _action,
		};

	})();

	return {
		dispatcher,
		view
	}

})();



