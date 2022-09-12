import { GraphQLString, GraphQLBoolean, GraphQLID } from "graphql";
import { Users } from "../../Entities/Users";
import { UserType } from "../typeDefs/User";
import bcrypt from "bcryptjs";

export const CREATE_USER = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_: any, args: any) {
    const { name, username, password } = args;

    const encryptPassword = await bcrypt.hash(password, 10);

    const result = await Users.insert({
      name,
      username,
      password: encryptPassword,
    });

    return { ...args, id: result.identifiers[0].id, password: encryptPassword };
  },
};

export const DELETE_USER = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(_: any, { id }: any) {
    const result = await Users.delete(id);
    if (result.affected === 1) return true;
    return false;
  },
};

export const UPDATE_USER = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(_: any, { id, name, username, oldPassword, newPassword }: any) {
    console.log(oldPassword);

    const userFound = await Users.findOneBy({ id });

    const isMatch = await bcrypt.compare(
      oldPassword,
      userFound?.password ?? ""
    );

    if (!isMatch) return false;

    const newPasswordHast = await bcrypt.hash(newPassword, 10);

    const response = await Users.update(
      { id },
      { username, name, password: newPasswordHast }
    );

    if (response.affected === 0) return false;

    return true;
  },
};
