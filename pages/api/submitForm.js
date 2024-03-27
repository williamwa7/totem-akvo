"use strict";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { SHEET_ID, CLIENT_EMAIL, PRIVATE_KEY } from "@/utils/env";

const doc = new GoogleSpreadsheet(SHEET_ID());
// const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

export default async (req, res) => {
	// if (req.method !== "POST") {
	// 	return res.status(405).json({ error: "Método não permitido" });
	// }
	try {
		await doc.useServiceAccountAuth({
			client_email: CLIENT_EMAIL(),
			// client_email: process.env.CLIENT_EMAIL,
			private_key: PRIVATE_KEY(),
			// private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
		});

		await doc.loadInfo();
		const geeCalcSheet = doc.sheetsByIndex[0];
		const data = JSON.parse(req.body);
		const {
			id,
			name,
			email,
			empresa,
			consultor,
			telefone,
			deslocamento,
			origem,
			destino,
			aeroportoOrigem,
			aeroportoDestino,
			combustivel,
			anoVeiculo,
		} = data;
		await geeCalcSheet.addRow({
			id,
			name,
			email,
			empresa,
			consultor,
			telefone,
			deslocamento,
			aeroportoOrigem,
			aeroportoDestino,
			combustivel,
			anoVeiculo,
			origem,
			destino,
		});
		res.end(
			JSON.stringify({
				body: req.body,
				status: 1,
				message: "Ok",
			})
		);
	} catch (error) {
		console.error("Erro ao enviar os dados:", error);
		req.end(
			JSON.stringify({
				body: req.body,
				message: "Não foi possível enviar os dados",
			})
		);
		res.status(500).json({ error: "Erro ao enviar os dados" });
	}
};
