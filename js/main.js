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
	if (target.classList.contains('modal-close') || target === modalCart) {
		closeModal();
	}
})

buttonCart.addEventListener('click', openModal);

//Плавная прокрутка
// на все ссылки получаем клас что бы прикрутить к ним прокрутку
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

for (let i = 0; i < scrollLinks.length; i++){
	scrollLinks[i].addEventListener('click', (event) => {
		event.preventDefault();  // убираем стандартное браузерное поведение - скачек
		const id = scrollLinks[i].getAttribute("href");
		document.querySelector(id).scrollIntoView({   // устанавливаем прокрутку (метод scrollIntoView не работает в старых браузерах)
			behavior: 'smooth', // тип прокрутки плавный 
			block:'start',      // до куда прокрутка - в начало
		}) 
	})
	}
}
