"use strict";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { SHEET_ID, CLIENT_EMAIL, PRIVATE_KEY } from "@/utils/env";

const doc = new GoogleSpreadsheet(SHEET_ID());
// const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

export default async (req, res) => {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Método não permitido" });
	}
	try {
		await doc.useServiceAccountAuth({
			client_email: CLIENT_EMAIL(),
			// client_email: process.env.CLIENT_EMAIL,

			private_key: PRIVATE_KEY(),
			// private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
		});

		await doc.loadInfo();
		const geeCalcSheet = doc.sheetsByIndex[0];
		const rows = await geeCalcSheet.getRows(); // Busca todas as linhas da planilha

		// Mapeia os dados das linhas para um formato adequado para enviar na resposta
		const data = rows.map((row) => ({
			id: row.id,
			name: row.name,
			email: row.email,
			deslocamento: row.deslocamento,
			aeroportoOrigem: row.aeroportoOrigem,
			aeroportoDestino: row.aeroportoDestino,
			combustivel: row.combustivel,
			anoVeiculo: row.anoVeiculo,
			origem: row.origem,
			destino: row.destino,
			distancia: row.km,
		}));

		res.status(200).json(data);
	} catch (error) {
		console.error("Erro ao buscar os dados:", error);
		res.status(500).json({ error: "Erro ao buscar os dados" });
	}
};
