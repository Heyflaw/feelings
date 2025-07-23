import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
  retry: false,
});

const WHITELIST_KEY = "whitelist";
const MAX_WALLETS = 75;

interface ApiResponse {
  list?: string[];
  total?: number;
  maxWallets?: number; // Ajout de maxWallets dans la réponse
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Log des variables d'environnement pour débogage
    console.log("Environment variables:", {
      KV_REST_API_URL: process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN
        ? "defined"
        : "undefined",
    });

    // Vérification des variables d'environnement
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error("Missing environment variables:", {
        KV_REST_API_URL: process.env.KV_REST_API_URL,
        KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN
          ? "defined"
          : "undefined",
      });
      return res.status(500).json({
        message: "Server configuration error: Missing Redis credentials",
      });
    }

    if (req.method === "GET") {
      const list = (await redis.lrange(WHITELIST_KEY, 0, -1)) || [];
      return res
        .status(200)
        .json({ list, total: list.length, maxWallets: MAX_WALLETS });
    }

    if (req.method === "POST") {
      const { address } = req.body as { address?: string };
      if (!address) {
        return res.status(400).json({
          message: "Address is required",
          total: 0,
          maxWallets: MAX_WALLETS,
        });
      }

      const list = (await redis.lrange(WHITELIST_KEY, 0, -1)) || [];
      if (list.includes(address)) {
        return res.status(409).json({
          message: "Address already in whitelist",
          total: list.length,
          maxWallets: MAX_WALLETS,
        });
      }

      if (list.length >= MAX_WALLETS) {
        return res.status(400).json({
          message: "Whitelist is full",
          total: list.length,
          maxWallets: MAX_WALLETS,
        });
      }

      await redis.lpush(WHITELIST_KEY, address);
      const updatedList = await redis.lrange(WHITELIST_KEY, 0, -1);
      return res.status(200).json({
        message: "Address added to whitelist",
        total: updatedList.length,
        maxWallets: MAX_WALLETS,
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Redis error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
