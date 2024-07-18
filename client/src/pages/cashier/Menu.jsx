import React from 'react';
import { Menu as AntMenu } from 'antd';
import { AiOutlineDashboard, AiOutlineDollarCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const { Item } = AntMenu;

const menuItems = [
    {
        key: '/dashboard',
        icon: <AiOutlineDashboard size={20} className='relative top-1'/>,
        label: 'Dashboard'
    },
    {
        key: 'pos',
        icon: <AiOutlineDollarCircle size={20} className='relative top-1'/>,
        label: 'Pos'
    }
];

const Menu = () => {
    return (
        <div>
            <AntMenu mode="horizontal">
                {menuItems.map(item => (
                    <Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.label}</Link>
                    </Item>
                ))}
            </AntMenu>
        </div>
    );
}

export default Menu;
