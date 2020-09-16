import { User } from '../entity/User';

export const batchUsers = async (userIds: any) => {
  const users = await User.createQueryBuilder('user')
    .where('user.id IN (:...users)', { users: userIds })
    .getMany();

  return userIds.map((userId: number) =>
    users.find((user) => user.id === userId)
  );
};
