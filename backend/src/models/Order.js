const Sequelize = require("sequelize");

class Order extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				details: { type: Sequelize.TEXT },
				address: { type: Sequelize.STRING },
                latitude: { type: Sequelize.STRING },
                longitude: { type: Sequelize.STRING },
                startTime: { type: Sequelize.STRING },
                endTime: { type: Sequelize.STRING },
				createdAt: {
					type: Sequelize.DATE(6),
					allowNull: false,
				},
				updatedAt: {
					type: Sequelize.DATE(6),
					allowNull: false,
				},
			},
			{
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
        this.belongsTo(models.Ticket, { foreignKey: "ticketId", as: "order" });
        this.belongsTo(models.Contact, { foreignKey: "contactId", as: "order" });
        this.belongsTo(models.DefaultLocation, { foreignKey: "beforeLocation", as: "order"});
	}
}

module.exports = Order;
