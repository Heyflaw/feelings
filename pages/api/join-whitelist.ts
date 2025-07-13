import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const WHITELIST_KEY = "whitelist";
const MAX_WALLETS = 100;

interface ApiResponse {
  list?: string[];
  total?: number;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (req.method === "GET") {
      // Récupérer la liste des adresses depuis Redis
      const list = (await redis.lrange(WHITELIST_KEY, 0, -1)) || [];
      return res.status(200).json({ list, total: list.length });
    }

    if (req.method === "POST") {
      const { address } = req.body as { address?: string };
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }

      // Vérifier si l'adresse existe déjà
      const list = (await redis.lrange(WHITELIST_KEY, 0, -1)) || [];
      if (list.includes(address)) {
        return res
          .status(409)
          .json({ message: "Address already in whitelist" });
      }

      // Vérifier si la liste est pleine
      if (list.length >= MAX_WALLETS) {
        return res.status(400).json({ message: "Whitelist is full" });
      }

      // Ajouter l'adresse à la liste
      await redis.lpush(WHITELIST_KEY, address);
      const updatedList = await redis.lrange(WHITELIST_KEY, 0, -1);
      return res
        .status(200)
        .json({
          message: "Address added to whitelist",
          total: updatedList.length,
        });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Redis error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
