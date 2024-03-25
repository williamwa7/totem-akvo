"use strict";
import { GoogleSpreadsheet } from "google-spreadsheet";

// const doc = new GoogleSpreadsheet(
// 	"1qdlG4Hi9yhHdGRJZqTucQnNwE_DyJ9_kZIzua-LcVps"
// );
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

export default async (req, res) => {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Método não permitido" });
	}
	try {
		await doc.useServiceAccountAuth({
			// client_email: "totemakvo@totemakvo.iam.gserviceaccount.com",
			client_email: process.env.CLIENT_EMAIL,

			// private_key:"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0QD6vmZUkIkTN\nXpZ5loRgGlni71SmaoEEcd/6S7Ppmsf1RsouwB1maqE6K9cVrsXMy4tACu9xbcOJ\njnHVFGMkGNVbcVRq2F0o0ZH3GY1uNwOOlJzFWAf5C8KekXIe57G+peYf8R33cn/q\naZdEMlMgt7vWssrp+oWxCFesJ/eoNchEP933nWBWcTW91ZeKvWtmXPKn9YPfeGNb\n6/G7YIjRf1SbkxXGMxDBLjiNu9jhnmP1REBo2UePT8icwTrSOOiAi3xKG7z7z0UX\nmgX5ks2XzcWJhkPc8I6ZSRWy6QXuuIRahmAugD+2Xeq8GiIfIu38c7tf2z3TiFvN\nZ/c//kUHAgMBAAECggEAS5qA0IWSNUA8bImGgwQ7jNWwqwtojY6xg8xBvkm/cjXO\nNhZVmmtRSZJjArO9uOYAKCidxSRxDzoTYKCDJXUyKkNSRlMQLeqHlKXmW+b3V+my\nT70MzodgfLjOjlUCMW1MM+OA1Rf80jvP5GIapOuYy2nVWzXN/3rpVXpiz55J9d64\n5Abmua/Ud0cUdIqWpS6ljuQVY8imXXIiDulV2ehag3h10IeQN0tbUUnwYiRXL+m/\njzUd4GII+as3E2FZuiFRCfPrFU3L1BLpJQosmbHT2YXbzwYGWbdLybrX61+b95Hq\ndAJDh2GjW7e7bg8PLFSoc4v5Xxp+4RNFwAZkJDvo7QKBgQDZq1pv/Pb3UIuA6cCg\nNfx24Jc9Fakkjk4nPG9FxXgSDN1absXtF0WuFD+WF3+cnvq3PQd+YSWCSCgCCrs0\nSQDJUa7YW5l14SzUKLLBX6HggJXVfsBSj6IXeS+2sqN3m3+GzDw0VCW4N7iYSRM3\nDmMpC38rMoS8nz3B/xVh2g2XwwKBgQDT/g0XXORnxisI4uYA8IZQT5x/JvwDi8a5\nvtVKqTDAh1D3MLbIPUaNNOF4F3gLg4c25sliGzkbH4bfePHBO838G5uQxwcSBD5v\nr4yAl5cbTGhd48zHjLQKwl4J/Eaywq54CUeXXFaLtc5GSKrBN/LzanBzL1/ArlA6\nO7rwTkVNbQKBgCkTI8LEOppa0ahm89mHtnd8VC3Lu5pRXEAdMGY7KDhHwzGAe8sM\nvDJoUcNx9bvJaEhRtOtNS7W1Bg+0lLT+Ha7fwh3D00aiUkJK18iT0kk6GowqGgK6\nZf0F+lIAjcZRSpRWT/oT8vY7VZMvHvght+aT69Br/Q5XAmFsUE2hxzTfAoGAKpTh\nNEwoZN/dTQ+me5HUqNUU7kV6YYv2AuFeHn0VmdaUYNKcJGSKg1qX33N3XXix9Ekv\nMlGdiuEuSj0U8md83KL/AHm55diMYgq1Ai9w3r7eR922CG8uyup30TGnUcjhGqNi\nifi2OaHvKRb3lZATcOl0ZO6jISTiYJAW4KYYLZECgYA+GaT/A7h6drA3AbxPeai2\n6j9UhlTnVwz1c47QPg+/ZbM2EmEc4UoDP/Rm+nKKLd1l+rYwQ3Wel49q4KLblzdi\nvarAF/EZgpJrne4UKP3Evr0xiOh3Vp8jcL/2j8oYPE5pDF/NSEAVEaKt0cTTIUhN\nytws6uX0gdxdIhipSLUnjw==\n-----END PRIVATE KEY-----\n",
			private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
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
