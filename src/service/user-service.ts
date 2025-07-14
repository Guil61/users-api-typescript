import UserInstance from "../model/userModel";

export class UserService {
  async create (data: any): Promise<UserInstance>  {
    return await UserInstance.create(data);
  }

  async findById(id: number):  Promise<UserInstance | null> {
    return await UserInstance.findByPk(id);
  }

  async delete(id: number): Promise <number> {
    return await UserInstance.destroy({
        where: {id}
    })
  }

  async findAll (){
    return await UserInstance.findAll();
  }



}
