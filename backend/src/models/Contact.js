const Sequelize = require("sequelize");

class Contact extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				name: { type: Sequelize.STRING },
				number: { type: Sequelize.STRING, allowNull: false, unique: true },
				email: { type: Sequelize.STRING, allowNull: false, defaultValue: "" },
				profilePicUrl: { type: Sequelize.STRING },
			},
			{
				sequelize,
			}
		);

		return this;
	}

	static associate(models) {
		this.hasMany(models.Ticket, { foreignKey: "contactId", as: "contact" });
		this.hasMany(models.ContactCustomField, {
			foreignKey: "contactId",
			as: "extraInfo",
		});
		this.belongsTo(models.DefaultLocation, {
			foreignKey: "locationId",
			as: "location",
		});
	}
}

module.exports = Contact;
