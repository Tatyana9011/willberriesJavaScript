
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
	 //если добавить класс .scroll-link и в верстку добавить "href" то плавная прокрутка будет работать
		const scrollLinks = document.querySelectorAll('.scroll-link');
		//сетТаймаут не сработал
	
		for (const scrollLink of scrollLinks) {
			scrollLink.addEventListener('click', event => {
				event.preventDefault();  // убираем стандартное браузерное поведение - скачек
				const id = scrollLink.getAttribute("href");
				document.querySelector(id).scrollIntoView({   // устанавливаем прокрутку (метод scrollIntoView не работает в старых браузерах)
					behavior: 'smooth', // тип прокрутки плавный 
					block: 'start',      // до куда прокрутка - в начало
				});
			});
		}
	
}


