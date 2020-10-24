"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("DefaultLocations", {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			address: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			latitude: {
				type: Sequelize.STRING,
				allowNull: false,
            },
            longitude: {
				type: Sequelize.STRING,
				allowNull: false,
            },
            belongsToContact: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
				defaultValue: false,
            },
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	down: queryInterface => {
		return queryInterface.dropTable("DefaultLocations");
	},
};
