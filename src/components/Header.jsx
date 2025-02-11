import { styled } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<header className='header'>
			<nav className='header__nav container'>
				<div className='header__logo'>
					<Link to='/'>
						<h1>SocialNet</h1>
					</Link>
				</div>

				<div className='header__search'>
					<input
						type='search'
						placeholder='Поиск...'
						className='header__search-input'
					/>
				</div>

				<ul className='header__menu'>
					<li>
						<Link to='/profile'>Профиль</Link>
					</li>
					<li>
						<Link to='/messages'>Сообщения</Link>
					</li>
					<li>
						<Link to='/friends'>Друзья</Link>
					</li>
					<li>
						<Link to='/notifications'>
							<span className='header__notifications'>3</span> Уведомления
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;


const Container = styled('div')(({theme}) => ({
  
}))