
const score = document.querySelector('.score'),
      game = document.querySelector('.game'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea');

const car = document.createElement('div');

car.classList.add('car');

    //   управление 
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// начальные настройки
const setting = {
    start: false,
    score: 0,
    speed: 9,
    traffic: 3
};

function getQuantityElements(elementHeight){ //высчитываем сколько объектов линий можно поместить на дорогу исходя из высоты документа
   return document.documentElement.clientHeight / elementHeight + 1;//получем высоту документа, кол-во линий на документ +1
}



start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function startGame () {
    event.preventDefault();
    start.classList.add('hide'); //обновление страницы для повторной игры
    gameArea.innerHTML = '';
    for (let i = 0; i < getQuantityElements(100); i++){ //создаём разментку на дороге
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){//создаём препятствия
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);//расчитываем расстояние между объектами * (i + 1)
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50 )) + 'px';//случайное расположение препятствий
        let skinEnemyCar = Math.floor(Math.random() * 10);//случайный выбор скина авто
        if(skinEnemyCar <= 5) {
            enemy.style.background = 'transparent url(./img/enemy2.png) center / cover no-repeat';
        }
        enemy.style.top = enemy.y + 'px';
        gameArea.appendChild(enemy);
    }

    setting.score = 0; // обнуляем при старте очки
    setting.start = true;
    gameArea.appendChild(car);
    car.style.top = 'auto';//возврат машинки на место
    car.style.bottom = '10px'; 
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2; //расчёт координат машинки
    setting.x = car.offsetLeft; //получаем координаты объекта от левой стороны
    setting.y = car.offsetTop; //получаем координаты объекта от верха до начала объекта (до переднего бампера)
    requestAnimationFrame(playGame);
};

function playGame () {

    if (setting.start === true) {
        setting.score += setting.speed;
        score.innerHTML = "SCORE: <br>" + setting.score;
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
            car.style.transform = 'rotate(345deg)';
        } else {
            car.style.transform = 'rotate(0deg)'
        }

        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
            car.style.transform = 'rotate(15deg)';
        } 

        if(keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }  
}

function startRun () {
    event.preventDefault();
    
    keys[event.key] = true;
};

function stopRun () {
    event.preventDefault();
    keys[event.key] = false;
};

function moveRoad (){
    let lines = document.querySelectorAll('.line')
    lines.forEach(function(line){ //перебирает псевдомассив с поосками на дороге
        line.y += setting.speed; //меняем скорость движения полосок на дороге
        line.style.top = line.y + 'px';//добавляем в стили

        if (line.y >= document.documentElement.clientHeight) { //проверяем высоту нашего документа
            line.y = -100; //возвращаем обратно
        }
    });
}

function moveEnemy () {
    let enemy = document.querySelectorAll('.enemy')

    enemy.forEach(function(item){ //перебирает псевдомассив с машинами на дороге
        let carRect = car.getBoundingClientRect();//получаем размеры и позиции эл-в
        let enemyRect = item.getBoundingClientRect(); //указываем item т.к. сейчас тут перебираем все препятствия

        if(carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) { // столкновения
                setting.start = false;
                start.classList.remove('hide');
                start.style.top = score.offsetHeight;//стилизуем надписи
        }

        item.y += setting.speed / 2; //меняем скорость движения машин на дороге. Видимость движения
        item.style.top = item.y + 'px';//добавляем в стили
        
        if (item.y >= document.documentElement.clientHeight) { //проверяем высоту нашего документа
            item.y = -100 * setting.traffic; //возвращаем обратно
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50 )) + 'px';
        }
    });
}