import React, { useState } from 'react';
import './App.css';
import Item from "./Item";

// Вспомогательные функции
// Метод выполнения хода, если это возможно
function makeStep(items: number[], clickedPosition: number, size: number): number | null {
    // Если не отрицательный результат шага и не больше 16 и на эту позицию выпадает пустая пятнашка
    const zeroPosition = items.indexOf(0);
    // Словарь возможных шагов
    const steps = STEPS(size);
    const calcStep = {
        top: clickedPosition + steps.top,
        bottom: clickedPosition + steps.bottom,
        left: clickedPosition + steps.left,
        right: clickedPosition + steps.right
    }
    /**
     * Валидность результата шага
     * @param calculatedStep
     */
    const validateStep = (calculatedStep: number): string | null => {
        return (calculatedStep === zeroPosition) ? calculatedStep + '' : null
    };
    // Получаем результат хода в строковом значении (чтобы не было проблем с 0ой ячейкой)
    const resultPosition = validateStep(calcStep.top) || validateStep(calcStep.bottom) || validateStep(calcStep.left) || validateStep(calcStep.right);
    return resultPosition !== null ? parseInt(resultPosition, 10) : null;
}

/**
 * Проверяет победил ли пользователь
 * @param items
 */
function isWin(items: number[]): boolean {
    // все кнопки должны быть упорядочены по возрастанию
    let prevNum: number | null = null;
    // Отбрасываю последний элемент (в идеальном результате там должен быть 0), чтобы условие работало всегда
    const checkedItems = items.slice(0, items.length - 2);
    return checkedItems.every((num) => {
        if (prevNum === null) {
            // Запоминаем первую пятнашку для дальнейшего сравнения
            prevNum = num;
            return true;
        } else {
            // проверяем с предыдущей пятнашкой
            const res = num > prevNum;
            if (res) {
                // пока процесс валидации идет хорошо, запомним новое предыдущее значение
                prevNum = num;
            }
            return res;
        }
    });
}

/**
 * Генерация шагов для любой из возможных для выбора игровой сетки
 * @param size
 * @constructor
 */
const STEPS = (size: number) => {
    return {
        top: -1 * size,
        bottom: size,
        left: -1,
        right: 1
    }
};

// Перемешиваем исходный массив
function shuffle(dictionary: number[]): number[] {
    const newItems = [...dictionary];
    return newItems.sort(() => Math.random() - 0.5);
}

/**
 * Создаем игровую сетку
 * @param size
 */
function createDictionary(size: number): number[] {
    if (!size) {
        console.error(`Неправильный размер пятнашек`);
    }
    const dict = Array.from({length: size}, (v, k) => k+1);
    dict.push(0);
    return dict;
}

function App() {
    const dictionary = createDictionary(15);
    // счетчик шагов
    const [stepCount, setStepCount] = useState(0);
    const [items, setItems] = useState(shuffle(dictionary));
    const [playMode, setPlayMode] = useState(15);
    const [playTableSize, setPlayTableSize] = useState(4);
    const [isWinner, setIsWinner] = useState(false);
    const clickHandler = (e: React.MouseEvent, id: number) => {
        console.log(`Нажата пятнашка с номером ${id}`)

        const currentNumPosition = items.indexOf(id);
        console.log(`Текущее положение ${id} = ${currentNumPosition}`);
        if (!!id) {
            const step = makeStep(items, currentNumPosition, playTableSize);
            if (step !== null) {
                const newItems = [...items];
                newItems[currentNumPosition] = 0;
                newItems[step] = id;
                setItems(newItems);
                setStepCount(stepCount + 1);
                if (isWin(newItems)) {
                    setIsWinner(true);
                }
            }
        }
    };
    /**
     * Начать собирать пятнашки заново
     * @param e
     */
    const restart = (e: React.MouseEvent) => {
        setStepCount(0);
        setItems(shuffle(items));
        setIsWinner(false);
    };
    /**
     * Изменить размерность игровой площадки
     * @param e
     */
    const changeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mode = parseInt(e.target.value, 10);
        setPlayTableSize(Math.sqrt(mode + 1));
        const dictionary = createDictionary(mode);
        setItems(shuffle(dictionary));
        setPlayMode(mode);
        setStepCount(0);
        setIsWinner(false);
    };

    return (
        <div className="App container">
            <h1 className='display-6'>Поиграй в старые добрые пятнашки</h1>
            <div>
                <span>Размерность поля:</span>
                <select id="selectMode" onChange={changeMode} value={playMode} className="form-select">
                    <option value={8}>3 x 3 (минимально возможный)</option>
                    <option value={15}>4 x 4 (стандартный размер)</option>
                    <option value={24}>5 x 5 (ты любишь рисковать)</option>
                    <option value={35}>6 x 6 (ты не пройдешь!)</option>
                </select>
            </div>
            {
                isWinner ?
                    <div className='Congratulations shadow-lg p-3 mb-4 mt-4 bg-body'>
                        <h2>Поздравляю с победой!</h2>
                        <p>Может быть сыграете еще разок-другой?</p>
                        <button onClick={restart} className='btn btn-primary p-3'>Начать сначала</button>
                    </div>
                    : ''
            }
            <div className={['PlayArea', 'PlayArea-Size-'+playTableSize].join(' ')}>
                {items.map(num => <Item num={num} clickHandler={clickHandler} key={num} />)}
            </div>
            <div className="Info">
                <div className="StepsCount p-3 mb-2 bg-secondary text-white">Сделано шагов: {stepCount}</div>
                {stepCount && !isWinner ? <button onClick={restart} className='btn btn-primary p-3'>Начать сначала</button> : ''}
            </div>
        </div>
    );
}

export default App;
