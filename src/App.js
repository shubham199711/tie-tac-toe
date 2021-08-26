import { useState } from 'react';
import './App.css';

const INIT_BOARD = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// X -> 1
// O -> -1

function App() {
	const [board, setBoard] = useState(() => INIT_BOARD);
	const [state, setState] = useState({
		isXPlayersMove: true,
		isGameWon: 0,
		playCount: 0,
	});

	const getDiagonal = (newList) => {
		return [
			[newList[0], newList[4], newList[8]],
			[newList[3], newList[4], newList[6]],
		];
	};

	const getRows = (newList) => {
		let rows = [];
		let row = [];
		newList.forEach((item, index) => {
			if (index > 0 && index % 3 === 0) {
				rows.push(row);
				row = [];
			}
			row.push(item);
		});
		rows.push(row);
		return rows;
	};

	const getColumns = (newList) => {
		let columns = [];
		let col1 = [];
		let col2 = [];
		let col3 = [];
		let currentCol = 0;
		newList.forEach((item, index) => {
			switch (currentCol) {
				case 0:
					col1.push(item);
					break;
				case 1:
					col2.push(item);
					break;
				case 2:
					col3.push(item);
					break;
				default:
					break;
			}
			currentCol = (currentCol + 1) % 3;
		});
		columns = [[...col1], [...col2], [...col3]];
		return columns;
	};

	const isGameWon = async (newList) => {
		const player = state.isXPlayersMove ? 1 : -1;
		const diagonal = getDiagonal(newList);
		const rows = getRows(newList);
		const columns = getColumns(newList);
		let isWon = 0;
		for (let index = 0; index < diagonal.length; index++) {
			const item = diagonal[index];
			isWon = item.reduce(function (flag, value) {
				return flag && player === value;
			}, true);

			if (isWon) {
				return player;
			}
		}
		for (let index = 0; index < rows.length; index++) {
			const item = rows[index];
			isWon = item.reduce(function (flag, value) {
				return flag && player === value;
			}, true);

			if (isWon) {
				return player;
			}
		}
		for (let index = 0; index < columns.length; index++) {
			const item = columns[index];
			isWon = item.reduce(function (flag, value) {
				return flag && player === value;
			}, true);

			if (isWon) {
				return player;
			}
		}
		return 0;
	};

	const resetGame = async () => {
		setBoard(INIT_BOARD);
		setState({
			isXPlayersMove: true,
			isGameWon: 0,
			playCount: 0,
		});
	};

	const playOnboard = async (index) => {
		if (state.isGameWon !== 0) {
			return;
		}
		const newList = [...board];
		newList[index] = state.isXPlayersMove ? 1 : -1;
		await setBoard(newList);
		const isGameWonByUser = await isGameWon(newList);
		await setState((prev) => {
			return {
				...prev,
				isGameWon: isGameWonByUser,
				playCount: prev.playCount + 1,
				isXPlayersMove: !prev.isXPlayersMove,
			};
		});
		if (isGameWonByUser !== 0) {
			// eslint-disable-next-line no-restricted-globals
			const result = confirm(
				`${
					state.isXPlayersMove ? 'X' : 'O'
				} Won the Game. Do You want To restart game?`
			);
			if (result) {
				resetGame();
			}
		} else if (state.playCount === 8) {
			// eslint-disable-next-line no-restricted-globals
			const result = confirm(
				'The game is draw. Do You want To restart game?'
			);
			if (result) {
				resetGame();
			}
		}
	};

	const IsYPlayed = (item) => (item === -1 ? 'O' : '_');

	return (
		<div className='App'>
			<h1 style={{ marginTop: '2em' }}>Tic-Tac-Toe</h1>
			<div className='card'>
				<div className='container'>
					<div
						style={{
							margin: '3em 0',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<div>
							{state.isXPlayersMove
								? 'X players Move'
								: 'O players Move'}
						</div>
						<div>
							<button onClick={resetGame}>Reset</button>
						</div>
					</div>
					<div className='flex-grid' style={{ margin: '3em 0' }}>
						{board.map((item, index) => (
							<div
								key={index}
								onClick={() =>
									item === 0 ? playOnboard(index) : null
								}
								className='flex-col'
							>
								{item === 1 ? 'X' : IsYPlayed(item)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
