// pages/api/join-whitelist.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'whitelist.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Méthode non autorisée');
  }

  const { address } = req.body;
  if (typeof address !== 'string') {
    return res.status(400).send('Adresse invalide');
  }

  // Lit le tableau existant
  let list: string[] = [];
  if (fs.existsSync(filePath)) {
    try {
      list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      list = [];
    }
  }

  // Ajoute sans duplicata
  if (!list.includes(address)) {
    list.push(address);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  }

  return res.status(200).json({ message: 'Enregistré' });
}
