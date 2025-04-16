import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../common/enum';
import sequelize from '../common/lib/sequelize';
import { UserAttributes } from '../interfaces/User';

class UserModel extends Model<UserAttributes> {
  declare id: string;
  declare email: string;
  declare username: string;
  declare password: string;
  declare role: Role;
  declare isVerified: boolean;
  declare token: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'member'),
      defaultValue: 'member',
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified',
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'users',
    underscored: true,
    freezeTableName: true,
    sequelize,
  }
);

UserModel.beforeCreate((instance) => {
  instance.id = uuidv4();
});

export default UserModel;
