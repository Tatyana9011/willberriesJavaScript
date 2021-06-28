document.addEventListener('DOMContentLoaded', () => {//чтобы прокрутка сработала после загрузки контента
	//пишим корзину
	const buttonCart = document.querySelector('.button-cart');
	const modalCart = document.querySelector('#modal-cart');
	const modalClose = document.querySelector('.modal-close')
	const overlay = document.querySelector('.overlay');
	const more = document.querySelector(".more");
	const navigationLink = document.querySelectorAll('.navigation-link');
	//const navigationLink = document.querySelectorAll('.navigation-link[data-field]');  выбирает все с дата атрибутом
	//const navigationLink = document.querySelectorAll('.navigation-link:not(.view-all)');  такой способ исключает класс с выборки
	const longGoodsList = document.querySelector('.long-goods-list');
	const viewAll = document.querySelectorAll('.view-all');
	const cartTableGoods = document.querySelector('.cart-table__goods');
	const cardTableTotal = document.querySelector('.card-table__total');
	const cartCount = document.querySelector('.cart-count');
	const clearTable = document.querySelector('.clear-table');
	//товары Можно поставить еще таймер для обновления данных по времени
	const checkGoods = () => { //так работает без лишней загрузки с сервера
		const data = [];

	return async () => {
		if (data.length) return data;

		const result = await fetch('./../db/db.json');
		if (!result.ok) {
			throw 'Ошибочка вышла' + result.status;  //какая ошибка 
		}
		data.push(...(await result.json())); //метод json() превращает строку или масив в джейсон
		return data
	};
	}
	const getGoods = checkGoods();

	const cart = {
		cartGoods: [],
		countQuantity() {
			cartCount.textContent=this.cartGoods.reduce((sum, item) => {
				return sum +item.count;
			},0)//первым аргументом обьявляем 0
		},
		clearCart() {
			this.cartGoods.length=0;
			this.countQuantity();
			this.renderGoodCard();
		},
		renderGoodCard() {
			cartTableGoods.textContent = ''; //очишаем поля корзины
			this.cartGoods.forEach(({ id, name, price, count }) => {  //перебираем обьекты карточек и создаем строки в корзине
				const trGood = document.createElement('tr');
				trGood.className = 'cart-item';
				trGood.dataset.id = id;
				trGood.innerHTML = `
					<td>${name}</td>
					<td>${price}$</td>
					<td><button class="cart-btn-minus" >-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus" >+</button></td>
					<td>${price * count}$</td>
					<td><button class="cart-btn-delete" >x</button></td>
			`;
				cartTableGoods.append(trGood) // попорядку будем вставлять на страницу
			});
			const totalPrice = this.cartGoods.reduce((sum, item) => {
				return sum + item.price * item.count;
			}, 0)
			cardTableTotal.textContent = totalPrice + '$';
		},//slace splase не получится они работают с простыми типами данных
		deleteGood(id) {
			this.cartGoods = this.cartGoods.filter(item => id !== item.id)  //если выражение тру тогда попадет в массив
			this.renderGoodCard()
			this.countQuantity();
		},
		minusGood(id) {
			for (const item of this.cartGoods) {
				if (item.id === id) {
					if (item.count <= 1) {
						this.deleteGood(id)
					} else {
						item.count--;
					}
					break;
				}
			}
			this.renderGoodCard();
			this.countQuantity();
		},
		plusGood(id) {
			for (const item of this.cartGoods) {
				if (item.id === id) {
					item.count++;
					break;
				}
			}
			this.renderGoodCard();
			this.countQuantity();
		},
		addCardGoods(id) {
			//если елемент уже в корзине и выводим его если есть по прибавляем количество
			const gootItem = this.cartGoods.find(item => item.id === id);//ишет подходящий елемент в корзине
			if (gootItem) {
				this.plusGood(id)
			} else {
				getGoods()
					.then(data => data.find(item => item.id === id))
					.then(({ id, name, price }) => {
						this.cartGoods.push({
							id,
							name,
							price,
							count: 1
						})
						this.countQuantity();
					})
			}
		},
	}

	document.body.addEventListener('click', event => {
		const addToCart = event.target.closest('.add-to-cart');
		if (addToCart) {
			cart.addCardGoods(addToCart.dataset.id);
		}
	})
	clearTable.addEventListener('click', cart.clearCart.bind(cart))

	cartTableGoods.addEventListener('click', event => {
		const target = event.target;
		if (target.classList.contains('cart-btn-delete')) {
			const parent = target.closest('.cart-item') //проверяем есть ли у родителя таргета класс если есть то удаляем
			cart.deleteGood(parent.dataset.id); //можно target.dataset.id и добавить в каждое поле data-id='${id}'
		}
		if (target.classList.contains('cart-btn-minus')) {
			const id = target.closest('.cart-item').dataset.id;
			cart.minusGood(id);
		}
		if (target.classList.contains('cart-btn-plus')) {
			const id = target.closest('.cart-item').dataset.id;
			cart.plusGood(id);
		}
	})

	const openModal = function (event) {
		cart.renderGoodCard();
		modalCart.classList.add('show');
		document.addEventListener('keydown', escapeHandler);
	}
	const closeModal = function () {
		modalCart.classList.remove('show');
		document.removeEventListener('keydown', escapeHandler);
	}
	const escapeHandler = (event) => {
		if (event.code === 'Escape') {
			closeModal();
		}
	}
	overlay.addEventListener('click', (event) => {
		const target = event.target;
		if (target.classList.contains('modal-close') || target.classList.contains('overlay')) {
			closeModal();
		}
	})

	buttonCart.addEventListener('click', openModal);

	const createCard = function ({ label, img, name, description, id, price }) {
		const card = document.createElement('div');
		card.className = 'col-lg-3 col-sm-6';  //можно и через класлист эдд  через запятую добавить классы
	
		card.innerHTML = `
	<div class="goods-card">
						${label ?
				`<span class="label">${label}</span>` :
				''}
						<img src="db/${img}" alt="${name}" class="goods-image">
						<h3 class="goods-title">${name}</h3>
						<p class="goods-description">${description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${id}">
							<span class="button-price">$${price}</span>
						</button>
					</div>`;
		return card;
	}

	const renderCard = function (data) {
		longGoodsList.textContent = '';    //очещаем верстку
		const cards = data.map(createCard);
		/* 	cards.forEach(card => {
				longGoodsList.append(card)
			}); */
		longGoodsList.append(...cards);
		document.body.classList.add('show-goods');
	}

	more.addEventListener('click', (event) => {
		getGoods().then(renderCard);
		event.preventDefault();
	})

	const filterCards = function (field, value) {
		getGoods()
			.then(data => data.filter(good => good[field] === value))
			.then(renderCard);
	}
	//ДЗ2 фильтр товаров была коррекция верстки
	viewAll.forEach(link => {
		link.addEventListener('click', () => {
			event.preventDefault()
			const value = link.dataset.field;
			filterCards("category", value);
		})
	})
	//ДЗ2 добавила условие для кнопки показать все
	navigationLink.forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			const field = link.dataset.field;   // что бы получить датаатрибут у линка
			const value = link.textContent;
			if (field) {
				filterCards(field, value);
			} else {
				getGoods().then(renderCard);
			}
		})
	})
})