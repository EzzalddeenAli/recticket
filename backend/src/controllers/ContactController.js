const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const Contact = require("../models/Contact");
const Whatsapp = require("../models/Whatsapp");
const ContactCustomField = require("../models/ContactCustomField");

const { getIO } = require("../libs/socket");
const { getWbot } = require("../libs/wbot");

// get /contacts - returns all contacts
exports.index = async (req, res) => {
	const { searchParam = "", pageNumber = 1 } = req.query;

	const whereCondition = {
		[Op.or]: [
			{
				name: Sequelize.where(
					Sequelize.fn("LOWER", Sequelize.col("name")),
					"LIKE",
					"%" + searchParam.toLowerCase() + "%"
				),
			},
			{ number: { [Op.like]: `%${searchParam}%` } },
		],
	};

	let limit = 20;
	let offset = limit * (pageNumber - 1);

	const { count, rows: contacts } = await Contact.findAndCountAll({
		where: whereCondition,
		limit,
		offset,
		order: [["createdAt", "DESC"]],
	});

	const hasMore = count > offset + contacts.length;

	return res.json({ contacts, count, hasMore });
};

// post /contacts - creates contact
exports.store = async (req, res) => {
	const defaultWhatsapp = await Whatsapp.findOne({
		where: { default: true },
	});

	if (!defaultWhatsapp) {
		return res
			.status(404)
			.json({ error: "No default WhatsApp found. Check Connection page." });
	}

	const wbot = getWbot(defaultWhatsapp);
	const io = getIO();
	const newContact = req.body;

	try {
		const isValidNumber = await wbot.isRegisteredUser(
			`${newContact.number}@c.us`
		);
		if (!isValidNumber) {
			return res
				.status(400)
				.json({ error: "The suplied number is not a valid Whatsapp number" });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: "Could not check whatsapp contact. Check connection page.",
		});
	}

	const profilePicUrl = await wbot.getProfilePicUrl(
		`${newContact.number}@c.us`
	);

	const contact = await Contact.create(
		{ ...newContact, profilePicUrl },
		{
			include: "extraInfo",
		}
	);

	io.emit("contact", {
		action: "create",
		contact: contact,
	});

	return res.status(200).json(contact);
};

// get /contacts/:contactId - gets the contact based on Id
exports.show = async (req, res) => {
	const { contactId } = req.params;

	const contact = await Contact.findByPk(contactId, {
		include: "extraInfo",
		attributes: ["id", "name", "number", "email"],
	});

	if (!contact) {
		return res.status(404).json({ error: "No contact found with this id." });
	}

	return res.status(200).json(contact);
};

// put /contacts/:contactId - updates the contact based on Id
exports.update = async (req, res) => {
	const io = getIO();

	const updatedContact = req.body;

	const { contactId } = req.params;

	const contact = await Contact.findByPk(contactId, {
		include: "extraInfo",
	});

	if (!contact) {
		return res.status(404).json({ error: "No contact found with this ID" });
	}

	if (updatedContact.extraInfo) {
		await Promise.all(
			updatedContact.extraInfo.map(async info => {
				await ContactCustomField.upsert({ ...info, contactId: contact.id });
			})
		);

		await Promise.all(
			contact.extraInfo.map(async oldInfo => {
				let stillExists = updatedContact.extraInfo.findIndex(
					info => info.id === oldInfo.id
				);

				if (stillExists === -1) {
					await ContactCustomField.destroy({ where: { id: oldInfo.id } });
				}
			})
		);
	}

	await contact.update(updatedContact);

	io.emit("contact", {
		action: "update",
		contact: contact,
	});

	return res.status(200).json(contact);
};

// delete /contacts/:contactId - deltetes contact based on Id
exports.delete = async (req, res) => {
	const io = getIO();
	const { contactId } = req.params;

	const contact = await Contact.findByPk(contactId);

	if (!contact) {
		return res.status(404).json({ error: "No contact found with this ID" });
	}

	await contact.destroy();

	io.emit("contact", {
		action: "delete",
		contactId: contactId,
	});

	return res.status(200).json({ message: "Contact deleted" });
};
