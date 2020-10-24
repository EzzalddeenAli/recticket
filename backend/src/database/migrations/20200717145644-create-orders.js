"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("Orders", {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
            },
            ticketId: {
                type: Sequelize.INTEGER,
				references: { model: "Tickets", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
            },
            contactId: {
				type: Sequelize.INTEGER,
				references: { model: "Contacts", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
            },
            details: {
                type: Sequelize.TEXT,
                allowNull: false
            },
			status: {
				type: Sequelize.STRING,
				defaultValue: "pending",
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
            beforeLocation: {
                type: Sequelize.INTEGER,
				references: { model: "DefaultLocations", key: "id" },
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
            },
            startTime: {
				type: Sequelize.STRING,
				allowNull: true,
            },
            endTime: {
				type: Sequelize.STRING,
				allowNull: true,
            },
			createdAt: {
				type: Sequelize.DATE(6),
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE(6),
				allowNull: false,
			},
		});
	},

	down: queryInterface => {
		return queryInterface.dropTable("Orders");
	},
};
