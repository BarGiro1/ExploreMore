import usersModel, { IUsers } from "../models/users_models";
import BaseController from "./base_controller";

const usersController = new BaseController<IUsers>(usersModel);

export default usersController;
