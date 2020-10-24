const Sequelize = require("sequelize");

class DefaultLocation extends Sequelize.Model {
	static init(sequelize) {
		super.init(
			{
				name: { type: Sequelize.STRING },
                address: { type: Sequelize.STRING },
                latitude: { type: Sequelize.STRING },
                longitude: { type: Sequelize.STRING },
			},
			{
				sequelize,
			}
		);

		return this;
	}
}

module.exports = DefaultLocation;
