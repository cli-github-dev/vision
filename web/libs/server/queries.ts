import prisma from '@libs/utils/prisma';

export const getMe = async (id: number) => {
  const me = await prisma?.user.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      role: true,
    },
  });

  return me;
};
