'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			'Patients',
			[
				{
					name: 'João Silva',
					email: 'j_silva@gmail.com',
					phone: '999991234',
				},
				{
					name: 'Maria Araújo',
					email: 'maria.a2021@outlook.com',
					phone: '999995678',
				},
				{
					name: 'Ana Luz',
					email: 'a.luz@gmail.com',
					phone: '999996789',
				},
				{
					name: 'Gustavo Prado',
					email: 'gprado@gmail.com',
					phone: '988996789',
				},
				{
					name: 'Leonardo Sandrini',
					email: 'lsandrini@gmail.com',
					phone: '999886789',
				},
				{
					name: 'Felipe Stelmack',
					email: 'fstelmack@yahoo.com',
					phone: '987656789',
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Patients', null, {});
	},
};
