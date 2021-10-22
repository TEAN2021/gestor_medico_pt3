'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			'Physicians',
			[
				{
					name: 'Evandro Luiz Ramiro',
					email: 'evandro.ramiro@hospitalmail.com',
					password: '123',
				},
				{
					name: 'Ana Paula Goulart',
					email: 'ana.goulart@hospitalmail.com',
					password: '456',
				},
				{
					name: 'Paulo Muzy',
					email: 'paulo.muzy@hospitalmail.com',
					password: '789',
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Physicians', null, {});
	},
};
