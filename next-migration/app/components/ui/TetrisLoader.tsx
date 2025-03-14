'use client';

import { useEffect, useState } from 'react';

type TetrisPiece = {
	shape: number[][];
	color: string;
};

const tetrisPieces: TetrisPiece[] = [
	{
		// I piece
		shape: [[1, 1, 1, 1]],
		color: 'bg-cyan-500',
	},
	{
		// O piece
		shape: [
			[1, 1],
			[1, 1],
		],
		color: 'bg-yellow-400',
	},
	{
		// T piece
		shape: [
			[0, 1, 0],
			[1, 1, 1],
		],
		color: 'bg-purple-500',
	},
	{
		// L piece
		shape: [
			[1, 0],
			[1, 0],
			[1, 1],
		],
		color: 'bg-orange-500',
	},
	{
		// J piece
		shape: [
			[0, 1],
			[0, 1],
			[1, 1],
		],
		color: 'bg-blue-500',
	},
	{
		// S piece
		shape: [
			[0, 1, 1],
			[1, 1, 0],
		],
		color: 'bg-green-500',
	},
	{
		// Z piece
		shape: [
			[1, 1, 0],
			[0, 1, 1],
		],
		color: 'bg-red-500',
	},
];

export default function TetrisLoader() {
	const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
	const [rotation, setRotation] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPieceIndex((prev) => (prev + 1) % tetrisPieces.length);
			setRotation((prev) => (prev + 90) % 360);
		}, 500);

		return () => clearInterval(interval);
	}, []);

	const currentPiece = tetrisPieces[currentPieceIndex];

	return (
		<div className='flex flex-col items-center justify-center p-8'>
			<div
				className='relative transition-transform duration-500 ease-in-out'
				style={{ transform: `rotate(${rotation}deg)` }}
			>
				{currentPiece.shape.map((row, rowIndex) => (
					<div key={rowIndex} className='flex'>
						{row.map((cell, cellIndex) => (
							<div
								key={cellIndex}
								className={`w-6 h-6 m-0.5 rounded-sm ${
									cell ? currentPiece.color : 'bg-transparent'
								}`}
							/>
						))}
					</div>
				))}
			</div>
			<p className='mt-4 text-lg font-medium text-white animate-pulse'>
				Загрузка...
			</p>
		</div>
	);
}
