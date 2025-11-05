import { getServerSession } from "next-auth/next"
import prisma from '../../../lib/prisma';

import { options } from '../auth/[...nextauth]';

export default async function handle(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { title, content } = req.body;
    
    const session = await getServerSession(req, res, options)

    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { email: session.user.email },
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
