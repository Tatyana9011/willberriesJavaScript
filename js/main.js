const mySwiper = new Swiper('.swiper-container', {
	loop: true,
	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

//пишим корзину
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close')
const overlay = document.querySelector('.overlay');

const openModal = function (event) {
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

//Плавная прокрутка
// на все ссылки получаем клас что бы прикрутить к ним прокрутку
/* {
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (let i = 0; i < scrollLinks.length; i++) {
		scrollLinks[i].addEventListener('click', (event) => {
			event.preventDefault();  // убираем стандартное браузерное поведение - скачек
			const id = scrollLinks[i].getAttribute("href");
			document.querySelector(id).scrollIntoView({   // устанавливаем прокрутку (метод scrollIntoView не работает в старых браузерах)
				behavior: 'smooth', // тип прокрутки плавный 
				block: 'start',      // до куда прокрутка - в начало
			})
		})
	}
} */
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', (event) => {
			event.preventDefault();  // убираем стандартное браузерное поведение - скачек
			const id = scrollLink.getAttribute("href");
			document.querySelector(id).scrollIntoView({   // устанавливаем прокрутку (метод scrollIntoView не работает в старых браузерах)
				behavior: 'smooth', // тип прокрутки плавный 
				block: 'start',      // до куда прокрутка - в начало
			})
		})
	}
}

//товары
const more = document.querySelector(".more");
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const viewAll = document.querySelectorAll('.view-all');

const getGoods = async function () {
	const result = await fetch('./../db/db.json');
	if (!result.ok) {
		throw 'Ошибочка вышла' + result.status;  //какая ошибка 
	}
	return await result.json(); //метод json() превращает строку или масив в джейсон
};

const createCard = function ({label,img,name,description,id,price}) {
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

const renderCard = function(data){
	longGoodsList.textContent = '';    //очещаем верстку
	const cards = data.map(createCard);
/* 	cards.forEach(card => {
		longGoodsList.append(card)
	}); */
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
}

//ДЗ плавная прокрутка вверх
more.addEventListener('click', (event) => {
	event.preventDefault();
	getGoods().then(renderCard);
	const id = more.getAttribute("href");
			document.querySelector(id).scrollIntoView({   // устанавливаем прокрутку (метод scrollIntoView не работает в старых браузерах)
				behavior: 'smooth', // тип прокрутки плавный 
				block: 'start',      // до куда прокрутка - в начало
			})
 })

const filterCards = function (field, value) {
	getGoods()
		.then(function (data) {
			const filteredGoods = data.filter(function (good) {
				return good[field] === value;
			});
			return filteredGoods;
		})
		.then(renderCard);
}
//ДЗ фильтр товаров 
viewAll.forEach(link => {
	link.addEventListener('click', () => {
		const value = link.dataset.field;
		console.log(value);
			filterCards("category", value);
	})
})
//ДЗ добавила условие для кнопки показать все
navigationLink.forEach(link => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		const field = link.dataset.field;   // что бы получить датаатрибут у линка
		const value = link.textContent;
		console.log(field, value);
		if (field) {
			filterCards(field, value);
		}else{
		getGoods().then(renderCard);
		}
	})
})