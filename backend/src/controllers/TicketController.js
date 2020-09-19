const Sequelize = require("sequelize");
const { startOfDay, endOfDay, parseISO } = require("date-fns");

const Ticket = require("../models/Ticket");
const Contact = require("../models/Contact");
const Message = require("../models/Message");
const Whatsapp = require("../models/Whatsapp");

const { getIO } = require("../libs/socket");

// get /tickets - gets tickets (all or based on criterias)
exports.index = async (req, res) => {
	const {
		pageNumber = 1,
		status = "",
		date = "",
		searchParam = "",
		showAll,
	} = req.query;

	const userId = req.user.id;

	const limit = 20;
	const offset = limit * (pageNumber - 1);

	let includeCondition = [
		{
			model: Contact,
			as: "contact",
			attributes: ["name", "number", "profilePicUrl"],
		},
	];

	let whereCondition = { userId: userId };

	if (showAll === "true") {
		whereCondition = {};
	}

	if (status) {
		whereCondition = {
			...whereCondition,
			status: status,
		};
	}

	if (searchParam) {
		includeCondition = [
			...includeCondition,
			{
				model: Message,
				as: "messages",
				attributes: ["id", "body"],
				where: {
					body: Sequelize.where(
						Sequelize.fn("LOWER", Sequelize.col("body")),
						"LIKE",
						"%" + searchParam.toLowerCase() + "%"
					),
				},
				required: false,
				duplicating: false,
			},
		];

		whereCondition = {
			[Sequelize.Op.or]: [
				{
					"$contact.name$": Sequelize.where(
						Sequelize.fn("LOWER", Sequelize.col("name")),
						"LIKE",
						"%" + searchParam.toLowerCase() + "%"
					),
				},
				{ "$contact.number$": { [Sequelize.Op.like]: `%${searchParam}%` } },
				{
					"$message.body$": Sequelize.where(
						Sequelize.fn("LOWER", Sequelize.col("body")),
						"LIKE",
						"%" + searchParam.toLowerCase() + "%"
					),
				},
			],
		};
	}

	if (date) {
		whereCondition = {
			...whereCondition,
			createdAt: {
				[Sequelize.Op.between]: [
					startOfDay(parseISO(date)),
					endOfDay(parseISO(date)),
				],
			},
		};
	}

	const { count, rows: tickets } = await Ticket.findAndCountAll({
		where: whereCondition,
		distinct: true,
		include: includeCondition,
		limit,
		offset,
		order: [["updatedAt", "DESC"]],
	});

	const hasMore = count > offset + tickets.length;

	return res.status(200).json({ count, tickets, hasMore });
};

// post /tickets - creates ticket
exports.store = async (req, res) => {
	const io = getIO();

	const defaultWhatsapp = await Whatsapp.findOne({
		where: { default: true },
	});

	if (!defaultWhatsapp) {
		return res
			.status(404)
			.json({ error: "No default WhatsApp found. Check Connection page." });
	}

	const ticket = await defaultWhatsapp.createTicket(req.body);

	const contact = await ticket.getContact();

	const serializaedTicket = { ...ticket.dataValues, contact: contact };

	io.to("notification").emit("ticket", {
		action: "create",
		ticket: serializaedTicket,
	});

	return res.status(200).json(ticket);
};

// put /tickets/:ticketId - update ticket
exports.update = async (req, res) => {
	const io = getIO();
	const { ticketId } = req.params;

	const ticket = await Ticket.findByPk(ticketId, {
		include: [
			{
				model: Contact,
				as: "contact",
				attributes: ["name", "number", "profilePicUrl"],
			},
		],
	});

	if (!ticket) {
		return res.status(404).json({ error: "No ticket found with this ID" });
	}

	await ticket.update(req.body);

	io.to("notification").emit("ticket", {
		action: "updateStatus",
		ticket: ticket,
	});

	return res.status(200).json(ticket);
};

// delete /ticket/:ticketId - deletes ticket
exports.delete = async (req, res) => {
	const io = getIO();
	const { ticketId } = req.params;

	const ticket = await Ticket.findByPk(ticketId);

	if (!ticket) {
		return res.status(400).json({ error: "No ticket found with this ID" });
	}

	await ticket.destroy();

	io.to("notification").emit("ticket", {
		action: "delete",
		ticketId: ticket.id,
	});

	return res.status(200).json({ message: "ticket deleted" });
};
